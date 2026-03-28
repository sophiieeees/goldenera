import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import '../ui/ChatbotWidget.scss';

const USE_AI = false; // 🔥 cambia a true si usas backend con OpenAI

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const ChatbotWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // CHAT
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

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

  // 🧠 RESPUESTAS LOCALES
  const getLocalResponse = (input: string): string => {
    const text = input.toLowerCase();

    if (text.includes('precio') || text.includes('costo')) {
      return 'Nuestros paquetes empiezan desde $499 💪';
    }
    if (text.includes('horario')) {
      return 'Abrimos de lunes a sábado de 6am a 10pm 🕒';
    }
    if (text.includes('ubicacion')) {
      return 'Estamos en el centro 📍';
    }
    if (text.includes('plan')) {
      return 'Tenemos planes personalizados según tu objetivo 🔥';
    }

    return 'No entendí bien 🤔, intenta preguntar por precios, horarios o planes.';
  };

  // 🤖 AI RESPONSE
  const getAIResponse = async (input: string): Promise<string> => {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    return data.reply;
  };

  // 🚀 ENVIAR MENSAJE
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMsg: Message = { from: 'user', text: userInput };
    setChatMessages(prev => [...prev, userMsg]);

    const input = userInput;
    setUserInput('');

    let reply = '';

    if (USE_AI) {
      reply = await getAIResponse(input);
    } else {
      reply = getLocalResponse(input);
    }

    const botMsg: Message = { from: 'bot', text: reply };
    setChatMessages(prev => [...prev, botMsg]);
  };

  const handleChatWidgetClick = () => {
    setShowModal(true);
    setShowChatTooltip(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsChatActive(false);
    setChatMessages([]);
  };

  const handleOptionClick = () => {
    setIsChatActive(true);
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
          <div className="chatbot-widget__icon">💬</div>

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

            {!isChatActive && (
              <>
                <h3 className="chatbot-modal__title">¿En qué podemos ayudarte?</h3>

                <div className="chatbot-modal__options">
                  <button className="chatbot-option" onClick={handleOptionClick}>
                    💬 Dudas y Soporte
                  </button>

                  <button className="chatbot-option" onClick={handleOptionClick}>
                    🔥 Entrenamiento
                  </button>
                </div>
              </>
            )}

            {/* CHAT */}
            {isChatActive && (
              <div className="chatbot-chat">
                <div className="chatbot-chat__messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`msg msg--${msg.from}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="chatbot-chat__input">
                  <input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                  />
                  <button onClick={handleSendMessage}>Enviar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
