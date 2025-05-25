import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-800 text-white py-6 shadow-md">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-1">SecureText Encryption</h1>
        <p className="text-indigo-100">Secure file encryption and decryption</p>
      </div>
    </header>
  );
};

export default Header;