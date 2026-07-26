import uuid
from django.db import models
from django.conf import settings
from apps.organizations.models import Organization
from apps.campaigns.models import Campaign

class Donation(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('UPI', 'UPI'),
        ('GOOGLE_PAY', 'Google Pay'),
        ('PHONEPE', 'PhonePe'),
        ('PAYTM', 'Paytm'),
        ('NET_BANKING', 'Net Banking'),
        ('DEBIT_CARD', 'Debit Card'),
        ('CREDIT_CARD', 'Credit Card'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donation_number = models.CharField(max_length=50, unique=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='donations', null=True, blank=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    
    # Required Fields from User Request
    donor_name = models.CharField(max_length=255)
    house_name = models.CharField(max_length=255, blank=True, default='')
    donor_email = models.EmailField(blank=True, default='')
    donor_phone = models.CharField(max_length=20)
    madrasa_name = models.CharField(max_length=255, default='Other')
    other_place = models.CharField(max_length=255, blank=True, default='')

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=30, choices=PAYMENT_METHOD_CHOICES, default='UPI')
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=255, blank=True)
    
    receipt_number = models.CharField(max_length=100, unique=True, blank=True)
    receipt_pdf = models.FileField(upload_to='receipts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def donor_phone_masked(self):
        """Masks mobile number leaving last 4 digits visible: XXXXXX1234"""
        phone_str = str(self.donor_phone).strip()
        clean_digits = ''.join(c for c in phone_str if c.isdigit())
        if len(clean_digits) >= 4:
            return "XXXXXX" + clean_digits[-4:]
        return "XXXXXX" + clean_digits

    @property
    def display_madrasa(self):
        if self.madrasa_name == 'Other' or self.madrasa_name == 'മറ്റുള്ളവ':
            return self.other_place or 'Other Place'
        return self.madrasa_name

    def save(self, *args, **kwargs):
        if not self.donation_number:
            import datetime, random
            date_str = datetime.date.today().strftime('%Y%m%d')
            rand_str = ''.join([str(random.randint(0, 9)) for _ in range(4)])
            self.donation_number = f"DON-{date_str}-{rand_str}"
        if not self.receipt_number:
            self.receipt_number = f"REC-{self.donation_number[4:]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.donation_number} - {self.donor_name} ({self.house_name}) - ₹{self.amount}"
