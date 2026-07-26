import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { CampaignCard } from '../components/CampaignCard';
import { LiveStats } from '../components/LiveStats';
import { Footer } from '../components/Footer';
import { DonateModal } from '../components/DonateModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { BottomNavBar } from '../components/BottomNavBar';
import { getCampaigns, getLiveCollectionStats, getOrganization } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, CheckCircle2, MapPin, Mail, Phone, Sparkles, Home, Trophy, Crown, HelpCircle } from 'lucide-react';

export const HomePage = () => {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'rankings' | 'donors' | 'about'
  const [organization, setOrganization] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [liveStats, setLiveStats] = useState(null);
  
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donateAmount, setDonateAmount] = useState(1000);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [completedDonation, setCompletedDonation] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [orgData, campData, statsData] = await Promise.all([
        getOrganization().catch(() => null),
        getCampaigns().catch(() => []),
        getLiveCollectionStats().catch(() => null),
      ]);
      if (orgData) setOrganization(orgData);
      if (campData?.results) setCampaigns(campData.results);
      else if (Array.isArray(campData)) setCampaigns(campData);
      if (statsData) setLiveStats(statsData);
    } catch (err) {
      console.error("Error loading home page data:", err);
    }
  };

  const handleOpenDonate = (campaign = null, amount = 1000) => {
    setSelectedCampaign(campaign);
    setDonateAmount(amount);
    setIsDonateOpen(true);
  };

  const handleSuccessReceipt = (donation, pdfUrl) => {
    setCompletedDonation(donation);
    setReceiptUrl(pdfUrl);
    setIsReceiptOpen(true);
    loadData(); // Refresh live stats and rankings
  };

  const totalCollected = liveStats?.total_collected || 0;

  return (
    <div className="min-vh-100 d-flex flex-column bg-light pb-5 mb-4">
      <Navbar onOpenDonateModal={() => handleOpenDonate(null, 1000)} />

      {/* Top Floating Highlight Banner for Total Collection */}
      <div className="bg-emerald-main text-white py-2 px-3 text-center border-bottom shadow-sm">
        <div className="container d-flex align-items-center justify-content-center gap-2">
          <span className="badge bg-warning text-dark font-bold">LIVE COLLECTION</span>
          <span className="fw-bold">ആകെ സമാഹരിച്ച തുക:</span>
          <strong className="fs-5 text-warning font-extrabold">₹{totalCollected.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Dynamic Tab Screen Switcher */}
      {activeTab === 'home' && (
        <>
          <HeroBanner 
            onQuickDonate={(amt) => handleOpenDonate(null, amt)} 
            liveStats={liveStats} 
          />

          <section id="campaigns" className="py-4 py-md-5 bg-light">
            <div className="container">
              <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
                <div>
                  <span className="badge badge-emerald mb-2">SKJM CHAPPARAPPADAVU RANGE</span>
                  <h2 className="fw-bold text-emerald-main display-6 mb-0">സമാഹരണ പദ്ധതികൾ</h2>
                </div>
                <button 
                  onClick={() => setActiveTab('rankings')} 
                  className="btn btn-outline-emerald btn-sm mt-2 mt-md-0 font-bold d-flex align-items-center gap-1"
                >
                  <Trophy size={16} />
                  <span>മദ്രസ റാങ്കിംഗ് കാണുക</span>
                </button>
              </div>

              <div className="row g-4">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="col-md-6">
                    <CampaignCard 
                      campaign={camp} 
                      onDonate={(c) => handleOpenDonate(c, 1000)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Tab: Madrasa Rankings */}
      {activeTab === 'rankings' && (
        <div className="container py-4">
          <LiveStats stats={liveStats} activeSection="rankings" />
        </div>
      )}

      {/* Tab: Top Donors */}
      {activeTab === 'donors' && (
        <div className="container py-4">
          <LiveStats stats={liveStats} activeSection="donors" />
        </div>
      )}

      {/* Tab: About & Usthad Welfare Info */}
      {activeTab === 'about' && (
        <section id="about" className="py-5 bg-white">
          <div className="container">
            <div className="row align-items-center gy-4">
              <div className="col-lg-7">
                <span className="badge badge-emerald mb-2">ABOUT SHEMA SAMITHI</span>
                <h2 className="fw-bold text-emerald-main display-6 mb-3">
                  SKJM ചപ്പാരപ്പടവ് റെയിഞ്ച് ക്ഷേമ സമിതി
                </h2>
                <p className="text-muted leading-relaxed mb-4" style={{ fontSize: '1.08rem', lineHeight: 1.7 }}>
                  റെയിഞ്ച് പരിധിയിൽ സേവനമനുഷ്ഠിക്കുന്ന ഉസ്താദുമാരുടെ ക്ഷേമത്തിനു വേണ്ടി അവരുടെ ചികിത്സ, വീട് നിർമാണം, വിവാഹം, മറ്റു ആനുകൂല്യങ്ങൾ ലഭിക്കാൻ വേണ്ടിയിട്ടുള്ള ഒരു ഫണ്ട് സമാഹരണമാണ് ഇത്.
                </p>

                <div className="p-4 bg-emerald-subtle rounded-4 border border-emerald-light border-opacity-30 d-flex align-items-center gap-3 mb-3">
                  <ShieldCheck size={36} className="text-emerald-main flex-shrink-0" />
                  <div>
                    <h6 className="fw-bold text-emerald-main mb-1">100% ഡിജിറ്റൽ സുതാര്യത & തത്സമയ റസീപ്റ്റ്</h6>
                    <span className="small text-muted">നിങ്ങൾ നൽകുന്ന ഓരോ സംഭാവനക്കും ഉടനടി QR കോഡോട് കൂടിയ ഔദ്യോഗിക PDF റസീപ്റ്റ് ലഭിക്കുന്നു.</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="p-4 bg-emerald-main text-white rounded-4 shadow-xl text-center">
                  <img src="/logo.png" alt="RAHMA Logo" className="bg-white p-3 rounded-4 shadow mb-3" style={{ height: '100px', objectFit: 'contain' }} />
                  <h4 className="fw-bold text-white mb-2">ചപ്പാരപ്പടവ് റെയിഞ്ച് ക്ഷേമ സമിതി</h4>
                  <p className="text-white text-opacity-80 small mb-4">ഉസ്താദുമാരുടെ ക്ഷേമ പദ്ധതികൾക്കുള്ള ഫണ്ട് സമാഹരണം</p>
                  <button 
                    onClick={() => handleOpenDonate(null, 1000)}
                    className="btn btn-gold text-white font-bold py-3 px-4 rounded-3 w-100 shadow"
                  >
                    <Heart size={20} className="fill-white me-2 inline" />
                    <span>ഇപ്പോൾ സംഭാവന ചെയ്യുക</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Instagram/WhatsApp Style Bottom Navigation Bar */}
      <BottomNavBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDonate={() => handleOpenDonate(null, 1000)}
      />

      {/* Donation Modal */}
      <DonateModal 
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        campaign={selectedCampaign}
        initialAmount={donateAmount}
        onSuccessReceipt={handleSuccessReceipt}
      />

      {/* Receipt Modal */}
      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        donation={completedDonation}
        receiptUrl={receiptUrl}
      />
    </div>
  );
};
