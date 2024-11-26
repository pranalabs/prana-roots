'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from 'next-themes';
import RotatingCarousel from '@/components/rotating-carousel';

const polygons = [
  // Base Shape
  { id: 1, clipPath: 'polygon(40% 40%, 60% 40%, 50% 60%)', color: 'var(--frozen-turquoise)', translateZ: '0px' },
  { id: 2, clipPath: 'polygon(35% 35%, 65% 35%, 50% 45%)', color: 'var(--megaman)', translateZ: '5px' },
  { id: 3, clipPath: 'polygon(30% 30%, 70% 30%, 50% 40%)', color: 'var(--heart-of-ice)', translateZ: '10px' },
  
  // Beak
  { id: 4, clipPath: 'polygon(45% 40%, 55% 40%, 50% 50%)', color: 'var(--lime-lightning)', translateZ: '20px' },
  { id: 5, clipPath: 'polygon(47% 42%, 53% 42%, 50% 48%)', color: 'var(--electric-lettuce)', translateZ: '25px' },
  { id: 6, clipPath: 'polygon(48% 44%, 52% 44%, 50% 46%)', color: 'var(--thallium-flame)', translateZ: '30px' },
  
  // Head Detail
  { id: 7, clipPath: 'polygon(35% 35%, 45% 30%, 40% 40%)', color: 'var(--fake-jade)', translateZ: '15px' },
  { id: 8, clipPath: 'polygon(55% 30%, 65% 35%, 60% 40%)', color: 'var(--fake-jade)', translateZ: '15px' },
  
  // Wings - More Dynamic
  { id: 9, clipPath: 'polygon(25% 45%, 45% 40%, 35% 60%)', color: 'var(--thallium-flame)', translateZ: '15px' },
  { id: 10, clipPath: 'polygon(55% 40%, 75% 45%, 65% 60%)', color: 'var(--thallium-flame)', translateZ: '15px' },
  
  // Eyes - More Prominent
  { id: 11, clipPath: 'polygon(42% 31%, 45% 34%, 43% 37%)', color: '#FFFFFF', translateZ: '40px' }, // Left eye white
  { id: 12, clipPath: 'polygon(43% 32%, 44.5% 34%, 43.5% 36%)', color: '#000000', translateZ: '45px' }, // Left eye pupil
  { id: 13, clipPath: 'polygon(57% 31%, 60% 34%, 58% 37%)', color: '#FFFFFF', translateZ: '40px' }, // Right eye white
  { id: 14, clipPath: 'polygon(58% 32%, 59.5% 34%, 58.5% 36%)', color: '#000000', translateZ: '45px' }, // Right eye pupil
  
  // Additional Detail Layers
  { id: 15, clipPath: 'polygon(40% 55%, 45% 60%, 42% 65%)', color: 'var(--megaman)', translateZ: '5px' },
  { id: 16, clipPath: 'polygon(55% 55%, 60% 60%, 58% 65%)', color: 'var(--megaman)', translateZ: '5px' },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const toucanRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [leftEyePos, setLeftEyePos] = useState({ x: 0, y: 0 });
  const [rightEyePos, setRightEyePos] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const toucan = toucanRef.current;
    if (!container || !toucan) return;

    let bounds = container.getBoundingClientRect();
    let mouseX = bounds.left + bounds.width / 2;
    let mouseY = bounds.top + bounds.height / 2;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      bounds = container.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      mouseX = e.clientX;
      mouseY = e.clientY;

      targetRotateY = ((mouseX - centerX) / (window.innerWidth / 2)) * 25;
      targetRotateX = ((mouseY - centerY) / (window.innerHeight / 2)) * -25;
    };

    const animate = () => {
      currentRotateX += (targetRotateX - currentRotateX) * 0.1;
      currentRotateY += (targetRotateY - currentRotateY) * 0.1;

      toucan.style.transform = `
        rotateX(${currentRotateX}deg) 
        rotateY(${currentRotateY}deg)
      `;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculateRotation = useCallback((mouseX: number, mouseY: number) => {
    if (toucanRef.current) {
      const toucanRect = toucanRef.current.getBoundingClientRect();
      const toucanCenterX = toucanRect.left + toucanRect.width / 2;
      const toucanCenterY = toucanRect.top + toucanRect.height / 2;
      
      const dx = mouseX - toucanCenterX;
      const dy = mouseY - toucanCenterY;
      
      // Limit rotation to +/- 25 degrees
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const limitedAngle = Math.max(-25, Math.min(25, angle));
      
      return limitedAngle;
    }
    return 0;
  }, []);

  const updateEyePositions = useCallback(() => {
    if (toucanRef.current) {
      const toucanRect = toucanRef.current.getBoundingClientRect();
      const toucanWidth = toucanRect.width;
      const toucanHeight = toucanRect.height;
      
      // Left pupil: polygon(43% 32%, 44.5% 34%, 43.5% 36%)
      const leftPupilCenterX = toucanRect.left + (toucanWidth * 0.435);
      const leftPupilCenterY = toucanRect.top + (toucanHeight * 0.35);
      
      // Right pupil: polygon(58% 32%, 59.5% 34%, 58.5% 36%)
      const rightPupilCenterX = toucanRect.left + (toucanWidth * 0.585);
      const rightPupilCenterY = toucanRect.top + (toucanHeight * 0.35);
      
      setLeftEyePos({ x: leftPupilCenterX, y: leftPupilCenterY });
      setRightEyePos({ x: rightPupilCenterX, y: rightPupilCenterY });
    }
  }, []);

  useEffect(() => {
    updateEyePositions();
    window.addEventListener('resize', updateEyePositions);
    window.addEventListener('scroll', updateEyePositions);

    const initialUpdateTimeout = setTimeout(updateEyePositions, 100);
    const postAnimationTimeout = setTimeout(updateEyePositions, 2100);

    return () => {
      window.removeEventListener('resize', updateEyePositions);
      window.removeEventListener('scroll', updateEyePositions);
      clearTimeout(initialUpdateTimeout);
      clearTimeout(postAnimationTimeout);
    };
  }, [updateEyePositions]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const shootLaser = useCallback((clickX: number, clickY: number) => {
    // Only shoot lasers in dark mode
    if (theme !== 'dark') return;

    [leftEyePos, rightEyePos].forEach((eyePos) => {
      const laser = document.createElement('div');
      laser.className = 'laser-beam';
      document.body.appendChild(laser);

      // Calculate angle and distance
      const dx = clickX - eyePos.x;
      const dy = clickY - eyePos.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Position and size the laser
      laser.style.left = `${eyePos.x}px`;
      laser.style.top = `${eyePos.y}px`;
      laser.style.width = `${distance}px`;
      laser.style.setProperty('--angle', `${angle}deg`);

      // Remove the laser after animation completes
      laser.addEventListener('animationend', () => {
        laser.remove();
      });
    });
  }, [leftEyePos, rightEyePos, theme]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Check if clicking anywhere in the theme toggle button or its children
      const themeButton = target.closest('button');
      if (themeButton?.querySelector('.sun-icon') || 
          themeButton?.querySelector('svg[class*="text-amber"]') ||
          target.closest('svg[class*="text-amber"]')) {
        return;
      }
      
      shootLaser(e.clientX, e.clientY);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [shootLaser]);

  const isThemeToggleClick = (e: MouseEvent) => {
    const target = e.target as Element;
    return !!(target.closest('.theme-toggle') || target.closest('button[aria-label="Toggle theme"]') || target.closest('svg'));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-x-hidden">
      {/* Sticky Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border/40 bg-background/80">
        <div className="max-w-5xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span 
              className="text-2xl font-light tracking-wider"
              style={{
                background: 'linear-gradient(to right, var(--megaman), var(--frozen-turquoise))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.15em'
              }}
            >
              Prana Local
            </span>
            <span className="text-[11px] tracking-[0.35em] text-muted-foreground font-light uppercase">
              Local Business Digitization Acccelerator
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Section with Toucan and Content */}
      <div className="w-full max-w-7xl mx-auto px-8 mt-32 -mb-12 md:-mb-8 lg:mb-0">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-start relative">
          {/* Left Content */}
          <div className="space-y-14 pt-8 md:pt-12">
            {/* Hero Title */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold 
                bg-gradient-to-r from-[var(--megaman)] to-[var(--frozen-turquoise)] 
                bg-clip-text text-transparent leading-[1.1]
                tracking-tight text-shadow max-w-3xl">
                Expert Tech for Local Champions
              </h1>
              
              {/* Main Description */}
              <p className="text-xl md:text-2xl leading-relaxed
                max-w-2xl
                text-gray-700 dark:text-slate-100 important-text
                tracking-wide">
                Bringing world-class digital solutions to local businesses. 
                We combine deep technical expertise with local business understanding 
                to help you truly stand out and deliver exceptional customer experiences.
              </p>

              {/* Subtitle */}
              <p className="text-lg md:text-xl 
                text-gray-600 dark:text-slate-200 important-text
                tracking-wider font-light">
                <span className="inline-block transform hover:scale-105 transition-transform duration-200">
                  Advanced Solutions
                </span>
                <span className="mx-4 text-gray-400 dark:text-slate-400">·</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-200">
                  Local Impact
                </span>
                <span className="mx-4 text-gray-400 dark:text-slate-400">·</span>
                <span className="inline-block transform hover:scale-105 transition-transform duration-200">
                  Real Results
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6 justify-start items-center pt-4">
              <button className="inline-flex items-center justify-center rounded-md text-base font-medium
                bg-[var(--megaman)] text-white hover:bg-[var(--frozen-turquoise)]
                px-10 py-4 transition-all duration-200 hover:scale-105
                shadow-lg hover:shadow-xl">
                Get Started
              </button>
              <button className="inline-flex items-center justify-center rounded-md text-base font-medium
                border-2 border-[var(--megaman)] text-[var(--megaman)]
                hover:bg-[var(--megaman)] hover:text-white
                px-10 py-4 transition-all duration-200 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          {/* Toucan Container */}
          <div className="relative w-full flex justify-center md:justify-end lg:w-auto lg:block lg:absolute lg:top-[-160px] lg:right-[-180px] xl:right-[-240px]">
            <div ref={containerRef} className="toucan-container">
              <div className="toucan-shadow">
                {polygons.map((polygon) => (
                  <div
                    key={`shadow-${polygon.id}`}
                    className="polygon-shadow"
                    style={{
                      clipPath: polygon.clipPath,
                    }}
                  />
                ))}
              </div>
              <div ref={toucanRef} className="toucan-wrap">
                {polygons.map((polygon) => (
                  <div 
                    key={polygon.id} 
                    className={`polygon ${isInitialLoad ? 'fly-in' : ''}`}
                    style={{
                      clipPath: polygon.clipPath,
                      backgroundColor: polygon.color,
                      transform: `translateZ(${polygon.translateZ})`,
                      animationDelay: `${(polygon.id * 0.1)}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rotating Carousel */}
      <div className="w-full py-4 md:py-8 lg:py-16 bg-gradient-to-b from-transparent to-background/80">
        <RotatingCarousel />
      </div>

      {/* Content Sections */}
      <div className="w-full max-w-6xl mx-auto px-8 py-24 space-y-32">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[/* ... */].map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border bg-background p-10 hover:shadow-lg transition-all duration-300
                hover:shadow-[var(--frozen-turquoise)]/10 hover:-translate-y-1"
            >
              <div className="text-4xl mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[var(--megaman)] to-[var(--frozen-turquoise)] bg-clip-text text-transparent">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Section */}
        <div className="relative rounded-2xl border bg-background/50 backdrop-blur-sm p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--megaman)]/5 to-[var(--frozen-turquoise)]/5" />
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold mb-12 bg-gradient-to-r from-[var(--megaman)] to-[var(--frozen-turquoise)] bg-clip-text text-transparent">
              Why Choose Prana Local?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {[/* ... */].map((feature, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8 py-12">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-[var(--megaman)] to-[var(--frozen-turquoise)] bg-clip-text text-transparent">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let's discuss how our technology solutions can drive your business forward
          </p>
          <button className="inline-flex items-center justify-center rounded-md text-lg font-medium
            bg-[var(--megaman)] text-white hover:bg-[var(--frozen-turquoise)]
            px-10 py-4 transition-all duration-300 hover:scale-105
            shadow-lg hover:shadow-xl">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
