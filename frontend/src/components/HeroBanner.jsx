import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, Zap, Sparkles, CheckCircle2, Stethoscope, Home as HomeIcon, Gift, Award } from 'lucide-react';

export const HeroBanner = ({ onQuickDonate, liveStats }) => {
  const { t } = useLanguage();

  const todayCollected = liveStats?.today_collected || 0;
  const totalCollected = liveStats?.total_collected || 0;
  const totalDonors = liveStats?.total_donors || 0;

  return (
    <div className="hero-gradient text-white py-4 py-md-5 position-relative">
      <div className="container py-2 py-md-3">
        <div className="row align-items-center gy-4">
          
          {/* Main Hero Header */}
          <div className="col-lg-7">
            <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-10 backdrop-blur rounded-pill px-3 py-1.5 mb-3 border border-white border-opacity-20 shadow-sm">
              <span className="live-dot"></span>
              <span className="small text-white font-semibold">SKJM CHAPPARAPPADAVU RANGE</span>
              <span className="badge bg-warning text-dark font-bold ms-1" style={{ fontSize: '0.75rem' }}>
                ₹{todayCollected.toLocaleString('en-IN')} Today
              </span>
            </div>

            <h1 className="display-5 font-extrabold tracking-tight mb-3 text-white leading-tight">
              SKJM ചപ്പാരപ്പടവ് റെയിഞ്ച് ക്ഷേമ സമിതി
            </h1>

            <p className="lead text-white text-opacity-95 mb-4 me-lg-3" style={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
              റെയിഞ്ച് പരിധിയിൽ സേവനമനുഷ്ഠിക്കുന്ന ഉസ്താദുമാരുടെ ക്ഷേമത്തിനു വേണ്ടി അവരുടെ ചികിത്സ, വീട് നിർമാണം, വിവാഹം, മറ്റു ആനുകൂല്യങ്ങൾ ലഭിക്കാൻ വേണ്ടിയിട്ടുള്ള ഒരു ഫണ്ട് സമാഹരണമാണ് ഇത്.
            </p>

            {/* Feature Pills for Usthad Welfare */}
            <div className="d-flex flex-wrap gap-2 gap-md-3 mb-4 small text-white text-opacity-95">
              <div className="d-flex align-items-center gap-1.5 bg-white bg-opacity-10 px-3 py-1.5 rounded-pill border border-white border-opacity-15">
                <Stethoscope size={16} className="text-warning" />
                <span>ചികിത്സാ സഹായം</span>
              </div>
              <div className="d-flex align-items-center gap-1.5 bg-white bg-opacity-10 px-3 py-1.5 rounded-pill border border-white border-opacity-15">
                <HomeIcon size={16} className="text-warning" />
                <span>വീട് നിർമാണം</span>
              </div>
              <div className="d-flex align-items-center gap-1.5 bg-white bg-opacity-10 px-3 py-1.5 rounded-pill border border-white border-opacity-15">
                <Gift size={16} className="text-warning" />
                <span>വിവാഹ ധനസഹായം</span>
              </div>
              <div className="d-flex align-items-center gap-1.5 bg-white bg-opacity-10 px-3 py-1.5 rounded-pill border border-white border-opacity-15">
                <Award size={16} className="text-warning" />
                <span>ക്ഷേമ പദ്ധതികൾ</span>
              </div>
            </div>

            {/* Mobile-Friendly Quick Donate Bar */}
            <div className="p-3.5 bg-white rounded-4 shadow-2xl text-dark max-w-lg">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-emerald-main small text-uppercase tracking-wider">
                  സംഭാവന തുക തിരഞ്ഞെടുക്കുക
                </span>
                <span className="text-muted small">Select & Pay</span>
              </div>
              <div className="row g-2 mb-3">
                {[100, 250, 500, 1000, 2500, 5000].map((amt) => (
                  <div key={amt} className="col-4 col-sm-2 col-md-4 col-lg-2">
                    <button
                      onClick={() => onQuickDonate(amt)}
                      className="btn btn-sm btn-outline-emerald font-bold w-100 py-2"
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onQuickDonate(1000)}
                className="btn btn-gold text-white w-100 font-bold py-3 rounded-3 d-flex align-items-center justify-content-center gap-2 shadow-lg fs-6"
              >
                <Heart size={20} className="fill-white" />
                <span>ഇപ്പോൾ സംഭാവന ചെയ്യുക</span>
              </button>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="col-lg-5 text-center">
            <div className="position-relative d-inline-block w-100">
              <div className="card rahma-card border-0 text-dark p-4 shadow-2xl rounded-4 text-start position-relative z-1" style={{ background: 'rgba(255,255,255,0.98)' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src="/logo.png" alt="RAHMA Logo" className="img-fluid rounded-3 bg-white p-1 border shadow-sm" style={{ height: '56px', width: 'auto', objectFit: 'contain' }} />
                  <div>
                    <h5 className="fw-bold mb-0 text-emerald-main" style={{ color: '#064e3b' }}>
                      SKJM ചപ്പാരപ്പടവ് റെയിഞ്ച്
                    </h5>
                    <span className="text-muted small fw-semibold">ക്ഷേമ സമിതി ഫണ്ട് സമാഹരണം</span>
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
                    <span className="fw-bold text-emerald-main fs-4">
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
