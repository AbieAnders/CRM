from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Organization

class UserSerializer(serializers.ModelSerializer):
    organization = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, write_only=True, default='member')
    
    organization_name = serializers.CharField(source='profile.organization.name', read_only=True)
    user_role = serializers.CharField(source='profile.role', read_only=True)

    class Meta(object):
        model = User
        fields = ['id', 'organization', 'organization_name', 'username', 'email', 'role', 'user_role', 'password']
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
        organization_name = validated_data.pop('organization')
        role = validated_data.pop('role', 'member')
        
        organization, created_now = Organization.objects.get_or_create(name=organization_name)

        if role == 'owner' and not created_now:
            organization, created_now = Organization.objects.get_or_create(name=organization_name)
        elif role != 'owner' and created_now:
            raise serializers.ValidationError("The first user must be the owner of a new organization.")

        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, organization=organization, role=role)
        
        if role == 'owner':
            organization.owner = user
            organization.save()

        return user