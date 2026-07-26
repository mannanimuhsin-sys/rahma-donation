import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Heart } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      navigate('/donor-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Username or email may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-emerald-dark p-3" style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' }}>
      <div className="card rahma-card border-0 shadow-2xl p-4 p-md-5 max-w-md w-100 rounded-4 text-center">
        
        <Link to="/" className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none justify-content-center">
          <div className="bg-emerald-main p-2 rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
            <Heart className="fill-warning text-warning" size={22} />
          </div>
          <span className="fw-bold fs-3 text-emerald-main">RAHMA</span>
        </Link>

        <h4 className="fw-bold text-emerald-main mb-1">{t('register_title')}</h4>
        <p className="text-muted small mb-4">Register to track your Sadaqah contributions & receipts.</p>

        {error && <div className="alert alert-danger rounded-3 py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="text-start">
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label small fw-bold text-muted">First Name</label>
              <input type="text" className="form-control" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
            </div>
            <div className="col-6">
              <label className="form-label small fw-bold text-muted">Last Name</label>
              <input type="text" className="form-control" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Username</label>
            <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Email Address</label>
            <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Phone Number</label>
            <input type="tel" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Password</label>
            <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required minLength="6" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-gold text-white w-100 py-3 rounded-3 font-bold shadow mb-3">
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Create Account'}
          </button>
        </form>

        <div className="small text-muted">
          Already have an account? <Link to="/login" className="text-emerald-main font-bold">Login Here</Link>
        </div>
      </div>
    </div>
  );
};
