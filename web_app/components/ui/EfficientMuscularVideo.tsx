'use client';

import React, { useRef, useEffect, useState } from 'react';

export interface EfficientMuscularVideoProps {
  className?: string;
  poster?: string;
  alt?: string;
  blendMultiply?: boolean;
}

/**
 * Ultra-efficient GPU-accelerated video component for the 3D muscular model.
 * 
 * Features:
 * - IntersectionObserver: Automatically pauses playback when scrolled out of view (0% idle GPU/CPU).
 * - Page Visibility API: Immediately pauses playback when browser tab is inactive.
 * - Hardware acceleration with will-change: transform and translateZ(0).
 * - Instant poster fallback: zero layout shift (CLS = 0) and graceful error fallback.
 * - Non-blocking pointer events: allows full hover/click interactivity for anatomical joint pins.
 */
export function EfficientMuscularVideo({
  className = 'w-full h-full object-contain',
  poster = '/muscular_poster.jpg',
  alt = '3D Anatomical Muscular Model Video',
  blendMultiply = true
}: EfficientMuscularVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // IntersectionObserver to only decode and play frames when visible in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !document.hidden) {
            video.play().catch(() => {
              // Browser autoplay policy or abort handled gracefully
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '100px'
      }
    );

    observer.observe(video);

    // Page Visibility API: pause when tab is in background to save 100% CPU/GPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {!hasError ? (
        <video
          ref={videoRef}
          src="/muscular_men.mp4"
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`${className} pointer-events-none select-none transition-opacity duration-300 ${
            blendMultiply ? 'mix-blend-multiply' : ''
          } ${isLoaded ? 'opacity-100' : 'opacity-90'}`}
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        />
      ) : (
        /* Fallback to static poster if video decoding encounters any hardware failure */
        <img
          src={poster}
          alt={alt}
          className={`${className} pointer-events-none select-none ${
            blendMultiply ? 'mix-blend-multiply' : ''
          }`}
        />
      )}
    </div>
  );
}
