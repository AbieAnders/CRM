from rest_framework import viewsets
from.models import Customer
from .serializers import CustomerSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.none()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user_org = self.request.user.profile.organization
        return Customer.objects.filter(organization=user_org).order_by('-created_at')
    
    def perform_create(self, serializer):
        profile = self.request.user.profile
        serializer.save(user=self.request.user, organization=profile.organization)
    
    