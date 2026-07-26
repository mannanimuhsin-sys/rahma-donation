import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, Users, Calendar, Award, Heart, ShieldCheck, Trophy, Crown, Medal, Sparkles } from 'lucide-react';

export const LiveStats = ({ stats, activeSection }) => {
  const { t } = useLanguage();

  const totalCollected = stats?.total_collected || 0;
  const todayCollected = stats?.today_collected || 0;
  const weeklyCollected = stats?.weekly_collected || 0;
  const monthlyCollected = stats?.monthly_collected || 0;
  
  const topDonors = stats?.top_donors || [];
  const madrasaRankings = stats?.madrasa_rankings || [];

  return (
    <section id="stats" className="py-4 bg-white border-top border-bottom">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-4">
          <span className="badge badge-emerald mb-2">SKJM CHAPPARAPPADAVU RANGE LEADERBOARD</span>
          <h2 className="fw-bold text-emerald-main display-6">മദ്രസ കളക്ഷൻ റാങ്കിംഗ് & ഉദാരമനസ്കർ</h2>
          <p className="text-muted">റേഞ്ചിനു കീഴിലുള്ള 14 മദ്രസകളുടെ തത്സമയ കളക്ഷൻ നിലയും ഉയർന്ന പിന്തുണ നൽകിയ വിശിഷ്ട ഉദാരമനസ്കരുടെ വിവരങ്ങളും.</p>
        </div>

        {/* Real-time Financial Metric Cards Grid */}
        {(!activeSection || activeSection === 'home') && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-emerald-subtle border border-emerald-light border-opacity-30 text-center h-100 rahma-card">
                <div className="d-inline-flex p-2.5 rounded-circle bg-emerald-main text-white mb-2 shadow-sm">
                  <Calendar size={20} />
                </div>
                <span className="text-muted small fw-bold text-uppercase d-block">ഇന്നത്തെ സമാഹരണം</span>
                <h5 className="fw-bold text-emerald-main mb-0 mt-1">₹{todayCollected.toLocaleString('en-IN')}</h5>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-light border text-center h-100 rahma-card">
                <div className="d-inline-flex p-2.5 rounded-circle bg-primary text-white mb-2 shadow-sm">
                  <TrendingUp size={20} />
                </div>
                <span className="text-muted small fw-bold text-uppercase d-block">ഈ ആഴ്ച</span>
                <h5 className="fw-bold text-dark mb-0 mt-1">₹{weeklyCollected.toLocaleString('en-IN')}</h5>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-light border text-center h-100 rahma-card">
                <div className="d-inline-flex p-2.5 rounded-circle bg-info text-white mb-2 shadow-sm">
                  <Award size={20} />
                </div>
                <span className="text-muted small fw-bold text-uppercase d-block">ഈ മാസം</span>
                <h5 className="fw-bold text-dark mb-0 mt-1">₹{monthlyCollected.toLocaleString('en-IN')}</h5>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="p-3 rounded-4 bg-gold-subtle border border-warning text-center h-100 rahma-card">
                <div className="d-inline-flex p-2.5 rounded-circle bg-warning text-dark mb-2 shadow-sm">
                  <Heart size={20} className="fill-dark" />
                </div>
                <span className="text-muted small fw-bold text-uppercase d-block">ആകെ സമാഹരിച്ച തുക</span>
                <h5 className="fw-bold text-gold-accent mb-0 mt-1">₹{totalCollected.toLocaleString('en-IN')}</h5>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Madrasa Rankings Leaderboard */}
        {(!activeSection || activeSection === 'rankings' || activeSection === 'home') && (
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <Trophy size={28} className="text-warning" />
                <h4 className="fw-bold text-emerald-main mb-0">റേഞ്ച് മദ്രസ റാങ്കിംഗ് ലിസ്റ്റ് (Madrasa Rankings)</h4>
              </div>
              <span className="badge badge-gold">Live Standings</span>
            </div>

            {/* Top 3 Medals Display */}
            {madrasaRankings.length > 0 && (
              <div className="row g-3 mb-4">
                {/* 1st Place - Gold */}
                {madrasaRankings[0] && (
                  <div className="col-md-4">
                    <div className="p-4 rounded-4 border border-warning shadow-lg text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-warning text-dark font-bold px-3 py-1 fs-6">🥇 1st Rank</span>
                      </div>
                      <div className="d-inline-flex p-3 rounded-circle bg-warning text-dark mb-3 shadow">
                        <Crown size={32} />
                      </div>
                      <h5 className="fw-bold text-dark mb-1">{madrasaRankings[0].name}</h5>
                      <span className="text-muted small d-block mb-2">GOLD MEDALIST</span>
                      <div className="py-2 px-3 bg-white rounded-3 d-inline-block border border-warning shadow-sm">
                        <span className="text-muted small">Total Collection: </span>
                        <strong className="fs-5 text-gold-accent ms-1">₹{madrasaRankings[0].amount.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2nd Place - Silver */}
                {madrasaRankings[1] && (
                  <div className="col-md-4">
                    <div className="p-4 rounded-4 border border-secondary shadow text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-secondary text-white font-bold px-3 py-1 fs-6">🥈 2nd Rank</span>
                      </div>
                      <div className="d-inline-flex p-3 rounded-circle bg-secondary text-white mb-3 shadow">
                        <Medal size={32} />
                      </div>
                      <h5 className="fw-bold text-dark mb-1">{madrasaRankings[1].name}</h5>
                      <span className="text-muted small d-block mb-2">SILVER MEDALIST</span>
                      <div className="py-2 px-3 bg-white rounded-3 d-inline-block border shadow-sm">
                        <span className="text-muted small">Total Collection: </span>
                        <strong className="fs-5 text-secondary ms-1">₹{madrasaRankings[1].amount.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place - Bronze */}
                {madrasaRankings[2] && (
                  <div className="col-md-4">
                    <div className="p-4 rounded-4 border border-amber shadow-sm text-center position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' }}>
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-dark text-warning font-bold px-3 py-1 fs-6">🥉 3rd Rank</span>
                      </div>
                      <div className="d-inline-flex p-3 rounded-circle bg-dark text-warning mb-3 shadow">
                        <Medal size={32} />
                      </div>
                      <h5 className="fw-bold text-dark mb-1">{madrasaRankings[2].name}</h5>
                      <span className="text-muted small d-block mb-2">BRONZE MEDALIST</span>
                      <div className="py-2 px-3 bg-white rounded-3 d-inline-block border shadow-sm">
                        <span className="text-muted small">Total Collection: </span>
                        <strong className="fs-5 text-dark ms-1">₹{madrasaRankings[2].amount.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Full Madrasa Rankings Table */}
            <div className="bg-light rounded-4 border p-4">
              <h6 className="fw-bold text-emerald-main mb-3">റേഞ്ച് മദ്രസകളുടെ സമ്പൂർണ്ണ കളക്ഷൻ റാങ്കിംഗ്</h6>
              <div className="table-responsive">
                <table className="table table-hover align-middle bg-white rounded-3 overflow-hidden shadow-sm mb-0">
                  <thead className="table-dark small text-uppercase">
                    <tr>
                      <th style={{ width: '80px' }}>Rank</th>
                      <th>Madrasa Name</th>
                      <th className="text-end">Total Collected Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {madrasaRankings.map((m) => (
                      <tr key={m.rank} className={m.rank <= 3 ? 'fw-bold bg-emerald-subtle' : ''}>
                        <td>
                          <span className={`badge rounded-pill ${
                            m.rank === 1 ? 'bg-warning text-dark' :
                            m.rank === 2 ? 'bg-secondary text-white' :
                            m.rank === 3 ? 'bg-dark text-warning' : 'bg-light text-dark border'
                          }`}>
                            #{m.rank}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-dark">{m.name}</span>
                        </td>
                        <td className="text-end">
                          <strong className="text-emerald-main fs-6">₹{m.amount.toLocaleString('en-IN')}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Top Contributors / Executive Supporters */}
        {(!activeSection || activeSection === 'donors' || activeSection === 'home') && (
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <Crown size={28} className="text-emerald-light" />
                <h4 className="fw-bold text-emerald-main mb-0">വിശിഷ്ട ഉദാരമനസ്കർ (Top Contributors)</h4>
              </div>
              <span className="badge badge-emerald">Highest Contributions</span>
            </div>

            {topDonors.length === 0 ? (
              <div className="p-4 bg-light rounded-4 border text-center text-muted">
                സംഭാവനകൾ ചേർക്കപ്പെടുന്നതോടെ വിശിഷ്ട ഉദാരമനസ്കരുടെ വിവരങ്ങൾ ഇവിടെ തത്സമയം കാണാം.
              </div>
            ) : (
              <div className="row g-3">
                {topDonors.map((donor, idx) => (
                  <div key={donor.id || idx} className="col-md-6 col-lg-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100 position-relative rahma-card">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge badge-gold">Top Supporter #{idx + 1}</span>
                        <strong className="fs-5 text-gold-accent">₹{Number(donor.amount).toLocaleString('en-IN')}</strong>
                      </div>

                      <h5 className="fw-bold text-emerald-main mb-1">{donor.donor_name}</h5>
                      <div className="small text-muted mb-2">
                        <span>വീട്ടു പേര്: </span>
                        <strong className="text-dark">{donor.house_name || 'N/A'}</strong>
                      </div>

                      <div className="p-2.5 bg-emerald-subtle rounded-3 small text-emerald-main mb-2">
                        <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>മദ്രസ / സ്ഥലം:</span>
                        <strong className="d-block text-truncate">{donor.madrasa_name}</strong>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-2 border-top text-muted small">
                        <span>മൊബൈൽ: <strong>{donor.donor_phone_masked}</strong></span>
                        <ShieldCheck size={16} className="text-success" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
