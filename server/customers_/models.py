from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    LIFECYCLE_STAGES = [
        ('lead', 'Lead'),
        ('rejected', 'Rejected Lead'),
        ('customer', 'Customer'),
        ('lost', 'Lost Customer'),
    ]
    
    GENDERS = [
        ('m', 'Male'),
        ('f', 'Female'),
        #('nb', 'Non Binary')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customers')
    #customer details
    name = models.CharField(max_length=30)
    email = models.EmailField(max_length=40)
    phone = models.CharField(max_length=10)

    gender = models.CharField(max_length=2,choices=GENDERS)
    sales_owner = models.CharField(max_length=30)
    employee_count = models.IntegerField(blank=True, null=True)
    lifecycle_status = models.CharField(
        max_length=10, #longest is 8 for 'rejected'
        choices=LIFECYCLE_STAGES,
        #default='lead',
        blank=True
    )
    loss_reason = models.TextField(blank=True)
    city = models.CharField(max_length=20, blank=True) #customers branch
    #branches = models.JSONField(blank=True, null=True) #companys branch cities
    branches = models.TextField(blank=True)
    market_cap = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name