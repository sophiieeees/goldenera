import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../ui/ChatbotWidget.scss';

type Msg = { from: 'user' | 'bot'; text: string };

const WHATSAPP = "https://wa.me/525576966262?text=¡Hola!%20Vengo%20de%20la%20página%20web%20de%20Golden%20Era%20y%20me%20interesa%20mi%20transformación.%20¿Podrían%20darme%20más%20información?";

const ChatbotWidget: React.FC = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: t('chatbot.welcome') }
  ]);

  const getResponse = (msg: string): string => {
    const text = msg.toLowerCase();

    if (text.includes('paquete')) return t('chatbot.packages');
    if (text.includes('unirme') || text.includes('club')) return t('chatbot.join');
    if (text.includes('merch') || text.includes('camiseta')) return t('chatbot.merch');
    if (text.includes('coach')) return t('chatbot.coach');

    if (text.includes('si') || text.includes('ok') || text.includes('yes')) {
      return t('chatbot.cta');
    }

    return t('chatbot.fallback');
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Msg = { from: 'user', text: input };
    const botReply: Msg = { from: 'bot', text: getResponse(input) };

    setMessages(prev => [...prev, userMsg, botReply]);
    setInput('');
  };

  const resetChat = () => {
    setMessages([{ from: 'bot', text: t('chatbot.reset') }]);
  };

  return (
    <>
      {/* BOTÓN */}
      {!open && !minimized && (
        <div className="chatbot-widget" onClick={() => setOpen(true)}>
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
      )}

      {/* MINIMIZADO */}
      {minimized && (
        <div
          className="chatbot-minimized"
          onClick={() => {
            setMinimized(false);
            setOpen(true);
          }}
        >
          💬 {t('chatbot.open')}
        </div>
      )}

      {/* CHAT */}
      {open && !minimized && (
        <div className="chatbot-modal-overlay">
          <div className="chatbot-modal">
            <div className="chatbot-chat">

              {/* HEADER */}
              <div className="chatbot-chat__header">
                <div className="chatbot-chat__info">
                  <div className="avatar">GE</div>
                  <div>
                    <div className="name">Golden Era</div>
                    <div className="status">{t('chatbot.online')}</div>
                  </div>
                </div>

                <div className="actions">
                  <button onClick={resetChat}>↻</button>
                  <button onClick={() => setMinimized(true)}>—</button>
                  <button onClick={() => setOpen(false)}>✖</button>
                </div>
              </div>

              {/* MENSAJES */}
              <div className="chatbot-chat__messages">
                {messages.map((m, i) => (
                  <div key={i} className={`msg msg--${m.from}`}>
                    {m.text.split('\n').map((line, i2) => (
                      <div key={i2}>{line}</div>
                    ))}
                  </div>
                ))}
              </div>

              {/* WHATS */}
              <a href={WHATSAPP} className="whatsapp-btn" target="_blank">
                {t('chatbot.whatsapp')}
              </a>

              {/* INPUT */}
              <div className="chatbot-chat__input">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chatbot.placeholder')}
                />
                <button onClick={sendMessage}>
                  {t('chatbot.send')}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
