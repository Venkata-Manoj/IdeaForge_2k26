import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      padding: '40px 20px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      marginTop: '80px',
    }}>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '14px',
        color: '#6B6B6B',
        margin: 0,
      }}>
        Made with <span style={{ color: '#FF5500' }}>❤️</span> by IDEAFORGE Team
      </p>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '12px',
        color: '#444',
        marginTop: '8px',
      }}>
        © 2026 IDEAFORGE. All rights reserved.
      </p>
    </footer>
  );
};