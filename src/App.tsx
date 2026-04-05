import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { Hero } from './components/Hero/Hero';
import { CertificateForm } from './components/CertificateForm/CertificateForm';
import { CertificatePreview } from './components/CertificatePreview/CertificatePreview';
import { MobileBlocker } from './components/UI/MobileBlocker';
import { Confetti } from './components/UI/Confetti';
import { AdminLogin } from './components/Admin/AdminLogin';
import { StatsCards, UsernameTable, BulkUpload } from './components/Admin/AdminDashboard';
import { Button } from './components/UI/Button';
import { generateCertificate, adminLogin, getAdminStats, getUsernames, uploadCSV, deleteUsername, resetUsername, updateUsername, getUserDetails, downloadUsernamesCSV, addUsername, type AdminStats, type Username, type UserDetails } from './services/api';
import './index.css';

interface CertificateData {
  name: string;
  eventType: string;
  certificateId: string;
  date: string;
  username: string;
}

interface FormData {
  username: string;
  name: string;
  eventType: string;
}

function MainPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateCertificate = async (formData: FormData) => {
    setIsLoading(true);
    
    try {
      const result = await generateCertificate(formData.username, formData.name, formData.eventType);
      
      if (result.success) {
        const certificateId = result.certificateId || 'IF2K26-XXXX-XXXX';
        const eventDate = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        setCertificateData({
          name: formData.name,
          eventType: formData.eventType,
          certificateId: certificateId,
          date: eventDate,
          username: formData.username,
        });
        setShowConfetti(true);
        setShowPreview(true);
        
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        alert(result.error || 'Failed to generate certificate');
      }
    } catch {
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MobileBlocker />
      <Navbar />
      
      <main className="min-h-screen">
        <Hero />
        
        <AnimatePresence>
          {!showPreview && (
            <CertificateForm
              onSubmit={handleGenerateCertificate}
              isLoading={isLoading}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPreview && certificateData && (
            <CertificatePreview
              data={certificateData}
              isVisible={showPreview}
            />
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
      
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-5 bg-bg-primary">
      <h1 className="text-[120px] font-bold text-primary" style={{
        fontFamily: "'Unbounded', sans-serif",
      }}>
        404
      </h1>
      <p className="text-lg text-gray-500" style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        Page not found
      </p>
      <a href="/" className="text-primary no-underline hover:underline" style={{
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        Go back home →
      </a>
    </div>
  );
}

// Admin Page Component
function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usernames, setUsernames] = useState<Username[]>([]);
  const [editingUser, setEditingUser] = useState<Username | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [viewingDetails, setViewingDetails] = useState<UserDetails | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUsernameValue, setAddUsernameValue] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const loadStats = async () => {
    const data = await getAdminStats();
    if (data) setStats(data);
  };

  const loadUsernames = async (search = '') => {
    const data = await getUsernames(1, 100, sortBy, order, search);
    if (data) {
      setUsernames(data.usernames);
      setTotalCount(data.pagination.total);
      // Clear selection when data reloads
      setSelectedUsernames([]);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    let mounted = true;
    
    const fetchData = async () => {
      const statsData = await getAdminStats();
      const usernamesData = await getUsernames(1, 100, sortBy, order, searchQuery);
      
      if (!mounted) return;
      
      if (statsData) setStats(statsData);
      if (usernamesData) {
        setUsernames(usernamesData.usernames);
        setTotalCount(usernamesData.pagination.total);
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, sortBy, order, searchQuery]);

  const handleLogin = async (password: string): Promise<boolean> => {
    const result = await adminLogin(password);
    if (result.success) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleUpload = async (file: File): Promise<void> => {
    setIsLoading(true);
    const result = await uploadCSV(file);
    setIsLoading(false);
    if (result) {
      alert(`Upload complete: ${result.added} added, ${result.skipped} skipped`);
      loadUsernames();
      loadStats();
    } else {
      alert('Upload failed');
    }
  };

  const handleDelete = async (username: string): Promise<void> => {
    if (confirm(`Delete ${username}?`)) {
      const success = await deleteUsername(username);
      if (success) {
        loadUsernames();
        loadStats();
      }
    }
  };

  const handleReset = async (username: string): Promise<void> => {
    if (confirm(`Reset ${username}? This will allow the user to generate a certificate again.`)) {
      const success = await resetUsername(username);
      if (success) {
        loadUsernames();
        loadStats();
      }
    }
  };

  const handleUpdate = async (oldUsername: string, newUsernameValue: string): Promise<void> => {
    const result = await updateUsername(oldUsername, newUsernameValue);
    if (result.success) {
      alert(`Username updated successfully!`);
      setShowEditModal(false);
      setEditingUser(null);
      setNewUsername('');
      loadUsernames();
    } else {
      alert(result.error || 'Failed to update username');
    }
  };

  const handleViewDetails = async (username: string): Promise<void> => {
    const details = await getUserDetails(username);
    if (details) {
      setViewingDetails(details);
      setShowDetailsModal(true);
    } else {
      alert('Failed to load user details');
    }
  };

  const handleDownloadCSV = async (): Promise<void> => {
    setIsLoading(true);
    await downloadUsernamesCSV();
    setIsLoading(false);
  };

  const openEditModal = (user: Username): void => {
    setEditingUser(user);
    setNewUsername(user.username);
    setShowEditModal(true);
  };

  const closeEditModal = (): void => {
    setShowEditModal(false);
    setEditingUser(null);
    setNewUsername('');
  };

  const closeDetailsModal = (): void => {
    setShowDetailsModal(false);
    setViewingDetails(null);
  };

  const handleSort = (newSortBy: string, newOrder: string) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setAddUsernameValue('');
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddUsernameValue('');
  };

  const handleAddUser = async () => {
    if (!addUsernameValue.trim()) {
      alert('Please enter a username');
      return;
    }
    
    const result = await addUsername(addUsernameValue.trim());
    if (result.success) {
      alert('Username added successfully!');
      closeAddModal();
      loadUsernames();
      loadStats();
    } else {
      alert(result.error || 'Failed to add username');
    }
  };

  // Multi-select handlers
  const handleSelectUser = (username: string, selected: boolean) => {
    if (selected) {
      setSelectedUsernames(prev => [...prev, username]);
    } else {
      setSelectedUsernames(prev => prev.filter(u => u !== username));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsernames(usernames.map(u => u.username));
    } else {
      setSelectedUsernames([]);
    }
  };

  const allSelected = usernames.length > 0 && selectedUsernames.length === usernames.length;

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (selectedUsernames.length === 0) {
      alert('Please select at least one user');
      return;
    }
    if (!confirm(`Delete ${selectedUsernames.length} selected users? This action cannot be undone.`)) {
      return;
    }
    
    setIsLoading(true);
    let successCount = 0;
    let failCount = 0;
    
    for (const username of selectedUsernames) {
      const success = await deleteUsername(username);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    setIsLoading(false);
    setSelectedUsernames([]);
    loadUsernames();
    loadStats();
    
    if (failCount > 0) {
      alert(`Deleted ${successCount} users, ${failCount} failed`);
    } else {
      alert(`Successfully deleted ${successCount} users`);
    }
  };

  const handleBulkReset = async () => {
    if (selectedUsernames.length === 0) {
      alert('Please select at least one user');
      return;
    }
    if (!confirm(`Reset ${selectedUsernames.length} selected users? This will allow them to generate certificates again.`)) {
      return;
    }
    
    setIsLoading(true);
    let successCount = 0;
    let failCount = 0;
    
    for (const username of selectedUsernames) {
      const success = await resetUsername(username);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    setIsLoading(false);
    setSelectedUsernames([]);
    loadUsernames();
    loadStats();
    
    if (failCount > 0) {
      alert(`Reset ${successCount} users, ${failCount} failed`);
    } else {
      alert(`Successfully reset ${successCount} users`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStats(null);
    setUsernames([]);
    navigate('/');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen py-24 px-10 bg-[#080808]">
      <Navbar />
      
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[28px] font-bold text-[#F5EFE0] mb-2 font-unbounded">
            Admin Dashboard
          </h1>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {stats && <StatsCards stats={stats} />}

        <div className="mb-8 flex gap-4 flex-wrap">
          <BulkUpload onUpload={handleUpload} isLoading={isLoading} />
          <Button 
            variant="primary" 
            onClick={openAddModal}
            disabled={isLoading}
          >
            ➕ Add User
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDownloadCSV}
            disabled={isLoading}
          >
            📥 Download CSV
          </Button>
        </div>

        {/* Sorting Controls */}
        <div className="mb-5 flex gap-3 flex-wrap items-center">
          <span className="text-sm text-gray-500 font-grotesk">
            Sort by:
          </span>
          <button
            onClick={() => handleSort('username', order === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 text-[13px] rounded-lg cursor-pointer border font-medium transition-colors"
          >
            Username {sortBy === 'username' && (order === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('createdAt', order === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 text-[13px] rounded-lg cursor-pointer border font-medium transition-colors"
          >
            Date {sortBy === 'createdAt' && (order === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('isGenerated', order === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 text-[13px] rounded-lg cursor-pointer border font-medium transition-colors"
          >
            Status {sortBy === 'isGenerated' && (order === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        <UsernameTable
          usernames={usernames}
          onDelete={handleDelete}
          onReset={handleReset}
          onUpdate={openEditModal}
          onViewDetails={handleViewDetails}
          isLoading={isLoading}
          selectedUsernames={selectedUsernames}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
          allSelected={allSelected}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={totalCount}
        />

        {/* Bulk Actions Bar */}
        {selectedUsernames.length > 0 && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1a1a1a] px-6 py-4 rounded-xl border border-[#FF5500]/30 flex gap-4 items-center z-[100] shadow-lg" style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            <span className="text-sm text-gray-500 mr-2 font-grotesk">
              {selectedUsernames.length} selected
            </span>
            <Button 
              variant="secondary" 
              onClick={handleBulkReset}
              disabled={isLoading}
            >
              🔄 Reset Selected
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleBulkDelete}
              disabled={isLoading}
              className="text-[#FF1744] border-[#FF1744]"
            >
              🗑️ Delete Selected
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setSelectedUsernames([])}
              disabled={isLoading}
            >
              ✕ Clear
            </Button>
          </div>
        )}

        {/* Edit Username Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]">
            <div className="bg-[#1a1a1a] p-8 rounded-xl max-w-[400px] w-[90%] border border-white/10">
              <h3 className="text-xl text-[#F5EFE0] mb-5 font-bold font-unbounded">
                Edit Username
              </h3>
              <p className="text-gray-500 mb-4">
                Current: <strong className="text-[#F5EFE0]">{editingUser.username}</strong>
              </p>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F5EFE0] text-sm mb-5 font-grotesk"
              />
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={() => handleUpdate(editingUser.username, newUsername)}
                  disabled={!newUsername || newUsername === editingUser.username}
                >
                  Update
                </Button>
                <Button variant="secondary" onClick={closeEditModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && viewingDetails && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]">
            <div className="bg-[#1a1a1a] p-8 rounded-xl max-w-[500px] w-[90%] border border-white/10">
              <h3 className="text-xl text-[#F5EFE0] mb-5 font-bold font-unbounded">
                User Details
              </h3>
              
              <div className="mb-4">
                <p className="text-gray-500 text-xs font-grotesk">Username</p>
                <p className="text-[#F5EFE0] text-base">{viewingDetails.username}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-500 text-xs font-grotesk">Status</p>
                <span className="px-3 py-1 rounded-full text-xs font-grotesk" style={{
                  background: viewingDetails.isGenerated ? 'rgba(0,200,83,0.2)' : 'rgba(255,145,0,0.2)',
                  color: viewingDetails.isGenerated ? '#00C853' : '#FF9100',
                }}>
                  {viewingDetails.isGenerated ? 'Certificate Generated' : 'Pending'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-xs">Created</p>
                <p className="text-[#F5EFE0] text-sm">
                  {new Date(viewingDetails.createdAt).toLocaleString()}
                </p>
              </div>

              {viewingDetails.certificate && (
                <>
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs">Certificate ID</p>
                    <p className="text-[#F5EFE0] text-sm font-mono">
                      {viewingDetails.certificate.certificateId}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs">Participant Name</p>
                    <p className="text-[#F5EFE0] text-sm">
                      {viewingDetails.certificate.participantName}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs">Event Type</p>
                    <p className="text-[#F5EFE0] text-sm">
                      {viewingDetails.certificate.eventType}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs">Generated At</p>
                    <p className="text-[#F5EFE0] text-sm">
                      {new Date(viewingDetails.certificate.generatedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
              
              <Button variant="secondary" onClick={closeDetailsModal}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]">
            <div className="bg-[#1a1a1a] p-8 rounded-xl max-w-[400px] w-[90%] border border-white/10">
              <h3 className="text-xl text-[#F5EFE0] mb-5 font-bold" style={{
                fontFamily: "'Unbounded', sans-serif",
              }}>
                Add New User
              </h3>
              <p className="text-gray-500 mb-4 text-sm">
                Enter a unique username (3-30 characters, letters, numbers, underscores only)
              </p>
              <input
                type="text"
                value={addUsernameValue}
                onChange={(e) => setAddUsernameValue(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F5EFE0] text-sm mb-5"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              />
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={handleAddUser}
                  disabled={!addUsernameValue.trim()}
                >
                  Add User
                </Button>
                <Button variant="secondary" onClick={closeAddModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;