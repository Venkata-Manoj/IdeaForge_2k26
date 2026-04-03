import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

interface StatsCardsProps {
  stats: {
    totalUsernames: number;
    certificatesGenerated: number;
    remaining: number;
    generationRate: string;
  };
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    { label: 'Total Usernames', value: stats.totalUsernames, icon: '📋', color: '#F5EFE0' },
    { label: 'Certificates Generated', value: stats.certificatesGenerated, icon: '🎓', color: '#00C853' },
    { label: 'Remaining', value: stats.remaining, icon: '⏳', color: '#FF9100' },
    { label: 'Generation Rate', value: stats.generationRate, icon: '📈', color: '#FF5500' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    }}>
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>{card.icon}</span>
            </div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              color: '#6B6B6B',
              marginBottom: '4px',
            }}>
              {card.label}
            </p>
            <p style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: '32px',
              fontWeight: 700,
              color: card.color,
            }}>
              {card.value}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

interface Username {
  username: string;
  isGenerated: boolean;
  createdAt: string;
}

interface UsernameTableProps {
  usernames: Username[];
  onReset: (username: string) => void;
  onDelete: (username: string) => void;
  isLoading: boolean;
}

export const UsernameTable: React.FC<UsernameTableProps> = ({ usernames, onReset, onDelete, isLoading }) => {
  return (
    <GlassCard>
      <h3 style={{
        fontFamily: "'Unbounded', sans-serif",
        fontSize: '20px',
        fontWeight: 600,
        color: '#F5EFE0',
        marginBottom: '24px',
      }}>
        Username Management
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#6B6B6B',
              }}>Username</th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#6B6B6B',
              }}>Status</th>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#6B6B6B',
              }}>Created</th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: '#6B6B6B',
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usernames.map((user) => (
              <tr key={user.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', color: '#F5EFE0', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {user.username}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: user.isGenerated ? 'rgba(0,200,83,0.2)' : 'rgba(255,145,0,0.2)',
                    color: user.isGenerated ? '#00C853' : '#FF9100',
                  }}>
                    {user.isGenerated ? 'Generated' : 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '12px', color: '#6B6B6B', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <Button
                    variant="secondary"
                    onClick={() => onReset(user.username)}
                    disabled={isLoading || user.isGenerated}
                    style={{ padding: '8px 16px', fontSize: '12px', marginRight: '8px' }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onDelete(user.username)}
                    disabled={isLoading}
                    style={{ padding: '8px 16px', fontSize: '12px', color: '#FF1744', borderColor: '#FF1744' }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usernames.length === 0 && (
        <p style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6B6B6B',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          No usernames found. Upload a CSV to get started.
        </p>
      )}
    </GlassCard>
  );
};

interface BulkUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        onUpload(file);
      } else {
        alert('Please upload a CSV file');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <GlassCard>
      <h3 style={{
        fontFamily: "'Unbounded', sans-serif",
        fontSize: '20px',
        fontWeight: 600,
        color: '#F5EFE0',
        marginBottom: '16px',
      }}>
        Bulk Upload
      </h3>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '14px',
        color: '#6B6B6B',
        marginBottom: '24px',
      }}>
        Upload a CSV file with usernames (one per line)
      </p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#FF5500' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          background: dragActive ? 'rgba(255,85,0,0.05)' : 'transparent',
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '16px',
          color: '#6B6B6B',
        }}>
          {isLoading ? 'Uploading...' : 'Drag & drop CSV file here or click to browse'}
        </p>
      </div>
    </GlassCard>
  );
};