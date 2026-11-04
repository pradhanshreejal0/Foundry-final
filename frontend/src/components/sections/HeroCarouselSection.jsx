import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroCarouselSection({ config = {} }) {
  const slides = config.slides || [
    {
      title: "Lumia Shopify 2.0 Full Sync",
      subtitle: "Discover the latest collection with boost conversions and sleek design.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
      cta: "Shop Now",
      link: "/shop"
    },
    {
      title: "Limited Edition Arrivals",
      subtitle: "Elevate your wardrobe with premium apparel and accessories.",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80",
      cta: "Explore Collection",
      link: "/shop"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-2xl shadow-lg bg-card text-card-foreground">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover brightness-90 dark:brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center p-8 md:p-16">
            <div className="max-w-xl space-y-4 text-white">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Featured
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base text-gray-200">
                {slide.subtitle}
              </p>
              <div>
                <Button asChild size="lg" className="rounded-full px-8">
                  <a href={slide.link}>{slide.cta}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background p-2 rounded-full shadow transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background p-2 rounded-full shadow transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
