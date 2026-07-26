import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Users, Target, CheckCircle } from 'lucide-react';

export const CampaignCard = ({ campaign, onDonate }) => {
  const { t } = useLanguage();

  const defaultBanner = "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="card rahma-card h-100 overflow-hidden d-flex flex-column">
      <div className="position-relative" style={{ height: '210px' }}>
        <img
          src={campaign.banner_image || defaultBanner}
          alt={campaign.title}
          className="w-100 h-100 object-fit-cover"
        />
        <div className="position-absolute top-0 start-0 m-3">
          <span className="badge badge-emerald shadow-sm">
            {campaign.category}
          </span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          <span className="badge badge-gold shadow-sm">
            {campaign.percentage_completed}% Achieved
          </span>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <h5 className="fw-bold text-emerald-main mb-2 line-clamp-2" style={{ color: '#064e3b' }}>
          {campaign.title}
        </h5>

        <p className="text-muted small mb-4 flex-grow-1 line-clamp-3" style={{ lineHeight: 1.5 }}>
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="d-flex justify-content-between small fw-bold mb-1">
            <span className="text-emerald-light">
              ₹{Number(campaign.collected_amount).toLocaleString('en-IN')} Raised
            </span>
            <span className="text-muted">
              Target: ₹{Number(campaign.target_amount).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="rahma-progress">
            <div
              className="rahma-progress-bar h-100"
              style={{ width: `${Math.min(campaign.percentage_completed, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
          <div className="d-flex align-items-center gap-1.5 text-muted small">
            <Users size={16} className="text-emerald-light" />
            <span>{campaign.donor_count} Donors</span>
          </div>

          <button
            onClick={() => onDonate(campaign)}
            className="btn btn-sm btn-gold text-white font-bold px-3 py-2 rounded-3 d-flex align-items-center gap-1.5"
          >
            <Heart size={16} className="fill-white" />
            <span>{t('donate_now')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
