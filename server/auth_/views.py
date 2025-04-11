from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError

import logging
from django.db import IntegrityError
from .serializers import UserSerializer

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

@api_view(['POST'])
def sign_up(request):
    logger.info("Received Sign-Up Request: %s", request.data)
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            user = User.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            
            token = Token.objects.create(user=user)
            
            logger.info("User create and token generated for username: %s", user.username)
            return Response({"token": token.key, "user": serializer.data})
        
        logger.warning("invalid sign-up data: %s", serializer.errors)
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
def sign_in(request):
    logger.info("Received Sign-In Request: %s", request.data)
    try:
        user = get_object_or_404(User, username=request.data['username'])
        
        if not user.check_password(request.data['password']):
            logger.warning("Invalid password attempt for username: %s", request.data['username'])
            return Response({"detail": "Invalid credentials"}, status-status.HTTP_400_BAD_REQUEST)

        token, created_ = Token.objects.get_or_create(user=user)
        logger.info("Successful sign-in for username: %s", request.data['username'])

        serializer = UserSerializer(user)
        return Response({"token": token.key, "user": serializer.data})
    except Exception as e:
        logger.exception("Unexpected error during sign-in for username: %s. Error: %s", request.data.get('username'), str(e))
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)