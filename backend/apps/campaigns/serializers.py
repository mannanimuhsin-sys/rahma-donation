from rest_framework import serializers
from .models import Campaign

class CampaignSerializer(serializers.ModelSerializer):
    percentage_completed = serializers.ReadOnlyField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'organization', 'title', 'slug', 'description', 'category',
            'target_amount', 'collected_amount', 'donor_count', 'percentage_completed',
            'banner_image', 'status', 'start_date', 'end_date', 'created_at', 'updated_at'
        ]
