import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MerchProducts from '../../components/Merch/MerchProducts';
import useMetaPixel from '../../hooks/useMetaPixel';
import './MerchPage.scss';

gsap.registerPlugin(ScrollTrigger);

const MerchPage: React.FC = () => {
  const { trackPageView } = useMetaPixel();

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Track page view con Meta Pixel
    trackPageView();

    // Animación de entrada de la página
    const ctx = gsap.context(() => {
      // Fade in de toda la página
      gsap.fromTo('.merch-page',
        { 
          opacity: 0,
          y: 20 
        },
        { 
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out' 
        }
      );

      // Animación del hero si existe
      gsap.fromTo('.merch-hero',
        {
          opacity: 0,
          scale: 0.95
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: 0.3,
          ease: 'power2.out'
        }
      );

      // Parallax effect en el background
      gsap.to('.merch-bg-pattern', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.merch-page',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    return () => ctx.revert();
  }, [trackPageView]);

  return (
    <div className="merch-page">
      {/* Background decorativo */}
      <div className="merch-bg-pattern" />
      
      {/* Hero Section Opcional */}
      <section className="merch-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">OFFICIAL</span>
            <span className="title-line golden">GOLDEN ERA</span>
            <span className="title-line">MERCHANDISE</span>
          </h1>
          <p className="hero-subtitle">
            Wear Your Ambition. Represent Excellence.
          </p>
          <div className="hero-badges">
            <span className="badge">LIMITED EDITION</span>
            <span className="badge">PREMIUM QUALITY</span>
            <span className="badge">EXCLUSIVE DESIGNS</span>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">EXPLORE</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Productos de Merch */}
      <MerchProducts />

      {/* Footer Section */}
      <section className="merch-footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <h3>CALIDAD PREMIUM</h3>
            <p>100% algodón orgánico de alta calidad</p>
            <p>Diseños exclusivos de edición limitada</p>
          </div>
          <div className="footer-column">
            <h3>ENVÍO RÁPIDO</h3>
            <p>Envío gratis en pedidos superiores a $1,500</p>
            <p>Entrega en 5-7 días hábiles</p>
          </div>
          <div className="footer-column">
            <h3>GARANTÍA</h3>
            <p>Satisfacción garantizada</p>
            <p>Cambios y devoluciones sin complicaciones</p>
          </div>
        </div>
        
        {/* Call to Action Final */}
        <div className="final-cta">
          <h2>JOIN THE ELITE</h2>
          <p>Únete a miles de guerreros que ya visten Golden Era</p>
        </div>
      </section>
    </div>
  );
};

export default MerchPage;