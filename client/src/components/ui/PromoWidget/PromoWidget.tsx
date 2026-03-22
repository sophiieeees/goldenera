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
  const contentRef = useRef<HTMLDivElement>(null);
  const minimizedRef = useRef<HTMLDivElement>(null);

  const shouldShow = !location.pathname.includes('/gallery') && isActive;

  useEffect(() => {
    if (shouldShow && !isVisible) {
      setIsVisible(true);
      setTimeout(() => animateIn(), 1200);
    } else if (!shouldShow && isVisible) {
      animateOut();
    }
  }, [shouldShow]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onClose]);

  const animateIn = () => {
    if (!widgetRef.current) return;

    gsap.fromTo(
      widgetRef.current,
      { x: 300, opacity: 0, scale: 0.85 },
      { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
    );
  };

  const animateOut = () => {
    if (!widgetRef.current) return;

    gsap.to(widgetRef.current, {
      x: 300,
      opacity: 0,
      scale: 0.85,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => setIsVisible(false)
    });
  };

  const handleClose = () => {
    animateOut();

    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleJoinNow = () => {
    animateOut();

    setTimeout(() => {
      navigate('/package');
    }, 400);
  };

  const handleMinimize = () => {
    if (!contentRef.current || !minimizedRef.current) return;

    if (!isMinimized) {
      gsap.to(contentRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.25
      });

      gsap.to(minimizedRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        delay: 0.15
      });
    } else {
      gsap.to(minimizedRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.25
      });

      gsap.to(contentRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        delay: 0.15
      });
    }

    setIsMinimized(!isMinimized);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="promo-widget" ref={widgetRef}>
      {/* HEADER */}
      <div className="promo-widget__header">
        <button onClick={handleMinimize}>—</button>
        <button onClick={handleClose}>✕</button>
      </div>

      {/* CONTENT */}
      <div
        className="promo-widget__content"
        ref={contentRef}
        style={{ display: isMinimized ? 'none' : 'block' }}
      >
        <div className="promo-widget__badge">50% OFF</div>

        <h3>Oferta exclusiva</h3>
        <p>Comienza tu transformación hoy</p>

        <div className="promo-widget__timer">
          {formatTime(timeLeft)}
        </div>

        <button className="promo-widget__cta" onClick={handleJoinNow}>
          Comenzar
        </button>

        <span className="promo-widget__spots">
          ¡Quedan pocos lugares disponibles!
        </span>
      </div>

      {/* MINIMIZED */}
      <div
        className="promo-widget__minimized"
        ref={minimizedRef}
        onClick={handleMinimize}
        style={{ display: isMinimized ? 'flex' : 'none' }}
      >
        <span>50% OFF</span>
        <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default PromoWidget;
