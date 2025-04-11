from django.urls import path
from . import views

urlpatterns = [
    path('sign_up/', views.sign_up),
    path('sign_in/', views.sign_in)
]