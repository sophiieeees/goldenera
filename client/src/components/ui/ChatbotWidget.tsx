import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../ui/ChatbotWidget.scss';

const WHATSAPP_NUMBER = '5215576966262';

const ChatbotWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<'main' | 'support' | 'training'>('main');

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
    }
  }, [isVisible, shouldShow]);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleChatWidgetClick = () => {
    setShowModal(true);
    setStep('main');
    setShowChatTooltip(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <>
      {/* BOTÓN */}
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

      {/* MODAL */}
      {showModal && (
        <div className="chatbot-modal-overlay" onClick={handleCloseModal}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>

            <button className="chatbot-modal__close" onClick={handleCloseModal}>
              ✕
            </button>

            {/* STEP 1 */}
            {step === 'main' && (
              <>
                <h3 className="chatbot-modal__title">GoldenEra Assistant</h3>
                <p className="chatbot-modal__subtitle">
                  ¿En qué te gustaría mejorar hoy?
                </p>

                <div className="chatbot-modal__options">
                  <button
                    className="chatbot-option"
                    onClick={() => setStep('support')}
                  >
                     Servicio al cliente
                  </button>

                  <button
                    className="chatbot-option"
                    onClick={() => setStep('training')}
                  >
                     Metas y entrenamiento
                  </button>
                </div>
              </>
            )}

            {/* SOPORTE */}
            {step === 'support' && (
              <>
                <h3>Soporte</h3>
                <p>Selecciona una opción:</p>

                <div className="chatbot-modal__options">
                  <button onClick={() =>
                    openWhatsApp('Hola, quiero información sobre PRECIOS en GoldenEra')
                  }>
                    Precios
                  </button>

                  <button onClick={() =>
                    openWhatsApp('Hola, ¿dónde se ubican?')
                  }>
                     Ubicación
                  </button>

                  <button onClick={() =>
                    openWhatsApp('Hola, necesito ayuda con mi compra')
                  }>
                     Soporte de compra
                  </button>
                </div>

                <button onClick={() => setStep('main')}>
                  ← Volver
                </button>
              </>
            )}

            {/* ENTRENAMIENTO */}
            {step === 'training' && (
              <>
                <h3>Metas y entrenamiento</h3>
                <p>Elige lo que buscas:</p>

                <div className="chatbot-modal__options">
                  <button onClick={() =>
                    openWhatsApp('Quiero mejorar mi físico, recomiéndame un plan')
                  }>
                     Recomiéndame un plan
                  </button>

                  <button onClick={() =>
                    openWhatsApp('Quiero información sobre los paquetes de entrenamiento')
                  }>
                     Ver paquetes
                  </button>

                  <button onClick={() =>
                    openWhatsApp('Quiero empezar mi transformación física')
                  }>
                     Empezar transformación
                  </button>
                </div>

                <button onClick={() => setStep('main')}>
                  ← Volver
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
