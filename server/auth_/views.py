import logging
from django.views.decorators.csrf import csrf_exempt

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
@authentication_classes([])  #Disables auth for sign-up endpoint
@permission_classes([AllowAny])  #Allows any user to sign-up
def sign_up(request):
    logger.info("Received Sign-Up Request: %s", request.data)
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            user = User.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            
            refresh_token = RefreshToken.for_user(user)
            access_token = str(refresh_token.access_token)
            
            logger.info("User created and JWT tokens generated for username: %s", user.username)
            return Response({"user": serializer.data, "access token": access_token, "refresh_token": str(refresh_token)})
        
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
@authentication_classes([])
@permission_classes([AllowAny])
def sign_in(request):
    logger.info("Received Sign-In Request: %s", request.data)
    try:
        user = get_object_or_404(User, username=request.data['username'])
        
        if not user.check_password(request.data['password']):
            logger.warning("Invalid password attempt for username: %s", request.data['username'])
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh_token = RefreshToken.for_user(user)
        access_token = str(refresh_token.access_token)

        logger.info("Successful sign-in for username: %s", request.data['username'])

        serializer = UserSerializer(user)
        return Response({"user": serializer.data, "access token": access_token, "refresh_token": str(refresh_token)})
    except Exception as e:
        logger.exception("Unexpected error during sign-in for username: %s. Error: %s", request.data.get('username'), str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def sign_out(request):
    logger.info("Received sign-out Request: %s", request.data)
    try:
        refresh_token = request.data.get('refresh') 
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
            return Response({"error": "Token blacklist not enabled or invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    except TokenError as e:
        logger.warning("TokenError while blacklisting token: %s", str(e))
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.exception("Unexpected error during sign-out or username: %s. Error: %s", request.data.get('username'), str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
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

        reset_link = f"127.0.0.1:8000/auth/reset_password/{uid}/{token}"

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

        return Response({"message": "Password reset successful. All sessions logged out."}, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception("Error confirming reset password: %s", str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
