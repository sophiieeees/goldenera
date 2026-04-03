import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './JoinForm.scss';

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("DATA:", formData);
    navigate('/packages');
  };

  return (
    <section className="join-form" ref={formRef}>
      <div className="join-form__container">

        {/* HEADER */}
        <div className="join-form__header">
          <h1 className="join-form__title">
            {t("form.title")}
          </h1>
          <p className="join-form__subtitle">
            {t("form.subtitle")}
          </p>
        </div>

        <form className="join-form__box" onSubmit={handleSubmit}>

          {/* CONTACT */}
          <h2 className="join-form__section-title">
            {t("form.contact")}
          </h2>

          <div className="join-form__grid">
            <input name="firstName" placeholder={t("form.firstName")} onChange={handleChange} />
            <input name="lastName" placeholder={t("form.lastName")} onChange={handleChange} />
            <input name="phone" placeholder={t("form.phone")} onChange={handleChange} />
            <input name="email" placeholder={t("form.email")} onChange={handleChange} />
          </div>

          {/* EXPERIENCE */}
          <div className="join-form__block">
            <label>{t("form.experience")}</label>
            <select name="experience" onChange={handleChange}>
              <option>{t("form.experience_options.a")}</option>
              <option>{t("form.experience_options.b")}</option>
              <option>{t("form.experience_options.c")}</option>
            </select>
          </div>

          {/* OBSTACLE */}
          <div className="join-form__block">
            <label>{t("form.obstacle")}</label>
            <textarea name="obstacle" onChange={handleChange} />
          </div>

          {/* RATING */}
          <div className="join-form__block">
            <label>{t("form.rating")}</label>
            <input name="rating" onChange={handleChange} />
          </div>

          {/* GOAL */}
          <div className="join-form__block">
            <label>{t("form.goal")}</label>
            <textarea name="goal" onChange={handleChange} />
          </div>

          {/* TIME */}
          <div className="join-form__block">
            <label>{t("form.timeThinking")}</label>
            <select name="timeThinking" onChange={handleChange}>
              <option>{t("form.timeThinking_options.a")}</option>
              <option>{t("form.timeThinking_options.b")}</option>
              <option>{t("form.timeThinking_options.c")}</option>
              <option>{t("form.timeThinking_options.d")}</option>
            </select>
          </div>

          {/* WHY YOU */}
          <div className="join-form__block">
            <label>{t("form.whyYou")}</label>
            <textarea name="whyYou" onChange={handleChange} />
          </div>

          {/* MONEY */}
          <div className="join-form__block">
            <label>{t("form.money")}</label>
            <select name="money" onChange={handleChange}>
              <option>{t("form.money_options.a")}</option>
              <option>{t("form.money_options.b")}</option>
              <option>{t("form.money_options.c")}</option>
              <option>{t("form.money_options.d")}</option>
            </select>
          </div>

          {/* CREDIT */}
          <div className="join-form__block">
            <label>{t("form.credit")}</label>
            <select name="credit" onChange={handleChange}>
              <option>{t("form.credit_options.a")}</option>
              <option>{t("form.credit_options.b")}</option>
              <option>{t("form.credit_options.c")}</option>
              <option>{t("form.credit_options.d")}</option>
              <option>{t("form.credit_options.e")}</option>
            </select>
          </div>

          {/* COMMITMENT */}
          <div className="join-form__block">
            <label>{t("form.commitment")}</label>
            <select name="commitment" onChange={handleChange}>
              <option>{t("form.commitment_options.a")}</option>
              <option>{t("form.commitment_options.b")}</option>
              <option>{t("form.commitment_options.c")}</option>
              <option>{t("form.commitment_options.d")}</option>
            </select>
          </div>

          <button className="join-form__submit">
            {t("form.button")}
          </button>

        </form>
      </div>
    </section>
  );
};

export default JoinForm;
