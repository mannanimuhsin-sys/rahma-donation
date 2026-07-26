from django.urls import path
from .views import (
    CreateOrderView, VerifyPaymentView, PaymentWebhookView, 
    MyDonationsView, AllDonationsView, LiveCollectionStatsView
)

urlpatterns = [
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    path('my-donations/', MyDonationsView.as_view(), name='my-donations'),
    path('all-donations/', AllDonationsView.as_view(), name='all-donations'),
    path('live-stats/', LiveCollectionStatsView.as_view(), name='live-collection-stats'),
]
