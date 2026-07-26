import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rahma_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.organizations.models import Organization
from apps.payment_settings.models import PaymentSetting
from apps.campaigns.models import Campaign
from apps.donations.models import Donation

User = get_user_model()

def reset_and_seed():
    print("Resetting database for SKJM Chapparappadavu Range (Starting at 0 Balance)...")

    # Clear donations
    Donation.objects.all().delete()
    print("[OK] All previous donations cleared. Balance reset to 0.")

    # 1. Organization
    org, created = Organization.objects.get_or_create(
        slug='skjm-chapparappadavu-range',
        defaults={
            'name': 'SKJM Chapparappadavu Range Shema Samithi',
            'tagline': 'Serving Madrasas & Islamic Education Across the Range',
            'about_text': 'SKJM Chapparappadavu Range Shema Samithi is dedicated to Islamic education, madrasa welfare, student empowerment, and community development across all 17 range madrasas.',
            'address': 'Chapparappadavu Range Office, Kannur, Kerala, India',
            'contact_email': 'contact@skjm-chapparappadavu.org',
            'contact_phone': '+91 98765 43210',
            'registration_number': 'SKJM-REG-RANGE-017'
        }
    )
    print(f"[OK] Organization: {org.name}")

    # 2. Users
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@skjm-chapparappadavu.org',
            password='admin123',
            first_name='Super',
            last_name='Admin',
            role=User.Role.SUPER_ADMIN,
            organization=org
        )
        print("[OK] Super Admin created (username: admin, password: admin123)")

    if not User.objects.filter(username='orgadmin').exists():
        User.objects.create_user(
            username='orgadmin',
            email='orgadmin@skjm-chapparappadavu.org',
            password='admin123',
            first_name='Range',
            last_name='Secretary',
            role=User.Role.ADMIN,
            organization=org
        )
        print("[OK] Range Admin created (username: orgadmin, password: admin123)")

    # 3. Payment Settings
    PaymentSetting.objects.get_or_create(
        organization=org,
        defaults={
            'org_display_name': org.name,
            'bank_name': 'State Bank of India',
            'account_holder_name': 'SKJM Chapparappadavu Range Shema Samithi',
            'account_number': '9876543210123',
            'ifsc_code': 'SBIN0001234',
            'upi_id': 'skjmchapparappadavu@sbi',
            'payment_gateway': 'RAZORPAY',
            'api_key': 'rzp_test_rahma12345678',
            'secret_key': 'rahma_secret_key_987654321',
            'webhook_secret': 'whsec_rahma_webhook_secret_key',
            'is_test_mode': True
        }
    )
    print("[OK] Payment Settings created.")

    # 4. Campaigns (Reset collected amounts to 0)
    Campaign.objects.all().delete()
    campaigns_data = [
        {
            'title': 'SKJM Chapparappadavu Range Shema Samithi Fund 2026',
            'description': 'Support Islamic education, madrasa infrastructure, student scholarships, and range activities across all 17 range madrasas.',
            'category': 'Range Shema Samithi',
            'target_amount': 1000000.00,
            'collected_amount': 0.00,
            'donor_count': 0,
            'status': 'ACTIVE'
        },
        {
            'title': 'Madrasa Student Scholarship & Books Fund',
            'description': 'Providing free textbooks, uniforms, and scholarships to underprivileged students studying in range madrasas.',
            'category': 'Madrasa Education',
            'target_amount': 500000.00,
            'collected_amount': 0.00,
            'donor_count': 0,
            'status': 'ACTIVE'
        }
    ]

    for c_data in campaigns_data:
        Campaign.objects.create(organization=org, **c_data)
    print("[OK] 2 Campaigns created with 0 initial balance.")

    print("Database reset & 0-balance initialization completed successfully.")

if __name__ == '__main__':
    reset_and_seed()
