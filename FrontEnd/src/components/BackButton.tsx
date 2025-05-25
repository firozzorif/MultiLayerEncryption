import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-1"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
};

export default BackButton;