// client/src/pages/Gallery/Gallery.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import imagen1 from '../../assets/images/imagen1.jpeg';
import imagen3 from '../../assets/images/imagen3.jpeg';
import imagen4 from '../../assets/images/imagen4.jpeg';
import imagen5 from '../../assets/images/imagen5.jpeg';
import imagen6 from '../../assets/images/imagen6.jpeg';
import imagen7 from '../../assets/images/imagen7.jpeg';
import imagen8 from '../../assets/images/imagen8.jpeg';
import imagen9 from '../../assets/images/imagen9.jpeg';
import imagen10 from '../../assets/images/imagen10.jpeg';
import imagen11 from '../../assets/images/imagen11.jpeg';
import imagen12 from '../../assets/images/imagen12.jpeg';
import imagen13 from '../../assets/images/imagen13.jpeg';
import imagen14 from '../../assets/images/imagen14.jpeg';
import imagen15 from '../../assets/images/imagen15.jpeg';
import imagen16 from '../../assets/images/imagen16.jpeg';
import imagen17 from '../../assets/images/imagen17.jpeg';
import imagen18 from '../../assets/images/imagen18.jpeg';
import imagen19 from '../../assets/images/imagen19.jpeg';
import imagen21 from '../../assets/images/imagen21.jpeg';
import imagen22 from '../../assets/images/imagen22.jpeg';
import imagen23 from '../../assets/images/imagen23.jpeg';
import imagen24 from '../../assets/images/imagen24.jpeg';
import imagen25 from '../../assets/images/imagen25.jpeg';
import imagen26 from '../../assets/images/imagen26.jpeg';
import imagen27 from '../../assets/images/imagen27.jpeg';
import imagen28 from '../../assets/images/imagen28.jpeg';
import imagen29 from '../../assets/images/imagen29.jpeg';
import imagen30 from '../../assets/images/imagen30.jpeg';

import imggal1 from '../../assets/images/imggal1.jpeg';
import imggal2 from '../../assets/images/imggal2.jpeg';
import imggal3 from '../../assets/images/imggal3.jpeg';
import imggal4 from '../../assets/images/imggal4.jpeg';
import imggal5 from '../../assets/images/imggal5.jpeg';
import imggal6 from '../../assets/images/imggal6.jpeg';
import imggal7 from '../../assets/images/imggal7.jpeg';
import imggal8 from '../../assets/images/imggal8.jpeg';
import imggal9 from '../../assets/images/imggal9.jpeg';
import imggal10 from '../../assets/images/imggal10.jpeg';
import imggal11 from '../../assets/images/imggal11.jpeg';
import imggal12 from '../../assets/images/imggal12.jpeg';
import imggal13 from '../../assets/images/imggal13.jpeg';
import imggal14 from '../../assets/images/imggal14.jpeg';
import imggal15 from '../../assets/images/imggal15.jpeg';
import imggal16 from '../../assets/images/imggal16.jpeg';
import imggal17 from '../../assets/images/imggal17.jpeg';
import imggal18 from '../../assets/images/imggal18.jpeg';
import imggal19 from '../../assets/images/imggal19.jpeg';
import imggal20 from '../../assets/images/imggal20.jpeg';
import imggal25 from '../../assets/images/imggal25.jpeg';
import imggal29 from '../../assets/images/imggal29.jpeg';
import imggal30 from '../../assets/images/imggal30.jpeg';
import imggal31 from '../../assets/images/imggal31.jpeg';
import imggal32 from '../../assets/images/imggal32.jpeg';

import { audio } from '../../assets/audio';
import './Gallery.scss';


