from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('sign-up/', views.sign_up),
    path('sign-in/', views.sign_in),
    path('sign-out/', views.sign_out),

    path('organizations/', views.organizations),

    path('reset-password/', views.reset_password),
    path('reset-password-confirmed/<str:uidb64>/<str:token>/', views.reset_password_confirmed),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('refresh-token-cookie/', views.refresh_token, name='refresh_token_cookie')
]