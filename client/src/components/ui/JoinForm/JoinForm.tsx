import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './JoinForm.scss';

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    experience: '',
    obstacle: '',
    rating: '',
    goal: '',
    timeThinking: '',
    whyYou: '',
    money: '',
    credit: '',
    commitment: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);

  const handleSubmit = () => {
    console.log(formData);
    navigate('/packages');
  };

  // 🔥 TODAS LAS PREGUNTAS
  const questions = [
    {
      key: 'experience',
      type: 'options',
      label: t('form.experience'),
      options: Object.values(t('form.experience_options', { returnObjects: true }) as any)
    },
    {
      key: 'obstacle',
      type: 'text',
      label: t('form.obstacle')
    },
    {
      key: 'rating',
      type: 'number',
      label: t('form.rating')
    },
    {
      key: 'goal',
      type: 'text',
      label: t('form.goal')
    },
    {
      key: 'timeThinking',
      type: 'options',
      label: t('form.timeThinking'),
      options: Object.values(t('form.timeThinking_options', { returnObjects: true }) as any)
    },
    {
      key: 'whyYou',
      type: 'text',
      label: t('form.whyYou')
    },
    {
      key: 'money',
      type: 'options',
      label: t('form.money'),
      options: Object.values(t('form.money_options', { returnObjects: true }) as any)
    },
    {
      key: 'credit',
      type: 'options',
      label: t('form.credit'),
      options: Object.values(t('form.credit_options', { returnObjects: true }) as any)
    },
    {
      key: 'commitment',
      type: 'options',
      label: t('form.commitment'),
      options: Object.values(t('form.commitment_options', { returnObjects: true }) as any)
    }
  ];

  return (
    <section className="quiz">

      {/* PROGRESS BAR */}
      <div className="quiz__progress">
        <div
          className="quiz__progress-bar"
          style={{ width: `${(step / (questions.length + 1)) * 100}%` }}
        />
      </div>

      <div className="quiz__card">

        {/* STEP 0 → CONTACT */}
        {step === 0 && (
          <>
            <h2>{t('form.contact')}</h2>

            <input
              placeholder={t('form.firstName')}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />

            <input
              placeholder={t('form.lastName')}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />

            <input
              placeholder={t('form.phone')}
              onChange={(e) => handleChange('phone', e.target.value)}
            />

            <input
              placeholder={t('form.email')}
              onChange={(e) => handleChange('email', e.target.value)}
            />

            <button onClick={nextStep}>
              {t('form.button')}
            </button>
          </>
        )}

        {/* QUESTIONS */}
        {step > 0 && step <= questions.length && (() => {
          const current = questions[step - 1];

          return (
            <>
              <h2>{current.label}</h2>

              {current.type === 'text' && (
                <textarea onChange={(e) => handleChange(current.key, e.target.value)} />
              )}

              {current.type === 'number' && (
                <input type="number"
                  onChange={(e) => handleChange(current.key, e.target.value)}
                />
              )}

              {current.type === 'options' && (
                <div className="quiz__options">
                  {current.options?.map((opt: string, i: number) => (
                    <button key={i} onClick={() => {
                      handleChange(current.key, opt);
                      nextStep();
                    }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {current.type !== 'options' && (
                <button onClick={nextStep}>
                  {t('common.next')}
                </button>
              )}
            </>
          );
        })()}

        {/* FINAL */}
        {step > questions.length && (
          <>
            <h2> Listo</h2>
            <button onClick={handleSubmit}>
              Ver programas
            </button>
          </>
        )}

      </div>
    </section>
  );
};

export default JoinForm;
