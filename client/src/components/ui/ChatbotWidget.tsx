import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import '../ui/ChatbotWidget.scss';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const WHATSAPP = 'https://wa.me/525576966262?text=¡Hola!%20Vengo%20de%20la%20página%20web%20de%20Golden%20Era%20y%20me%20interesa%20mi%20transformación.%20¿Podrían%20darme%20más%20información?';

const ChatbotWidget: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  const shouldShow = !location.pathname.includes('/gallery');

  useEffect(() => {
    if (!shouldShow) return;
    setTimeout(() => setIsVisible(true), 1000);
  }, [shouldShow]);

  useEffect(() => {
    if (isVisible) {
      gsap.fromTo('.chatbot-widget', { scale: 0 }, { scale: 1, duration: 0.5 });
    }
  }, [isVisible]);

  // RESPUESTAS
  const getResponse = (input: string): string => {
    const text = input.toLowerCase();

    if (text.includes('unir') || text.includes('join')) {
      return t('chatbot.join');
    }

    if (text.includes('precio') || text.includes('plan')) {
      return t('chatbot.plans');
    }

    if (text.includes('merch') || text.includes('camiseta')) {
      return t('chatbot.merch');
    }

    if (text.includes('coach')) {
      return t('chatbot.coach');
    }

    if (text.includes('contenido')) {
      return t('chatbot.content');
    }

    return t('chatbot.unknown');
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMsg: Message = { from: 'user', text: userInput };
    const reply = getResponse(userInput);
    const botMsg: Message = { from: 'bot', text: reply };

    setChatMessages(prev => [...prev, userMsg, botMsg]);
    setUserInput('');
  };

  const startChat = () => {
    setIsChatActive(true);
    setIsMinimized(false);
    setChatMessages([{ from: 'bot', text: t('chatbot.welcome') }]);
  };

  const resetChat = () => {
    setChatMessages([{ from: 'bot', text: t('chatbot.welcome') }]);
  };

  const minimizeChat = () => setIsMinimized(true);
  const reopenChat = () => setIsMinimized(false);

  if (!shouldShow || !isVisible) return null;

  return (
    <>
      {/* BOTÓN */}
      <div className="chatbot-widget-container">
        <div className="chatbot-widget" onClick={() => setShowModal(true)}>
          
          <div className="chatbot-widget__icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                fill="white"
              />
            </svg>
          </div>

          <div className="chatbot-widget__tooltip">
            Asistente de IA
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="chatbot-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>

            {!isChatActive && (
              <button className="chatbot-option" onClick={startChat}>
                💬 {t('chatbot.start')}
              </button>
            )}

            {/* CHAT */}
            {isChatActive && !isMinimized && (
              <div className="chatbot-chat">

                {/* HEADER */}
                <div className="chatbot-chat__header">
                  <div className="chatbot-chat__info">
                    <div className="avatar">GE</div>
                    <div>
                      <div className="name">Golden Era</div>
                      <div className="status">● Online</div>
                    </div>
                  </div>

                  <div className="actions">
                    <button onClick={resetChat}>↻</button>
                    <button onClick={minimizeChat}>—</button>
                    <button onClick={() => setShowModal(false)}>✕</button>
                  </div>
                </div>

                {/* MENSAJES */}
                <div className="chatbot-chat__messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`msg msg--${msg.from}`}>
                      {msg.text.split('\n').map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* WHATSAPP */}
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="whatsapp-btn">
                  {t('chatbot.whatsapp')}
                </a>

                {/* INPUT */}
                <div className="chatbot-chat__input">
                  <input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={t('chatbot.inputPlaceholder')}
                  />
                  <button onClick={handleSendMessage}>
                    {t('chatbot.send')}
                  </button>
                </div>

              </div>
            )}

            {/* MINIMIZADO */}
            {isChatActive && isMinimized && (
              <div className="chatbot-minimized" onClick={reopenChat}>
                💬 {t('chatbot.whatsapp')}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
