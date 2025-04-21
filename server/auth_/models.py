from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Organization(models.Model):
    org_name = models.CharField(max_length=255, unique=True)
    org_created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.org_name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='members')

    def __str__(self):
        return f"{self.user.username} Profile"

class ExpiringToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="active_sessions")
    jti = models.CharField(max_length=255, unique=True)
    created_time = models.DateTimeField(auto_now_add=True)
    expiration_time = models.DateTimeField()

    def is_token_expired(self):
        current_time = timezone.now()
        return current_time > self.expiration_time
    
    def __str__(self):
        return f"{self.user.username} - {self.jti} - Expired: {self.is_expired()}"
