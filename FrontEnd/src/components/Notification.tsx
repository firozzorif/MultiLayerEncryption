import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface NotificationProps {
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ title, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full animate-slide-up">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="bg-green-100 rounded-full p-2">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
        <button
          type="button"
          className="ml-4 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 hover:text-gray-500"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;