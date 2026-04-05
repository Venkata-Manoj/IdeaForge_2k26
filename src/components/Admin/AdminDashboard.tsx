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
    <div className="grid gap-5 mb-8" style={{
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    }}>
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-sm text-gray-400 mb-1" style={{
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {card.label}
            </p>
            <p className="text-3xl font-bold" style={{
              fontFamily: "'Unbounded', sans-serif",
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
  onUpdate: (user: Username) => void;
  onViewDetails: (username: string) => void;
  isLoading: boolean;
  selectedUsernames: string[];
  onSelectUser: (username: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  allSelected: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export const UsernameTable: React.FC<UsernameTableProps> = ({ 
  usernames, onReset, onDelete, onUpdate, onViewDetails, isLoading,
  selectedUsernames, onSelectUser, onSelectAll, allSelected,
  searchQuery, onSearchChange, totalCount
}) => {
  return (
    <GlassCard>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-[#F5EFE0]" style={{
          fontFamily: "'Unbounded', sans-serif",
        }}>
          Username Management
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 font-grotesk">
            Showing {usernames.length} of {totalCount} users
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search usernames..."
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5EFE0] text-sm font-grotesk w-48 md:w-64"
            aria-label="Search usernames"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/8">
              <th className="p-3 text-center w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="cursor-pointer"
                  aria-label="Select all usernames"
                />
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-400" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>Username</th>
              <th className="p-3 text-left text-sm font-medium text-gray-400" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>Status</th>
              <th className="p-3 text-left text-sm font-medium text-gray-400" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>Created</th>
              <th className="p-3 text-right text-sm font-medium text-gray-400" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usernames.map((user) => (
              <tr key={user.username} className="border-b border-white/5">
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsernames.includes(user.username)}
                    onChange={(e) => onSelectUser(user.username, e.target.checked)}
                    className="cursor-pointer"
                    aria-label={`Select ${user.username}`}
                  />
                </td>
                <td className="p-3 text-[#F5EFE0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {user.username}
                </td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs" style={{
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
                    onClick={() => onViewDetails(user.username)}
                    disabled={isLoading}
                    className="px-4 py-2 text-xs mr-2"
                  >
                    👁️ View
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onUpdate(user)}
                    disabled={isLoading}
                    className="px-4 py-2 text-xs mr-2"
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onReset(user.username)}
                    disabled={isLoading || !user.isGenerated}
                    className="px-4 py-2 text-xs mr-2"
                  >
                    🔄 Reset
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onDelete(user.username)}
                    disabled={isLoading}
                    className="px-4 py-2 text-xs"
                    style={{ color: '#FF1744', borderColor: '#FF1744' }}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usernames.length === 0 && (
        <p className="text-center p-10 text-gray-400" style={{
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
      <h3 className="text-xl font-semibold text-[#F5EFE0] mb-4" style={{
        fontFamily: "'Unbounded', sans-serif",
      }}>
        Bulk Upload
      </h3>
      <p className="text-sm text-gray-400 mb-6" style={{
        fontFamily: "'Space Grotesk', sans-serif",
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
          className="hidden"
          aria-label="Upload CSV file"
        />
        <p className="text-base text-gray-400" style={{
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {isLoading ? 'Uploading...' : 'Drag & drop CSV file here or click to browse'}
        </p>
      </div>
    </GlassCard>
  );
};