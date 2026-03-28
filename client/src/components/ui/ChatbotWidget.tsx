import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import '../ui/ChatbotWidget.scss';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const [isMinimized, setIsMinimized] = useState(false);
const WHATSAPP = 'https://wa.me/525576966262?text=Hola%20quiero%20información';

const ChatbotWidget: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [context, setContext] = useState<string | null>(null);

  const shouldShow = !location.pathname.includes('/gallery');

  useEffect(() => {
    if (!shouldShow) return;

    setTimeout(() => setIsVisible(true), 1000);
  }, [shouldShow]);

  useEffect(() => {
    if (isVisible) {
      gsap.fromTo('.chatbot-widget',
        { scale: 0 },
        { scale: 1, duration: 0.5 }
      );
    }
  }, [isVisible]);

  const getResponse = (input: string): string => {
    const text = input.toLowerCase();

    if (text.includes('unir') || text.includes('join')) {
      setContext('join');
      return t('chatbot.join');
    }

    if (text.includes('precio') || text.includes('plan')) {
      setContext('plans');
      return t('chatbot.plans');
    }

    if (text.includes('merch') || text.includes('camiseta')) {
      setContext('merch');
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
    setChatMessages([
      { from: 'bot', text: t('chatbot.welcome') }
    ]);
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <>
      <div className="chatbot-widget-container">
        <div className="chatbot-widget" onClick={() => setShowModal(true)}>
          
        </div>
      </div>

      {showModal && (
        <div className="chatbot-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>

            {!isChatActive && (
              <button className="chatbot-option" onClick={startChat}>
                 Iniciar chat
              </button>
            )}

            {isChatActive && (
              <div className="chatbot-chat">

                <div className="chatbot-chat__messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`msg msg--${msg.from}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                {/* BOTÓN WHATSAPP */}
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="whatsapp-btn">
                  {t('chatbot.whatsapp')}
                </a>

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

          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
