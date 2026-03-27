import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../ui/ChatbotWidget.scss';

const CHATBOT_CUSTOMER_SERVICE = '694301ad2f5df596853d1c35';
const CHATBOT_TRAINING = '69419ad75d0d22e16b26141c';

const ChatbotWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const shouldShow = !location.pathname.includes('/gallery');

  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setShowChatTooltip(true), 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  useEffect(() => {
    if (isVisible && shouldShow) {
      gsap.fromTo('.chatbot-widget',
        { scale: 0, opacity: 0, rotate: -180 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );

      gsap.fromTo('.whatsapp-button',
        { scale: 0, opacity: 0, rotate: 180 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
      );
    }
  }, [isVisible, shouldShow]);

  const cleanupVoiceflow = useCallback(() => {
    const existingScript = document.getElementById('voiceflow-script');
    if (existingScript) {
      existingScript.remove();
    }

    const widgetContainer = document.getElementById('voiceflow-chat');
    if (widgetContainer) {
      widgetContainer.remove();
    }

    document.querySelectorAll('[data-testid="widget-bubble"]').forEach(el => el.remove());
    document.querySelectorAll('[class*="vfrc"]').forEach(el => el.remove());

    if (window.voiceflow) {
      delete (window as any).voiceflow;
    }
  }, []);

  const loadVoiceflowChatbot = useCallback((projectID: string) => {
    setIsLoading(true);
    setShowModal(false);

    cleanupVoiceflow();

    setTimeout(() => {
      const script = document.createElement('script');
      script.id = 'voiceflow-script';
      script.type = 'text/javascript';
      script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';

      script.onload = () => {
        console.log('Voiceflow script loaded, initializing projectID:', projectID);

        if (window.voiceflow?.chat) {
          window.voiceflow.chat.load({
            verify: { projectID },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production'
          }).then(() => {
            console.log('Voiceflow chat loaded successfully');
            setIsLoading(false);
            if (window.voiceflow?.chat?.open) {
              window.voiceflow.chat.open();
            }
          }).catch((err: any) => {
            console.error('Voiceflow chat load error:', err);
            setIsLoading(false);
          });
        } else {
          console.error('Voiceflow chat object not available');
          setIsLoading(false);
        }
      };

      script.onerror = (err) => {
        setIsLoading(false);
        console.error('Error loading Voiceflow script:', err);
      };


      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.body.appendChild(script);
      }

      if (window.gtag) {
        window.gtag('event', 'chatbot_open', {
          event_category: 'engagement',
          event_label: projectID === CHATBOT_CUSTOMER_SERVICE ? 'customer_service' : 'training'
        });
      }
    }, 100);
  }, [cleanupVoiceflow]);

  const handleChatWidgetClick = () => {
    setShowModal(true);
    setShowChatTooltip(false);
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(whatsappUrl, '_blank');

    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'widget'
      });
    }
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
    <>
      {/* Botón de Chatbot (izquierda) */}
      <div className="chatbot-widget-container">
        <div
          className="chatbot-widget"
          onClick={handleChatWidgetClick}
          onMouseEnter={() => !showModal && setShowChatTooltip(true)}
          onMouseLeave={() => setShowChatTooltip(false)}
        >
          <div className="chatbot-widget__icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
              <path d="M7 9H17V11H7V9Z" fill="white"/>
              <path d="M7 12H14V14H7V12Z" fill="white"/>
              <path d="M7 6H17V8H7V6Z" fill="white"/>
            </svg>
          </div>

          {showChatTooltip && !showModal && (
            <div className="chatbot-widget__tooltip">
              <span>Asistente AI</span>
            </div>
          )}
        </div>
      </div>


      {/* Modal de opciones de chatbot */}
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
    </>
  );
};
export default ChatbotWidget;
