import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollSequenceProps {
  // Height of the scrollable area (e.g., "300vh")
  scrollHeight?: string;
}

export const SmoothScrollSequence: React.FC<SmoothScrollSequenceProps> = ({
  scrollHeight = '300vh',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Store loaded images in a ref to avoid state-driven re-renders during scroll
  const imagesRef = useRef<HTMLImageElement[]>([]);
  // Store the proxy object that GSAP will tween to handle the momentum easing
  const frameProxy = useRef({ frame: 0 });

  // Generate image paths: /images/01.jpg to /images/15.jpg
  const frameCount = 15;
  const imagePaths = Array.from({ length: frameCount }, (_, i) => {
    const paddedIndex = String(i + 1).padStart(2, '0');
    return `/images/${paddedIndex}.jpg`;
  });

  // --------------------------------------------------------
  // 1. ROBUST PRELOADER
  // --------------------------------------------------------
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const loadImages = async () => {
      const promises = imagePaths.map((src, index) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loadedImages[index] = img;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / frameCount) * 100));
            resolve();
          };
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(promises);
        imagesRef.current = loadedImages;
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load image sequence', error);
      }
    };

    loadImages();
  }, []); // Run once on mount

  // --------------------------------------------------------
  // 2. GSAP SCROLLTRIGGER & MOMENTUM EASING
  // --------------------------------------------------------
  useEffect(() => {
    if (!isLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false optimizes rendering
    if (!ctx) return;

    // Draw function to render a specific frame to the canvas
    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img) return;

      // Ensure canvas resolution matches image for 1:1 hardware blit
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }

      ctx.drawImage(img, 0, 0);
    };

    // Render the very first frame immediately upon load
    renderFrame(0);

    // The Secret Sauce: Tweening a proxy object
    // Instead of tying the frame directly to scroll progress (which causes stuttering at low FPS),
    // we use a GSAP tween with `scrub: 1`. This adds 1 second of interpolation/lag.
    // The frameProxy smoothly glides towards the target scroll value, giving the 15 frames a buttery momentum.
    const animation = gsap.to(frameProxy.current, {
      frame: frameCount - 1, // Target the last frame index
      snap: 'frame',         // Forces GSAP to round the interpolated value to an integer (0, 1, 2...)
      ease: 'none',          // Linear progress through the timeline
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,          // 1.5 seconds of smoothing momentum! (Adjust for more/less lag)
      },
      onUpdate: () => {
        // As the proxy object tweens, we read the rounded frame and draw it
        renderFrame(frameProxy.current.frame);
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, frameCount]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: scrollHeight }}
    >
      {/* 
        Sticky Canvas Container 
        Keeps the canvas pinned to the viewport while the parent container scrolls 
      */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Loading State Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
            <span className="text-sm tracking-widest uppercase mb-4">Loading sequence</span>
            <div className="w-48 h-1 bg-gray-800 rounded">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out rounded"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 
          The Canvas Element
          w-full h-full + object-cover utilizes CSS GPU scaling 
          so the canvas fills the screen dynamically without heavy JS math
        */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};
