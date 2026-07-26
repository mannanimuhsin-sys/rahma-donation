from django.urls import path
from .views import ExportExcelReportView, ExportPDFReportView

urlpatterns = [
    path('export-excel/', ExportExcelReportView.as_view(), name='export-excel'),
    path('export-pdf/', ExportPDFReportView.as_view(), name='export-pdf'),
]
