import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { Hero } from './components/Hero/Hero';
import { CertificateForm } from './components/CertificateForm/CertificateForm';
import { CertificatePreview } from './components/CertificatePreview/CertificatePreview';
import { MobileBlocker } from './components/UI/MobileBlocker';
import { Confetti } from './components/UI/Confetti';
import { generateCertificate } from './services/api';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;