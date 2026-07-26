import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Download, Printer, CheckCircle2, X, ShieldCheck, QrCode } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, donation, receiptUrl }) => {
  const { t } = useLanguage();

  if (!isOpen || !donation) return null;

  const handleDownload = () => {
    if (receiptUrl) {
      const fullUrl = receiptUrl.startsWith('http') ? receiptUrl : `http://localhost:8000${receiptUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(2, 44, 34, 0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="modal-header bg-emerald-main text-white p-4 border-0 position-relative">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white text-emerald-main p-2 rounded-circle">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <span className="badge badge-gold mb-1">PAYMENT SUCCESSFUL</span>
                <h4 className="fw-bold mb-0">{t('receipt_title')}</h4>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4" 
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4 bg-light">
            {/* Printable Receipt Card */}
            <div className="bg-white p-4 rounded-4 shadow-sm border printable-receipt">
              
              <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                <div>
                  <h4 className="fw-bold text-emerald-main mb-1">Al-Rahma Central Mosque & Trust</h4>
                  <span className="text-muted small">Registered NGO Charity • Reg: NGO-2024/786-RAHMA</span>
                </div>
                <div className="text-end">
                  <span className="badge badge-gold fs-6">{donation.receipt_number}</span>
                  <div className="text-muted small mt-1">
                    Date: {new Date(donation.created_at || Date.now()).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-3 bg-gold-subtle rounded-3 border border-warning text-center mb-4">
                <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Donation Received</span>
                <h2 className="fw-bold text-gold-accent mb-0">₹{Number(donation.amount).toLocaleString('en-IN')}</h2>
              </div>

              {/* Details Grid */}
              <div className="row g-3 small mb-4">
                <div className="col-6">
                  <span className="text-muted d-block">Donor Name:</span>
                  <strong className="fs-6 text-dark">{donation.donor_name}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Donor Email:</span>
                  <strong className="text-dark">{donation.donor_email}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Campaign Cause:</span>
                  <strong className="text-dark">{donation.campaign_title || 'General Sadaqah'}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Payment Method:</span>
                  <strong className="text-dark">{donation.payment_method}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Transaction Ref:</span>
                  <strong className="text-emerald-light">{donation.razorpay_payment_id || donation.donation_number}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Verification Status:</span>
                  <span className="badge bg-success">VERIFIED & SAVED</span>
                </div>
              </div>

              {/* Verification & QR Note */}
              <div className="d-flex align-items-center justify-content-between p-3 bg-emerald-subtle rounded-3 border border-emerald-light border-opacity-30">
                <div className="small text-emerald-main me-3">
                  <ShieldCheck size={18} className="me-1 inline" />
                  This is an automated computer-generated PDF receipt with digital QR verification code.
                </div>
                <QrCode size={40} className="text-emerald-main flex-shrink-0" />
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-3 mt-4">
              <button onClick={handleDownload} className="btn btn-emerald flex-fill py-2.5 font-bold d-flex align-items-center justify-content-center gap-2">
                <Download size={18} />
                <span>{t('download_receipt')}</span>
              </button>

              <button onClick={handlePrint} className="btn btn-outline-emerald flex-fill py-2.5 font-bold d-flex align-items-center justify-content-center gap-2">
                <Printer size={18} />
                <span>{t('print_receipt')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
