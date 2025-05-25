import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingAnimationProps {
  type: 'encrypt' | 'decrypt';
}

const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ type }) => {
  const bgColor = type === 'encrypt' ? 'bg-blue-50' : 'bg-purple-50';
  const textColor = type === 'encrypt' ? 'text-blue-600' : 'text-purple-600';
  const borderColor = type === 'encrypt' ? 'border-blue-100' : 'border-purple-100';

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-8 text-center animate-fade-in`}>
      <Loader2 className={`${textColor} h-12 w-12 mx-auto mb-4 animate-spin-slow`} />
      <h3 className={`${textColor} text-lg font-medium mb-2`}>
        {type === 'encrypt' ? 'Encrypting your file...' : 'Decrypting your file...'}
      </h3>
      <p className={`${textColor} opacity-75`}>
        Please wait while we process your file securely
      </p>
    </div>
  );
};

export default ProcessingAnimation;