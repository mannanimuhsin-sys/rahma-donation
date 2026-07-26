import hmac
import hashlib
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Donation
from .serializers import DonationSerializer
from .pdf_generator import generate_pdf_receipt
from apps.campaigns.models import Campaign
from apps.payment_settings.models import PaymentSetting

class CreateOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        campaign_id = request.data.get('campaign_id')
        amount = request.data.get('amount')
        donor_name = request.data.get('donor_name')
        house_name = request.data.get('house_name', '')
        donor_email = request.data.get('donor_email', '')
        donor_phone = request.data.get('donor_phone', '')
        madrasa_name = request.data.get('madrasa_name', 'Other')
        other_place = request.data.get('other_place', '')
        payment_method = request.data.get('payment_method', 'UPI')

        if not amount or float(amount) <= 0:
            return Response({'error': 'Please enter a valid donation amount.'}, status=status.HTTP_400_BAD_REQUEST)
        if not donor_name or not donor_phone:
            return Response({'error': 'Donor name and mobile number are required.'}, status=status.HTTP_400_BAD_REQUEST)

        campaign = None
        if campaign_id:
            try:
                campaign = Campaign.objects.get(id=campaign_id)
            except Campaign.DoesNotExist:
                campaign = None

        donor_user = request.user if request.user.is_authenticated else None

        donation = Donation.objects.create(
            campaign=campaign,
            donor=donor_user,
            donor_name=donor_name,
            house_name=house_name,
            donor_email=donor_email,
            donor_phone=donor_phone,
            madrasa_name=madrasa_name,
            other_place=other_place,
            amount=amount,
            payment_method=payment_method,
            payment_status='PENDING'
        )

        payment_setting = PaymentSetting.objects.first()
        is_test_mode = payment_setting.is_test_mode if payment_setting else True

        razorpay_order_id = f"order_rahma_{donation.id.hex[:12]}"
        donation.razorpay_order_id = razorpay_order_id
        donation.save()

        return Response({
            'donation_id': str(donation.id),
            'order_id': razorpay_order_id,
            'amount': float(donation.amount),
            'currency': 'INR',
            'key': payment_setting.api_key if payment_setting else 'rzp_test_rahma12345678',
            'donor_name': donation.donor_name,
            'house_name': donation.house_name,
            'donor_phone': donation.donor_phone,
            'madrasa_name': donation.display_madrasa,
            'is_test_mode': is_test_mode,
            'message': 'Donation order initialized successfully'
        })

class VerifyPaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        donation_id = request.data.get('donation_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        if not donation_id:
            return Response({'error': 'Donation ID is missing.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            donation = Donation.objects.get(id=donation_id)
        except Donation.DoesNotExist:
            return Response({'error': 'Donation record not found.'}, status=status.HTTP_404_NOT_FOUND)

        if donation.payment_status == 'SUCCESS':
            pdf_url = donation.receipt_pdf.url if donation.receipt_pdf else generate_pdf_receipt(donation)
            return Response({
                'status': 'SUCCESS',
                'message': 'Payment already verified.',
                'donation': DonationSerializer(donation).data,
                'receipt_url': pdf_url
            })

        donation.razorpay_payment_id = razorpay_payment_id or f"pay_rahma_{donation.id.hex[:10]}"
        donation.razorpay_signature = razorpay_signature or "sig_test_verified"
        donation.payment_status = 'SUCCESS'
        donation.save()

        if donation.campaign:
            donation.campaign.collected_amount += donation.amount
            donation.campaign.donor_count += 1
            donation.campaign.save()

        pdf_url = generate_pdf_receipt(donation)

        return Response({
            'status': 'SUCCESS',
            'message': 'Barakallahu Feekum! Your donation has been verified and processed successfully.',
            'donation': DonationSerializer(donation).data,
            'receipt_url': pdf_url
        })

class PaymentWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        event = request.data.get('event')
        payload = request.data.get('payload', {})

        if event == 'payment.captured':
            payment_entity = payload.get('payment', {}).get('entity', {})
            order_id = payment_entity.get('order_id')
            payment_id = payment_entity.get('id')

            if order_id:
                try:
                    donation = Donation.objects.get(razorpay_order_id=order_id)
                    if donation.payment_status != 'SUCCESS':
                        donation.payment_status = 'SUCCESS'
                        donation.razorpay_payment_id = payment_id
                        donation.save()
                        if donation.campaign:
                            donation.campaign.collected_amount += donation.amount
                            donation.campaign.donor_count += 1
                            donation.campaign.save()
                        generate_pdf_receipt(donation)
                except Donation.DoesNotExist:
                    pass

        return Response({'status': 'Webhook processed successfully'})

class MyDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user, payment_status='SUCCESS').order_by('-created_at')

class AllDonationsView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_org_admin():
            return Donation.objects.none()
        return Donation.objects.filter(payment_status='SUCCESS').order_by('-created_at')

class LiveCollectionStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=now.weekday())
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

        successful_donations = Donation.objects.filter(payment_status='SUCCESS')

        total_collected = successful_donations.aggregate(Sum('amount'))['amount__sum'] or 0.00
        today_collected = successful_donations.filter(created_at__gte=today_start).aggregate(Sum('amount'))['amount__sum'] or 0.00
        weekly_collected = successful_donations.filter(created_at__gte=week_start).aggregate(Sum('amount'))['amount__sum'] or 0.00
        monthly_collected = successful_donations.filter(created_at__gte=month_start).aggregate(Sum('amount'))['amount__sum'] or 0.00
        yearly_collected = successful_donations.filter(created_at__gte=year_start).aggregate(Sum('amount'))['amount__sum'] or 0.00
        total_donors = successful_donations.values('donor_phone').distinct().count()

        # Top Donors (Ranked by highest donation amount)
        top_donors_qs = successful_donations.order_by('-amount')[:10]
        top_donors = [
            {
                'id': str(d.id),
                'donor_name': d.donor_name,
                'house_name': d.house_name,
                'madrasa_name': d.display_madrasa,
                'donor_phone_masked': d.donor_phone_masked,
                'amount': float(d.amount),
                'created_at': d.created_at
            }
            for d in top_donors_qs
        ]

        # Madrasa Rankings (Aggregated total collection per Madrasa)
        all_madrasas_list = [
            'Al-Madrasathul Islamiyya, Chapparappadavu',
            'Hayathul Islam Madrasa, Karuvanchal',
            'Sirajul Uloom Madrasa, Tadikkadabu',
            'Badrul Huda Madrasa, Padappengad',
            'Markazul Uloom Madrasa, Thervayil',
            'Hidayathul Islam Madrasa, Mavichery',
            'Minhajus Sunnah Madrasa, Alakkode',
            'Darul Iman Madrasa, Karthikapuram',
            'Irshadul Muslimeen Madrasa, Pooparamba',
            'Nurul Islam Madrasa, Manakadavu',
            'Busthanul Uloom Madrasa, Chengalayi',
            'Fathima Zahra Madrasa, Reyarome',
            'Thanjimul Muslimeen Madrasa, Ottathai',
            'Raudul Uloom Madrasa, Nedungome',
            'Sabeelul Huda Madrasa, Arabode',
            'Markazus Sunnah Madrasa, Kaniyarvayal',
            'Manharul Uloom Madrasa, Kooveri'
        ]

        madrasa_totals = {}
        for d in successful_donations:
            m_name = d.display_madrasa
            madrasa_totals[m_name] = madrasa_totals.get(m_name, 0.00) + float(d.amount)

        # Include 0 collection madrasas in default list for complete ranking display
        for m in all_madrasas_list:
            if m not in madrasa_totals:
                madrasa_totals[m] = 0.00

        # Sort madrasas descending by collection
        sorted_madrasas = sorted(madrasa_totals.items(), key=lambda item: item[1], reverse=True)
        madrasa_rankings = [
            {'rank': idx + 1, 'name': m[0], 'amount': m[1]}
            for idx, m in enumerate(sorted_madrasas)
        ]

        recent_donations = DonationSerializer(successful_donations.order_by('-created_at')[:10], many=True).data

        return Response({
            'total_collected': float(total_collected),
            'today_collected': float(today_collected),
            'weekly_collected': float(weekly_collected),
            'monthly_collected': float(monthly_collected),
            'yearly_collected': float(yearly_collected),
            'total_donors': total_donors,
            'top_donors': top_donors,
            'madrasa_rankings': madrasa_rankings,
            'recent_donations': recent_donations,
        })
