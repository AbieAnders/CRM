from rest_framework import serializers
#from auth_.serializers import UserSerializer
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    #user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = Customer
        fields = [
            'user_id',
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
            'company_branches',
            
            'lifecycle_status',
            'loss_reason',
            'last_contact_date',
            'contacted_by',
            'employee_count',
            'market_cap',
        ]
        read_only_fields = ['user_id', 'username', 'email', 'created_at']