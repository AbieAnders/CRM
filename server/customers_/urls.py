from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet

router = DefaultRouter(r'customers', CustomerViewSet, basename='customer')

urlpattern = [
    path('customers_/', include(router.urls))
]