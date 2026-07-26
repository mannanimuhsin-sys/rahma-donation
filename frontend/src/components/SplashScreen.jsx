import React, { useState, useEffect } from 'react';

export const SplashScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState('enter'); // 'enter' -> 'show' -> 'exit'

  useEffect(() => {
    // Phase 1: Enter animation for 400ms
    const enterTimer = setTimeout(() => setPhase('show'), 400);
    // Phase 2: Start exit at 1.8s
    const exitTimer = setTimeout(() => setPhase('exit'), 1800);
    // Phase 3: Remove splash at 2.2s (after exit animation)
    const finishTimer = setTimeout(() => { if (onFinish) onFinish(); }, 2200);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const getStyle = () => {
    if (phase === 'enter') return { opacity: 0, transform: 'scale(1.04)' };
    if (phase === 'show')  return { opacity: 1, transform: 'scale(1)' };
    if (phase === 'exit')  return { opacity: 0, transform: 'scale(0.96)' };
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'linear-gradient(160deg, #022c22 0%, #064e3b 55%, #047857 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        ...getStyle(),
      }}
    >
      {/* Gold ring glow behind logo */}
      <div style={{
        position: 'absolute',
        width: '280px',
        height: '280px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 70%)',
        animation: 'glow-pulse 2s ease-in-out infinite',
      }} />

      {/* Logo card */}
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '28px',
        padding: '32px 36px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(217,119,6,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0',
        animation: 'logo-float 2.4s ease-in-out infinite',
        maxWidth: '300px',
        width: '80vw',
      }}>
        <img
          src="/logo.png"
          alt="RAHMA"
          style={{
            width: '100%',
            maxWidth: '220px',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Progress bar */}
      <div style={{
        marginTop: '40px',
        width: '180px',
        height: '4px',
        background: 'rgba(255,255,255,0.18)',
        borderRadius: '99px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          borderRadius: '99px',
          background: 'linear-gradient(90deg, #d97706, #f59e0b)',
          animation: 'splash-fill 2.2s linear forwards',
        }} />
      </div>

      {/* Tagline */}
      <p style={{
        marginTop: '20px',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '12px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'Outfit, sans-serif',
      }}>
        Online Donation Platform
      </p>

      <style>{`
        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes logo-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes splash-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
