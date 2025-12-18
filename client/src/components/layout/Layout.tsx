import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppWidget from "../ui/WhatsAppWidget";
import PromoWidget from "../ui/PromoWidget/PromoWidget";
import "../../styles/layout.scss";

const Layout: React.FC = () => {
  const [showPromoWidget, setShowPromoWidget] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Mostrar widget después de navegar, pero no inmediatamente
    if (!location.pathname.includes('/gallery')) {
      const timer = setTimeout(() => {
        // Verificar si ya se cerró hoy
        const lastClosed = localStorage.getItem('promoWidgetClosed');
        const today = new Date().toDateString();
        
        if (lastClosed !== today) {
          setShowPromoWidget(true);
        }
      }, 5000); // Aparece después de 5 segundos

      return () => clearTimeout(timer);
    } else {
      setShowPromoWidget(false);
    }
  }, [location.pathname]);

  const handleClosePromoWidget = () => {
    setShowPromoWidget(false);
    // Recordar que se cerró hoy
    localStorage.setItem('promoWidgetClosed', new Date().toDateString());
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
      <PromoWidget 
        isActive={showPromoWidget}
        onClose={handleClosePromoWidget}
      />
    </div>
  );
};

export default Layout;