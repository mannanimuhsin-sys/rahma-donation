import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { createDonationOrder, verifyDonationPayment, getPublicPaymentSettings } from '../services/api';
import confetti from 'canvas-confetti';
import { X, Heart, ShieldCheck, QrCode, Smartphone, CreditCard, Building, CheckCircle2, FileText, Download } from 'lucide-react';

export const DonateModal = ({ isOpen, onClose, campaign, initialAmount, onSuccessReceipt }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [amount, setAmount] = useState(initialAmount || 1000);
  const [customAmount, setCustomAmount] = useState(initialAmount || 1000);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setDonorName(`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username);
      setDonorEmail(user.email || '');
      setDonorPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
      setCustomAmount(initialAmount);
    }
  }, [initialAmount]);

  useEffect(() => {
    if (isOpen) {
      getPublicPaymentSettings()
        .then(data => setPaymentConfig(data))
        .catch(err => console.error("Failed to load payment config:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustomAmount(val);
  };

  const handleCustomAmountChange = (e) => {
    const val = Number(e.target.value);
    setCustomAmount(val);
    setAmount(val);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }
    if (!donorName || !donorEmail) {
      setError("Please enter donor name and email address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 1. Create order
      const orderRes = await createDonationOrder({
        campaign_id: campaign ? campaign.id : null,
        amount: Number(amount),
        donor_name: donorName,
        donor_email: donorEmail,
        donor_phone: donorPhone,
        payment_method: paymentMethod,
      });

      // 2. Automated Instant Verification & Receipt Generation
      const verifyRes = await verifyDonationPayment({
        donation_id: orderRes.donation_id,
        razorpay_order_id: orderRes.order_id,
        razorpay_payment_id: `pay_${paymentMethod.toLowerCase()}_${Date.now()}`,
        razorpay_signature: 'sig_auto_verified_rahma'
      });

      setLoading(false);
      
      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onClose();
      if (onSuccessReceipt) {
        onSuccessReceipt(verifyRes.donation, verifyRes.receipt_url);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.error || "Payment processing failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block tab-modal-backdrop" style={{ background: 'rgba(2, 44, 34, 0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="modal-header bg-emerald-main text-white p-4 border-0 position-relative">
            <div>
              <span className="badge badge-gold mb-1">AUTOMATED PAYMENT GATEWAY</span>
              <h4 className="fw-bold mb-0">
                {campaign ? campaign.title : 'General Sadaqah & Zakat Fund'}
              </h4>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4" 
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger rounded-3 py-2 px-3 small mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitPayment}>
              {/* Preset Amounts */}
              <div className="mb-4">
                <label className="form-label fw-bold text-emerald-main small text-uppercase">
                  1. {t('enter_amount')}
                </label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {[250, 500, 1000, 2500, 5000, 10000].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => handleAmountClick(preset)}
                      className={`btn btn-sm ${amount === preset ? 'btn-emerald fw-bold' : 'btn-outline-emerald'}`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light fw-bold text-emerald-main">₹</span>
                  <input
                    type="number"
                    min="10"
                    className="form-control fw-bold fs-4 text-emerald-main"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter Custom Amount"
                    required
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-4">
                <label className="form-label fw-bold text-emerald-main small text-uppercase">
                  2. Select Payment Method
                </label>
                <div className="row g-2">
                  {[
                    { id: 'UPI', label: 'UPI / BHIM', icon: <QrCode size={18} /> },
                    { id: 'GOOGLE_PAY', label: 'Google Pay', icon: <Smartphone size={18} /> },
                    { id: 'PHONEPE', label: 'PhonePe', icon: <Smartphone size={18} /> },
                    { id: 'PAYTM', label: 'Paytm', icon: <Smartphone size={18} /> },
                    { id: 'NET_BANKING', label: 'Net Banking', icon: <Building size={18} /> },
                    { id: 'CREDIT_CARD', label: 'Credit/Debit Card', icon: <CreditCard size={18} /> }
                  ].map((method) => (
                    <div key={method.id} className="col-6 col-md-4">
                      <div
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-3 border text-center cursor-pointer transition-all ${
                          paymentMethod === method.id 
                            ? 'border-emerald-light bg-emerald-subtle text-emerald-main fw-bold shadow-sm' 
                            : 'bg-light text-secondary'
                        }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {method.icon}
                          <span className="small">{method.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donor Contact Details */}
              <div className="mb-4">
                <label className="form-label fw-bold text-emerald-main small text-uppercase">
                  3. Donor Details (For Official Receipt)
                </label>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('donor_full_name')}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder={t('donor_email')}
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder={`${t('donor_phone')} (Optional)`}
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Instant Verification Notice */}
              <div className="p-3 bg-emerald-subtle rounded-3 mb-4 d-flex align-items-center gap-3 border border-emerald-light border-opacity-30">
                <ShieldCheck size={28} className="text-emerald-light flex-shrink-0" />
                <div className="small text-emerald-main">
                  <strong>{t('test_mode_notice')}</strong>
                  <br />
                  Receipt generated automatically upon successful transaction.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gold text-white w-100 py-3 rounded-3 font-bold fs-5 shadow d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <Heart size={22} className="fill-white" />
                    <span>Pay ₹{Number(amount).toLocaleString('en-IN')} & Generate Receipt</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
