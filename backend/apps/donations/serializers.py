from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(source='campaign.title', read_only=True)
    donor_phone_masked = serializers.ReadOnlyField()
    display_madrasa = serializers.ReadOnlyField()
    receipt_pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Donation
        fields = [
            'id', 'donation_number', 'organization', 'campaign', 'campaign_title',
            'donor', 'donor_name', 'house_name', 'donor_email', 'donor_phone',
            'donor_phone_masked', 'madrasa_name', 'other_place', 'display_madrasa',
            'amount', 'payment_method', 'payment_status', 'razorpay_order_id',
            'razorpay_payment_id', 'receipt_number', 'receipt_pdf_url', 'created_at'
        ]

    def get_receipt_pdf_url(self, obj):
        if obj.receipt_pdf:
            return obj.receipt_pdf.url
        return None
