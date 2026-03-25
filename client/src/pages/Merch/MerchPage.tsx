import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import MerchProducts from '../../components/Merch/MerchProducts';
import useMetaPixel from '../../hooks/useMetaPixel';
import './MerchPage.scss';

gsap.registerPlugin(ScrollTrigger);

const MerchPage: React.FC = () => {
  const { trackPageView } = useMetaPixel();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView();

    const ctx = gsap.context(() => {
      gsap.fromTo('.merch-page',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );

      gsap.fromTo('.merch-hero',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5, delay: 0.3, ease: 'power2.out' }
      );

      gsap.to('.merch-bg-pattern', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.merch-page',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    return () => ctx.revert();
  }, [trackPageView]);

  return (
    <div className="merch-page">
      <div className="merch-bg-pattern" />
      
      <section className="merch-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">{t('merchPage.hero.title.line1')}</span>
            <span className="title-line golden">{t('merchPage.hero.title.line2')}</span>
            <span className="title-line">{t('merchPage.hero.title.line3')}</span>
          </h1>

          <p className="hero-subtitle">
            {t('merchPage.hero.subtitle')}
          </p>

          <div className="hero-badges">
            <span className="badge">{t('merchPage.hero.badges.limited')}</span>
            <span className="badge">{t('merchPage.hero.badges.premium')}</span>
            <span className="badge">{t('merchPage.hero.badges.exclusive')}</span>
          </div>
        </div>

        <div className="scroll-indicator">
          <span className="scroll-text">{t('merchPage.hero.scroll.text')}</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      <MerchProducts />

      <section className="merch-footer-section">
        <div className="footer-content">
          <div className="footer-column">
            <h3>{t('merchPage.footer.columns.quality.title')}</h3>
            <p>{t('merchPage.footer.columns.quality.line1')}</p>
            <p>{t('merchPage.footer.columns.quality.line2')}</p>
          </div>

          <div className="footer-column">
            <h3>{t('merchPage.footer.columns.shipping.title')}</h3>
            <p>{t('merchPage.footer.columns.shipping.line1')}</p>
            <p>{t('merchPage.footer.columns.shipping.line2')}</p>
          </div>

          <div className="footer-column">
            <h3>{t('merchPage.footer.columns.guarantee.title')}</h3>
            <p>{t('merchPage.footer.columns.guarantee.line1')}</p>
            <p>{t('merchPage.footer.columns.guarantee.line2')}</p>
          </div>
        </div>

        <div className="final-cta">
          <h2>{t('merchPage.footer.cta.title')}</h2>
          <p>{t('merchPage.footer.cta.subtitle')}</p>
        </div>
      </section>
    </div>
  );
};

export default MerchPage;
