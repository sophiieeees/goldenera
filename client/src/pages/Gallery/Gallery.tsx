// client/src/pages/Gallery/Gallery.tsx 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { images } from '../../assets/images';
import { audio } from '../../assets/audio';
import './Gallery.scss';

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
  const [showHeart, setShowHeart] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(() => Math.floor(Math.random() * 2));

  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🎵 Música
  const musicTracks: MusicTrack[] = [
    { id: 'dans-le-vide', name: 'Dans le vide', artist: 'Golden Era', url: audio.danslevide },
    { id: 'skyfall', name: 'Skyfall', artist: 'Golden Era', url: audio.skyfall }
  ];

  const playNextTrack = useCallback(() => {
    if (!audioRef.current) return;
    const nextTrack = currentTrack === 0 ? 1 : 0;

    gsap.to(audioRef.current, {
      volume: 0,
      duration: 0.2,
      onComplete: () => {
        if (audioRef.current) {
          audioRef.current.src = musicTracks[nextTrack].url;
          setCurrentTrack(nextTrack);
          audioRef.current.play();
          gsap.to(audioRef.current, { volume: 0.3, duration: 0.2 });
        }
      }
    });
  }, [currentTrack, musicTracks]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.3;
    audioRef.current.loop = true;

    audioRef.current.src = musicTracks[currentTrack].url;
    audioRef.current.play().catch(() => {});
  }, []);

  // 💬 Quotes
  const quotes = [
    { content: 'Build a body that speaks for you.', contentPart2: 'Become untouchable.', background: 'black', color: 'white', colorPart2: '#EAC31B' },
    { content: 'Transform your physique.', contentPart2: 'Transform your life.', background: 'black', color: '#EAC31B', colorPart2: 'white' },
    { content: 'Discipline builds muscle.', contentPart2: 'Muscle builds confidence.', background: 'black', color: '#EAC31B', colorPart2: 'white' }
  ];

  // 🔥 SHUFFLE + REMOVE DUPLICATES
  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

  const galleryImages = shuffleArray(
    Array.from(new Set(Object.values(images.gallery)))
  );

  // 🧠 Crear slides
  const createSlides = useCallback((): Slide[] => {
    const slides: Slide[] = [];
    let imageIndex = 0;
    let quoteIndex = 0;
    let id = 1;

    while (imageIndex < galleryImages.length || quoteIndex < quotes.length) {
      for (let i = 0; i < 2; i++) {
        if (imageIndex < galleryImages.length) {
          slides.push({
            id: id++,
            type: 'image',
            image: galleryImages[imageIndex++]
          });
        }
      }

      if (quoteIndex < quotes.length) {
        slides.push({
          id: id++,
          type: 'quote',
          ...quotes[quoteIndex++]
        });
      }
    }

    return slides;
  }, [galleryImages, quotes]);

  const [slides, setSlides] = useState<Slide[]>([]);

  useEffect(() => {
    setSlides(createSlides());
  }, [createSlides]);

  // 🎯 Scroll animation
  useEffect(() => {
    slidesRefs.current.forEach((ref, index) => {
      if (!ref) return;

      ScrollTrigger.create({
        trigger: ref,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCurrentIndex(index),
        onEnterBack: () => setCurrentIndex(index)
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [slides]);

  // ❤️ Like + música
  const handleDoubleTap = (id: number) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }));
    setShowHeart(id);
    setTimeout(() => setShowHeart(null), 800);
    playNextTrack();
  };

  const lastTap = useRef(0);
  const handleTap = (id: number) => {
    const now = Date.now();
    if (now - lastTap.current < 300) handleDoubleTap(id);
    lastTap.current = now;
  };

  const getImageStyle = () => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  });

  return (
    <div className="gallery-container" ref={containerRef}>
      
      <div className="track-info">
        <span>{musicTracks[currentTrack].name}</span>
        <span>{musicTracks[currentTrack].artist}</span>
      </div>

      <div className="slides-wrapper">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={el => slidesRefs.current[index] = el}
            className={`gallery-slide ${slide.type}`}
            onClick={() => handleTap(slide.id)}
            style={slide.type === 'quote' ? { background: slide.background } : {}}
          >
            <div className="slide-content">

              {slide.type === 'image' ? (
                <>
                  <div className="image-wrapper">
                    <img src={slide.image} style={getImageStyle()} />
                  </div>

                  {showHeart === slide.id && (
                    <div className="heart-animation-overlay">
                      ❤️
                    </div>
                  )}

                </>
              ) : (
                <div className="quote-content">
                  <h2 style={{ color: slide.color }}>{slide.content}</h2>
                  <h2 style={{ color: slide.colorPart2 }}>{slide.contentPart2}</h2>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
