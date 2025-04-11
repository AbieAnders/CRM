from rest_framework import serializers
from auth_.serializers import UserSerializer
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Contact
        fields = '__all__'