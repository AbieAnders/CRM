from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Organization

class UserSerializer(serializers.ModelSerializer):
    organization = serializers.CharField(write_only=True, required=True)
    org_name = serializers.CharField(source='profile.organization.org_name', read_only=True)
    
    class Meta(object):
        model = User
        fields = ['id', 'username', 'password', 'email', 'organization', 'org_name']
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
    
    def create(self, validated_data):
        org_name = validated_data.pop('organization')
        organization = Organization.objects.filter(org_name__iexact=org_name).first()

        if not organization:
            organization = Organization.objects.create(org_name=org_name)

        user = User.objects.create_user(**validated_data)
        user.profile.organization = organization
        user.profile.save()

        return user