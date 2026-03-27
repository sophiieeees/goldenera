import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../ui/ChatbotWidget.scss';

const WHATSAPP_NUMBER = '5215576966262';

type Message = {
  from: 'bot' | 'user';
  text: string;
};

const ChatbotWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);

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
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6 }
      );
    }
  }, [isVisible, shouldShow]);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const startChat = () => {
    setMessages([
      {
        from: 'bot',
        text: 'Hola, soy el asistente de GoldenEra 👋 ¿En qué te puedo ayudar?',
      },
    ]);

    setOptions([
      '💬 Servicio al cliente',
      '🔥 Metas y entrenamiento',
    ]);
  };

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [...prev, { from: 'user', text: option }]);

    if (option.includes('Servicio')) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: 'Claro 😊 ¿Qué te gustaría saber?' },
        ]);
        setOptions(['💰 Precios', '📍 Ubicación', '🧾 Soporte']);
      }, 500);
    }

    else if (option.includes('Metas')) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: 'bot', text: 'Perfecto 🔥 ¿Qué buscas mejorar?' },
        ]);
        setOptions(['💪 Recomiéndame un plan', '📦 Ver paquetes']);
      }, 500);
    }

    else if (option.includes('Precios')) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text:
              'Manejamos dos paquetes:\n\n💎 Premium: $35,000\n⚡ Básico: $3,500\n\n¿Te gustaría más información?',
          },
        ]);
        setOptions(['📲 Ir a WhatsApp']);
      }, 500);
    }

    else if (option.includes('Ubicación')) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: 'Nos ubicamos en CDMX 📍 ¿Quieres que te mandemos la ubicación por WhatsApp?',
          },
        ]);
        setOptions(['📲 Ir a WhatsApp']);
      }, 500);
    }

    else if (option.includes('plan')) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text:
              'Te recomiendo un plan personalizado según tu objetivo 💪\n\n¿Te gustaría que te asesoremos directamente?',
          },
        ]);
        setOptions(['📲 Ir a WhatsApp']);
      }, 500);
    }

    else if (option.includes('WhatsApp')) {
      openWhatsApp('Hola, quiero más información sobre GoldenEra');
    }
  };

  const handleOpen = () => {
    setShowModal(true);
    setShowChatTooltip(false);
    startChat();
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <>
      {/* BOTÓN */}
      <div className="chatbot-widget-container">
        <div
          className="chatbot-widget"
          onClick={handleOpen}
          onMouseEnter={() => setShowChatTooltip(true)}
          onMouseLeave={() => setShowChatTooltip(false)}
        >
          <div className="chatbot-widget__icon">💬</div>

          {showChatTooltip && (
            <div className="chatbot-widget__tooltip">
              <span>Asistente AI</span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="chatbot-modal-overlay" onClick={handleClose}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>

            <button className="chatbot-modal__close" onClick={handleClose}>
              ✕
            </button>

            {/* MENSAJES */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chatbot-msg ${msg.from}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* OPCIONES */}
            <div className="chatbot-options">
              {options.map((opt, i) => (
                <button key={i} onClick={() => handleOptionClick(opt)}>
                  {opt}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
