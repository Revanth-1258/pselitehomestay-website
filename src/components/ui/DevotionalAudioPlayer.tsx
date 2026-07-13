'use client';

import React, { useRef, useEffect } from 'react';

// Reliable direct Om Namo Venkatesaya / Suprabhatam devotional audio URLs
const DEVOTIONAL_SONG_URLS = [
  'https://ia600301.us.archive.org/15/items/SriVenkateswaraSuprabhatam_201605/01%20-%20Sri%20Venkateswara%20Suprabhatam.mp3',
  'https://ia800301.us.archive.org/15/items/SriVenkateswaraSuprabhatam_201605/01%20-%20Sri%20Venkateswara%20Suprabhatam.mp3',
];

export const DevotionalAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Full audible volume
    audio.volume = 1.0;

    // Attempt immediate autoplay of the real song on load
    const attemptPlay = () => {
      audio.play().catch(() => {
        // Browser Autoplay Policy deferred playback until user interaction
      });
    };

    attemptPlay();

    // The moment the user clicks, taps, presses a key, or scrolls anywhere on the page, play the real song
    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.volume = 1.0;
        audio.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstInteraction, { capture: true });
    window.addEventListener('pointerdown', handleFirstInteraction, { capture: true });
    window.addEventListener('keydown', handleFirstInteraction, { capture: true });
    window.addEventListener('touchstart', handleFirstInteraction, { capture: true });
    window.addEventListener('scroll', handleFirstInteraction, { capture: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction, { capture: true });
      window.removeEventListener('pointerdown', handleFirstInteraction, { capture: true });
      window.removeEventListener('keydown', handleFirstInteraction, { capture: true });
      window.removeEventListener('touchstart', handleFirstInteraction, { capture: true });
      window.removeEventListener('scroll', handleFirstInteraction, { capture: true });
    };
  }, []);

  // 100% invisible — no wizard, no banners, no pills, no pop sounds
  return (
    <audio
      ref={audioRef}
      autoPlay
      loop
      preload="auto"
      className="hidden"
    >
      <source src={DEVOTIONAL_SONG_URLS[0]} type="audio/mpeg" />
      <source src={DEVOTIONAL_SONG_URLS[1]} type="audio/mpeg" />
    </audio>
  );
};
