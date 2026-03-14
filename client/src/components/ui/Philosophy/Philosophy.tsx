// client/src/components/ui/Philosophy/Philosophy.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { forgeyourLegacy } from '../../../assets/images'; // Agrega este import
import './Philosophy.scss';

gsap.registerPlugin(ScrollTrigger);

const Philosophy: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Crear contexto específico para Philosophy
    const ctx = gsap.context(() => {
      // Seleccionar solo elementos dentro de esta sección
      const legacyBlock = section.querySelector('.philosophy-legacy-block');
      const philosophyBlock = section.querySelector('.philosophy-philosophy-block');
      const ctaButton = section.querySelector('.philosophy-cta-button');

      // Timeline principal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true
        }
      });

      // Animación secuencial
      if (legacyBlock) {
        tl.fromTo(legacyBlock,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          }
        );
      }

      if (philosophyBlock) {
        tl.fromTo(philosophyBlock,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          },
          "-=0.4"
        );
      }

      if (ctaButton) {
        tl.fromTo(ctaButton,
          {
            opacity: 0,
            y: 30,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)"
          },
          "-=0.3"
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="philosophy-section" ref={sectionRef}>
      <div className="philosophy-container">
        {/* Forge Your Legacy - MODIFICADO PARA USAR IMAGEN */}
        <div className="philosophy-legacy-block">
          <img 
            src={forgeyourLegacy} 
            alt="Forge Your Legacy"
            className="philosophy-title-image"
          />
          <p className="philosophy-section-description">
            {t('home.philosophy.legacy')}
          </p>
        </div>
        
        {/* CTA Button */}
        <button className="philosophy-cta-button" aria-label="Begin your fitness journey"
          onClick={() => window.location.href = "/join"}
          >
          {t('home.philosophy.cta')}
        </button>
      </div>
    </section>
  );
};

export default Philosophy;
