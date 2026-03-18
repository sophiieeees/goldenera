import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.scss';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-minimal">
      <div className="footer-container">

        {/* DESCRIPCIÓN */}
        <p className="footer-description">
          {t('footer.description')}
        </p>

        {/* SÍGUENOS */}
        <p className="footer-follow">
          ✦ {t('footer.followUs')} ✦
        </p>

        {/* ICONOS (LOS TUYOS, NO LOS TOQUÉ) */}
        <div className="footer-content">
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/goldenera_wardrobe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Instagram Golden Era"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584..."/>
            </svg>
          </a>

          <span className="footer-divider"></span>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/525576966262"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="WhatsApp Golden Era"
          >
            <svg viewBox="0 0 32 32" fill="currentColor">
              <path d="M16.04 2C8.29 2..."/>
            </svg>
          </a>

        </div>

        {/* DERECHOS */}
        <p className="footer-rights">
          {t('footer.rights')}
        </p>

      </div>
    </footer>
  );
};

export default Footer;
