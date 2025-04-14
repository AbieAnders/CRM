from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Email is already in use")
        return value
    
    def validate_username(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.filter(username=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Username is already taken")
        return value