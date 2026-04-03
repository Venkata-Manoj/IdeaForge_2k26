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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(ellipse at center, rgba(255,85,0,0.05) 0%, transparent 70%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GlassCard style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: '28px',
              fontWeight: 700,
              color: '#F5EFE0',
              marginBottom: '8px',
            }}>
              Admin Panel
            </h1>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              color: '#6B6B6B',
            }}>
              Enter your credentials to access
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
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
              style={{ width: '100%' }}
            >
              Login
            </Button>
          </form>

          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '12px',
            color: '#444',
            textAlign: 'center',
            marginTop: '24px',
          }}>
            <a href="/" style={{ color: '#6B6B6B', textDecoration: 'none' }}>
              ← Back to Certificate Generation
            </a>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};