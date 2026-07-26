import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const WhatsAppSupport = () => {
  const phoneNumber = '917559950633';
  const prefilledText = encodeURIComponent('അസ്സലാമു അലൈക്കും, RAHMA PWA ആപ്പുമായി ബന്ധപ്പെട്ട സംശയങ്ങൾക്ക് എനിക്ക് സഹായം വേണം.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${prefilledText}`;
  const callUrl = `tel:+${phoneNumber}`;

  return (
    <div className="position-fixed bottom-0 end-0 m-3 m-md-4 d-flex flex-column gap-2" style={{ zIndex: 9999 }}>
      {/* Direct Call Button */}
      <a
        href={callUrl}
        className="btn btn-emerald rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center text-white"
        title="Direct Call Helpline"
        style={{ width: '50px', height: '50px' }}
      >
        <Phone size={22} />
      </a>

      {/* WhatsApp Button with Auto Message */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn rounded-circle p-3 shadow-2xl d-flex align-items-center justify-content-center text-white position-relative"
        title="WhatsApp Support"
        style={{ 
          width: '56px', 
          height: '56px',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          border: '2px solid #ffffff'
        }}
      >
        <MessageCircle size={28} className="fill-white" />
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
          Help
        </span>
      </a>
    </div>
  );
};
