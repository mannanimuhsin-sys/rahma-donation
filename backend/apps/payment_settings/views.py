from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PaymentSetting
from .serializers import PublicPaymentSettingSerializer, AdminPaymentSettingSerializer
from apps.organizations.models import Organization

class PublicPaymentSettingView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        setting = PaymentSetting.objects.first()
        if not setting:
            org, _ = Organization.objects.get_or_create(
                slug='rahma-main',
                defaults={'name': 'RAHMA Foundation', 'tagline': 'Empowering Communities & Charitable Causes'}
            )
            setting = PaymentSetting.objects.create(organization=org)
        serializer = PublicPaymentSettingSerializer(setting)
        return Response(serializer.data)

class AdminPaymentSettingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_org_admin():
            return Response({'error': 'Permission denied. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)
        
        setting = PaymentSetting.objects.first()
        if not setting:
            org, _ = Organization.objects.get_or_create(
                slug='rahma-main',
                defaults={'name': 'RAHMA Foundation', 'tagline': 'Empowering Communities & Charitable Causes'}
            )
            setting = PaymentSetting.objects.create(organization=org)
        serializer = AdminPaymentSettingSerializer(setting)
        return Response(serializer.data)

    def put(self, request):
        if not request.user.is_org_admin():
            return Response({'error': 'Permission denied. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

        setting = PaymentSetting.objects.first()
        if not setting:
            org, _ = Organization.objects.get_or_create(
                slug='rahma-main',
                defaults={'name': 'RAHMA Foundation'}
            )
            setting = PaymentSetting.objects.create(organization=org)

        serializer = AdminPaymentSettingSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
