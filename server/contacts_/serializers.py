from rest_framework import serializers
#from auth_.serializers import UserSerializer
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='customer.company_name', read_only=True)
    contact_email = serializers.EmailField(source='customer.contact_email', read_only=True)
    contact_phone = serializers.CharField(source='customer.contact_phone', read_only=True)
    sales_owner = serializers.CharField(source='customer.sales_owner', read_only=True)
    contact_designation = serializers.CharField(source='customer.contact_designation', read_only=True)
    contact_gender = serializers.CharField(source='customer.contact_gender', read_only=True)
    contact_branch = serializers.CharField(source='customer.contact_branch', read_only=True)
    branch_address = serializers.CharField(source='customer.branch_address', read_only=True)
    lifecycle_status = serializers.CharField(source='customer.lifecycle_status', read_only=True)
    loss_reason = serializers.CharField(source='customer.loss_reason', read_only=True)
    last_contact_date = serializers.DateField(source='customer.last_contact_date', read_only=True)
    contacted_by = serializers.CharField(source='customer.contacted_by', read_only=True)

    organization_name = serializers.CharField(source='organization.org_name', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Contact
        fields = [
            'organization_name',

            'user_id', 'username', 'email',
            
            'id', 'company_name', 'contact_email', 'contact_phone', 'sales_owner',

            'contact_designation', 'contact_gender', 'contact_branch', 'branch_address',

            'lifecycle_status', 'last_correspondence', 'corresponder', 'loss_reason',
            
            'last_contact_date', 'contacted_by',
        ]
        read_only_fields = ['organization_name', 'user_id', 'username', 'email', 'created_at']