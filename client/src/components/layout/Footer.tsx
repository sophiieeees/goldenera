// client/src/components/layout/Footer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.scss';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const WHATSAPP_MESSAGE = '¡Hola! Vengo de la página web de Golden Era y me interesa comenzar mi transformación. ¿Podrían darme más información?';

  return (
    <footer className="footer-minimal">
      <div className="footer-container">
        
        {/* TOP */}
        <div className="footer-top">
          
          {/* LEFT */}
          <div className="footer-brand">
            <h3>{t('¡SÍGUENOS!')}</h3>
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
                <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5C18.55 4 20 5.45 20 7.75v8.5c0 2.3-1.45 3.75-3.75 3.75h-8.5C5.45 20 4 18.55 4 16.25v-8.5C4 5.45 5.45 4 7.75 4zm8.75 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a 
              href={`https://wa.me/525576966262?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 32 32">
                <path d="M16 3C9.37 3 4 8.37 4 15c0 2.47.73 4.78 2 6.72L4 29l7.46-1.95A11.93 11.93 0 0016 27c6.63 0 12-5.37 12-12S22.63 3 16 3z"/>
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
