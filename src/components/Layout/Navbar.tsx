import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 py-5 px-10 flex justify-between items-center bg-bg-primary/80 backdrop-blur-md border-b border-white/5 z-100"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center font-bold text-lg text-bg-primary" style={{
          fontFamily: "'Unbounded', sans-serif",
        }}>
          IF
        </div>
        <span className="text-lg font-semibold text-[#F5EFE0] tracking-wider" style={{
          fontFamily: "'Unbounded', sans-serif",
        }}>
          IDEAFORGE <span className="text-primary">2k26</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 py-2 px-4 bg-white/3 rounded-[20px] border border-white/8">
          <span className="text-sm">💻</span>
          <span className="text-xs text-gray-500" style={{
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Desktop Only
          </span>
        </div>

        <Link to="/admin" className="no-underline">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 py-2 px-4 bg-primary/10 rounded-[20px] border border-primary/30 cursor-pointer"
          >
            <span className="text-sm">🛡️</span>
            <span className="text-xs text-primary font-medium" style={{
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Admin
            </span>
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  );
};