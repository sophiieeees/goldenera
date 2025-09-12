import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { logos } from '../../assets';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Cerrar menú cuando cambie la ruta
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    // Bloquear scroll cuando el menú esté abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Animación del menú
    if (isOpen) {
      gsap.fromTo('.mobile-menu', 
        { x: '100%' },
        { x: '0%', duration: 0.3, ease: 'power2.out' }
      );
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Cerrar menú con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img src={logos.goldenEraAmarillo} alt="Golden Era" />
          </Link>

          <div className="navbar-desktop">
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
              {t('nav.home')}
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              {t('nav.about')}
            </Link>
            <Link to="/join" className={location.pathname === '/join' ? 'active' : ''}>
              {t('nav.join')}
            </Link>
               {/* AGREGAR LINK DE MERCH */}
            <Link to="/merch" className={location.pathname === '/merch' ? 'active' : ''}>
              Merch
            </Link>
            <Link to="/gallery" className={location.pathname === '/gallery' ? 'active' : ''}>
              {t('nav.gallery')}
            </Link>
         
            <button className="language-toggle" onClick={toggleLanguage}>
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>
          </div>

          <div className="navbar-mobile-actions">
            <button className="language-toggle-mobile" onClick={toggleLanguage}>
              {i18n.language === 'es' ? 'EN' : 'ES'}
            </button>
            <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
              <span className={`bar ${isOpen ? 'active' : ''}`}></span>
              <span className={`bar ${isOpen ? 'active' : ''}`}></span>
              <span className={`bar ${isOpen ? 'active' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={closeMenu}></div>
          <div className="mobile-menu">
            <button className="close-menu" onClick={closeMenu} aria-label="Close menu">
              <span></span>
              <span></span>
            </button>
            <div className="mobile-menu-content">
              <Link to="/home" onClick={closeMenu} className={location.pathname === '/home' ? 'active' : ''}>
                {t('nav.home')}
              </Link>
              <Link to="/about" onClick={closeMenu} className={location.pathname === '/about' ? 'active' : ''}>
                {t('nav.about')}
              </Link>
              <Link to="/join" onClick={closeMenu} className={location.pathname === '/join' ? 'active' : ''}>
                {t('nav.join')}
              </Link>
               {/* AGREGAR LINK DE MERCH EN MOBILE */}
              <Link to="/merch" onClick={closeMenu} className={location.pathname === '/merch' ? 'active' : ''}>
                Merch
              </Link>
              <Link to="/gallery" onClick={closeMenu} className={location.pathname === '/gallery' ? 'active' : ''}>
                {t('nav.gallery')}
              </Link>
             
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;