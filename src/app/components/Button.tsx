"use client";
import React from 'react';
import { cn } from '../utils/cn'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline'; 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
  isLoading?: boolean; 
  leftIcon?: React.ReactNode; 
  rightIcon?: React.ReactNode; 
  disabled?: boolean; 
  
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    'font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-200',
    secondary: 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-300',
    outline: 'bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], isLoading && 'opacity-70 cursor-not-allowed', className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;