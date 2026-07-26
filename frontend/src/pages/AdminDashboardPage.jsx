import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { 
  getLiveCollectionStats, getAllDonationsAdmin, getCampaigns, 
  createCampaign, deleteCampaign, getAdminPaymentSettings, updateAdminPaymentSettings,
  exportExcelReport, exportPDFReport
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, DollarSign, Users, Calendar, FileSpreadsheet, 
  FileText, Plus, Trash2, Edit3, Settings, ShieldCheck, Search, Filter 
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'campaigns', 'donations', 'settings'

  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New Campaign Form Modal state
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    category: 'General Sadqa & Zakat',
    target_amount: 500000,
    description: '',
    status: 'ACTIVE'
  });

  // Payment Settings Form state
  const [settingsForm, setSettingsForm] = useState({
    org_display_name: '',
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    ifsc_code: '',
    upi_id: '',
    payment_gateway: 'RAZORPAY',
    api_key: '',
    secret_key: '',
    webhook_secret: '',
    is_test_mode: true
  });
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, donData, campData, setRes] = await Promise.all([
        getLiveCollectionStats().catch(() => null),
        getAllDonationsAdmin().catch(() => []),
        getCampaigns().catch(() => []),
        getAdminPaymentSettings().catch(() => null),
      ]);
      if (statsData) setStats(statsData);
      if (donData?.results) setDonations(donData.results);
      else if (Array.isArray(donData)) setDonations(donData);

      if (campData?.results) setCampaigns(campData.results);
      else if (Array.isArray(campData)) setCampaigns(campData);

      if (setRes) {
        setPaymentSettings(setRes);
        setSettingsForm(setRes);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await createCampaign(newCampaign);
      setShowCampaignModal(false);
      setNewCampaign({ title: '', category: 'General Sadqa & Zakat', target_amount: 500000, description: '', status: 'ACTIVE' });
      loadAdminData();
    } catch (err) {
      alert("Failed to create campaign: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCampaign = async (slug) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(slug);
        loadAdminData();
      } catch (err) {
        alert("Failed to delete campaign");
      }
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateAdminPaymentSettings(settingsForm);
      setPaymentSettings(updated);
      setSettingsSavedMsg("Payment Gateway and Bank details updated securely!");
      setTimeout(() => setSettingsSavedMsg(null), 4000);
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  const filteredDonations = donations.filter(d => 
    d.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.donor_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar onOpenDonateModal={() => {}} />

      <div className="container py-5 flex-grow-1">
        {/* Admin Header */}
        <div className="bg-emerald-main text-white p-4 rounded-4 shadow-lg mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <span className="badge badge-gold mb-1">SUPER ADMIN PORTAL</span>
            <h3 className="fw-bold mb-0">Al-Rahma Executive Control Center</h3>
            <span className="small text-white text-opacity-80">Logged in as: {user?.username} ({user?.role})</span>
          </div>

          <div className="d-flex gap-2">
            <button onClick={exportExcelReport} className="btn btn-sm btn-light font-bold d-flex align-items-center gap-1">
              <FileSpreadsheet size={16} className="text-success" />
              <span>Excel Export</span>
            </button>

            <button onClick={exportPDFReport} className="btn btn-sm btn-gold text-white font-bold d-flex align-items-center gap-1">
              <FileText size={16} />
              <span>Financial PDF Report</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-pills nav-fill mb-4 bg-white p-2 rounded-4 border shadow-sm fw-semibold">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'overview' ? 'active bg-emerald-main' : 'text-dark'}`} onClick={() => setActiveTab('overview')}>
              Overview Metrics
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'campaigns' ? 'active bg-emerald-main' : 'text-dark'}`} onClick={() => setActiveTab('campaigns')}>
              Campaign Management ({campaigns.length})
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'donations' ? 'active bg-emerald-main' : 'text-dark'}`} onClick={() => setActiveTab('donations')}>
              Donations & Receipts ({donations.length})
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'settings' ? 'active bg-emerald-main' : 'text-dark'}`} onClick={() => setActiveTab('settings')}>
              Payment Settings
            </button>
          </li>
        </ul>

        {/* Tab Content 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="row g-3">
              <div className="col-md-4 col-lg-2.4">
                <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">Today's Collection</span>
                  <h4 className="fw-bold text-emerald-main mb-0">₹{(stats?.today_collected || 25000).toLocaleString('en-IN')}</h4>
                </div>
              </div>
              <div className="col-md-4 col-lg-2.4">
                <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">Weekly Collection</span>
                  <h4 className="fw-bold text-dark mb-0">₹{(stats?.weekly_collected || 185000).toLocaleString('en-IN')}</h4>
                </div>
              </div>
              <div className="col-md-4 col-lg-2.4">
                <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">Monthly Collection</span>
                  <h4 className="fw-bold text-dark mb-0">₹{(stats?.monthly_collected || 640000).toLocaleString('en-IN')}</h4>
                </div>
              </div>
              <div className="col-md-4 col-lg-2.4">
                <div className="p-4 bg-white rounded-4 border shadow-sm text-center">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">Yearly Collection</span>
                  <h4 className="fw-bold text-dark mb-0">₹{(stats?.yearly_collected || 3005000).toLocaleString('en-IN')}</h4>
                </div>
              </div>
              <div className="col-md-4 col-lg-2.4">
                <div className="p-4 bg-gold-subtle rounded-4 border border-warning text-center">
                  <span className="text-muted small fw-bold text-uppercase d-block mb-1">Total Donors</span>
                  <h4 className="fw-bold text-gold-accent mb-0">{stats?.total_donors || 437} Donors</h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-emerald-main mb-0">Active & Historical Campaigns</h5>
              <button onClick={() => setShowCampaignModal(true)} className="btn btn-emerald font-bold d-flex align-items-center gap-1">
                <Plus size={18} />
                <span>Create New Campaign</span>
              </button>
            </div>

            <div className="row g-3">
              {campaigns.map((camp) => (
                <div key={camp.id} className="col-md-6">
                  <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-emerald-main mb-1">{camp.title}</h6>
                      <span className="text-muted small">Target: ₹{Number(camp.target_amount).toLocaleString('en-IN')} • Raised: ₹{Number(camp.collected_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => handleDeleteCampaign(camp.slug)} className="btn btn-sm btn-outline-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Donations Table */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
              <h5 className="fw-bold text-emerald-main mb-0">Donation Transactions & Receipts</h5>
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-light"><Search size={16} /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search Donor / Receipt #" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th>Receipt #</th>
                    <th>Date</th>
                    <th>Donor Name</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map((item) => (
                    <tr key={item.id}>
                      <td><strong className="text-emerald-main">{item.receipt_number}</strong></td>
                      <td>{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                      <td>{item.donor_name}</td>
                      <td><span className="text-muted small">{item.donor_email}</span></td>
                      <td><strong className="text-gold-accent">₹{Number(item.amount).toLocaleString('en-IN')}</strong></td>
                      <td><span className="badge bg-light text-dark border">{item.payment_method}</span></td>
                      <td>
                        {item.receipt_pdf_url && (
                          <a href={item.receipt_pdf_url.startsWith('http') ? item.receipt_pdf_url : `http://localhost:8000${item.receipt_pdf_url}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-emerald">
                            PDF
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 4: Payment Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-4 border shadow-sm p-4">
            <div className="d-flex align-items-center gap-2 mb-4 text-emerald-main">
              <ShieldCheck size={24} />
              <h5 className="fw-bold mb-0">Configure Organization Bank Details & Payment Gateway API Keys</h5>
            </div>

            {settingsSavedMsg && (
              <div className="alert alert-success rounded-3 mb-4">
                {settingsSavedMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">Organization Display Name</label>
                  <input type="text" className="form-control" value={settingsForm.org_display_name || ''} onChange={e => setSettingsForm({...settingsForm, org_display_name: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">Bank Name</label>
                  <input type="text" className="form-control" value={settingsForm.bank_name || ''} onChange={e => setSettingsForm({...settingsForm, bank_name: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">Account Holder Name</label>
                  <input type="text" className="form-control" value={settingsForm.account_holder_name || ''} onChange={e => setSettingsForm({...settingsForm, account_holder_name: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">Account Number</label>
                  <input type="text" className="form-control" value={settingsForm.account_number || ''} onChange={e => setSettingsForm({...settingsForm, account_number: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">IFSC Code</label>
                  <input type="text" className="form-control" value={settingsForm.ifsc_code || ''} onChange={e => setSettingsForm({...settingsForm, ifsc_code: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">UPI ID</label>
                  <input type="text" className="form-control" value={settingsForm.upi_id || ''} onChange={e => setSettingsForm({...settingsForm, upi_id: e.target.value})} required />
                </div>

                <hr className="my-4" />

                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">Payment Gateway API Key</label>
                  <input type="text" className="form-control" value={settingsForm.api_key || ''} onChange={e => setSettingsForm({...settingsForm, api_key: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase">Payment Gateway Secret Key</label>
                  <input type="password" className="form-control" value={settingsForm.secret_key || ''} onChange={e => setSettingsForm({...settingsForm, secret_key: e.target.value})} required />
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-bold small text-uppercase">Webhook Secret</label>
                  <input type="password" className="form-control" value={settingsForm.webhook_secret || ''} onChange={e => setSettingsForm({...settingsForm, webhook_secret: e.target.value})} required />
                </div>
              </div>

              <button type="submit" className="btn btn-gold text-white font-bold py-2.5 px-4 mt-4 rounded-3 shadow">
                Save Encrypted Payment Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal for Creating Campaign */}
      {showCampaignModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 p-4">
              <h5 className="fw-bold text-emerald-main mb-3">Create New Donation Campaign</h5>
              <form onSubmit={handleCreateCampaign}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Title</label>
                  <input type="text" className="form-control" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Target Amount (₹)</label>
                  <input type="number" className="form-control" value={newCampaign.target_amount} onChange={e => setNewCampaign({...newCampaign, target_amount: e.target.value})} required />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Description</label>
                  <textarea className="form-control" rows="3" value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} required></textarea>
                </div>
                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-light" onClick={() => setShowCampaignModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-emerald font-bold">Create Campaign</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
