import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './WhatsAppWidget.scss';

const CHATBOT_CUSTOMER_SERVICE = '694301ad2f5df596853d1c35';
const CHATBOT_TRAINING = '69419ad75d0d22e16b26141c';

const WhatsAppWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const shouldShow = !location.pathname.includes('/gallery');

  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setShowTooltip(true), 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  useEffect(() => {
    if (isVisible && shouldShow) {
      gsap.fromTo('.whatsapp-widget',
        { scale: 0, opacity: 0, rotate: -180 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );

      gsap.to('.whatsapp-widget__icon', {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, [isVisible, shouldShow]);

  const loadVoiceflowChatbot = useCallback((projectID: string) => {
    setIsLoading(true);

    // Remover script anterior si existe
    const existingScript = document.getElementById('voiceflow-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Destruir chatbot anterior si existe
    if (window.voiceflow?.chat?.destroy) {
      try {
        window.voiceflow.chat.destroy();
      } catch (e) {
        console.log('No previous chatbot to destroy');
      }
    }

    const script = document.createElement('script');
    script.id = 'voiceflow-script';
    script.type = 'text/javascript';
    script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
    script.onload = () => {
      window.voiceflow.chat.load({
        verify: { projectID },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        voice: { url: 'https://runtime-api.voiceflow.com' }
      });
      setIsLoading(false);
      setShowModal(false);

      // Abrir el chat automáticamente después de cargar
      setTimeout(() => {
        if (window.voiceflow?.chat?.open) {
          window.voiceflow.chat.open();
        }
      }, 500);
    };

    document.body.appendChild(script);

    // Tracking
    if (window.gtag) {
      window.gtag('event', 'chatbot_open', {
        event_category: 'engagement',
        event_label: projectID === CHATBOT_CUSTOMER_SERVICE ? 'customer_service' : 'training'
      });
    }
  }, []);

  const handleWidgetClick = () => {
    setShowModal(true);
    setShowTooltip(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOptionClick = (option: 'customer_service' | 'training') => {
    const projectID = option === 'customer_service' ? CHATBOT_CUSTOMER_SERVICE : CHATBOT_TRAINING;
    loadVoiceflowChatbot(projectID);
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <div className="whatsapp-widget-container">
      <div
        className="whatsapp-widget"
        onClick={handleWidgetClick}
        onMouseEnter={() => !showModal && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="whatsapp-widget__icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
            <path d="M7 9H17V11H7V9Z" fill="white"/>
            <path d="M7 12H14V14H7V12Z" fill="white"/>
            <path d="M7 6H17V8H7V6Z" fill="white"/>
          </svg>
        </div>

        {showTooltip && !showModal && (
          <div className="whatsapp-widget__tooltip">
            <span>¡Chatea con nosotros!</span>
          </div>
        )}
      </div>

      {/* Modal de opciones */}
      {showModal && (
        <div className="chatbot-modal-overlay" onClick={handleCloseModal}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="chatbot-modal__close" onClick={handleCloseModal}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <h3 className="chatbot-modal__title">¿En qué podemos ayudarte?</h3>
            <p className="chatbot-modal__subtitle">Selecciona el tipo de asistencia que necesitas</p>

            <div className="chatbot-modal__options">
              <button
                className="chatbot-option chatbot-option--support"
                onClick={() => handleOptionClick('customer_service')}
                disabled={isLoading}
              >
                <div className="chatbot-option__icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="chatbot-option__content">
                  <span className="chatbot-option__title">Dudas y Soporte</span>
                  <span className="chatbot-option__desc">Preguntas sobre precios, pagos, programa</span>
                </div>
              </button>

              <button
                className="chatbot-option chatbot-option--training"
                onClick={() => handleOptionClick('training')}
                disabled={isLoading}
              >
                <div className="chatbot-option__icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="chatbot-option__content">
                  <span className="chatbot-option__title">Metas y Entrenamiento</span>
                  <span className="chatbot-option__desc">Platiquemos sobre tu transformación</span>
                </div>
              </button>
            </div>

            {isLoading && (
              <div className="chatbot-modal__loading">
                <div className="spinner"></div>
                <span>Cargando asistente...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppWidget;
