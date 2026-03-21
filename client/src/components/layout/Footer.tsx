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
        <path d="M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5C18.55 4 20 5.45 20 7.75v8.5c0 2.3-1.45 3.75-3.75 3.75h-8.5C5.45 20 4 18.55 4 16.25v-8.5C4 5.45 5.45 4 7.75 4zm8.75 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
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
        <path d="M16 3C9.37 3 4 8.37 4 15c0 2.47.73 4.78 2 6.72L4 29l7.46-1.95A11.93 11.93 0 0016 27c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 21.5c-2.1 0-4.16-.57-5.96-1.65l-.42-.25-4.42 1.16 1.18-4.3-.27-.44A9.47 9.47 0 016.5 15c0-5.25 4.25-9.5 9.5-9.5s9.5 4.25 9.5 9.5-4.25 9.5-9.5 9.5zm5.2-7.1c-.28-.14-1.65-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.28-.73.9-.9 1.08-.17.19-.34.21-.62.07-.28-.14-1.2-.44-2.3-1.4-.85-.75-1.42-1.67-1.59-1.95-.17-.28-.02-.43.12-.57.12-.12.28-.31.42-.47.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.5.07-.76.35-.26.28-1 1-.98 2.44.02 1.44 1.02 2.83 1.16 3.03.14.19 2 3.05 4.85 4.28.68.3 1.2.48 1.6.61.67.21 1.28.18 1.76.11.54-.08 1.65-.67 1.88-1.31.23-.64.23-1.19.16-1.31-.07-.12-.26-.19-.54-.33z"/>
        </svg>
        </a>
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
