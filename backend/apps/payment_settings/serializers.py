from rest_framework import serializers
from .models import PaymentSetting

class PublicPaymentSettingSerializer(serializers.ModelSerializer):
    """Public serializer exposed during donation checkout (hides secret keys)."""
    class Meta:
        model = PaymentSetting
        fields = [
            'org_display_name', 'bank_name', 'account_holder_name', 
            'account_number', 'ifsc_code', 'upi_id', 'qr_code_image', 
            'payment_gateway', 'api_key', 'is_test_mode'
        ]

class AdminPaymentSettingSerializer(serializers.ModelSerializer):
    """Full administrative serializer for Super Admin configuration."""
    class Meta:
        model = PaymentSetting
        fields = '__all__'
