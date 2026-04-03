import React, { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';

export const MobileBlocker: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  if (!isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#080808',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <GlassCard style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '24px',
          color: '#FF5500'
        }}>
          ⚠️
        </div>
        <h2 style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: '24px',
          color: '#F5EFE0',
          marginBottom: '16px',
        }}>
          Desktop Only
        </h2>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '16px',
          color: '#6B6B6B',
          lineHeight: '1.6',
        }}>
          This website is designed for desktop/laptop only. Please open on a larger screen.
        </p>
      </GlassCard>
    </div>
  );
};