from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.core.exceptions import ValidationError

class Organization(models.Model):
    name = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="created_organizations")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def can_be_deleted(self):
        if not self.is_active:
            return False
        active_profiles = self.org_users.filter(is_active=True)
        if self.owner:
            active_profiles = active_profiles.exclude(user=self.owner)
        if active_profiles.exists():
            return False
        user_ids = self.org_users.values_list('user__id', flat=True)  #__ is the django lookup for accessing fields through foreign keys or 1 to 1 fields
        if ExpiringToken.objects.filter(user_id__in=user_ids, expiration_time__gt=timezone.now()).exists():
            return False
        return True

    def soft_delete(self, deleted_by=None, reason=""):
        if not self.can_be_deleted():
            raise ValueError("This organization cannot be deleted because it has active members or other conditions.")
        
        self.is_active = False
        self.save()
        self.org_users.all().update(is_active=False, organization=None) #updating user profile
        
        DeletionLog.objects.create(
            user=deleted_by,
            content_type=ContentType.objects.get_for_model(self),
            object_id=self.id,
            reason=reason
        )

    def __str__(self):
        return f"Organization: {self.name}, Owner: {self.owner})"
    
    class Meta:
        db_table = 'organizations'

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('owner', 'Owner'),
        ('head', 'Head'),
        ('member', 'Member')
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='org_users')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    is_active = models.BooleanField(default=True)
    
    def is_org_owner(self):
        return self.role == 'owner' and self.organization and self.organization.owner == self.user

    def soft_delete(self, deleted_by=None, reason=""):
        self.is_active = False
        self.organization = None
        self.save()

        DeletionLog.objects.create(
            user=deleted_by,
            content_type=ContentType.objects.get_for_model(self),
            object_id=self.id,
            reason=reason
        )

    def save(self, *args, **kwargs):
        if (self.organization and self.organization.owner == self.user and self.role != 'owner'):
            raise ValueError("The organization owner must retain the 'owner' role.")
        if self.role == 'owner':
            existing_owner = UserProfile.objects.filter(
                organization=self.organization,
                role='owner'
            ).exclude(user=self.user).first()
            if existing_owner:
                raise ValueError(f"Organization '{self.organization.name}' already has an owner: {existing_owner.user.username}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"User: {self.user.username}, Role: {self.role})"
    
    class Meta:
        db_table = 'profiles'

class ExpiringToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="active_sessions")
    jti = models.CharField(max_length=255, unique=True)
    created_time = models.DateTimeField(auto_now_add=True)
    expiration_time = models.DateTimeField()

    def is_token_expired(self):
        return timezone.now() > self.expiration_time
    
    def __str__(self):
        status = "Expired" if self.is_token_expired() else "Active"
        return f"{self.user.username}, {self.jti}, Token status: {status}"
    
    class Meta:
        db_table = 'tokens'

class DeletionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True)
    object_id = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(blank=True)

    def __str__(self):
        user_display = self.user.username if self.user else "Unknown username"
        return f"{self.content_type} ID {self.object_id} deleted by {user_display}"
    
    class Meta:
        db_table = 'deletion_log'