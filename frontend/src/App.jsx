import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SplashScreen } from './components/SplashScreen';

import { HomePage } from './pages/HomePage';
import { DonorDashboardPage } from './pages/DonorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import './assets/theme.css';

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <LanguageProvider>
      <AuthProvider>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/donor-dashboard" element={<DonorDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
