import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, accept, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-10 text-center transition-all 
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-14 w-14 text-gray-400 mb-4" />
      <p className="text-gray-600 mb-4">{label}</p>
      
      {fileName ? (
        <p className="text-indigo-600 font-medium mb-4">Selected: {fileName}</p>
      ) : null}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileInput}
      />
      
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Select File
      </button>
    </div>
  );
};

export default FileUploader;