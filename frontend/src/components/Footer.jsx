import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, Mail, Phone, MapPin, Lock } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-emerald-dark text-white pt-5 pb-4 mt-auto position-relative overflow-hidden" style={{ background: '#022c22' }}>
      <div className="container">
        <div className="row gy-4 mb-4">
          
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-emerald-light p-2 rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <Heart size={20} className="fill-warning text-warning" />
              </div>
              <span className="fw-bold fs-4 tracking-tight text-white">RAHMA</span>
            </div>
            <p className="text-white text-opacity-75 small mb-3" style={{ lineHeight: 1.6 }}>
              {t('about_text')}
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small fw-bold">
              <ShieldCheck size={18} />
              <span>Registered NGO Trust No: NGO-2024/786-RAHMA</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase tracking-wider">Quick Links</h6>
            <ul className="list-unstyled space-y-2 small text-white text-opacity-75">
              <li className="mb-2"><a href="#campaigns" className="text-white text-opacity-75 text-decoration-none hover-text-warning">{t('nav_campaigns')}</a></li>
              <li className="mb-2"><a href="#stats" className="text-white text-opacity-75 text-decoration-none hover-text-warning">{t('nav_stats')}</a></li>
              <li className="mb-2"><a href="#about" className="text-white text-opacity-75 text-decoration-none hover-text-warning">{t('nav_about')}</a></li>
              <li className="mb-2"><a href="#gallery" className="text-white text-opacity-75 text-decoration-none hover-text-warning">{t('nav_gallery')}</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase tracking-wider">{t('contact_title')}</h6>
            <ul className="list-unstyled space-y-2 small text-white text-opacity-75">
              <li className="d-flex gap-2 mb-2">
                <MapPin size={18} className="text-warning flex-shrink-0" />
                <span>{t('contact_address')}</span>
              </li>
              <li className="d-flex gap-2 mb-2">
                <Mail size={18} className="text-warning flex-shrink-0" />
                <span>{t('contact_email')}</span>
              </li>
              <li className="d-flex gap-2 mb-2">
                <Phone size={18} className="text-warning flex-shrink-0" />
                <span>{t('contact_phone')}</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase tracking-wider">Security & Trust</h6>
            <div className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-10">
              <div className="d-flex align-items-center gap-2 mb-2 text-warning font-bold small">
                <Lock size={16} />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <p className="small text-white text-opacity-75 mb-0" style={{ fontSize: '0.78rem' }}>
                All donations are processed securely via verified Payment Gateways with instant automated receipt generation.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-white border-opacity-15 my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-white text-opacity-60 small">
          <div>© {new Date().getFullYear()} RAHMA Platform. {t('footer_rights')}</div>
          <div className="mt-2 mt-md-0">
            <span>Powered by Django REST & React PWA Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
