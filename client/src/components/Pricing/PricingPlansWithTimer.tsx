// client/src/components/Pricing/PricingPlansWithTimer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import CheckoutModal from '../Checkout/CheckoutModal';
import './PricingPlans.scss';

gsap.registerPlugin(ScrollTrigger);

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  badge?: string;
  popular?: boolean;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const PricingPlansWithTimer: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const plansRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // Estado para el contador
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 2,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  const plans: Plan[] = [
    {
      id: 'golden-standard',
      name: t('home.packages.standard.name'),
      price: 3500,
      originalPrice: 7000,
      features: [
        t('home.packages.features.coaching'),
        t('home.packages.features.apps'),
        t('home.packages.features.recipes'),
        t('home.packages.features.support'),
        t('home.packages.features.tracking')
      ],
      badge: 'POPULAR'
    },
    {
      id: 'ultra-deluxe',
      name: t('home.packages.deluxe.name'),
      price: 35000,
      originalPrice: 70000,
      features: [
        t('home.packages.features.coaching'),
        t('home.packages.features.apps'),
        t('home.packages.features.recipes'),
        t('home.packages.features.merch'),
        t('home.packages.features.support'),
        t('home.packages.features.tracking'),
        t('home.packages.features.presential'),
        t('home.packages.features.location')
      ],
      badge: t('home.packages.most_exclusive'),
      popular: true
    }
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = { ...prevTime };
        
        if (newTime.seconds > 0) {
          newTime.seconds--;
        } else if (newTime.minutes > 0) {
          newTime.minutes--;
          newTime.seconds = 59;
        } else if (newTime.hours > 0) {
          newTime.hours--;
          newTime.minutes = 59;
          newTime.seconds = 59;
        } else if (newTime.days > 0) {
          newTime.days--;
          newTime.hours = 23;
          newTime.minutes = 59;
          newTime.seconds = 59;
        } else {
          // Reset to 3 days when it reaches 0
          return { days: 2, hours: 23, minutes: 59, seconds: 59 };
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del título
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, 
          { opacity: 0, y: 100, scale: 0.8 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Animación del countdown
      gsap.fromTo('.countdown-container-timer', 
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1, delay: 0.5, ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.countdown-container-timer',
            start: 'top 80%'
          }
        }
      );

      // Animación de las tarjetas de planes
      if (plansRef.current) {
        const planCards = plansRef.current.querySelectorAll('.pricing-card');
        
        planCards.forEach((card, index) => {
          gsap.fromTo(card,
            { opacity: 0, y: 100, rotationY: 45, scale: 0.8 },
            {
              opacity: 1, y: 0, rotationY: 0, scale: 1,
              duration: 1, delay: index * 0.2, ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      }
    }, plansRef);

    return () => ctx.revert();
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

return (
    <section className="pricing-plans">
      <div className="pricing-plans__container">
        <div className="pricing-plans__header">
          <h2 className="pricing-plans__title" ref={titleRef}>
            <span className="title-part">{t('home.packages.title').split(' ')[0]} {t('home.packages.title').split(' ')[1]}</span>
            <span className="title-main">{t('home.packages.title').split(' ')[2]}</span>
            <span className="title-sub">{t('home.packages.subtitle')}</span>
          </h2>
        </div>

        {/* Countdown Timer */}
        <div className="countdown-container-timer">
          <div className="countdown-header">
            <span className="fire-icon"></span>
            <h3 className="countdown-title">{t('home.packages.offer_title')}</h3>
            <span className="fire-icon"></span>
          </div>
          <div className="countdown-timer">
            <div className="time-unit">
              <span className="time-number">{formatNumber(timeLeft.days)}</span>
              <span className="time-label">{t('home.packages.days')}</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-number">{formatNumber(timeLeft.hours)}</span>
              <span className="time-label">{t('home.packages.hours')}</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-number">{formatNumber(timeLeft.minutes)}</span>
              <span className="time-label">{t('home.packages.minutes')}</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-unit">
              <span className="time-number">{formatNumber(timeLeft.seconds)}</span>
              <span className="time-label">{t('home.packages.seconds')}</span>
            </div>
          </div>
        </div>

        <div className="pricing-plans__grid" ref={plansRef}>
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? 'pricing-card--popular' : ''}`}>
              {plan.badge && (
                <div className="pricing-card__badge">
                  {plan.badge}
                </div>
              )}

              <div className="pricing-card__header">
                <h3 className="pricing-card__name">{plan.name}</h3>
                <div className="pricing-card__pricing">
                  {plan.originalPrice && (
                    <span className="pricing-card__original-price">
                      {formatPrice(plan.originalPrice)}
                    </span>
                  )}
                  <span className="pricing-card__price">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="pricing-card__period">12 weeks</span>
                </div>
              </div>

              <div className="pricing-card__features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <svg className="feature-icon" width="20" height="20" viewBox="0 0 20 20">
                        <path fill="#EAC31B" d="M8.6 14.6L4 10l1.4-1.4L8.6 12l6-6L16 7.4z"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="pricing-card__button"
                onClick={() => handleSelectPlan(plan)}
              >
                <span className="button-text">{t('home.packages.cta')}</span>
                <span className="button-glow"></span>
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-plans__guarantee">
          <div className="guarantee-badge">
            <span className="guarantee-text">GOLDEN QUALITY</span>
            <span className="guarantee-subtext">Tu transformación o tu dinero de vuelta</span>
          </div>
        </div>
      </div>

      {/* CAMBIO AQUÍ: Solo renderizar el modal si selectedPlan existe */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          program={selectedPlan}
        />
      )}
    </section>
  );
};

export default PricingPlansWithTimer;