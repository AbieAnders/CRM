from django.db import models
from django.contrib.auth.models import User
from auth_.models import Organization
from phonenumber_field.modelfields import PhoneNumberField
#from django.core.validators import RegexValidator

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
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='customers')
    
    #company/customer or contact details
    company_name = models.CharField(max_length=30)
    contact_email = models.EmailField(max_length=40, unique=True)
    contact_phone = PhoneNumberField(unique=True, region='IN')
    #phone_regex = RegexValidator(regex=r'^\d{10}$', message="Phone number must be exactly 10 digits.")
    #contact_phone = models.CharField(validators=[phone_regex], max_length=10, unique=True)
    
    sales_owner = models.CharField(max_length=30)  #setup collection of sales owners later
    contact_designation = models.CharField(max_length=10)
    contact_gender = models.CharField(max_length=1,choices=GENDERS, blank=True)
    contact_branch = models.CharField(max_length=20, blank=True)  #company contacts branch
    
    branch_address = models.TextField(max_length=255, blank=True)
    company_branches = models.JSONField(blank=True, null=True)  #cities of companys branches
    #branches = models.TextField(blank=True)

    lifecycle_status = models.CharField(
        max_length=10, #longest is 8 for 'rejected'
        choices=LIFECYCLE_STAGES,
        #default='lead',
        blank=True
    )
    loss_reason = models.TextField(blank=True)

    last_contact_date = models.DateField(blank=True, null=True)
    contacted_by = models.CharField(max_length=30,blank=True)

    employee_count = models.IntegerField(blank=True, null=True)
    market_cap = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} ({self.contact_email})"
    
    class Meta:
        db_table = 'customers'