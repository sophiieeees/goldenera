// client/src/components/ui/Coach/Coach.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { images } from '../../../assets';
import './Coach.scss';

gsap.registerPlugin(ScrollTrigger);

const Coach: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const title = titleRef.current;
    const quote = quoteRef.current;

    if (!section || !image || !content || !title || !quote) return;

    // Timeline principal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Animación del título con efecto de poder
    tl.fromTo(title,
      {
        scale: 0.5,
        opacity: 0,
        rotationX: 90
      },
      {
        scale: 1,
        opacity: 1,
        rotationX: 0,
        duration: 1.2,
        ease: "power4.out"
      }
    );

    // Animación de la imagen con efecto de entrada potente
    tl.fromTo(image,
      {
        scale: 1.3,
        opacity: 0,
        filter: "blur(10px)"
      },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power3.out"
      },
      "-=0.8"
    );

    // Efecto de brillo en la imagen
    tl.to(image, {
      duration: 2,
      ease: "power2.inOut",
      "--glow": "1",
      repeat: -1,
      yoyo: true
    }, "-=1");

    // Animación del contenido
    tl.fromTo(content.children,
      {
        y: 30,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      },
      "-=0.5"
    );

    // Animación especial para la quote
    tl.fromTo(quote,
      {
        scale: 0.8,
        opacity: 0,
        x: -50
      },
      {
        scale: 1,
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "back.out(1.7)"
      },
      "-=0.3"
    );

    // Efecto parallax en la imagen
    gsap.to(image, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

    // Efecto hover en la imagen para desktop
    const handleMouseMove = (e: MouseEvent) => {
      const rect = image.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(image, {
        rotationY: x * 10,
        rotationX: -y * 10,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    if (window.innerWidth > 768) {
      image.addEventListener('mousemove', handleMouseMove);
      image.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (window.innerWidth > 768) {
        image.removeEventListener('mousemove', handleMouseMove);
        image.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="coach-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title" ref={titleRef}>
          {t('home.coach.title')}
        </h2>
        
        <div className="coach-container">
          <div className="coach-image" ref={imageRef}>
            <div className="image-glow"></div>
            <img src={images.coach} alt={t('home.coach.name')} />
            <div className="power-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          <div className="coach-info" ref={contentRef}>
            <h3 className="coach-name">{t('home.coach.name')}</h3>
            
            <div className="coach-quote" ref={quoteRef}>
              <div className="quote-icon"></div>
              <blockquote>
                {t('home.coach.quote')}
              </blockquote>
            </div>
            
            <p className="coach-description">
              {t('home.coach.description')}
            </p>
            
            <a 
              href="https://www.instagram.com/mateo.haces/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="coach-instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" fill="currentColor"/>
              </svg>
              <span>{t('home.coach.instagram')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coach;
