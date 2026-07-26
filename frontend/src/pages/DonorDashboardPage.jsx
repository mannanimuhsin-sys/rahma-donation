import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getMyDonations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Heart, FileText, Download, User, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DonorDashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyDonations();
  }, []);

  const loadMyDonations = async () => {
    try {
      const data = await getMyDonations();
      if (data?.results) setDonations(data.results);
      else if (Array.isArray(data)) setDonations(data);
    } catch (err) {
      console.error("Failed to load donor history:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar onOpenDonateModal={() => {}} />

      <div className="container py-5 flex-grow-1">
        {/* Header Profile Summary */}
        <div className="bg-emerald-main text-white p-4 p-md-5 rounded-4 shadow-lg mb-4 position-relative overflow-hidden">
          <div className="d-flex align-items-center gap-4">
            <div className="bg-white text-emerald-main p-3 rounded-circle d-flex align-items-center justify-content-center shadow-md" style={{ width: '70px', height: '70px' }}>
              <User size={36} />
            </div>
            <div>
              <span className="badge badge-gold mb-1">DONOR PORTAL</span>
              <h2 className="fw-bold mb-1">{user?.first_name || user?.username}'s Dashboard</h2>
              <span className="text-white text-opacity-80 small">{user?.email} • {user?.phone || 'Verified Donor'}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Contributions</span>
              <h3 className="fw-bold text-gold-accent mb-0">₹{totalDonated.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Verified Receipts</span>
              <h3 className="fw-bold text-emerald-main mb-0">{donations.length} Receipts</h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Security Rating</span>
              <div className="d-flex align-items-center justify-content-center gap-1 text-emerald-light fw-bold fs-5">
                <ShieldCheck size={22} />
                <span>100% Tax Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Donation History Table */}
        <div className="bg-white rounded-4 border shadow-sm p-4">
          <h4 className="fw-bold text-emerald-main mb-3 d-flex align-items-center gap-2">
            <FileText size={22} />
            <span>My Donation History & PDF Receipts</span>
          </h4>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-emerald-main"></div>
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Heart size={48} className="text-emerald-light opacity-50 mb-2" />
              <p>No donation history found yet. Make your first Sadaqah contribution today!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase fw-bold text-muted">
                  <tr>
                    <th>Receipt #</th>
                    <th>Date</th>
                    <th>Campaign</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th className="text-end">Download PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((item) => (
                    <tr key={item.id}>
                      <td><span className="fw-bold text-emerald-main">{item.receipt_number}</span></td>
                      <td>{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                      <td>{item.campaign_title || 'General Sadaqah'}</td>
                      <td><strong className="text-gold-accent">₹{Number(item.amount).toLocaleString('en-IN')}</strong></td>
                      <td><span className="badge bg-light text-dark border">{item.payment_method}</span></td>
                      <td><span className="badge bg-success">SUCCESS</span></td>
                      <td className="text-end">
                        {item.receipt_pdf_url ? (
                          <a 
                            href={item.receipt_pdf_url.startsWith('http') ? item.receipt_pdf_url : `http://localhost:8000${item.receipt_pdf_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-emerald d-inline-flex align-items-center gap-1 font-bold"
                          >
                            <Download size={14} />
                            <span>PDF</span>
                          </a>
                        ) : (
                          <span className="text-muted small">Generating...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
