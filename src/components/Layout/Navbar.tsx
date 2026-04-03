import React from 'react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(8, 8, 8, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #FF5500, #FF6A1A)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Unbounded', sans-serif",
          fontWeight: 700,
          fontSize: '18px',
          color: '#080808',
        }}>
          IF
        </div>
        <span style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: '18px',
          fontWeight: 600,
          color: '#F5EFE0',
          letterSpacing: '1px',
        }}>
          IDEAFORGE <span style={{ color: '#FF5500' }}>2k26</span>
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <span style={{ fontSize: '14px' }}>💻</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '12px',
          color: '#6B6B6B',
        }}>
          Desktop Only
        </span>
      </div>
    </motion.nav>
  );
};