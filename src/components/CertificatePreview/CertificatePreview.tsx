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
      className="py-20 px-5"
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <GlassCard className="max-w-[800px] mx-auto text-center">
        {/* Certificate Preview Card — matches SIMATS Engineering template */}
        <div ref={certificateRef} className="bg-white border-4 border-[#B89A1A] rounded p-2.5 mb-8 relative">
          {/* Inner border */}
          <div className="border border-[#D1B846] py-9 px-10">
            {/* Logos Row - Perfectly Aligned */}
            <div className="flex justify-between items-center mb-6 px-5">
              <img
                src={logo1}
                alt="Organization Logo 1"
                crossOrigin="anonymous"
                className="h-[70px] w-auto object-contain"
              />
              <img
                src={logo2}
                alt="Organization Logo 2"
                crossOrigin="anonymous"
                className="h-[70px] w-auto object-contain"
              />
            </div>

            {/* SIMATS ENGINEERING header */}
            <h2 className="text-[32px] font-bold text-[#0D3880] mb-3 tracking-wider" style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
            }}>
              SIMATS ENGINEERING
            </h2>

            {/* CERTIFICATE OF PARTICIPATION subtitle */}
            <h3 className="text-lg font-bold text-[#1A4D8C] tracking-widest mb-2" style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
            }}>
              CERTIFICATE OF PARTICIPATION
            </h3>

            {/* Thin decorative line */}
            <div className="w-4/5 h-px bg-[#D1B846] mx-auto mb-7" />

            {/* Body paragraph */}
            <p className="text-[15px] text-[#262626] leading-8 text-left mx-auto mb-6 max-w-[620px]" style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
            }}>
              This is to certify that <strong className="text-black text-base">{data.name}</strong> has actively participated in
              the <strong>{"\u201C"}IDEAFORGE 2K26{"\u201D"}</strong> organized by <strong>{"\u201C"}SIMATS Engineering Passion Pitch Club {"\u201D"}</strong> as
              a contributor in the {data.eventType} activity. Your innovation and initiative reflect the spirit of building ideas that shape the future.
            </p>

            {/* Bottom section: Date/Venue (left) | Signature (right) */}
            <div className="flex justify-between items-end mt-8 text-[13px] text-[#262626]" style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
            }}>
              {/* Date & Venue */}
              <div className="text-left">
                <p className="mb-1"><strong>Date:</strong> 20/03/26</p>
                <p className="m-0"><strong>Venue:</strong> SIMATS ENGINEERING</p>
              </div>

              {/* Head of Department signature */}
              <div className="text-center min-w-[200px]">
                <img
                  src={signature}
                  alt="HOD Signature"
                  crossOrigin="anonymous"
                  className="h-[70px] w-auto object-contain mb-0.5 ml-5"
                />
                <div className="border-b border-[#262626] mb-1.5 w-40 mx-auto" />
                <p className="m-0 italic text-[13px]">
                  Head of the Department
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6 mb-4" style={{
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Certificate generated successfully!
        </p>

        <div className="flex justify-center gap-4 flex-wrap mt-6">
          <Button onClick={() => window.open('https://passion-pitch-connect.netlify.app', '_blank')}>
            CONNECT WITH COORDINATORS
          </Button>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mt-4">
          <Button onClick={handleDownload}>
            ⬇ DOWNLOAD CERTIFICATE
          </Button>
        </div>
      </GlassCard>
    </motion.section>
  );
};