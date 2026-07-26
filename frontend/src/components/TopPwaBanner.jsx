import React, { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone, Check } from 'lucide-react';

export const TopPwaBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone PWA mode (App opened from Home Screen)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true || 
      document.referrer.includes('android-app://');

    // 2. Check if user already installed or dismissed banner previously
    const isDismissed = localStorage.getItem('rahma_pwa_installed_or_dismissed') === 'true';

    if (isStandalone || isDismissed) {
      setShowBanner(false);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    if (iosDevice) {
      setShowBanner(true);
    }

    // Handle Android & Desktop (Chrome/Edge/Brave) PWA Prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Detect when app is successfully installed
    window.addEventListener('appinstalled', () => {
      localStorage.setItem('rahma_pwa_installed_or_dismissed', 'true');
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(!showIosInstructions);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('rahma_pwa_installed_or_dismissed', 'true');
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that already installed or don't support prompt
      alert("ഫോണിൽ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യാനായി ബ്രൗസർ ഓപ്ഷനിൽ 'Add to Home Screen' അമർത്തുക.");
      dismissBanner();
    }
  };

  const dismissBanner = () => {
    localStorage.setItem('rahma_pwa_installed_or_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="bg-emerald-dark text-white p-2.5 px-3 border-bottom shadow-lg position-relative z-3" style={{ background: 'linear-gradient(90deg, #022c22 0%, #064e3b 100%)' }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
          
          <div className="d-flex align-items-center gap-2.5">
            <img src="/logo.png" alt="RAHMA Logo" className="bg-white p-1 rounded-2 border" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <div>
              <span className="fw-bold d-block small text-white" style={{ lineHeight: 1.2 }}>
                RAHMA App ഇൻസ്റ്റാൾ ചെയ്യാം
              </span>
              <span className="text-white text-opacity-80" style={{ fontSize: '0.72rem' }}>
                {isIos 
                  ? "iPhone / iPad ഫോണുകളിൽ Home Screen ആക്കാം"
                  : "ഫോണിലും ലാപ്ടോപ്പിലും ആപ്പ് ആയി ഇൻസ്റ്റാൾ ചെയ്യാം"}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="btn btn-sm btn-gold text-white font-bold px-3 py-1.5 rounded-pill shadow-sm d-flex align-items-center gap-1.5"
              style={{ fontSize: '0.82rem' }}
            >
              {isIos ? <Share size={15} /> : <Download size={15} />}
              <span>{isIos ? "Add to Home Screen" : "ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക"}</span>
            </button>

            <button
              onClick={dismissBanner}
              className="btn btn-sm btn-outline-light rounded-circle p-1 d-flex align-items-center justify-content-center"
              style={{ width: '28px', height: '28px', opacity: 0.8 }}
              title="Close & Don't show again"
            >
              <X size={16} />
            </button>
          </div>

        </div>

        {/* iOS Instruction Text Banner */}
        {isIos && showIosInstructions && (
          <div className="mt-2 p-2.5 bg-white text-dark rounded-3 small border border-warning shadow-sm">
            <div className="d-flex align-items-start gap-2">
              <Smartphone size={20} className="text-emerald-main flex-shrink-0 mt-0.5" />
              <div>
                <strong>iPhone / Safari ഉപയോക്താക്കൾക്ക്:</strong>
                <ol className="mb-1 ps-3 mt-1" style={{ fontSize: '0.78rem' }}>
                  <li>താഴെയുള്ള <strong>Share ബട്ടൺ [ <Share size={12} className="inline" /> ]</strong> അമർത്തുക.</li>
                  <li>താഴേക്ക് സ്ക്രോൾ ചെയ്ത് <strong>'Add to Home Screen'</strong> തിരഞ്ഞെടുക്കുക.</li>
                </ol>
                <button onClick={dismissBanner} className="btn btn-xs btn-emerald px-2 py-0.5 rounded text-white font-bold mt-1" style={{ fontSize: '0.72rem' }}>
                  <Check size={12} className="inline me-1" /> മനസിലായി (Got it)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
