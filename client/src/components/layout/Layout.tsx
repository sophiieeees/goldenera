import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PromoWidget from "../ui/PromoWidget/PromoWidget";
import ChatbotWidget from "../ui/ChatbotWidget";
import "../../styles/layout.scss";

const Layout: React.FC = () => {
  const [showPromoWidget, setShowPromoWidget] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes('/gallery')) {
      const timer = setTimeout(() => {

        const lastClosed = localStorage.getItem('promoWidgetClosed');

        if (lastClosed) {
          const diff = Date.now() - parseInt(lastClosed);

          if (diff < 1 * 60 * 1000) {
            return;
          }
        }

        setShowPromoWidget(true);

      }, 5000); 

      return () => clearTimeout(timer);
    } else {
      setShowPromoWidget(false);
    }
  }, [location.pathname]);

  const handleClosePromoWidget = () => {
    setShowPromoWidget(false);

    localStorage.setItem('promoWidgetClosed', Date.now().toString());
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <PromoWidget 
        isActive={showPromoWidget}
        onClose={handleClosePromoWidget}
      />
    </div>
  );
};

export default Layout;
