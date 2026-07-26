import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Lock, User, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.user.role === 'SUPER_ADMIN' || res.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/donor-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please verify credentials.");
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

        <h4 className="fw-bold text-emerald-main mb-1">{t('login_title')}</h4>
        <p className="text-muted small mb-4">Enter your credentials to manage donations & receipts.</p>

        {error && <div className="alert alert-danger rounded-3 py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Username or Email</label>
            <input 
              type="text" 
              className="form-control py-2.5" 
              placeholder="admin or email@example.com" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Password</label>
            <input 
              type="password" 
              className="form-control py-2.5" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-gold text-white w-100 py-3 rounded-3 font-bold shadow mb-3">
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Sign In Securely'}
          </button>
        </form>

        <div className="p-3 bg-emerald-subtle rounded-3 small text-emerald-main mb-3 text-start">
          <strong>Demo Credentials:</strong>
          <br />
          Super Admin: <code>admin</code> / <code>admin123</code>
          <br />
          Demo Donor: <code>donor1</code> / <code>donor123</code>
        </div>

        <div className="small text-muted">
          Don't have an account? <Link to="/register" className="text-emerald-main font-bold">Register as Donor</Link>
        </div>
      </div>
    </div>
  );
};
