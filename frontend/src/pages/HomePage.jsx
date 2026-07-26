import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { CampaignCard } from '../components/CampaignCard';
import { LiveStats } from '../components/LiveStats';
import { Footer } from '../components/Footer';
import { DonateModal } from '../components/DonateModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { getCampaigns, getLiveCollectionStats, getOrganization } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Heart, ShieldCheck, CheckCircle2, MapPin, Mail, Phone, Sparkles, Home, Trophy } from 'lucide-react';

export const HomePage = () => {
  const { t } = useLanguage();
  
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

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar onOpenDonateModal={() => handleOpenDonate(null, 1000)} />

      {/* Hero Banner with SKJM Branding & Quick Amounts */}
      <HeroBanner 
        onQuickDonate={(amt) => handleOpenDonate(null, amt)} 
        liveStats={liveStats} 
      />

      {/* Live Collection Leaderboards (Madrasa Rankings & Top Donors) */}
      <LiveStats stats={liveStats} />

      {/* Active Range Campaigns Section */}
      <section id="campaigns" className="py-5 bg-light border-top">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
            <div>
              <span className="badge badge-emerald mb-2">SKJM CHAPPARAPPADAVU RANGE</span>
              <h2 className="fw-bold text-emerald-main display-6 mb-0">സമാഹരണ പദ്ധതികൾ (Campaigns)</h2>
            </div>
            <p className="text-muted mb-0 mt-2 mt-md-0 max-w-md">
              റേഞ്ചിലെ മദ്രസകളുടെ വികസനത്തിനും വിദ്യാഭ്യാസ ആവശ്യങ്ങൾക്കുമായി ഓൺലൈനായി സംഭാവന ചെയ്യാം.
            </p>
          </div>

          <div className="row g-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="col-md-6 col-lg-6">
                <CampaignCard 
                  campaign={camp} 
                  onDonate={(c) => handleOpenDonate(c, 1000)} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Range Info Section (No Stock Photos) */}
      <section id="about" className="py-5 bg-white border-top">
        <div className="container py-3">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <span className="badge badge-emerald mb-2">ABOUT SKJM RANGE</span>
              <h2 className="fw-bold text-emerald-main display-6 mb-3">
                SKJM ചപ്പറപ്പടവ് റേഞ്ച് ഷെമാ സമിതി
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                ചപ്പറപ്പടവ് റേഞ്ചിന് കീഴിലുള്ള 14 മദ്രസകളുടെ സുഗമമായ പ്രവർത്തനത്തിനും വിദ്യാർത്ഥികളുടെ ഉന്നമനത്തിനുമായി സംഘടിപ്പിക്കുന്ന ഡിജിറ്റൽ ഫണ്ട് സമാഹരണം. സുതാര്യവും വേഗതയേറിയതുമായ പെയ്മെന്റുകളും തത്സമയ ഡിജിറ്റൽ റസീപ്റ്റുകളും ഇതിലൂടെ ലഭ്യമാവുന്നു.
              </p>

              <div className="p-4 bg-emerald-subtle rounded-4 border border-emerald-light border-opacity-30 d-flex align-items-center gap-3">
                <ShieldCheck size={36} className="text-emerald-main flex-shrink-0" />
                <div>
                  <h6 className="fw-bold text-emerald-main mb-1">100% ഡിജിറ്റൽ സുതാര്യത & തത്സമയ റസീപ്റ്റ്</h6>
                  <span className="small text-muted">നിങ്ങൾ നൽകുന്ന ഓരോ സംഭാവനക്കും ഉടനടി QR കോഡോട് കൂടിയ ഔദ്യോഗിക PDF റസീപ്റ്റ് ലഭിക്കുന്നു.</span>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 bg-emerald-main text-white rounded-4 shadow-xl text-center">
                <img src="/logo.png" alt="RAHMA Logo" className="bg-white p-3 rounded-4 shadow mb-3" style={{ height: '110px', objectFit: 'contain' }} />
                <h4 className="fw-bold text-white mb-2">ചപ്പറപ്പടവ് റേഞ്ച്</h4>
                <p className="text-white text-opacity-80 small mb-4">14 മദ്രസകളുടെ കൂട്ടായ്മ & ഡിജിറ്റൽ സമാഹരണം</p>
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

      <Footer />

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
