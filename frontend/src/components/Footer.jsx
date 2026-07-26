import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, Mail, Phone, MapPin, Lock, MessageCircle } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  const phoneNumber = '917559950633';
  const prefilledText = encodeURIComponent('അസ്സലാമു അലൈക്കും, RAHMA PWA ആപ്പുമായി ബന്ധപ്പെട്ട സംശയങ്ങൾക്ക് എനിക്ക് സഹായം വേണം.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${prefilledText}`;
  const callUrl = `tel:+${phoneNumber}`;

  return (
    <footer className="bg-emerald-dark text-white pt-5 pb-4 mt-auto position-relative overflow-hidden" style={{ background: '#022c22' }}>
      <div className="container">
        <div className="row gy-4 mb-4">
          
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/logo.png" alt="RAHMA Logo" className="bg-white p-1 rounded" style={{ height: '40px' }} />
              <span className="fw-bold fs-4 tracking-tight text-white">RAHMA</span>
            </div>
            <p className="text-white text-opacity-75 small mb-3" style={{ lineHeight: 1.6 }}>
              {t('about_text')}
            </p>
            <div className="d-flex align-items-center gap-2 text-warning small fw-bold">
              <ShieldCheck size={18} />
              <span>SKJM Chapparappadavu Range Shema Samithi</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase tracking-wider">Quick Links</h6>
            <ul className="list-unstyled space-y-2 small text-white text-opacity-75">
              <li className="mb-2"><a href="#campaigns" className="text-white text-opacity-75 text-decoration-none hover-text-warning">{t('nav_campaigns')}</a></li>
              <li className="mb-2"><a href="#stats" className="text-white text-opacity-75 text-decoration-none hover-text-warning">{t('nav_stats')}</a></li>
              <li className="mb-2"><a href="#about" className="text-white text-opacity-75 text-decoration-none hover-text-warning">{t('nav_about')}</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white mb-3 text-uppercase tracking-wider">Helpline & Support</h6>
            <ul className="list-unstyled space-y-2 small text-white text-opacity-75">
              <li className="d-flex align-items-center gap-2 mb-2">
                <Phone size={18} className="text-warning flex-shrink-0" />
                <a href={callUrl} className="text-white text-decoration-none fw-bold">
                  Direct Call: +91 75599 50633
                </a>
              </li>
              <li className="d-flex align-items-center gap-2 mb-2">
                <MessageCircle size={18} className="text-success flex-shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-success text-decoration-none fw-bold">
                  WhatsApp Support (+91 75599 50633)
                </a>
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
          <div>© {new Date().getFullYear()} RAHMA PWA. SKJM Chapparappadavu Range.</div>
          <div className="mt-2 mt-md-0">
            <span>Helpline: +91 75599 50633</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
