from rest_framework import viewsets

from server.decorators import log_execution_time
from .models import Customer
from .serializers import ContactSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user_org = self.request.user.profile.organization
        return Customer.objects.filter(organization=user_org).order_by('-created_at')
    
    @log_execution_time
    def perform_create(self, serializer):
        profile = self.request.user.profile
        serializer.save(user=self.request.user, organization=profile.organization)
    
    @log_execution_time
    def list(self, request, *args, **kwargs):
        """
        Override the `list` method to log execution time of data fetching.
        """
        return super().list(request, *args, **kwargs)

    @log_execution_time
    def create(self, request, *args, **kwargs):
        """
        Override the `create` method to log execution time of creating a new customer.
        """
        return super().create(request, *args, **kwargs)