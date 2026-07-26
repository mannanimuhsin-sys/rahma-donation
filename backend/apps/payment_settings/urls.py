from django.urls import path
from .views import PublicPaymentSettingView, AdminPaymentSettingView

urlpatterns = [
    path('public/', PublicPaymentSettingView.as_view(), name='payment-settings-public'),
    path('admin-config/', AdminPaymentSettingView.as_view(), name='payment-settings-admin'),
]
