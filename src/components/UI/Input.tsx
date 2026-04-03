import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, success, className = '', ...props }, ref) => {
    let inputClass = 'input-field';
    if (error) inputClass += ' error';
    if (success) inputClass += ' success';

    return (
      <div style={{ width: '100%' }}>
        <input
          ref={ref}
          className={`${inputClass} ${className}`}
          {...props}
        />
        {error && (
          <p style={{ 
            color: '#FF1744', 
            fontSize: '13px', 
            marginTop: '8px',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';