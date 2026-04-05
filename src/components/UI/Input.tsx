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
      <div className="w-full">
        <input
          ref={ref}
          className={`${inputClass} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-error text-[13px] mt-2" style={{
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