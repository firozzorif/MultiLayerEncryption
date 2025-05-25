import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import Button from '../components/Button';
import Card from '../components/Card';
import BackButton from '../components/BackButton';
import ProcessingAnimation from '../components/ProcessingAnimation';
import { Download, Key, AlertCircle } from 'lucide-react';
import CopyButton from '../components/CopyButton';
import { decryptFile } from '../utils/api';

interface DecryptPageProps {
  onBack: () => void;
}

const DecryptPage: React.FC<DecryptPageProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<{
    decrypted: string;
    filename: string;
  } | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setProgress(0);
    setError(null);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
    return interval;
  };

  const handleDecrypt = async () => {
    if (!file || !key) return;

    setIsLoading(true);
    setError(null);
    const progressInterval = simulateProgress();
    
    try {
      const result = await decryptFile(file, key);
      setProgress(100);
      
      // Short delay before showing the result for a smoother UI experience
      setTimeout(() => {
        setDecryptionResult(result);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Decryption error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsLoading(false);
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">File Decryption</h2>
          <BackButton onClick={onBack} />
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 animate-fade-in">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!decryptionResult ? (
          <>
            {!isLoading ? (
              <>
                <div className="animate-fade-in">
                  <FileUploader 
                    onFileSelect={handleFileSelect} 
                    accept=".txt" 
                    label="Upload the encrypted file" 
                  />
                </div>
                
                <div className="mt-6 animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decryption Key
                  </label>
                  <div className="flex items-center">
                    <Key className="text-gray-500 mr-2" size={20} />
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Enter your decryption key"
                      className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={handleDecrypt} 
                    color="purple" 
                    disabled={!file || !key}
                    fullWidth
                  >
                    Decrypt File
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <ProcessingAnimation type="decrypt" />
                <div className="mt-4 text-center text-sm text-gray-500">
                  {progress < 100 ? 'Decrypting your file...' : 'Finalizing...'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6 animate-scale">
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-purple-800 mb-2">Decryption Successful</h3>
              <p className="text-purple-700">Your file has been decrypted successfully.</p>
            </div>
            
            <Button 
              onClick={() => {
                const blob = new Blob([decryptionResult.decrypted], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = decryptionResult.filename;
                link.click();
                URL.revokeObjectURL(url);
              }} 
              color="purple"
              icon={<Download className="h-5 w-5" />}
              fullWidth
            >
              Download Decrypted File
            </Button>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">File Preview</h3>
                <CopyButton text={decryptionResult.decrypted} />
              </div>
              <div className="bg-gray-50 p-4 border border-gray-300 rounded-md overflow-auto max-h-60 font-mono text-sm">
                {decryptionResult.decrypted}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DecryptPage;