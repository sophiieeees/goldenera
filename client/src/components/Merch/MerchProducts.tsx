import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import useMetaPixel from '../../hooks/useMetaPixel';
import MerchCheckoutModal from './MerchCheckout/MerchCheckoutModal';
import './MerchProducts.scss';
import { merch } from '../../assets';

gsap.registerPlugin(ScrollTrigger);

interface MerchProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  description: string;
}

const MerchProducts: React.FC = () => {
  const { t } = useTranslation();
  const { trackViewContent, trackAddToCart } = useMetaPixel();

  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<{ [key: string]: number }>({});

  const sectionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement[]>([]);

  const products: MerchProduct[] = [
    {
      id: 'golden-era-tshirt',
      name: t('merch.products.shirt1.name'),
      price: 888,
      images: [
        merch.whitelivesfront,
        merch.whitelivesback
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      description: t('merch.products.shirt1.description')
    },
    {
      id: 'golden-era-wakens',
      name: t('merch.products.shirt2.name'),
      price: 888,
      images: [
        merch.wakenessfront,
        merch.wakenessback
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      description: t('merch.products.shirt2.description')
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(
        '.merch-header',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.merch-header',
            start: 'top 80%',
            once: true
          }
        }
      );

      productsRef.current.forEach((product, index) => {
        if (product) {
          gsap.fromTo(
            product,
            {
              opacity: 0,
              y: 80,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              delay: index * 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: product,
                start: 'top 85%',
                once: true
              }
            }
          );

          product.addEventListener('mouseenter', () => {
            gsap.to(product.querySelector('.product-image-container'), {
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out'
            });
          });

          product.addEventListener('mouseleave', () => {
            gsap.to(product.querySelector('.product-image-container'), {
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        }
      });

      gsap.utils.toArray('.product-image').forEach((image: any) => {
        gsap.to(image, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      });

    }, sectionRef);

    trackViewContent('Golden Era Merchandise', 777);

    return () => ctx.revert();
  }, [trackViewContent]);

  const handleImageChange = (
    productId: string,
    direction: 'prev' | 'next'
  ) => {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const currentIndex = selectedImageIndex[productId] || 0;

    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % product.images.length
        : (currentIndex - 1 + product.images.length) % product.images.length;

    setSelectedImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }));

    gsap.fromTo(
      `#image-${productId}`,
      { opacity: 0.5, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      }
    );
  };

  const handleAddToCart = (product: MerchProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);

    trackAddToCart({
      value: product.price,
      currency: 'MXN',
      content_ids: [product.id],
      content_name: product.name
    });
  };

  return (
    <section ref={sectionRef} className="merch-section">
      <div className="merch-container">

        <div className="merch-header">

          <h2 className="merch-title">
            {t('merchPage.hero.title.line1')} {' '}
            {t('merchPage.hero.title.line2')}
          </h2>

          <p className="merch-subtitle">
            {t('merchPage.hero.subtitle')}
          </p>

          <div className="merch-badge">
            {t('merchPage.hero.badges.limited')}
          </div>

        </div>

        <div className="products-grid">

          {products.map((product, index) => (
            <div
              key={product.id}
              ref={el => productsRef.current[index] = el!}
              className="product-card"
            >

              <div className="product-image-container">

                <div className="image-carousel">

                  <img
                    id={`image-${product.id}`}
                    src={product.images[selectedImageIndex[product.id] || 0]}
                    alt={product.name}
                    className="product-image"
                  />

                  <button
                    className="carousel-btn prev"
                    onClick={() => handleImageChange(product.id, 'prev')}
                  >
                    ‹
                  </button>

                  <button
                    className="carousel-btn next"
                    onClick={() => handleImageChange(product.id, 'next')}
                  >
                    ›
                  </button>

                  <div className="image-indicators">
                    {product.images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`indicator ${(selectedImageIndex[product.id] || 0) === idx ? 'active' : ''}`}
                      />
                    ))}
                  </div>

                </div>

                <div className="product-badge">
                  {t('merch.exclusive')}
                </div>

              </div>

              <div className="product-info">

                <h3 className="product-name">
                  {product.name}
                </h3>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="size-selector">

                  <span className="size-label">
                    {t('merch.availableSizes')}
                  </span>

                  <div className="sizes">
                    {product.sizes.map(size => (
                      <span key={size} className="size-tag">
                        {size}
                      </span>
                    ))}
                  </div>

                </div>

                <div className="product-footer">

                  <div className="price-container">
                    <span className="price">
                      ${product.price}
                    </span>

                    <span className="currency">
                      MXN
                    </span>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <span className="btn-text">
                      {t('merch.buyNow')}
                    </span>

                    <span className="btn-icon">
                      →
                    </span>
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

      <MerchCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </section>
  );
};

export default MerchProducts;
