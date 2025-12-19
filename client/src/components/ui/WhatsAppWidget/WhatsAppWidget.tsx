import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './WhatsAppWidget.scss';

const CHATBOT_CUSTOMER_SERVICE = '694301ad2f5df596853d1c35';
const CHATBOT_TRAINING = '69419ad75d0d22e16b26141c';
const WHATSAPP_NUMBER = '5215576966262';
const WHATSAPP_MESSAGE = '¡Hola! Me gustaría obtener más información sobre Golden Era';

const WhatsAppWidget: React.FC = () => {
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

      // Use insertBefore pattern like Voiceflow recommends
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

      {/* Botón de WhatsApp (derecha) */}
      <div className="whatsapp-widget-container">
        <div
          className="whatsapp-button"
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setShowWhatsAppTooltip(true)}
          onMouseLeave={() => setShowWhatsAppTooltip(false)}
        >
          <div className="whatsapp-button__icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 28.176 1.116 32.088 3.048 35.472L0 48L12.816 45.024C16.08 46.812 19.896 47.832 24 47.832V48Z" fill="#25D366"/>
              <path d="M35.52 12.48C32.232 9.144 27.816 7.2 23.04 7.2C13.176 7.2 5.256 15.12 5.256 24.984C5.256 28.272 6.192 31.44 7.848 34.2L5.04 42.96L14.064 40.224C16.728 41.736 19.824 42.552 23.04 42.552C32.904 42.552 40.824 34.632 40.824 24.768C40.608 20.208 38.808 15.816 35.52 12.48ZM23.04 39.264C20.256 39.264 17.592 38.568 15.24 37.176L14.664 36.84L8.784 38.28L10.224 32.616L9.864 32.04C8.328 29.568 7.56 26.664 7.56 23.76C7.56 16.176 13.968 10.056 21.768 10.056C25.416 10.056 28.848 11.496 31.512 14.04C34.176 16.584 35.736 20.016 35.736 23.76C36.024 31.56 29.616 39.264 23.04 39.264ZM29.616 27.408C29.184 27.192 27.096 26.16 26.664 25.944C26.232 25.728 25.944 25.728 25.656 26.16C25.368 26.592 24.504 27.624 24.216 27.912C23.928 28.2 23.712 28.2 23.28 27.984C22.848 27.768 21.384 27.336 19.656 25.728C18.264 24.48 17.4 22.896 17.184 22.464C16.968 22.032 17.184 21.816 17.4 21.6C17.616 21.384 17.832 21.096 18.048 20.808C18.264 20.52 18.336 20.376 18.48 20.088C18.624 19.8 18.552 19.512 18.48 19.296C18.408 19.08 17.472 17.064 17.112 16.2C16.752 15.336 16.392 15.48 16.104 15.48C15.816 15.48 15.528 15.48 15.24 15.48C14.952 15.48 14.52 15.552 14.088 15.984C13.656 16.416 12.576 17.448 12.576 19.464C12.576 21.48 14.088 23.424 14.304 23.712C14.52 24 17.4 28.344 23.4 30.288C24.504 30.72 25.368 30.936 26.04 31.152C27.144 31.44 28.104 31.368 28.896 31.296C29.76 31.152 31.392 30.288 31.752 29.352C32.112 28.416 32.112 27.624 32.04 27.48C31.824 27.624 31.464 27.624 29.616 27.408Z" fill="white"/>
            </svg>
          </div>

          {showWhatsAppTooltip && (
            <div className="whatsapp-button__tooltip">
              <span>WhatsApp</span>
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

export default WhatsAppWidget;
