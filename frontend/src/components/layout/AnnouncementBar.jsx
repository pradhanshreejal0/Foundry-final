import React, { useState, useEffect } from 'react';
import { useThemeSettings } from '../../context/ThemeSettingsContext';
import { Clock } from 'lucide-react';

export default function AnnouncementBar() {
  const { settings } = useThemeSettings();
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!settings?.countdownTarget) return;

    const targetTime = new Date(settings.countdownTarget).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings?.countdownTarget]);

  if (!settings?.announcementEnabled) return null;

  return (
    <div className="bg-black text-white text-xs sm:text-sm py-2 px-4 flex flex-wrap items-center justify-center gap-4 tracking-wider font-medium">
      <span>{settings.announcementText}</span>
      <div className="flex items-center gap-1.5 bg-neutral-800 px-3 py-0.5 rounded text-neutral-200">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>
          Ends in: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
