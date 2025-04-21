from django.db import models
from customers_.models import Customer
    
class Contact(models.Model):
    GENDERS = [
        ('m', 'Male'),
        ('f', 'Female'),
        #('nb', 'Non Binary')
    ]

    #company/customer or contact details

    #customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='contacts')
    #name = models.CharField(max_length=30)
    #contact_email = models.EmailField(max_length=40, unique=True)
    #contact_phone = PhoneNumberField(unique=True, region='IN')
    #sales_owner = models.CharField(max_length=30)
    contact_designation = models.CharField(max_length=10)
    #contact_gender = models.CharField(max_length=1,choices=GENDERS, blank=True)
    branch_address = models.TextField(max_length=255, blank=True)
    #contact_branch = models.CharField(max_length=20, blank=True)  #company contacts branch
    #branches = models.JSONField(blank=True, null=True)  #cities of companys branches
    #branches = models.TextField(blank=True)

    '''lifecycle_status = models.CharField(
        max_length=10, #longest is 8 for 'rejected'
        choices=LIFECYCLE_STAGES,
        #default='lead',
        blank=True
    )'''

    last_correspondence = models.DateField(blank=True, null=True)
    corresponder= models.CharField(max_length=30, blank=True)
    updated_time = models.DateTimeField(auto_now=True) #setup save() for this

    def __str__(self):
        return f"Contact #{self.pk} ({self.address})"
    
    class Meta:
        db_table = 'contacts'