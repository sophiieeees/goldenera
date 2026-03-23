// client/src/pages/About/About.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './About.scss';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      contentRefs.current.forEach((ref) => {
        gsap.fromTo(ref,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  const handleCTAClick = () => {
    navigate('/join');
  };

  return (
    <div className="about-page v2" ref={sectionRef}>

      {/* HERO */}
      <section className="hero-v2">
        <div className="overlay" />
        <img
          src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1920"
          alt="Elite Physique"
        />

        <div className="hero-content">
          <h1>
            GOLDEN ERA
            <span> LOOKSMAX</span>
          </h1>

          <p>
            No es fitness. Es dominación estética, mental y biológica.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="section mission" ref={addToRefs}>
        <div className="container">
          <h2>NUESTRA MISIÓN</h2>

          <p>
            En Golden Era no aceptamos la mediocridad. Transformamos individuos
            en máquinas de alto rendimiento físico, mental y estético.
            Aquí no vienes a "mejorar un poco", vienes a construir una versión
            que domina en todas las áreas.
          </p>
        </div>
      </section>

      {/* SYSTEM */}
      <section className="section system dark" ref={addToRefs}>
        <div className="container">

          <h2>THE SYSTEM</h2>

          <div className="system-grid">

            <div className="system-card">
              <span>01</span>
              <h3>Diagnose</h3>
              <p>
                Análisis completo de físico, cara, hábitos y biología.
              </p>
            </div>

            <div className="system-card">
              <span>02</span>
              <h3>Execute</h3>
              <p>
                Protocolos diarios: entrenamiento, nutrición y biohacking.
              </p>
            </div>

            <div className="system-card">
              <span>03</span>
              <h3>Compound</h3>
              <p>
                Ajustes estratégicos para maximizar resultados exponenciales.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="section vision" ref={addToRefs}>
        <div className="container">

          <h2>NUESTRA VISIÓN</h2>

          <p>
            Crear individuos que proyecten poder, disciplina y estatus
            en cualquier entorno.
          </p>

          <div className="stats">
            <div>
              <h3>50</h3>
              <span>Elite anual</span>
            </div>

            <div>
              <h3>0%</h3>
              <span>Mediocridad</span>
            </div>

            <div>
              <h3>100%</h3>
              <span>Transformación</span>
            </div>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="section values" ref={addToRefs}>
        <div className="container">

          <h2>NUESTROS VALORES</h2>

          <div className="values-grid">

            <div className="value">
              <h3>Disciplina</h3>
              <p>Sin disciplina no existe transformación real.</p>
            </div>

            <div className="value">
              <h3>Excelencia</h3>
              <p>Optimización constante en cada aspecto.</p>
            </div>

            <div className="value">
              <h3>Transformación</h3>
              <p>Cambio físico, mental y estético total.</p>
            </div>

            <div className="value">
              <h3>Liderazgo</h3>
              <p>Dominio personal antes que externo.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta dark" ref={addToRefs}>
        <div className="container">

          <h2>
            Acceso limitado.
          </h2>

          <p>
            Solo un número reducido entra cada año.
            Si estás listo para dejar de ser promedio, este es tu momento.
          </p>

          <button onClick={handleCTAClick}>
            Aplicar ahora
          </button>

        </div>
      </section>

    </div>
  );
};

export default About;
