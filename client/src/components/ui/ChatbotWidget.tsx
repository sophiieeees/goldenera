import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import '../ui/ChatbotWidget.scss';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const ChatbotWidget: React.FC = () => {
  const { t } = useTranslation();
  const currentUrl = window.location.href;
  const pageTitle = document.title;
  const WHATSAPP_MESSAGE = `${t('home.footer.whatsapp')}

Página: ${pageTitle}
${currentUrl}`;

  const WHATSAPP_LINK = `https://wa.me/525576966262?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: t('chatbot.welcome') }
  ]);
  const [input, setInput] = useState('');

  const getBotResponse = (msg: string): string => {
    const text = msg.toLowerCase();

    if (text.includes('paquete') || text.includes('precio')) {
      return t('chatbot.packages');
    }

    if (text.includes('unirme') || text.includes('club')) {
      return t('chatbot.join');
    }

    if (text.includes('coach')) {
      return t('chatbot.coach');
    }

    if (text.includes('merch') || text.includes('camiseta')) {
      return t('chatbot.merch');
    }

    if (text.includes('hola') || text.includes('hey')) {
      return t('chatbot.greeting');
    }

    return t('chatbot.fallback');
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = { from: 'user', text: input };
    const botMsg: Message = { from: 'bot', text: getBotResponse(input) };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const resetChat = () => {
    setMessages([{ from: 'bot', text: t('chatbot.welcome') }]);
  };

  return (
    <>
      {/* BOTÓN */}
      {!isOpen && !isMinimized && (
        <div className="chatbot-widget-container">
          <div className="chatbot-widget" onClick={() => setIsOpen(true)}>
            <div className="chatbot-widget__icon">
              <svg viewBox="0 0 24 24">
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="chatbot-widget__tooltip">
              {t('chatbot.tooltip')}
            </div>
          </div>
        </div>
      )}

      {/* MINIMIZADO */}
      {isMinimized && (
        <div
          className="chatbot-minimized"
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
        >
          {t('chatbot.open')}
        </div>
      )}

      {/* PORTAL */}
      {isOpen &&
        ReactDOM.createPortal(
          <div className="chatbot-modal-overlay">
            <div className="chatbot-modal">

              <div className="chatbot-chat">

                {/* HEADER */}
                <div className="chatbot-chat__header">
                  <div className="chatbot-chat__info">
                    <div className="avatar">AI</div>
                    <div>
                      <div className="name">Golden Era</div>
                      <div className="status">{t('chatbot.online')}</div>
                    </div>
                  </div>

                  <div className="actions">
                    <button onClick={() => setIsMinimized(true)}>—</button>
                    <button onClick={resetChat}>⟳</button>
                    <button onClick={() => setIsOpen(false)}>✕</button>
                  </div>
                </div>

                {/* MENSAJES */}
                <div className="chatbot-chat__messages">
                  {messages.map((m, i) => (
                    <div key={i} className={`msg msg--${m.from}`}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: m.text.replace(/\n/g, '<br/>')
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* INPUT */}
                <div className="chatbot-chat__input">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('chatbot.placeholder')}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage}>
                    {t('chatbot.send')}
                  </button>
                </div>

                {/* WHATSAPP */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-btn"
                >
                  {t('chatbot.whatsapp')}
                </a>

              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ChatbotWidget;
