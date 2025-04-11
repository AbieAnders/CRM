from rest_framework import serializers
from auth_.serializers import UserSerializer
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Customer
        fields = '__all__'