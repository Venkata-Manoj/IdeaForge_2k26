import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

interface AdminLoginProps {
  onLogin: (password: string) => Promise<boolean>;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(password);
      if (!success) {
        setError('Invalid credentials');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{
      background: 'radial-gradient(ellipse at center, rgba(255,85,0,0.05) 0%, transparent 70%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GlassCard className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-[#F5EFE0] mb-2" style={{
              fontFamily: "'Unbounded', sans-serif",
            }}>
              Admin Panel
            </h1>
            <p className="text-sm text-gray-500" style={{
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Enter your credentials to access
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={!password || isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              Login
            </Button>
          </form>

          <p className="text-xs text-gray-700 text-center mt-6">
            <a href="/" className="text-gray-500 no-underline hover:text-gray-400 transition-colors">
              ← Back to Certificate Generation
            </a>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};