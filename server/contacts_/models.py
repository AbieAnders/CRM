from django.db import models
from customers_.models import Customer
    
class Contact(models.Model):
    GENDERS = [
        ('m', 'Male'),
        ('f', 'Female'),
        #('nb', 'Non Binary')
    ]

    #company/customer or contact details

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='contacts')
    #branches = models.JSONField(blank=True, null=True)  #cities of companys branches
    #branches = models.TextField(blank=True)

    last_correspondence = models.DateField(blank=True, null=True)
    corresponder= models.CharField(max_length=30, blank=True)
    updated_time = models.DateTimeField(auto_now=True) #setup save() for this

    def __str__(self):
        return f"Contact #{self.pk} (Customer: {self.customer.company_name})"
    
    class Meta:
        db_table = 'contacts'