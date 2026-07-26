import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Heart, Globe, User, LogOut, LayoutDashboard, Download, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onOpenDonateModal }) => {
  const { lang, setLang, t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top rahma-navbar py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img 
            src="/logo.png" 
            alt="RAHMA Logo" 
            className="img-fluid rounded-2 bg-white p-1 border" 
            style={{ height: '42px', width: 'auto', objectFit: 'contain' }} 
          />
          <div>
            <span className="fw-bold fs-4 text-emerald-main tracking-tight d-block" style={{ color: '#064e3b', lineHeight: 1.1 }}>
              RAHMA
            </span>
            <span className="small text-muted d-block" style={{ fontSize: '0.68rem' }}>
              SKJM ചപ്പാരപ്പടവ് റെയിഞ്ച് ക്ഷേമ സമിതി
            </span>
          </div>
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} className="text-emerald-main" /> : <Menu size={26} className="text-emerald-main" />}
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 fw-semibold">
            <li className="nav-item">
              <Link className="nav-link text-dark px-3" to="/" onClick={() => setMobileMenuOpen(false)}>
                {t('nav_home')}
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark px-3" href="#campaigns" onClick={() => setMobileMenuOpen(false)}>
                {t('nav_campaigns')}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark px-3" href="#about" onClick={() => setMobileMenuOpen(false)}>
                {t('nav_about')}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-dark px-3" href="#stats" onClick={() => setMobileMenuOpen(false)}>
                {t('nav_stats')}
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* PWA Install Button */}
            {showInstallBtn && (
              <button 
                onClick={handleInstallClick}
                className="btn btn-sm btn-outline-emerald d-flex align-items-center gap-1 shadow-sm"
              >
                <Download size={16} />
                <span>{t('install_pwa')}</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="dropdown">
              <button 
                className="btn btn-sm btn-light border dropdown-toggle d-flex align-items-center gap-1 fw-semibold text-secondary" 
                type="button" 
                data-bs-toggle="dropdown"
              >
                <Globe size={16} className="text-emerald-light" />
                <span>{lang === 'en' ? 'EN' : lang === 'ml' ? 'മലയാളം' : 'العربية'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                <li>
                  <button className={`dropdown-item ${lang === 'en' ? 'active bg-emerald-main' : ''}`} onClick={() => setLang('en')}>
                    English (EN)
                  </button>
                </li>
                <li>
                  <button className={`dropdown-item ${lang === 'ml' ? 'active bg-emerald-main' : ''}`} onClick={() => setLang('ml')}>
                    മലയാളം (ML)
                  </button>
                </li>
                <li>
                  <button className={`dropdown-item ${lang === 'ar' ? 'active bg-emerald-main' : ''}`} onClick={() => setLang('ar')}>
                    العربية (AR - RTL)
                  </button>
                </li>
              </ul>
            </div>

            {/* Auth State & Navigation */}
            {user ? (
              <div className="dropdown">
                <button className="btn btn-sm btn-emerald dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                  <User size={16} />
                  <span>{user.first_name || user.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/admin">
                        <LayoutDashboard size={16} className="text-emerald-light" />
                        <span>{t('nav_admin_dashboard')}</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/donor-dashboard">
                      <User size={16} className="text-emerald-light" />
                      <span>{t('nav_donor_dashboard')}</span>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={logout}>
                      <LogOut size={16} />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-outline-emerald fw-semibold px-3">
                {t('nav_login')}
              </Link>
            )}

            {/* Main Donate Button */}
            <button onClick={() => onOpenDonateModal()} className="btn btn-gold text-white font-semibold">
              {t('donate_now')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
