import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export const getOrganization = async () => {
  const res = await axios.get(`${API_BASE}/organizations/default/`);
  return res.data;
};

export const getCampaigns = async () => {
  const res = await axios.get(`${API_BASE}/campaigns/`);
  return res.data;
};

export const createCampaign = async (campaignData) => {
  const res = await axios.post(`${API_BASE}/campaigns/`, campaignData);
  return res.data;
};

export const updateCampaign = async (slug, campaignData) => {
  const res = await axios.patch(`${API_BASE}/campaigns/${slug}/`, campaignData);
  return res.data;
};

export const deleteCampaign = async (slug) => {
  const res = await axios.delete(`${API_BASE}/campaigns/${slug}/`);
  return res.data;
};

export const createDonationOrder = async (donationData) => {
  const res = await axios.post(`${API_BASE}/donations/create-order/`, donationData);
  return res.data;
};

export const verifyDonationPayment = async (verificationData) => {
  const res = await axios.post(`${API_BASE}/donations/verify-payment/`, verificationData);
  return res.data;
};

export const getLiveCollectionStats = async () => {
  const res = await axios.get(`${API_BASE}/donations/live-stats/`);
  return res.data;
};

export const getMyDonations = async () => {
  const res = await axios.get(`${API_BASE}/donations/my-donations/`);
  return res.data;
};

export const getAllDonationsAdmin = async () => {
  const res = await axios.get(`${API_BASE}/donations/all-donations/`);
  return res.data;
};

export const getPublicPaymentSettings = async () => {
  const res = await axios.get(`${API_BASE}/payment-settings/public/`);
  return res.data;
};

export const getAdminPaymentSettings = async () => {
  const res = await axios.get(`${API_BASE}/payment-settings/admin-config/`);
  return res.data;
};

export const updateAdminPaymentSettings = async (settingsData) => {
  const res = await axios.put(`${API_BASE}/payment-settings/admin-config/`, settingsData);
  return res.data;
};

export const exportExcelReport = () => {
  const token = localStorage.getItem('rahma_token');
  window.open(`${API_BASE}/reports/export-excel/?token=${token}`, '_blank');
};

export const exportPDFReport = () => {
  const token = localStorage.getItem('rahma_token');
  window.open(`${API_BASE}/reports/export-pdf/?token=${token}`, '_blank');
};
