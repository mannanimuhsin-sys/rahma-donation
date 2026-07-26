import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rahma_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.organizations.models import Organization
from apps.payment_settings.models import PaymentSetting
from apps.campaigns.models import Campaign

User = get_user_model()

def reset_and_seed():
    # 1. Organization
    org, created = Organization.objects.get_or_create(
        slug='skjm-chapparappadavu-range',
        defaults={
            'name': 'SKJM ചപ്പാരപ്പടവ് റെയിഞ്ച് ക്ഷേമ സമിതി',
            'tagline': 'ഉസ്താദുമാരുടെ ക്ഷേമ പദ്ധതികൾക്കുള്ള ഡിജിറ്റൽ ഫണ്ട് സമാഹരണം',
            'about_text': 'റെയിഞ്ച് പരിധിയിൽ സേവനമനുഷ്ഠിക്കുന്ന ഉസ്താദുമാരുടെ ക്ഷേമത്തിനു വേണ്ടി അവരുടെ ചികിത്സ, വീട് നിർമാണം, വിവാഹം, മറ്റു ആനുകൂല്യങ്ങൾ ലഭിക്കാൻ വേണ്ടിയിട്ടുള്ള ഒരു ഫണ്ട് സമാഹരണമാണ് ഇത്.',
            'address': 'Chapparappadavu Range Office, Kannur, Kerala, India',
            'contact_email': 'contact@skjm-chapparappadavu.org',
            'contact_phone': '+91 75599 50633',
            'registration_number': 'SKJM-REG-RANGE-017'
        }
    )

    org.name = 'SKJM ചപ്പാരപ്പടവ് റെയിഞ്ച് ക്ഷേമ സമിതി'
    org.about_text = 'റെയിഞ്ച് പരിധിയിൽ സേവനമനുഷ്ഠിക്കുന്ന ഉസ്താദുമാരുടെ ക്ഷേമത്തിനു വേണ്ടി അവരുടെ ചികിത്സ, വീട് നിർമാണം, വിവാഹം, മറ്റു ആനുകൂല്യങ്ങൾ ലഭിക്കാൻ വേണ്ടിയിട്ടുള്ള ഒരു ഫണ്ട് സമാഹരണമാണ് ഇത്.'
    org.save()

    print("[OK] Organization updated.")

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
        print("[OK] Super Admin created.")

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
        print("[OK] Range Admin created.")

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

    # 4. Campaigns
    Campaign.objects.all().delete()
    campaigns_data = [
        {
            'title': 'SKJM ചപ്പാരപ്പടവ് റെയിഞ്ച് ക്ഷേമ സമിതി ഫണ്ട് 2026',
            'description': 'റെയിഞ്ച് പരിധിയിൽ സേവനമനുഷ്ഠിക്കുന്ന ഉസ്താദുമാരുടെ ക്ഷേമത്തിനു വേണ്ടി അവരുടെ ചികിത്സ, വീട് നിർമാണം, വിവാഹം, മറ്റു ആനുകൂല്യങ്ങൾ ലഭിക്കാൻ വേണ്ടിയിട്ടുള്ള ഫണ്ട് സമാഹരണം.',
            'category': 'ക്ഷേമ സമിതി ഫണ്ട്',
            'target_amount': 1000000.00,
            'collected_amount': 0.00,
            'donor_count': 0,
            'status': 'ACTIVE'
        },
        {
            'title': 'ഉസ്താദുമാരുടെ അടിയന്തര ചികിത്സാ & റിലീഫ് ഫണ്ട്',
            'description': 'അടിയന്തര ഘട്ടങ്ങളിൽ ഉസ്താദുമാർക്ക് മെഡിക്കൽ ചികിത്സയും സാമ്പത്തിക സഹായവും എത്തിക്കാനുള്ള സമാഹരണം.',
            'category': 'ചികിത്സാ റിലീഫ്',
            'target_amount': 500000.00,
            'collected_amount': 0.00,
            'donor_count': 0,
            'status': 'ACTIVE'
        }
    ]

    for c_data in campaigns_data:
        Campaign.objects.create(organization=org, **c_data)
    print("[OK] Campaigns updated for Usthad Welfare.")

if __name__ == '__main__':
    reset_and_seed()
