import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, Users, Calendar, Award, Heart, CheckCircle2 } from 'lucide-react';

export const LiveStats = ({ stats }) => {
  const { t } = useLanguage();

  const totalCollected = stats?.total_collected || 3005000;
  const todayCollected = stats?.today_collected || 25000;
  const weeklyCollected = stats?.weekly_collected || 185000;
  const monthlyCollected = stats?.monthly_collected || 640000;
  const totalDonors = stats?.total_donors || 437;
  const recentDonations = stats?.recent_donations || [];

  return (
    <section id="stats" className="py-5 bg-white border-top border-bottom">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge badge-emerald mb-2">TRANSPARENT FINANCIAL METRICS</span>
          <h2 className="fw-bold text-emerald-main display-6">{t('statistics_title')}</h2>
          <p className="text-muted">Live update of online contributions collected and verified automatically across all causes.</p>
        </div>

        {/* Metric Cards Grid */}
        <div className="row g-4 mb-5">
          <div className="col-6 col-md-4 col-lg-2.4">
            <div className="p-4 rounded-4 bg-emerald-subtle border border-emerald-light border-opacity-30 text-center h-100 rahma-card">
              <div className="d-inline-flex p-3 rounded-circle bg-emerald-main text-white mb-2 shadow-sm">
                <Calendar size={22} />
              </div>
              <span className="text-muted small fw-bold text-uppercase d-block">{t('today_collection')}</span>
              <h4 className="fw-bold text-emerald-main mb-0 mt-1">₹{todayCollected.toLocaleString('en-IN')}</h4>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2.4">
            <div className="p-4 rounded-4 bg-light border text-center h-100 rahma-card">
              <div className="d-inline-flex p-3 rounded-circle bg-primary text-white mb-2 shadow-sm">
                <TrendingUp size={22} />
              </div>
              <span className="text-muted small fw-bold text-uppercase d-block">This Week</span>
              <h4 className="fw-bold text-dark mb-0 mt-1">₹{weeklyCollected.toLocaleString('en-IN')}</h4>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2.4">
            <div className="p-4 rounded-4 bg-light border text-center h-100 rahma-card">
              <div className="d-inline-flex p-3 rounded-circle bg-info text-white mb-2 shadow-sm">
                <Award size={22} />
              </div>
              <span className="text-muted small fw-bold text-uppercase d-block">This Month</span>
              <h4 className="fw-bold text-dark mb-0 mt-1">₹{monthlyCollected.toLocaleString('en-IN')}</h4>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2.4">
            <div className="p-4 rounded-4 bg-gold-subtle border border-warning text-center h-100 rahma-card">
              <div className="d-inline-flex p-3 rounded-circle bg-warning text-dark mb-2 shadow-sm">
                <Heart size={22} className="fill-dark" />
              </div>
              <span className="text-muted small fw-bold text-uppercase d-block">{t('total_collected')}</span>
              <h4 className="fw-bold text-gold-accent mb-0 mt-1">₹{totalCollected.toLocaleString('en-IN')}</h4>
            </div>
          </div>

          <div className="col-12 col-md-4 col-lg-2.4">
            <div className="p-4 rounded-4 bg-emerald-subtle border border-emerald-light border-opacity-30 text-center h-100 rahma-card">
              <div className="d-inline-flex p-3 rounded-circle bg-emerald-light text-white mb-2 shadow-sm">
                <Users size={22} />
              </div>
              <span className="text-muted small fw-bold text-uppercase d-block">{t('total_donors')}</span>
              <h4 className="fw-bold text-emerald-main mb-0 mt-1">{totalDonors}+</h4>
            </div>
          </div>
        </div>

        {/* Live Recent Donations List */}
        {recentDonations.length > 0 && (
          <div className="p-4 rounded-4 bg-light border">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-emerald-main mb-0 d-flex align-items-center gap-2">
                <span className="live-dot"></span>
                <span>Recent Live Contributions</span>
              </h6>
              <span className="badge badge-emerald">Real-time Stream</span>
            </div>
            <div className="row g-2">
              {recentDonations.slice(0, 4).map((item, idx) => (
                <div key={idx} className="col-md-3 col-6">
                  <div className="p-2.5 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                    <div>
                      <strong className="d-block small text-dark truncate" style={{ maxWidth: '110px' }}>{item.donor_name}</strong>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.payment_method}</span>
                    </div>
                    <span className="badge bg-success font-bold">₹{Number(item.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
