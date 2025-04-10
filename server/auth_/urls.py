from django.urls import re_path
from . import views

urlpatterns = [
    re_path('sign_up/', views.sign_up),
    re_path('sign_in/', views.sign_in)
]