import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Layout from './components/layout/Layout';
import LandingPage from './components/ui/Landing/LandingPage';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import JoinClub from './pages/JoinClub/JoinClub';
import Gallery from './pages/Gallery/Gallery';
import './styles/global.scss';
import MerchPage from './pages/Merch/MerchPage';
import ChatbotWidget from './components/ChatbotWidget.tsx';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

function App() {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Verificar si el usuario ya vio el landing
    const hasSeenLanding = sessionStorage.getItem('hasSeenLanding');
    if (hasSeenLanding) {
      setShowLanding(false);
    }
  }, []);

  return (
    <LanguageProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            <Route path="/" element={showLanding ? <LandingPage /> : <Navigate to="/home" />} />
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/join" element={<JoinClub />} />
              <Route path="/merch" element={<MerchPage />} />
              <Route path="/gallery" element={<Gallery />} />
            </Route>
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Router>
      </Elements>
    </LanguageProvider>
  );
}

export default App;
