import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const HeroBanner = ({ onQuickDonate, liveStats }) => {
  const { t } = useLanguage();

  return (
    <div className="hero-gradient text-white py-5 py-md-6 position-relative">
      <div className="container py-4">
        <div className="row align-items-center gy-4">
          <div className="col-lg-7">
            <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 backdrop-blur rounded-pill px-3 py-1.5 mb-3 border border-white border-opacity-20">
              <span className="live-dot"></span>
              <span className="small text-white font-medium">{t('live_collection')}</span>
              <span className="badge bg-warning text-dark font-bold ms-2">
                ₹{liveStats?.today_collected ? liveStats.today_collected.toLocaleString('en-IN') : '25,000'} Today
              </span>
            </div>

            <h1 className="display-4 font-extrabold tracking-tight mb-3 text-white">
              {t('hero_title')}
            </h1>

            <p className="lead text-white text-opacity-90 mb-4 me-lg-4" style={{ lineHeight: 1.6 }}>
              {t('hero_subtitle')}
            </p>

            {/* Feature Pills */}
            <div className="d-flex flex-wrap gap-3 mb-4 small text-white text-opacity-90">
              <div className="d-flex align-items-center gap-1.5">
                <ShieldCheck size={18} className="text-warning" />
                <span>100% Automated Verification</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <Zap size={18} className="text-warning" />
                <span>Instant PDF Receipt</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <Sparkles size={18} className="text-warning" />
                <span>Tax Benefit Eligible</span>
              </div>
            </div>

            {/* Quick Donate Bar */}
            <div className="p-3 bg-white rounded-4 shadow-lg text-dark max-w-lg">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-emerald-main small text-uppercase tracking-wider">
                  {t('quick_donate')}
                </span>
                <span className="text-muted small">Select Amount & Pay</span>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {[100, 500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => onQuickDonate(amt)}
                    className="btn btn-sm btn-outline-emerald font-bold flex-fill py-2"
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onQuickDonate(1000)}
                className="btn btn-gold text-white w-100 font-bold py-2.5 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow"
              >
                <Heart size={20} className="fill-white" />
                <span>{t('donate_now')}</span>
              </button>
            </div>
          </div>

          <div className="col-lg-5 text-center">
            <div className="position-relative d-inline-block w-100">
              <div className="card rahma-card border-0 text-dark p-4 shadow-2xl rounded-4 text-start position-relative z-1" style={{ background: 'rgba(255,255,255,0.96)' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-emerald-subtle p-3 rounded-circle text-emerald-main">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-emerald-main">Al-Rahma Central Mosque</h5>
                    <span className="text-muted small">Registered Trust No. NGO-2024/786</span>
                  </div>
                </div>

                <hr className="my-2" />

                <div className="space-y-3 py-2">
                  <div className="d-flex justify-content-between text-sm">
                    <span className="text-muted">Total Donors Joined:</span>
                    <span className="fw-bold text-dark">{liveStats?.total_donors || 437}+ Donors</span>
                  </div>
                  <div className="d-flex justify-content-between text-sm">
                    <span className="text-muted">Total Sadaqah Raised:</span>
                    <span className="fw-bold text-emerald-main fs-5">
                      ₹{liveStats?.total_collected ? liveStats.total_collected.toLocaleString('en-IN') : '30,05,000'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-subtle rounded-3 text-emerald-main small mt-2 border border-emerald-light border-opacity-20">
                  <i className="bi bi-quote me-1"></i>
                  "The example of those who spend their wealth in the way of Allah is like a seed of grain which grows seven spikes..." (Al-Baqarah 2:261)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
