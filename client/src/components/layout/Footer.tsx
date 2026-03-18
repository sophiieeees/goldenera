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

        {/* REDES */}
        <p className="footer-follow">{t('footer.followUs')}</p>

        <div className="footer-content">
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/goldenera_wardrobe"
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584..."/>
            </svg>
          </a>

          <span className="footer-divider"></span>

          {/* Whats */}
          <a 
            href="https://wa.me/525576966262"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <svg viewBox="0 0 32 32" fill="currentColor">
              <path d="M16.04 2C8.29 2..."/>
            </svg>
          </a>
        </div>

        {/* COPYRIGHT */}
        <p className="footer-rights">
          {t('footer.rights')}
        </p>

      </div>
    </footer>
  );
};

export default Footer;
