import React from 'react';
import { Home, Trophy, Heart, Crown, HelpCircle } from 'lucide-react';

export const BottomNavBar = ({ activeTab, setActiveTab, onOpenDonate }) => {
  return (
    <div 
      className="position-fixed bottom-0 start-0 end-0 bg-emerald-dark text-white border-top shadow-2xl z-4 py-1 px-2"
      style={{
        background: 'rgba(2, 44, 34, 0.96)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(255,255,255,0.15)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.3)'
      }}
    >
      <div className="container max-w-md mx-auto">
        <div className="d-flex align-items-center justify-content-between text-center position-relative">
          
          {/* Tab 1: Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`btn border-0 text-white flex-fill p-1.5 transition-all d-flex flex-column align-items-center justify-content-center ${
              activeTab === 'home' ? 'text-warning font-bold' : 'opacity-70'
            }`}
            style={{ fontSize: '0.7rem' }}
          >
            <Home size={22} className={activeTab === 'home' ? 'text-warning' : 'text-white'} />
            <span className="mt-1">ഹോം</span>
          </button>

          {/* Tab 2: Madrasa Rankings */}
          <button
            onClick={() => setActiveTab('rankings')}
            className={`btn border-0 text-white flex-fill p-1.5 transition-all d-flex flex-column align-items-center justify-content-center ${
              activeTab === 'rankings' ? 'text-warning font-bold' : 'opacity-70'
            }`}
            style={{ fontSize: '0.7rem' }}
          >
            <Trophy size={22} className={activeTab === 'rankings' ? 'text-warning' : 'text-white'} />
            <span className="mt-1">റാങ്കിംഗ്</span>
          </button>

          {/* Center Elevated Big Round Donate Button */}
          <div className="flex-fill d-flex justify-content-center position-relative" style={{ marginTop: '-24px' }}>
            <button
              onClick={onOpenDonate}
              className="btn btn-gold rounded-circle p-0 shadow-2xl d-flex flex-column align-items-center justify-content-center border border-3 border-white transition-all pulse-glow"
              style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 8px 25px rgba(217, 119, 6, 0.6), 0 0 0 4px rgba(255,255,255,0.2)'
              }}
              title="ഇപ്പോൾ സംഭാവന ചെയ്യുക"
            >
              <Heart size={28} className="fill-white text-white" />
              <span className="text-white font-extrabold" style={{ fontSize: '0.62rem', letterSpacing: '-0.2px' }}>
                സംഭാവന
              </span>
            </button>
          </div>

          {/* Tab 3: Executive Term "ഉദാരമനസ്കർ" (Generous Supporters) */}
          <button
            onClick={() => setActiveTab('donors')}
            className={`btn border-0 text-white flex-fill p-1.5 transition-all d-flex flex-column align-items-center justify-content-center ${
              activeTab === 'donors' ? 'text-warning font-bold' : 'opacity-70'
            }`}
            style={{ fontSize: '0.7rem' }}
          >
            <Crown size={22} className={activeTab === 'donors' ? 'text-warning' : 'text-white'} />
            <span className="mt-1">ഉദാരമനസ്കർ</span>
          </button>

          {/* Tab 4: Helpline / About */}
          <button
            onClick={() => setActiveTab('about')}
            className={`btn border-0 text-white flex-fill p-1.5 transition-all d-flex flex-column align-items-center justify-content-center ${
              activeTab === 'about' ? 'text-warning font-bold' : 'opacity-70'
            }`}
            style={{ fontSize: '0.7rem' }}
          >
            <HelpCircle size={22} className={activeTab === 'about' ? 'text-warning' : 'text-white'} />
            <span className="mt-1">വിവരങ്ങൾ</span>
          </button>

        </div>
      </div>
    </div>
  );
};
