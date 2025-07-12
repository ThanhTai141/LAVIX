import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  variant?: 'toast' | 'inline';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
  variant = 'toast',
}) => {
  if (variant === 'toast') {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{message}</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-red-100 focus:outline-none"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <AlertCircle className="text-red-500" size={20} />
        <span className="text-red-700 text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}; 