import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import Button from '../components/Button';
import Card from '../components/Card';
import BackButton from '../components/BackButton';
import ProcessingAnimation from '../components/ProcessingAnimation';
import ProgressRing from '../components/ProgressRing';
import CopyButton from '../components/CopyButton';
import { Download, Key } from 'lucide-react';

interface EncryptPageProps {
  onBack: () => void;
}

const EncryptPage: React.FC<EncryptPageProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [encryptionResult, setEncryptionResult] = useState<{
    fileContent: string;
    key: string;
    filename: string;
  } | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setProgress(0);
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

  const handleEncrypt = async () => {
    if (!file) return;

    setIsLoading(true);
    const progressInterval = simulateProgress();
    
    try {
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Content = reader.result?.toString().split(',')[1];
        
        const response = await fetch('https://dygqvheyj2.execute-api.us-east-1.amazonaws.com/prod/encrypt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filename: file.name,
            fileContent: base64Content
          })
        });

        const result = await response.json();
        
        if (result && result.fileContent && result.key) {
          setProgress(100);
          setTimeout(() => {
            setEncryptionResult({
              fileContent: result.fileContent,
              key: result.key,
              filename: result.filename || 'encrypted.txt'
            });
            setIsLoading(false);
          }, 500);
        }
        
        clearInterval(progressInterval);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Encryption error:', error);
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">File Encryption</h2>
          <BackButton onClick={onBack} />
        </div>

        {!encryptionResult ? (
          <>
            {!isLoading ? (
              <>
                <div className="animate-fade-in">
                  <FileUploader 
                    onFileSelect={handleFileSelect} 
                    accept=".txt" 
                    label="Upload a text file to encrypt" 
                  />
                </div>
                
                <div className="mt-6 animate-fade-in">
                  <Button 
                    onClick={handleEncrypt} 
                    color="blue" 
                    disabled={!file}
                    fullWidth
                  >
                    Encrypt File
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <ProcessingAnimation type="encrypt" />
                
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6 animate-scale">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-green-800 mb-2">Encryption Successful</h3>
              <p className="text-green-700">Your file has been encrypted successfully.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `data:text/plain;base64,${encryptionResult.fileContent}`;
                  link.download = encryptionResult.filename;
                  link.click();
                }} 
                color="blue"
                icon={<Download className="h-5 w-5" />}
                fullWidth
              >
                Download Encrypted File
              </Button>
              
              <Button 
                onClick={() => {
                  const blob = new Blob([encryptionResult.key], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'encryption-key.txt';
                  link.click();
                  URL.revokeObjectURL(url);
                }} 
                color="purple"
                icon={<Key className="h-5 w-5" />}
                fullWidth
              >
                Download Key File
              </Button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-yellow-800">Your Encryption Key</h3>
                <CopyButton text={encryptionResult.key} />
              </div>
              <p className="text-yellow-700 mb-2">Save this key securely. You'll need it to decrypt your file.</p>
              <div className="bg-white p-3 border border-yellow-300 rounded font-mono text-gray-700 break-all">
                {encryptionResult.key}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EncryptPage;