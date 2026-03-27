import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../ui/ChatbotWidget.scss';

const CHATBOT_CUSTOMER_SERVICE = '694301ad2f5df596853d1c35';
const CHATBOT_TRAINING = '69419ad75d0d22e16b26141c';

const ChatbotWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChatTooltip, setShowChatTooltip] = useState(false);
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
      gsap.fromTo(
        '.chatbot-widget',
        { scale: 0, opacity: 0, rotate: -180 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [isVisible, shouldShow]);

  // ✅ CLEANUP SEGURO
  const cleanupVoiceflow = useCallback(() => {
    const existingScript = document.getElementById('voiceflow-script');
    if (existingScript) existingScript.remove();

    if (window.voiceflow) {
      delete (window as any).voiceflow;
    }
  }, []);

  const loadVoiceflowChatbot = useCallback(
    (projectID: string) => {
      setIsLoading(true);
      setShowModal(false);

      cleanupVoiceflow();

      setTimeout(() => {
        const script = document.createElement('script');
        script.id = 'voiceflow-script';
        script.type = 'text/javascript';
        script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';

        script.onload = () => {
          console.log('Voiceflow script loaded:', projectID);

          if (window.voiceflow?.chat) {
            window.voiceflow.chat
              .load({
                verify: { projectID },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production',
              })
              .then(() => {
                console.log('Chat cargado');
                setIsLoading(false);

                // ✅ FIX AQUÍ (TypeScript safe)
                window.voiceflow?.chat?.open();
              })
              .catch((err: any) => {
                console.error('Error cargando chat:', err);
                setIsLoading(false);
              });
          } else {
            console.error('Voiceflow no disponible');
            setIsLoading(false);
          }
        };

        script.onerror = (err) => {
          console.error('Error cargando script:', err);
          setIsLoading(false);
        };

        document.body.appendChild(script);
      }, 100);
    },
    [cleanupVoiceflow]
  );

  const handleChatWidgetClick = () => {
    setShowModal(true);
    setShowChatTooltip(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOptionClick = (option: 'customer_service' | 'training') => {
    const projectID =
      option === 'customer_service'
        ? CHATBOT_CUSTOMER_SERVICE
        : CHATBOT_TRAINING;

    loadVoiceflowChatbot(projectID);
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <>
      <div className="chatbot-widget-container">
        <div
          className="chatbot-widget"
          onClick={handleChatWidgetClick}
          onMouseEnter={() => !showModal && setShowChatTooltip(true)}
          onMouseLeave={() => setShowChatTooltip(false)}
        >
          <div className="chatbot-widget__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
            </svg>
          </div>

          {showChatTooltip && !showModal && (
            <div className="chatbot-widget__tooltip">
              <span>Asistente AI</span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="chatbot-modal-overlay" onClick={handleCloseModal}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="chatbot-modal__close" onClick={handleCloseModal}>
              ✕
            </button>

            <h3>¿En qué podemos ayudarte?</h3>
            <p>Selecciona el tipo de asistencia</p>

            <button
              onClick={() => handleOptionClick('customer_service')}
              disabled={isLoading}
            >
              Dudas y Soporte
            </button>

            <button
              onClick={() => handleOptionClick('training')}
              disabled={isLoading}
            >
              Metas y Entrenamiento
            </button>

            {isLoading && <p>Cargando asistente...</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
