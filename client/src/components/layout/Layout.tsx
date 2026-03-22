import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PromoWidget from "../ui/PromoWidget/PromoWidget";
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

          // ⏱️ TIEMPO PARA QUE VUELVA A APARECER (10 min)
          if (diff < 10 * 60 * 1000) {
            return;
          }
        }

        setShowPromoWidget(true);

      }, 5000); // aparece después de 5s

      return () => clearTimeout(timer);
    } else {
      setShowPromoWidget(false);
    }
  }, [location.pathname]);

  const handleClosePromoWidget = () => {
    setShowPromoWidget(false);

    // 🔥 guardamos timestamp (NO fecha)
    localStorage.setItem('promoWidgetClosed', Date.now().toString());
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />

      <PromoWidget 
        isActive={showPromoWidget}
        onClose={handleClosePromoWidget}
      />
    </div>
  );
};

export default Layout;
