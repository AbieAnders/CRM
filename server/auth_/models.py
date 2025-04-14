from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

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
