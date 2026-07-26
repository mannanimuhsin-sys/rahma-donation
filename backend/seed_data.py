import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rahma_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.organizations.models import Organization
from apps.payment_settings.models import PaymentSetting
from apps.campaigns.models import Campaign
from apps.donations.models import Donation
from apps.donations.pdf_generator import generate_pdf_receipt

User = get_user_model()

def run_seed():
    print("Seeding RAHMA Database...")

    # 1. Organization
    org, created = Organization.objects.get_or_create(
        slug='al-rahma-central-mosque',
        defaults={
            'name': 'Al-Rahma Central Mosque & Islamic Center',
            'tagline': 'Serving the Ummah with Knowledge, Compassion & Faith',
            'about_text': 'Al-Rahma Islamic Center is dedicated to spiritual growth, Islamic education, community welfare, and charitable outreach. Your generous contributions sustain our daily operations, educational madrasa, and community relief initiatives.',
            'address': 'Grand Mosque Road, Cultural Zone, Kerala, India',
            'contact_email': 'contact@rahmafoundation.org',
            'contact_phone': '+91 98765 43210',
            'registration_number': 'NGO-REG-2024/786-RAHMA'
        }
    )
    print(f"[OK] Organization: {org.name}")

    # 2. Users
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@rahmafoundation.org',
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
            email='orgadmin@rahmafoundation.org',
            password='admin123',
            first_name='Mosque',
            last_name='Manager',
            role=User.Role.ADMIN,
            organization=org
        )
        print("[OK] Org Admin created (username: orgadmin, password: admin123)")

    if not User.objects.filter(username='donor1').exists():
        donor = User.objects.create_user(
            username='donor1',
            email='mohammed.ali@example.com',
            password='donor123',
            first_name='Mohammed',
            last_name='Ali',
            phone='+91 98950 12345',
            role=User.Role.DONOR
        )
        print("[OK] Demo Donor created (username: donor1, password: donor123)")
    else:
        donor = User.objects.get(username='donor1')

    # 3. Payment Settings
    pay_setting, _ = PaymentSetting.objects.get_or_create(
        organization=org,
        defaults={
            'org_display_name': org.name,
            'bank_name': 'State Bank of India',
            'account_holder_name': 'Al-Rahma Charitable Trust',
            'account_number': '9876543210123',
            'ifsc_code': 'SBIN0001234',
            'upi_id': 'rahmatrust@sbi',
            'payment_gateway': 'RAZORPAY',
            'api_key': 'rzp_test_rahma12345678',
            'secret_key': 'rahma_secret_key_987654321',
            'webhook_secret': 'whsec_rahma_webhook_secret_key',
            'is_test_mode': True
        }
    )
    print("[OK] Payment Settings created.")

    # 4. Campaigns
    campaigns_data = [
        {
            'title': 'Grand Mosque Expansion & Solar Power Drive',
            'description': 'Expanding prayer halls to accommodate 1,500+ worshippers for Friday Jumuah & installing clean green solar power systems.',
            'category': 'Masjid Construction',
            'target_amount': 2500000.00,
            'collected_amount': 1485000.00,
            'donor_count': 142,
            'status': 'ACTIVE'
        },
        {
            'title': 'Madrasa Student Scholarship & Hifz Sponsorship',
            'description': 'Sponsoring Islamic education, textbooks, clothing, and meals for 100 underprivileged students memorizing the Holy Quran.',
            'category': 'Education & Hifz',
            'target_amount': 750000.00,
            'collected_amount': 520000.00,
            'donor_count': 86,
            'status': 'ACTIVE'
        },
        {
            'title': 'Ramadan Community Iftar & Food Ration Kits',
            'description': 'Providing daily nutritious Iftar for fasting community members and monthly ration packages to 300 needy widows & families.',
            'category': 'Food & Relief',
            'target_amount': 500000.00,
            'collected_amount': 390000.00,
            'donor_count': 114,
            'status': 'ACTIVE'
        },
        {
            'title': 'Orphan Care & Medical Emergency Relief Fund',
            'description': 'Emergency healthcare aid, surgeries, medicines, and monthly support for orphans and underprivileged patients in critical need.',
            'category': 'Healthcare & Orphan Welfare',
            'target_amount': 1000000.00,
            'collected_amount': 610000.00,
            'donor_count': 95,
            'status': 'ACTIVE'
        }
    ]

    sample_campaigns = []
    for c_data in campaigns_data:
        c, _ = Campaign.objects.get_or_create(
            title=c_data['title'],
            organization=org,
            defaults=c_data
        )
        sample_campaigns.append(c)
    print(f"[OK] {len(sample_campaigns)} Campaigns created.")

    # 5. Sample Donations & Receipts
    donations_data = [
        {'donor_name': 'Mohammed Ali', 'email': 'mohammed.ali@example.com', 'amount': 25000.00, 'method': 'UPI', 'campaign': sample_campaigns[0]},
        {'donor_name': 'Fatima Zohra', 'email': 'fatima.z@example.com', 'amount': 15000.00, 'method': 'GOOGLE_PAY', 'campaign': sample_campaigns[1]},
        {'donor_name': 'Yusuf Ibrahim', 'email': 'yusuf.i@example.com', 'amount': 50000.00, 'method': 'NET_BANKING', 'campaign': sample_campaigns[0]},
        {'donor_name': 'Aisha Rahman', 'email': 'aisha.r@example.com', 'amount': 10000.00, 'method': 'PHONEPE', 'campaign': sample_campaigns[2]},
        {'donor_name': 'Zaid Abdullah', 'email': 'zaid.a@example.com', 'amount': 30000.00, 'method': 'CREDIT_CARD', 'campaign': sample_campaigns[3]},
    ]

    for d_item in donations_data:
        donation, created = Donation.objects.get_or_create(
            donor_email=d_item['email'],
            amount=d_item['amount'],
            campaign=d_item['campaign'],
            defaults={
                'organization': org,
                'donor': donor if d_item['donor_name'] == 'Mohammed Ali' else None,
                'donor_name': d_item['donor_name'],
                'donor_phone': '+91 98470 55667',
                'payment_method': d_item['method'],
                'payment_status': 'SUCCESS',
                'razorpay_payment_id': f"pay_seed_{d_item['donor_name'].replace(' ', '_').lower()}",
            }
        )
        if created:
            generate_pdf_receipt(donation)

    print("[OK] Sample Donations & Receipts seeded successfully!")
    print("Database seeding completed successfully.")

if __name__ == '__main__':
    run_seed()
