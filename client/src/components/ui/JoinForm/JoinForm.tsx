import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import './JoinForm.scss';

const steps = [
  { key: 'experience', type: 'options', options: ['a', 'b', 'c'] },
  { key: 'contact', type: 'contact' },
  { key: 'obstacle', type: 'textarea' },
  { key: 'rating', type: 'input' },
  { key: 'goal', type: 'textarea' },
  { key: 'timeThinking', type: 'options', options: ['a', 'b', 'c', 'd'] },
  { key: 'whyYou', type: 'textarea' },
  { key: 'money', type: 'options', options: ['a', 'b', 'c', 'd'] },
  { key: 'credit', type: 'options', options: ['a', 'b', 'c', 'd', 'e'] },
  { key: 'commitment', type: 'options', options: ['a', 'b', 'c', 'd'] }
];

const JoinForm: React.FC = () => {
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSteps = steps.length;
  const currentStep = steps[step];

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.5 }
    );
  }, [step]);

  const handleAnswer = (key: string, value: any) => {
    setAnswers((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });

      alert('🔥 Aplicación enviada');
    } catch (err) {
      alert('Error al enviar');
    }
  };

  return (
    <section className="join">
      {/* PROGRESS */}
      <div className="join__progress">
        <div
          className="join__progress-bar"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <form className="join__form" onSubmit={handleSubmit}>
        <div className="join__card" ref={containerRef}>
          
          {/* PREGUNTA */}
          <h2 className="join__question">
            {t(`form.${currentStep.key}`)}
          </h2>

          {/* OPCIONES */}
          {currentStep.type === 'options' && (
            <div className="join__options">
              {currentStep.options.map((opt: string) => (
                <button
                  key={opt}
                  type="button"
                  className="join__option"
                  onClick={() => {
                    handleAnswer(currentStep.key, opt);
                    next();
                  }}
                >
                  {t(`form.${currentStep.key}_options.${opt}`)}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          {currentStep.type === 'input' && (
            <input
              className="join__input"
              onChange={(e) =>
                handleAnswer(currentStep.key, e.target.value)
              }
              placeholder="..."
            />
          )}

          {/* TEXTAREA */}
          {currentStep.type === 'textarea' && (
            <textarea
              className="join__textarea"
              onChange={(e) =>
                handleAnswer(currentStep.key, e.target.value)
              }
            />
          )}

          {/* CONTACT */}
          {currentStep.type === 'contact' && (
            <div className="join__contact">
              <input
                placeholder={t('form.firstName')}
                onChange={(e) => handleAnswer('firstName', e.target.value)}
              />
              <input
                placeholder={t('form.lastName')}
                onChange={(e) => handleAnswer('lastName', e.target.value)}
              />
              <input
                placeholder={t('form.phone')}
                onChange={(e) => handleAnswer('phone', e.target.value)}
              />
              <input
                placeholder={t('form.email')}
                onChange={(e) => handleAnswer('email', e.target.value)}
              />
            </div>
          )}

          {/* NAV */}
          <div className="join__nav">
            {step > 0 && (
              <button type="button" onClick={prev}>
                ←
              </button>
            )}

            {currentStep.type !== 'options' && step < totalSteps - 1 && (
              <button type="button" onClick={next}>
                {t('form.button')}
              </button>
            )}

            {step === totalSteps - 1 && (
              <button type="submit" className="join__submit">
                FINALIZAR
              </button>
            )}
          </div>

        </div>
      </form>
    </section>
  );
};

export default JoinForm;
