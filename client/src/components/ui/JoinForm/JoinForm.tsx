import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './JoinForm.scss';

interface FormData {
  name: string;
  phone: string;
  email: string;
  experience: string;
  obstacle: string;
  rating: string;
  goal: string;
  timeThinking: string;
  whyYou: string;
  money: string;
  credit: string;
  commitment: string;
}

const JoinForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formElementRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
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

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!formRef.current) return;

    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 }
    );

    gsap.fromTo(formElementRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
    );
  }, []);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("FORM DATA:", formData);

    setIsSuccess(true);

    setTimeout(() => {
      navigate('/packages'); 
    }, 1200);
  };

  return (
    <section className="join-form" ref={formRef}>
      <div className="join-form__container">
        <div className="join-form__content">

          <div className="join-form__header" ref={titleRef}>
            <h1 className="join-form__title">
              {t("form.title")}
            </h1>
          </div>

          <form
            className="join-form__form"
            ref={formElementRef}
            onSubmit={handleSubmit}
          >

            {/* BASICO */}
            <input name="name" placeholder={t("form.firstName")} onChange={handleChange} required />
            <input name="phone" placeholder={t("form.phone")} onChange={handleChange} required />
            <input name="email" type="email" placeholder={t("form.email")} onChange={handleChange} required />

            {/* EXPERIENCE */}
            <select name="experience" onChange={handleChange} defaultValue="">
              <option value="" disabled>{t("form.experience")}</option>
              <option value="a">{t("form.experience_options.a")}</option>
              <option value="b">{t("form.experience_options.b")}</option>
              <option value="c">{t("form.experience_options.c")}</option>
            </select>

            {/* TEXT */}
            <textarea name="obstacle" placeholder={t("form.obstacle")} onChange={handleChange} />
            <input name="rating" placeholder={t("form.rating")} onChange={handleChange} />
            <textarea name="goal" placeholder={t("form.goal")} onChange={handleChange} />

            {/* TIME */}
            <select name="timeThinking" onChange={handleChange} defaultValue="">
              <option value="" disabled>{t("form.timeThinking")}</option>
              <option value="a">{t("form.timeThinking_options.a")}</option>
              <option value="b">{t("form.timeThinking_options.b")}</option>
              <option value="c">{t("form.timeThinking_options.c")}</option>
              <option value="d">{t("form.timeThinking_options.d")}</option>
            </select>

            {/* WHY */}
            <textarea name="whyYou" placeholder={t("form.whyYou")} onChange={handleChange} />

            {/* MONEY */}
            <select name="money" onChange={handleChange} defaultValue="">
              <option value="" disabled>{t("form.money")}</option>
              <option value="a">{t("form.money_options.a")}</option>
              <option value="b">{t("form.money_options.b")}</option>
              <option value="c">{t("form.money_options.c")}</option>
              <option value="d">{t("form.money_options.d")}</option>
            </select>

            {/* CREDIT */}
            <select name="credit" onChange={handleChange} defaultValue="">
              <option value="" disabled>{t("form.credit")}</option>
              <option value="a">{t("form.credit_options.a")}</option>
              <option value="b">{t("form.credit_options.b")}</option>
              <option value="c">{t("form.credit_options.c")}</option>
              <option value="d">{t("form.credit_options.d")}</option>
              <option value="e">{t("form.credit_options.e")}</option>
            </select>

            {/* COMMITMENT */}
            <select name="commitment" onChange={handleChange} defaultValue="">
              <option value="" disabled>{t("form.commitment")}</option>
              <option value="a">{t("form.commitment_options.a")}</option>
              <option value="b">{t("form.commitment_options.b")}</option>
              <option value="c">{t("form.commitment_options.c")}</option>
              <option value="d">{t("form.commitment_options.d")}</option>
            </select>

            <button type="submit">
              {t("form.button")}
            </button>

            {isSuccess && (
              <div className="join-form__success">
                {t("form.success") || "Success! Redirecting..."}
              </div>
            )}

          </form>

        </div>
      </div>
    </section>
  );
};

export default JoinForm;
