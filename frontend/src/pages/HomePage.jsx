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
import { Heart, ShieldCheck, CheckCircle2, MapPin, Mail, Phone, Sparkles } from 'lucide-react';

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
    loadData(); // Refresh live stats and campaign collected amounts
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar onOpenDonateModal={() => handleOpenDonate(null, 1000)} />

      <HeroBanner 
        onQuickDonate={(amt) => handleOpenDonate(null, amt)} 
        liveStats={liveStats} 
      />

      <LiveStats stats={liveStats} />

      {/* Campaigns Section */}
      <section id="campaigns" className="py-5 bg-light">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5">
            <div>
              <span className="badge badge-emerald mb-2">{t('active_campaigns')}</span>
              <h2 className="fw-bold text-emerald-main display-6 mb-0">Choose a Cause & Donate</h2>
            </div>
            <p className="text-muted mb-0 mt-2 mt-md-0 max-w-md">
              100% of your Sadaqah and Zakat contributions directly support these verified causes.
            </p>
          </div>

          <div className="row g-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="col-md-6 col-lg-3">
                <CampaignCard 
                  campaign={camp} 
                  onDonate={(c) => handleOpenDonate(c, 1000)} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-white border-top">
        <div className="container py-3">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6">
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80" 
                  alt="Mosque Exterior" 
                  className="img-fluid rounded-4 shadow-xl w-100" 
                  style={{ maxHeight: '420px', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 m-4 p-3 bg-emerald-main text-white rounded-3 shadow-lg max-w-xs">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <ShieldCheck className="text-warning" size={20} />
                    <strong className="small">Trusted Charity Platform</strong>
                  </div>
                  <span className="small text-white text-opacity-80">Serving 1,500+ daily worshippers & students</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="badge badge-emerald mb-2">{t('about_title')}</span>
              <h2 className="fw-bold text-emerald-main display-6 mb-3">
                Transparent & Efficient Islamic Online Donations
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                {t('about_text')}
              </p>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="p-3 bg-emerald-subtle rounded-3 border border-emerald-light border-opacity-30">
                    <h3 className="fw-bold text-emerald-main mb-1">1,500+</h3>
                    <span className="small text-muted">Friday Worshippers</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-emerald-subtle rounded-3 border border-emerald-light border-opacity-30">
                    <h3 className="fw-bold text-emerald-main mb-1">100+</h3>
                    <span className="small text-muted">Hifz Quran Scholars</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleOpenDonate(null, 1000)}
                className="btn btn-gold text-white font-bold py-3 px-4 rounded-3 d-flex align-items-center gap-2 shadow"
              >
                <Heart size={20} className="fill-white" />
                <span>Make a Generous Donation Today</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge badge-emerald mb-2">MOSQUE & COMMUNITY</span>
            <h2 className="fw-bold text-emerald-main display-6">{t('gallery_title')}</h2>
          </div>

          <div className="row g-3">
            {[
              { title: 'Grand Mosque Prayer Hall', img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80' },
              { title: 'Madrasa Quran Recitation', img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80' },
              { title: 'Ramadan Community Iftar', img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80' },
            ].map((item, idx) => (
              <div key={idx} className="col-md-4">
                <div className="rahma-card overflow-hidden h-100 position-relative" style={{ height: '240px' }}>
                  <img src={item.img} alt={item.title} className="w-100 h-100 object-fit-cover" />
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-60 backdrop-blur text-white">
                    <span className="fw-bold small">{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
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
