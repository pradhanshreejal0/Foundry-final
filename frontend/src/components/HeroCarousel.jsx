import React, { useState, useEffect } from 'react';
import { useThemeSettings } from '../context/ThemeSettingsContext';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroCarousel() {
  const { banners } = useThemeSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBanners = banners && banners.length > 0 ? banners : [
    {
      _id: 'default-1',
      title: 'NEW SEIKO AUTOMATIC',
      subtitle: 'Precision craftsmanship & timeless elegance',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1600',
      linkUrl: '/shop',
      buttonText: 'Shop Now'
    }
  ];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  if (!activeBanners.length) return null;

  const current = activeBanners[currentIndex];

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] overflow-hidden bg-neutral-900">
      <img
        src={current.imageUrl}
        alt={current.title}
        className="w-full h-full object-cover opacity-85 transition-transform duration-700 ease-out transform hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-white space-y-4 max-w-xl">
          <span className="text-xs sm:text-sm tracking-widest uppercase font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded">
            Seiko Official Collection
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            {current.title}
          </h1>
          {current.subtitle && (
            <p className="text-sm sm:text-lg text-neutral-200">
              {current.subtitle}
            </p>
          )}
          <div className="pt-4">
            <Link to={current.linkUrl || '/shop'}>
              <Button size="lg" className="bg-white text-black hover:bg-neutral-200 font-semibold px-8 py-3 rounded-none shadow-lg">
                {current.buttonText || 'Shop Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
