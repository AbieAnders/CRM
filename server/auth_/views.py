import logging
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import ExpiringToken, Organization, UserProfile

from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
#from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework_simplejwt.exceptions import TokenError
from server.decorators import log_execution_time

import os
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)

@api_view(['POST'])
@csrf_exempt
@log_execution_time
@authentication_classes([])  #Disables auth for sign-up endpoint
@permission_classes([AllowAny])  #Allows any user to sign-up
def sign_up(request):
    logger.info("Received Sign-Up Request: %s", request.data)
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user_ = serializer.save()
            
            refresh_token = RefreshToken.for_user(user_)
            access_token = str(refresh_token.access_token)

            response = JsonResponse({
                "user": serializer.data,
                "access-token": access_token,
                "refresh-token": str(refresh_token)
            })
            logger.info("User created and tokens generated for username: %s", user.username)
            return response
        
        logger.warning("Invalid sign-up data: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except IntegrityError as e:
        logger.error("IntegrityError during sign-up for username: %s. Error: %s", request.data.get('username'), str(e))
        return Response({"error": "Username or email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    except ValidationError as e:
        logger.error("ValidationError during sign-up for username: %s. Error: %s", request.data.get('username'), str(e))
        return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.exception("Unexpected error during sign-up for username: %s. Error: %s", request.data.get('username'), str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@log_execution_time
@authentication_classes([])
@permission_classes([AllowAny])
def sign_in(request):
    #logger.info("Received Sign-In Request: %s", request.data)
    try:
        username_ = request.data['username']
        password_ = request.data['password']
        organization_name_ = request.data.get('organization', None)

        if not organization_name_:
            return Response({"error": "Organization name is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(User, username=username_)
        user_profile = user.profile

        if not user.is_active or not user_profile.is_active or not user_profile.organization.is_active:
            return Response({"error": "User, profile, or organization is inactive."}, status=status.HTTP_403_FORBIDDEN)

        if user_profile.organization.name.lower() != organization_name_.lower():
            return Response({"error": "User is not part of the given organization."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password_):
            #logger.warning("Invalid password attempt for username: %s", username_)
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        #logger.info("Successful sign-in for username: %s", username_)

        response = JsonResponse({
            "user": UserSerializer(user).data,
            "access-token": access_token,
            "refresh-token": str(refresh_token)
        })
        #logger.info("User Signed In and tokens generated for username: %s", user.username)
        return response
    
    except Exception as e:
        logger.exception("Unexpected error during sign-in for username: %s. Error: %s", username_, str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@log_execution_time
@permission_classes([AllowAny])
def organizations(request):
    logger.info("Received org list retrieval Request")
    try:
        orgs = Organization.objects.filter(is_active=True).values_list('name', flat=True)
        org_list = list(orgs)
        logger.info("Org list retrieved successfully")
        return Response(org_list)

    except Exception as e:
        logger.exception("Error fetching organizations: %s", str(e))
        return Response([], status=500)

@api_view(['POST'])
@log_execution_time
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def sign_out(request):
    logger.info("Received sign-out Request: %s", request.data)
    try:
        user_ = request.user
        '''refresh_token = request.data.get('refresh') 
        if not refresh_token:
            logger.warning("No refresh token provided for sign-out")
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)
        token = RefreshToken(refresh_token)

        try:
            token.blacklist()
            logger.info("Blacklisted token for user ID: %s", token['user_id'])
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except AttributeError:
            logger.warning("Token blacklist is not enabled or token invalid")
            return Response({"error": "Token blacklist not enabled or invalid token"}, status=status.HTTP_400_BAD_REQUEST)'''
        tokens = ExpiringToken.objects.filter(user=user_)
        for token_ in tokens:
            try:
                BlacklistedToken.objects.get_or_create(token=token_)
                logger.info("Blacklisted token for user ID: %s", user_.id)
            except Exception as e:
                logger.warning("Error blacklisting token for user ID: %s: %s", user_.id, str(e))
                logger.error("Token blacklist failed for token %s: %s", token_.jti, str(e))
        
        response = Response({"message": "Logged out successfully, all tokens blacklisted."}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh-token')
        return response
    
    except TokenError as e:
        logger.warning("TokenError while blacklisting token: %s", str(e))
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.exception("Unexpected error during sign-out or username: %s. Error: %s", request.data.get('username'), str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

'''
@api_view(['POST'])
@log_execution_time
@permission_classes([AllowAny])
def refresh_token(request):
    try:
        refresh_token = request.data.get('refresh-token')

        if not refresh_token:
            return Response({"error": "No refresh token provided."}, status=status.HTTP_401_UNAUTHORIZED)
        
        token = RefreshToken(refresh_token)
        access_token = str(token.access_token)

        response = JsonResponse({
            "access-token": access_token,
            "refresh-token": refresh_token
        })
        return response

    except TokenError as e:
        return Response({"error": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)'''

@api_view(['POST'])
@log_execution_time
@permission_classes([AllowAny])
def reset_password(request):
    try:
        email = request.data.get('email')
        user = get_object_or_404(User, email=email)

        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            try:
                BlacklistedToken.objects.get_or_create(token=token)
            except:
                pass

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"{settings.FRONTEND_URL}/auth/reset_password/{uid}/{token}"

        send_mail(
            subject = "CRM Password reset request",
            message = f"Click the link to reset the password: {reset_link}",
            from_email = os.getenv('DEFAULT_FROM_EMAIL'),
            recipient_list = [user.email],
            fail_silently = False
        )

        return Response({"message": "Password reset link sent"}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception("Forgot password error: %s", str(e))
        return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@log_execution_time
@permission_classes([AllowAny])
def reset_password_confirmed(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_object_or_404(get_user_model(), pk=uid)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({"error": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()

        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)
        ExpiringToken.objects.filter(user=user).delete()

        return Response({"message": "Password reset successful. All sessions logged out."}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception("Error confirming reset password: %s", str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
