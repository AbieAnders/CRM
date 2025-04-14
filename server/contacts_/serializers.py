from rest_framework import serializers
#from auth_.serializers import UserSerializer
from .models import Customer

class ContactSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = Customer
        fields = [
            'username',
            'email',
            
            'id',
            'company_name',
            'contact_email',
            'contact_phone',
            'sales_owner',

            'contact_designation',
            'contact_gender',
            'contact_branch',
            'branch_address',

            'lifecycle_status',
            'loss_reason',
            'last_contact_date',
            'contacted_by',
        ]
        read_only = ['username', 'email', 'created_at']