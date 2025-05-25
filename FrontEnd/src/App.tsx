import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EncryptPage from './pages/EncryptPage';
import DecryptPage from './pages/DecryptPage';
import Notification from './components/Notification';

// App view types
type AppView = 'home' | 'encrypt' | 'decrypt';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [notification, setNotification] = useState<{
    isVisible: boolean;
    title: string;
    message: string;
  }>({
    isVisible: false,
    title: '',
    message: ''
  });

  const showNotification = (title: string, message: string) => {
    setNotification({
      isVisible: true,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        {currentView === 'home' && (
          <HomePage 
            onEncryptSelect={() => setCurrentView('encrypt')}
            onDecryptSelect={() => setCurrentView('decrypt')}
          />
        )}
        
        {currentView === 'encrypt' && (
          <EncryptPage 
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'decrypt' && (
          <DecryptPage 
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>
      
      <Footer />
      
      <Notification
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}

export default App;