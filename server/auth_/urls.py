from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('sign-up/', views.sign_up),
    path('sign-in/', views.sign_in),
    path('sign-out/', views.sign_out),
    path('reset-password/', views.reset_password),
    path('reset-password-confirmed/', views.reset_password_confirmed),
    path('generate-token-pair/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh-token-pair/', TokenRefreshView.as_view(), name='token_refresh')
]