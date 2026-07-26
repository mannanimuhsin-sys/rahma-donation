from django.db import models
from apps.organizations.models import Organization

class PaymentSetting(models.Model):
    GATEWAY_CHOICES = (
        ('RAZORPAY', 'Razorpay'),
        ('CASHFREE', 'Cashfree'),
        ('PHONEPE', 'PhonePe'),
    )

    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='payment_setting')
    org_display_name = models.CharField(max_length=255, default="RAHMA Islamic Foundation & Charity")
    bank_name = models.CharField(max_length=255, blank=True, default="State Bank of India")
    account_holder_name = models.CharField(max_length=255, blank=True, default="RAHMA Charitable Trust")
    account_number = models.CharField(max_length=100, blank=True, default="9876543210123")
    ifsc_code = models.CharField(max_length=20, blank=True, default="SBIN0001234")
    upi_id = models.CharField(max_length=100, blank=True, default="rahma.trust@sbi")
    qr_code_image = models.ImageField(upload_to='payment_qrs/', null=True, blank=True)
    
    payment_gateway = models.CharField(max_length=50, choices=GATEWAY_CHOICES, default='RAZORPAY')
    api_key = models.CharField(max_length=255, blank=True, default="rzp_test_rahma12345678")
    secret_key = models.CharField(max_length=255, blank=True, default="rahma_secret_key_987654321")
    webhook_secret = models.CharField(max_length=255, blank=True, default="whsec_rahma_webhook_secret_key")
    is_test_mode = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment Settings - {self.organization.name if self.organization else 'Global'}"
