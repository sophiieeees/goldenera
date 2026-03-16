import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './Package.scss';

gsap.registerPlugin(ScrollTrigger);

interface PackageFeature {
  icon: string;
  text: string;
}

interface PackagePlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  currency: string;
  type: string;
  description: string;
  features: PackageFeature[];
  isPopular?: boolean;
  image?: string;
  spotsLeft: number;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Package: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const packagesRef = useRef<HTMLDivElement[]>([]);
  
  // Estado para el contador
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 2,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

 const packages: PackagePlan[] = [
  {
    id: 'ultra-deluxe',
    name: t('home.packages.deluxe.name'),
    price: 35000,
    originalPrice: 70000,
    discount: 50,
    currency: 'MXN',
    type: t('home.packages.deluxe.type'),
    description: t('home.packages.deluxe.description'),
    features: [
      { icon: '✔', text: t('home.packages.features.coaching') },
      { icon: '✔', text: t('home.packages.features.apps') },
      { icon: '✔', text: t('home.packages.features.recipes') },
      { icon: '✔', text: t('home.packages.features.merch') },
      { icon: '✔', text: t('home.packages.features.support') },
      { icon: '✔', text: t('home.packages.features.tracking') },
      { icon: '✔', text: t('home.packages.features.presential') },
      { icon: '✔', text: t('home.packages.features.location') },
      { icon: '✔', text: t('home.packages.features.style') },
      { icon: '✔', text: t('home.packages.features.grooming') },
      { icon: '✔', text: t('home.packages.features.skincare') },
      { icon: '✔', text: t('home.packages.features.looksmax') },
      { icon: '✔', text: t('home.packages.features.supplements') },
      { icon: '✔', text: t('home.packages.features.biohacking') },
      { icon: '✔', text: t('home.packages.features.nootropics') } 
    ],
    isPopular: true,
    image: 'https://placehold.co/600x400/000000/d4af37?text=Ultra+Deluxe',
    spotsLeft: 5
  },
  {
    id: 'standard',
    name: t('home.packages.standard.name'),
    price: 3500,
    originalPrice: 7000,
    discount: 50,
    currency: 'MXN',
    type: t('home.packages.standard.type'),
    description: t('home.packages.standard.description'),
    features: [
      { icon: '✔', text: t('home.packages.features.coaching') },
      { icon: '✔', text: t('home.packages.features.apps') },
      { icon: '✔', text: t('home.packages.features.recipes') },
      { icon: '✔', text: t('home.packages.features.merch') },
      { icon: '✔', text: t('home.packages.features.support') },
      { icon: '✔', text: t('home.packages.features.tracking') },
      { icon: '✔', text: t('home.packages.features.style') },
      { icon: '✔', text: t('home.packages.features.grooming') },
      { icon: '✔', text: t('home.packages.features.skincare') },
      { icon: '✔', text: t('home.packages.features.looksmax') },
      { icon: '✔', text: t('home.packages.features.supplements') },
      { icon: '✔', text: t('home.packages.features.biohacking') }
    ],
    image: 'https://placehold.co/600x400/1a1a1a/d4af37?text=Golden+Standard',
    spotsLeft: 3
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
      gsap.from('.package-header', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      });

      // Animación del countdown
      gsap.from('.countdown-container', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        }
      });

      // Animación de las tarjetas
      packagesRef.current.forEach((card, index) => {
        gsap.from(card, {
          y: 150,
          opacity: 0,
          duration: 1,
          delay: index * 0.3,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        });

        // Efecto hover luxury
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

      // Animación de partículas doradas
      const createGoldParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'gold-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        sectionRef.current?.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 6000);
      };

      const particleInterval = setInterval(createGoldParticle, 500);

      return () => {
        clearInterval(particleInterval);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePurchase = (packageId: string) => {
    // Aquí conectarás con Stripe
    console.log(`Purchasing package: ${packageId}`);
    // TODO: Implementar lógica de Stripe
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <section ref={sectionRef} className="package-section">
      <div className="luxury-overlay"></div>
      <div className="container">
        <div className="package-header">
          <span className="luxury-badge">{t('home.packages.membership_badge')}</span>
          <h2 className="arabic-title" dir="rtl">العصر الذهبي</h2>
          <h2 className="section-title">{t('home.packages.title')}</h2>
          <p className="section-subtitle">{t('home.packages.subtitle')}</p>
        </div>

        {/* Countdown Timer */}
        <div className="countdown-container">
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

        <div className="packages-grid">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              ref={el => packagesRef.current[index] = el!}
              className={`package-card ${pkg.isPopular ? 'popular' : ''}`}
            >
              {pkg.isPopular && (
                <div className="popular-badge">{t('home.packages.most_exclusive')}</div>
              )}
              
              <div className="discount-badge">
                <span className="discount-text">-{pkg.discount}%</span>
              </div>
              
              <div className="package-image">
                <img src={pkg.image} alt={pkg.name} />
                <div className="image-overlay"></div>
              </div>

              <div className="package-content">
                <h3 className="package-name">{pkg.name}</h3>
                <p className="package-type">{pkg.type}</p>
                
                <div className="price-container">
                  <div className="original-price">
                    <span className="currency">{pkg.currency}</span>
                    <span className="price-striked">${pkg.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="current-price">
                    <span className="currency">{pkg.currency}</span>
                    <span className="price">${pkg.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="savings-badge">
                  {t('home.packages.savings')} ${(pkg.originalPrice - pkg.price).toLocaleString()} MXN
                </div>

                <p className="package-description">{pkg.description}</p>

                <div className="features-list">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="feature-icon">{feature.icon}</span>
                      <span className="feature-text">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className="purchase-button"
                  onClick={() => handlePurchase(pkg.id)}
                >
                  <span className="button-text">{t('home.packages.cta')}</span>
                  <span className="button-icon">→</span>
                </button>

                <p className="urgency-text">
                   {t('home.packages.spots_left', { count: pkg.spotsLeft })}
                </p>
              </div>

              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Package;
