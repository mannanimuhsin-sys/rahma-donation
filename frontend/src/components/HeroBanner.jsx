import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const HeroBanner = ({ onQuickDonate, liveStats }) => {
  const { t } = useLanguage();

  const todayCollected = liveStats?.today_collected || 0;
  const totalCollected = liveStats?.total_collected || 0;
  const totalDonors = liveStats?.total_donors || 0;

  return (
    <div className="hero-gradient text-white py-5 position-relative">
      <div className="container py-3">
        <div className="row align-items-center gy-4">
          
          <div className="col-lg-7">
            <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 backdrop-blur rounded-pill px-3 py-1.5 mb-3 border border-white border-opacity-20">
              <span className="live-dot"></span>
              <span className="small text-white font-medium">SKJM CHAPPARAPPADAVU RANGE</span>
              <span className="badge bg-warning text-dark font-bold ms-2">
                ₹{todayCollected.toLocaleString('en-IN')} Today
              </span>
            </div>

            <h1 className="display-5 font-extrabold tracking-tight mb-3 text-white">
              SKJM ചപ്പറപ്പടവ് റേഞ്ച് ഷെമാ സമിതി
            </h1>

            <p className="lead text-white text-opacity-90 mb-4 me-lg-4" style={{ lineHeight: 1.6 }}>
              റേഞ്ചിലെ 14 മദ്രസകളുടെ പ്രവർത്തനങ്ങൾക്കായി ഓൺലൈനിൽ സുതാര്യമായി സംഭാവന ചെയ്യാം. തൽക്ഷണം ഫോട്ടോയും ക്യു.ആർ കോഡുമുള്ള ഡിജിറ്റൽ PDF റസീപ്റ്റ് നേടാം.
            </p>

            {/* Feature Pills */}
            <div className="d-flex flex-wrap gap-3 mb-4 small text-white text-opacity-90">
              <div className="d-flex align-items-center gap-1.5">
                <ShieldCheck size={18} className="text-warning" />
                <span>100% ഡിജിറ്റൽ സുതാര്യത</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <Zap size={18} className="text-warning" />
                <span>തത്സമയ PDF റസീപ്റ്റ്</span>
              </div>
              <div className="d-flex align-items-center gap-1.5">
                <Sparkles size={18} className="text-warning" />
                <span>തത്സമയ മദ്രസ റാങ്കിംഗ്</span>
              </div>
            </div>

            {/* Quick Donate Bar */}
            <div className="p-3 bg-white rounded-4 shadow-lg text-dark max-w-lg">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-emerald-main small text-uppercase tracking-wider">
                  സംഭാവന തുക തിരഞ്ഞെടുക്കുക
                </span>
                <span className="text-muted small">Select & Pay</span>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {[100, 250, 500, 1000, 2500, 5000].map((amt) => (
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
                <span>ഇപ്പോൾ സംഭാവന ചെയ്യുക</span>
              </button>
            </div>
          </div>

          <div className="col-lg-5 text-center">
            <div className="position-relative d-inline-block w-100">
              <div className="card rahma-card border-0 text-dark p-4 shadow-2xl rounded-4 text-start position-relative z-1" style={{ background: 'rgba(255,255,255,0.98)' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src="/logo.png" alt="RAHMA Logo" className="img-fluid rounded-2 bg-white p-1 border" style={{ height: '52px', objectFit: 'contain' }} />
                  <div>
                    <h5 className="fw-bold mb-0 text-emerald-main">SKJM ചപ്പറപ്പടവ് റേഞ്ച്</h5>
                    <span className="text-muted small">ഷെമാ സമിതി ഡിജിറ്റൽ ഫണ്ട് സമാഹരണം</span>
                  </div>
                </div>

                <hr className="my-2" />

                <div className="space-y-3 py-2">
                  <div className="d-flex justify-content-between text-sm">
                    <span className="text-muted">ആകെ ദാതാക്കൾ:</span>
                    <span className="fw-bold text-dark">{totalDonors} പേർ</span>
                  </div>
                  <div className="d-flex justify-content-between text-sm">
                    <span className="text-muted">ആകെ സമാഹരിച്ച തുക:</span>
                    <span className="fw-bold text-emerald-main fs-5">
                      ₹{totalCollected.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-subtle rounded-3 text-emerald-main small mt-2 border border-emerald-light border-opacity-20">
                  <i className="bi bi-quote me-1"></i>
                  "സദഖ നൽകുന്നവരുടെ ധനത്തിൽ അല്ലാഹു വർദ്ധനവും ബറകത്തും പ്രധാനം ചെയ്യട്ടെ."
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
