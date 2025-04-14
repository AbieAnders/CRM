from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('sign_up/', views.sign_up),
    path('sign_in/', views.sign_in),
    path('sign_out/', views.sign_out),
    path('reset_password/', views.reset_password),
    path('reset_password_confirmed/', views.reset_password_confirmed),
    path('generate_token_pair/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh_token_pair/', TokenRefreshView.as_view(), name='token_refresh')
]