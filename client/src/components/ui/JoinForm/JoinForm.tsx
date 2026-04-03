import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './JoinForm.scss';


type Question = {
  type: "input" | "textarea" | "select";
  name: string;
  placeholder?: string;
  label?: string;
  options?: string[];
};

const JoinForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(0);

  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    phone: "",
    email: "",
    experience: "",
    obstacle: "",
    rating: "",
    goal: "",
    timeThinking: "",
    whyYou: "",
    money: "",
    credit: "",
    commitment: ""
  });


  const questions: Question[] = [
    {
      type: "input",
      name: "name",
      placeholder: t("form.firstName")
    },
    {
      type: "input",
      name: "phone",
      placeholder: t("form.phone")
    },
    {
      type: "input",
      name: "email",
      placeholder: t("form.email")
    },
    {
      type: "select",
      name: "experience",
      label: t("form.experience"),
      options: [
        t("form.experience_options.a"),
        t("form.experience_options.b"),
        t("form.experience_options.c")
      ]
    },
    {
      type: "textarea",
      name: "obstacle",
      placeholder: t("form.obstacle")
    },
    {
      type: "input",
      name: "rating",
      placeholder: t("form.rating")
    },
    {
      type: "textarea",
      name: "goal",
      placeholder: t("form.goal")
    },
    {
      type: "select",
      name: "timeThinking",
      label: t("form.timeThinking"),
      options: [
        t("form.timeThinking_options.a"),
        t("form.timeThinking_options.b"),
        t("form.timeThinking_options.c"),
        t("form.timeThinking_options.d")
      ]
    },
    {
      type: "textarea",
      name: "whyYou",
      placeholder: t("form.whyYou")
    },
    {
      type: "select",
      name: "money",
      label: t("form.money"),
      options: [
        t("form.money_options.a"),
        t("form.money_options.b"),
        t("form.money_options.c"),
        t("form.money_options.d")
      ]
    },
    {
      type: "select",
      name: "credit",
      label: t("form.credit"),
      options: [
        t("form.credit_options.a"),
        t("form.credit_options.b"),
        t("form.credit_options.c"),
        t("form.credit_options.d"),
        t("form.credit_options.e")
      ]
    },
    {
      type: "select",
      name: "commitment",
      label: t("form.commitment"),
      options: [
        t("form.commitment_options.a"),
        t("form.commitment_options.b"),
        t("form.commitment_options.c"),
        t("form.commitment_options.d")
      ]
    }
  ];

  const current = questions[step];

  const handleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [current.name]: value
    }));
  };

  const next = () => {
    if (!formData[current.name]) return; 

    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      console.log("FINAL DATA:", formData);
      navigate("/packages");
    }
  };

  const prev = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="quiz">

      {/* PROGRESS */}
      <div className="quiz__progress">
        <div
          className="quiz__progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="quiz__card">

        {current.label && <h2>{current.label}</h2>}

        {/* INPUT */}
        {current.type === "input" && (
          <input
            value={formData[current.name]}
            placeholder={current.placeholder}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}

        {/* TEXTAREA */}
        {current.type === "textarea" && (
          <textarea
            value={formData[current.name]}
            placeholder={current.placeholder}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}

        {/* SELECT SAFE */}
        {current.type === "select" && current.options && (
          <div className="quiz__options">
            {current.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChange(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* NAV */}
        <div className="quiz__nav">
          {step > 0 && (
            <button type="button" onClick={prev}>
              Back
            </button>
          )}

          <button type="button" onClick={next}>
            {step === questions.length - 1
              ? t("form.button")
              : "Next"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default JoinForm;
