import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';
import signature from '../../assets/signature.png';

interface CertificateData {
  name: string;
  eventType: string;
  certificateId: string;
  date: string;
}

export interface CertificatePreviewProps {
  data: CertificateData;
  isVisible: boolean;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ data, isVisible }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) {
      alert('Certificate not ready');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Certificate_${data.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert('Failed to download certificate: ' + String(error));
    }
  }, [data.name]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        padding: '80px 20px', 
        display: isVisible ? 'block' : 'none',
      }}
    >
      <GlassCard style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        {/* Certificate Preview Card — matches SIMATS Engineering template */}
        <div ref={certificateRef} style={{
          background: '#FFFFFF',
          border: '4px solid #B89A1A',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '32px',
          position: 'relative',
        }}>
          {/* Inner border */}
          <div style={{
            border: '1px solid #D1B846',
            padding: '36px 40px 28px',
          }}>
            {/* Logos Row - Perfectly Aligned */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              padding: '0 20px',
            }}>
              <img
                src={logo1}
                alt="Organization Logo 1"
                crossOrigin="anonymous"
                style={{
                  height: '70px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
              <img
                src={logo2}
                alt="Organization Logo 2"
                crossOrigin="anonymous"
                style={{
                  height: '70px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* SIMATS ENGINEERING header */}
            <h2 style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              fontSize: '32px',
              fontWeight: 700,
              color: '#0D3880',
              marginBottom: '12px',
              letterSpacing: '2px',
            }}>
              SIMATS ENGINEERING
            </h2>

            {/* CERTIFICATE OF PARTICIPATION subtitle */}
            <h3 style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#1A4D8C',
              letterSpacing: '3px',
              marginBottom: '8px',
            }}>
              CERTIFICATE OF PARTICIPATION
            </h3>

            {/* Thin decorative line */}
            <div style={{
              width: '80%',
              height: '1px',
              background: '#D1B846',
              margin: '0 auto 28px',
            }} />

            {/* Body paragraph */}
            <p style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              fontSize: '15px',
              color: '#262626',
              lineHeight: '2',
              textAlign: 'left',
              margin: '0 auto 24px',
              maxWidth: '620px',
            }}>
              This is to certify that <strong style={{ color: '#000', fontSize: '16px' }}>{data.name}</strong> has actively participated in
              the <strong>{"\u201C"}IDEAFORGE 2K26{"\u201D"}</strong> organized by <strong>{"\u201C"}SIMATS Engineering Passion Pitch Club {"\u201D"}</strong> as
              a contributor in the {data.eventType} activity. Your innovation and initiative reflect the spirit of building ideas that shape the future.
            </p>

            {/* Bottom section: Date/Venue (left) | Signature (right) */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '32px',
              fontFamily: "'Times New Roman', 'Georgia', serif",
              fontSize: '13px',
              color: '#262626',
            }}>
              {/* Date & Venue */}
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: '0 0 4px' }}>
                  <strong>Date:</strong> 20/03/26
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Venue:</strong> SIMATS ENGINEERING
                </p>
              </div>

              {/* Head of Department signature */}
              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <img
                  src={signature}
                  alt="HOD Signature"
                  crossOrigin="anonymous"
                  style={{
                    height: '70px',
                    width: 'auto',
                    objectFit: 'contain',
                    marginBottom: '2px',
                    marginLeft: '20px',
                  }}
                />
                <div style={{
                  borderBottom: '1px solid #262626',
                  marginBottom: '6px',
                  width: '160px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }} />
                <p style={{
                  margin: 0,
                  fontStyle: 'italic',
                  fontSize: '13px',
                }}>
                  Head of the Department
                </p>
              </div>
            </div>
          </div>
        </div>

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '14px',
          color: '#6B6B6B',
          marginTop: '24px',
          marginBottom: '16px',
        }}>
          Certificate generated successfully!
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginTop: '24px',
        }}>
          <Button onClick={() => window.open('https://passion-pitch-connect.netlify.app', '_blank')}>
            CONNECT WITH COORDINATORS
          </Button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginTop: '16px',
        }}>
          <Button onClick={handleDownload}>
            ⬇ DOWNLOAD CERTIFICATE
          </Button>
        </div>
      </GlassCard>
    </motion.section>
  );
};