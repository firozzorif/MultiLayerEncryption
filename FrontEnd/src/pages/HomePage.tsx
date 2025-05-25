import React from 'react';
import { LockIcon, UnlockIcon } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

interface HomePageProps {
  onEncryptSelect: () => void;
  onDecryptSelect: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEncryptSelect, onDecryptSelect }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-4">Secure File Encryption and Decryption</h2>
      <p className="text-center text-gray-600 mb-8">
        Protect your sensitive text files with strong encryption. Choose an option below to get started.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="flex flex-col items-center text-center transition-transform hover:scale-105">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <LockIcon className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Encrypt</h3>
          <p className="text-gray-600 mb-6">
            Upload a text file to encrypt. You'll receive an encrypted file and a decryption key.
          </p>
          <Button 
            onClick={onEncryptSelect} 
            color="blue"
            fullWidth
          >
            Select Encryption
          </Button>
        </Card>

        <Card className="flex flex-col items-center text-center transition-transform hover:scale-105">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <UnlockIcon className="h-10 w-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Decrypt</h3>
          <p className="text-gray-600 mb-6">
            Upload an encrypted file and provide the decryption key to retrieve the original content.
          </p>
          <Button 
            onClick={onDecryptSelect} 
            color="purple"
            fullWidth
          >
            Select Decryption
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;