// client/src/components/layout/Footer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.scss';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-minimal">
      <div className="footer-container">
        
        {/* TOP */}
        <div className="footer-top">
          
          {/* LEFT */}
          <div className="footer-brand">
            <h3>{t('¡Siguenos!')}</h3>
          </div>

          {/* RIGHT */}
          <div className="footer-socials">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/goldenera_wardrobe" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/525576966262"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 32 32">
                <path d="M16.04 2C8.29 2 2 8.29 2 16.04c0 2.83.83 5.54 2.41 7.85L2 30l6.3-2.35a14 14 0 007.74 2.28h.01c7.75 0 14.04-6.29 14.04-14.04S23.79 2 16.04 2z"/>
              </svg>
            </a>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>{t('Golden Era ®. Una empresa de Emiratos Árabes Unidos.')}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
