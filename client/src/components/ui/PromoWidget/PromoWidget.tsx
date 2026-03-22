import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './PromoWidget.scss';

interface PromoWidgetProps {
  isActive: boolean;
  onClose: () => void;
}

const PromoWidget: React.FC<PromoWidgetProps> = ({ isActive, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const widgetRef = useRef<HTMLDivElement>(null);

  const shouldShow = !location.pathname.includes('/gallery') && isActive;

  // Mostrar widget
  useEffect(() => {
    const closed = localStorage.getItem('promoClosed');
    if (closed === 'true') return;

    if (shouldShow && !isVisible) {
      setIsVisible(true);
      setTimeout(() => animateIn(), 1200);
    }
  }, [shouldShow]);

  // Timer
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Animación entrada
  const animateIn = () => {
    if (!widgetRef.current) return;

    gsap.fromTo(
      widgetRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
    );
  };

  // Animación salida + cierre real
  const animateOut = () => {
    if (!widgetRef.current) return;

    gsap.to(widgetRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        setIsVisible(false);
        handleClose();
      }
    });
  };

  // Cierre global
  const handleClose = () => {
    localStorage.setItem('promoClosed', 'true'); // no vuelve a aparecer
    onClose();
  };

  // Ir a paquetes
  const handleJoin = () => {
    animateOut();
    setTimeout(() => {
      navigate('/join#packages');
    }, 400);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="promo-widget" ref={widgetRef}>
      
      {!isMinimized && (
        <div className="promo-widget__content">

          <div className="promo-widget__header">
            <button onClick={() => setIsMinimized(true)}>—</button>
            <button onClick={animateOut}>×</button>
          </div>

          <div className="promo-widget__body">

            <div className="promo-widget__badge">
              <span>50% OFF</span>
            </div>

            <div className="promo-widget__title">
              Acceso exclusivo
            </div>

            <div className="promo-widget__timer">
              {formatTime(timeLeft)}
            </div>

            <button className="promo-widget__cta" onClick={handleJoin}>
              Ver paquetes
            </button>

            <div className="promo-widget__urgency">
              ● 7 lugares disponibles
            </div>

          </div>
        </div>
      )}

      {isMinimized && (
        <div className="promo-widget__min" onClick={() => setIsMinimized(false)}>
          <span>50% OFF</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      )}

    </div>
  );
};

export default PromoWidget;
