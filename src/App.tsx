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
import { generateCertificate, adminLogin, getAdminStats, getUsernames, uploadCSV, deleteUsername, resetUsername, type AdminStats, type Username } from './services/api';
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
      
      <main style={{ minHeight: '100vh' }}>
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px',
      background: '#080808',
    }}>
      <h1 style={{
        fontFamily: "'Unbounded', sans-serif",
        fontSize: '120px',
        fontWeight: 700,
        color: '#FF5500',
      }}>
        404
      </h1>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '18px',
        color: '#6B6B6B',
      }}>
        Page not found
      </p>
      <a href="/" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#FF5500',
        textDecoration: 'none',
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

  const loadStats = async () => {
    const data = await getAdminStats();
    if (data) setStats(data);
  };

  const loadUsernames = async () => {
    const data = await getUsernames();
    if (data) setUsernames(data.usernames);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    let mounted = true;
    
    const fetchData = async () => {
      const statsData = await getAdminStats();
      const usernamesData = await getUsernames();
      
      if (!mounted) return;
      
      if (statsData) setStats(statsData);
      if (usernamesData) setUsernames(usernamesData.usernames);
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

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
    if (confirm(`Reset ${username}?`)) {
      const success = await resetUsername(username);
      if (success) {
        loadUsernames();
        loadStats();
      }
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
    <div style={{
      minHeight: '100vh',
      padding: '100px 40px 40px',
      background: '#080808',
    }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <h1 style={{
            fontFamily: "'Unbounded', sans-serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#F5EFE0',
          }}>
            Admin Dashboard
          </h1>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {stats && <StatsCards stats={stats} />}

        <div style={{ marginBottom: '32px' }}>
          <BulkUpload onUpload={handleUpload} isLoading={isLoading} />
        </div>

        <UsernameTable
          usernames={usernames}
          onDelete={handleDelete}
          onReset={handleReset}
          isLoading={isLoading}
        />
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