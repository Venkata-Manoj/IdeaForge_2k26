import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { validateUsername } from '../../services/api';

interface FormData {
  username: string;
  name: string;
  eventType: 'Technical' | 'Non-Technical' | '';
}

interface FormErrors {
  username?: string;
  name?: string;
  eventType?: string;
}

interface CertificateFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export const CertificateForm: React.FC<CertificateFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    eventType: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  const validateUsernameFormat = (value: string): string | undefined => {
    if (!value) return 'Username is required';
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(value)) return 'Only letters, numbers, and underscores allowed (3-30 characters)';
    return undefined;
  };

  const validateName = (value: string): string | undefined => {
    if (!value) return 'Name is required';
    if (!/^[a-zA-Z\s]{2,50}$/.test(value)) return 'Only alphabets and spaces allowed (2-50 characters)';
    return undefined;
  };

  const formatName = (value: string): string => {
    return value
      .replace(/[^a-zA-Z\s]/g, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim();
    setFormData(prev => ({ ...prev, username: value }));
    setTouched(prev => ({ ...prev, username: true }));
    
    const formatError = validateUsernameFormat(value);
    setErrors(prev => ({ ...prev, username: formatError }));
    
    if (!formatError && value.length >= 3) {
      setUsernameStatus('checking');
      try {
        const result = await validateUsername(value);
        if (result.valid) {
          setUsernameStatus('valid');
          setErrors(prev => ({ ...prev, username: undefined }));
        } else {
          setUsernameStatus('invalid');
          setErrors(prev => ({ ...prev, username: result.error }));
        }
      } catch {
        setUsernameStatus('invalid');
        setErrors(prev => ({ ...prev, username: 'Failed to validate username' }));
      }
    } else {
      setUsernameStatus('idle');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatName(e.target.value);
    setFormData(prev => ({ ...prev, name: formatted }));
    setTouched(prev => ({ ...prev, name: true }));
    
    const error = validateName(formatted);
    setErrors(prev => ({ ...prev, name: error }));
  };

  const handleEventTypeSelect = (type: 'Technical' | 'Non-Technical') => {
    setFormData(prev => ({ ...prev, eventType: type }));
    setTouched(prev => ({ ...prev, eventType: true }));
    setErrors(prev => ({ ...prev, eventType: undefined }));
  };

  const validateForm = (): boolean => {
    const usernameError = validateUsernameFormat(formData.username);
    const nameError = validateName(formData.name);
    const eventTypeError = !formData.eventType ? 'Please select an event type' : undefined;

    setErrors({
      username: usernameError,
      name: nameError,
      eventType: eventTypeError,
    });
    setTouched({ username: true, name: true, eventType: true });

    return !usernameError && !nameError && !eventTypeError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isFormValid = formData.username && formData.name && formData.eventType && usernameStatus === 'valid';
  const hasErrors = Object.values(errors).some(error => error);

  return (
    <section id="certificate-form" className="py-20 px-5 relative">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard className="max-w-[600px] mx-auto">
          <h2 className="text-[32px] font-semibold text-[#F5EFE0] text-center mb-8" style={{
            fontFamily: "'Unbounded', sans-serif",
          }}>
            Generate Your Certificate
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-500 mb-2" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your unique username"
                value={formData.username}
                onChange={handleUsernameChange}
                error={touched.username ? errors.username : undefined}
                disabled={isLoading}
                autoComplete="off"
              />
              {usernameStatus === 'checking' && (
                <p className="text-[13px] text-gray-500 mt-2">
                  Checking username...
                </p>
              )}
              {usernameStatus === 'valid' && !errors.username && (
                <p className="text-[13px] text-green-500 mt-2">
                  ✓ Username available
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-500 mb-2" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Enter your full name (as it appears on certificate)"
                value={formData.name}
                onChange={handleNameChange}
                error={touched.name ? errors.name : undefined}
                disabled={isLoading}
                autoComplete="off"
              />
              {formData.name && !errors.name && (
                <p className="text-[13px] text-green-500 mt-2">
                  Preview: {formData.name}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-500 mb-3" style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Event Type
              </label>
              <div className="flex gap-4 flex-wrap">
                {(['Technical', 'Non-Technical'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleEventTypeSelect(type)}
                    className={`pill-option ${formData.eventType === type ? 'active' : ''}`}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      ...(formData.eventType === type ? {
                        background: '#FF5500',
                        color: '#080808',
                        borderColor: '#FF5500',
                        boxShadow: '0 0 25px rgba(255, 85, 0, 0.3)',
                      } : {}),
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {touched.eventType && errors.eventType && (
                <p className="text-error text-[13px] mt-2">
                  {errors.eventType}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || hasErrors || isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              🔥 GENERATE CERTIFICATE
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </section>
  );
};