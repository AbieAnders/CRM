from django.db import models
from customers_.models import Customer
    
class Contact(models.Model):
    GENDERS = [
        ('m', 'Male'),
        ('f', 'Female'),
        #('nb', 'Non Binary')
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='contacts')
    #name = models.CharField(max_length=30)
    #gender = models.CharField(max_length=2,choices=GENDERS)
    #email = models.EmailField(max_length=40)
    #phone = models.CharField(max_length=10)
    #sales_owner = models.CharField(max_length=30)
    address = models.TextField(max_length=255, blank=True)
    #city = models.CharField(max_length=20, blank=True) #customers branch
    #branches = models.TextField(blank=True)
    last_correspondence = models.DateField(blank=True, null=True)
    corresponder= models.CharField(max_length=30,blank=True)
    updated_at = models.DateTimeField(auto_now=True) #setup save() for this

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.address})"