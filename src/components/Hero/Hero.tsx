import React from 'react';
import { motion } from 'framer-motion';

const FloatingOrb: React.FC<{ 
  size: number; 
  x: number; 
  y: number; 
  delay: number;
  color: string;
}> = ({ size, x, y, delay, color }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: 'blur(60px)',
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
};

export const Hero: React.FC = () => {
  const title = "IDEAFORGE 2k26";
  const letters = title.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 20px 80px',
    }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <FloatingOrb size={400} x={10} y={20} delay={0} color="rgba(255, 85, 0, 0.15)" />
        <FloatingOrb size={300} x={70} y={60} delay={2} color="rgba(255, 107, 26, 0.1)" />
        <FloatingOrb size={250} x={50} y={10} delay={4} color="rgba(245, 239, 224, 0.05)" />
        
        {/* Grain overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Main Title */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontSize: 'clamp(60px, 12vw, 160px)',
                fontWeight: 700,
                color: letter === '2' ? '#FF5500' : '#F5EFE0',
                lineHeight: 1,
                display: 'inline-block',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(18px, 3vw, 24px)',
          color: '#6B6B6B',
          textAlign: 'center',
          maxWidth: '600px',
          marginBottom: '48px',
        }}
      >
        Generate your personalized e-certificate in seconds
      </motion.p>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '12px',
          color: '#444',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Scroll to Generate
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: '24px',
            height: '40px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '8px',
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.5, 1], y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '4px',
              height: '8px',
              background: '#FF5500',
              borderRadius: '2px',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};