export const images = {
  gallery: [
    imagen1, imagen3, imagen4, imagen5, imagen6,
    imagen7, imagen8, imagen9, imagen10, imagen11, imagen12,
    imagen13, imagen14, imagen15, imagen16, imagen17, imagen18,
    imagen19, imagen21, imagen22, imagen23, imagen24, imagen25,
    imagen26, imagen27, imagen28, imagen29, imagen30, 

    imggal1, imggal2, imggal3, imggal4, imggal5,
    imggal6, imggal7, imggal8, imggal9, imggal10,
    imggal11, imggal12, imggal13, imggal14, imggal15,
    imggal16, imggal17, imggal18, imggal19, imggal20,
    imggal25, imggal29, imggal30, imggal31, imggal32,
  ]
};


gsap.registerPlugin(ScrollTrigger);

interface Slide {
  id: number;
  type: 'image' | 'quote';
  content?: string;
  contentPart2?: string;
  image?: string;
  background?: string;
  color?: string;
  colorPart2?: string;
  originalIndex: number;
  aspectRatio?: number;
}

interface MusicTrack {
  id: string;
  name: string;
  artist: string;
  url: string;
}

const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showHeart, setShowHeart] = useState<number | null>(null);
  const [imageAspectRatios, setImageAspectRatios] = useState<{ [key: string]: number }>({});
  const [showHint, setShowHint] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(() => 
    Math.floor(Math.random() * 2) // Random entre 0 y 1 para las 2 canciones
  );
  
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollTime = useRef(0);
  const scrollVelocity = useRef(0);

  // Solo 2 canciones
  const musicTracks: MusicTrack[] = [
    {
      id: 'dans-le-vide',
      name: 'Dans le vide',
      artist: 'Golden Era',
      url: audio.danslevide
    },
    {
      id: 'skyfall',
      name: 'Skyfall',
      artist: 'Golden Era',
      url: audio.skyfall
    }
  ];

  // Play next track - cambiar entre las 2 canciones
  const playNextTrack = useCallback(() => {
    if (!audioRef.current) return;
    
    // Simplemente alternar entre 0 y 1
    const nextTrack = currentTrack === 0 ? 1 : 0;
    
    gsap.to(audioRef.current, {
      volume: 0,
      duration: 0.2, // Más rápido para cambio instantáneo
      onComplete: () => {
        if (audioRef.current) {
          audioRef.current.src = musicTracks[nextTrack].url;
          setCurrentTrack(nextTrack);
          
          audioRef.current.play().then(() => {
            gsap.to(audioRef.current, {
              volume: 0.3,
              duration: 0.2
            });
          }).catch(err => console.log('Audio play failed:', err));
        }
      }
    });
  }, [currentTrack, musicTracks]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.3;
    audioRef.current.loop = true; // Loop la canción actual
    
    const initAudio = async () => {
      if (audioRef.current) {
        audioRef.current.src = musicTracks[currentTrack].url;
        try {
          await audioRef.current.play();
        } catch (err) {
          console.log('Waiting for user interaction to play audio');
        }
      }
    };

    initAudio();

    const handleUserInteraction = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch (err) {
          console.error('Audio play failed:', err);
        }
      }
    };

    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  // Quotes
  const quotes = [
    { 
      content: 'Build a body that speaks for you.',
      contentPart2: 'Become untouchable.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Transform your physique.',
      contentPart2: 'Transform your life.',
      background: 'black',
      color: '#EAC31B',
      colorPart2: 'white'
    },
    { 
      content: 'With no muscles comes no respect.',
      contentPart2: 'Build a body that commands attention.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Discipline builds muscle.',
      contentPart2: 'Muscle builds confidence.',
      background: 'black',
      color: '#EAC31B',
      colorPart2: 'white'
    },
    { 
      content: 'Gold is forged with fire,',
      contentPart2: 'just as muscle with iron.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Your body is your first impression.',
      contentPart2: 'Make it count.',
      background: 'black',
      color: '#EAC31B',
      colorPart2: 'white'
    },
    { 
      content: 'The pain you feel today',
      contentPart2: 'will be the strength you feel tomorrow.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    },
    { 
      content: 'Champions are made in the gym.',
      contentPart2: 'Legends are made in Golden Era.',
      background: 'black',
      color: 'white',
      colorPart2: '#EAC31B'
    }
  ];

const galleryImages = Array.from(new Set(images.gallery));

  const createSlides = useCallback((): Slide[] => {
    const slides: Slide[] = [];
    let imageIndex = 0;
    let quoteIndex = 0;
    let slideId = 1;

    // Crear patrón fijo: 2 imágenes, 1 quote
    while (imageIndex < galleryImages.length || quoteIndex < quotes.length) {
      // Añadir 2 imágenes
      for (let i = 0; i < 2; i++) {
        if (imageIndex < galleryImages.length) {
          slides.push({
            id: slideId++,
            type: 'image',
            image: galleryImages[imageIndex],
            originalIndex: imageIndex,
            aspectRatio: imageAspectRatios[galleryImages[imageIndex]] || 1
          });
          imageIndex++;
        }
      }

      // Añadir 1 quote
      if (quoteIndex < quotes.length) {
        slides.push({
          id: slideId++,
          type: 'quote',
          ...quotes[quoteIndex],
          originalIndex: quoteIndex
        });
        quoteIndex++;
      }
    }

    return slides;
  }, [galleryImages, quotes, imageAspectRatios]);

  const [slides, setSlides] = useState<Slide[]>([]);

  // Load image aspect ratios
  useEffect(() => {
    const loadImageAspectRatios = async () => {
      const ratios: { [key: string]: number } = {};
      
      for (const imageSrc of galleryImages) {
        const img = new Image();
        img.src = imageSrc;
        await new Promise((resolve) => {
          img.onload = () => {
            ratios[imageSrc] = img.width / img.height;
            resolve(null);
          };
        });
      }
      
      setImageAspectRatios(ratios);
    };

    loadImageAspectRatios();
  }, [galleryImages]);

  useEffect(() => {
    setSlides(createSlides());
  }, [createSlides]);

  // Hide hint
  useEffect(() => {
    if (currentIndex > 0) {
      setShowHint(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // ScrollTrigger setup
  useEffect(() => {
    if (!containerRef.current || slides.length === 0) return;

    slidesRefs.current.forEach((slideRef, index) => {
      if (!slideRef) return;

      ScrollTrigger.create({
        trigger: slideRef,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setCurrentIndex(index);
          gsap.fromTo(slideRef.querySelector('.slide-content'), {
            scale: 0.98,
            opacity: 0.8
          }, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        },
        onEnterBack: () => {
          setCurrentIndex(index);
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [slides]);

  // Touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    lastScrollTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
    
    const currentTime = Date.now();
    const timeDiff = currentTime - lastScrollTime.current;
    const distance = touchStart - e.targetTouches[0].clientY;
    scrollVelocity.current = distance / timeDiff;
    lastScrollTime.current = currentTime;
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const threshold = 30;
    const velocityThreshold = 0.5;

    if (Math.abs(distance) > threshold || Math.abs(scrollVelocity.current) > velocityThreshold) {
      if (distance > 0 && currentIndex < slides.length - 1) {
        navigateToSlide(currentIndex + 1);
      } else if (distance < 0 && currentIndex > 0) {
        navigateToSlide(currentIndex - 1);
      }
    }

    setTouchStart(0);
    setTouchEnd(0);
    scrollVelocity.current = 0;
  }, [touchStart, touchEnd, currentIndex, slides.length]);

  const navigateToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length || index === currentIndex) return;
    
    setIsScrolling(true);
    
    const targetElement = slidesRefs.current[index];
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 600);
    }
  }, [currentIndex, slides.length]);

  // Double tap para like Y cambio de canción
  const handleDoubleTap = useCallback((slideId: number) => {
    // Toggle like
    setIsLiked(prev => ({
      ...prev,
      [slideId]: !prev[slideId]
    }));

    // Mostrar corazón
    setShowHeart(slideId);
    setTimeout(() => setShowHeart(null), 800);

    // Vibración suave
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // CAMBIAR CANCIÓN
    playNextTrack();
  }, [playNextTrack]);

  const lastTapRef = useRef(0);
  const handleTap = useCallback((slideId: number) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleDoubleTap(slideId);
    }
    lastTapRef.current = now;
  }, [handleDoubleTap]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isScrolling) return;
    
    switch(e.key) {
      case 'ArrowUp':
        if (currentIndex > 0) navigateToSlide(currentIndex - 1);
        break;
      case 'ArrowDown':
        if (currentIndex < slides.length - 1) navigateToSlide(currentIndex + 1);
        break;
      case ' ':
      case 'Enter':
        const currentSlide = slides[currentIndex];
        if (currentSlide) {
          handleDoubleTap(currentSlide.id);
        }
        break;
    }
  }, [currentIndex, navigateToSlide, handleDoubleTap, slides, isScrolling]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Preload images
  useEffect(() => {
    const preloadRange = 2;
    for (let i = Math.max(0, currentIndex - preloadRange); 
         i <= Math.min(slides.length - 1, currentIndex + preloadRange); 
         i++) {
      const slide = slides[i];
      if (slide?.type === 'image' && slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    }
  }, [currentIndex, slides]);

  const getLikeCount = (slideId: number) => {
    const baseCount = 1000 + (slideId * 237);
    return isLiked[slideId] ? baseCount + 1 : baseCount;
  };

  const getImageStyle = (slide: Slide) => {
    if (slide.type !== 'image' || !slide.aspectRatio) {
      return {};
    }

    const viewportAspectRatio = window.innerWidth / window.innerHeight;
    const imageAspectRatio = slide.aspectRatio;

    if (imageAspectRatio > viewportAspectRatio) {
      return {
        width: '100%',
        height: 'auto',
        maxHeight: '100vh',
        objectFit: 'cover' as const
      };
    } else {
      return {
        width: 'auto',
        height: '100%',
        maxWidth: '100vw',
        objectFit: 'cover' as const
      };
    }
  };

  return (
    <div 
      className="gallery-container" 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="track-info">
        <span className="track-name">{musicTracks[currentTrack].name}</span>
        <span className="track-artist">{musicTracks[currentTrack].artist}</span>
      </div>

      <div className="slides-wrapper">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={el => slidesRefs.current[index] = el}
            className={`gallery-slide ${slide.type} ${index === currentIndex ? 'active' : ''}`}
            style={slide.type === 'quote' ? { backgroundColor: slide.background } : {}}
            onClick={() => handleTap(slide.id)}
          >
            <div className="slide-content">
              {slide.type === 'image' ? (
                <>
                  <div className="image-wrapper">
                    <img 
                      src={slide.image} 
                      alt={`Gallery ${slide.id}`}
                      draggable={false}
                      style={getImageStyle(slide)}
                      loading={Math.abs(index - currentIndex) <= 2 ? "eager" : "lazy"}
                    />
                  </div>
                  
                  {showHeart === slide.id && (
                    <div className="heart-animation-overlay">
                      <div className="heart-icon">❤️</div>
                    </div>
                  )}

                  <div className="actions-sidebar">
                    <button 
                      className={`action-button like-button ${isLiked[slide.id] ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDoubleTap(slide.id);
                      }}
                    >
                      <span className="icon">❤️</span>
                      <span className="count">
                        {getLikeCount(slide.id).toLocaleString()}
                      </span>
                    </button>
                  </div>

                  {index === 0 && showHint && currentIndex === 0 && (
                    <div className="navigation-hint">
                      <div className="swipe-icon">👆</div>
                      <p>Swipe up</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="quote-content">
                  <h2 style={{ color: slide.color }}>
                    {slide.content}
                  </h2>
                  {slide.contentPart2 && (
                    <h2 style={{ color: slide.colorPart2 }}>
                      {slide.contentPart2}
                    </h2>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="progress-indicator">
        <div 
          className="progress-bar"
          style={{ 
            height: `${((currentIndex + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default Gallery;
