import React, { useEffect, useRef, useState } from 'react';
import './AnimatedSection.css';

// Animated section wrapper with scroll-triggered animations
const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-up', // fade-up, fade-left, fade-right, scale, none
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  staggerChildren = false,
  staggerDelay = 100,
  style = {}
}) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay if specified
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [delay, threshold, triggerOnce]);

  // Apply stagger delays to children if enabled
  useEffect(() => {
    if (staggerChildren && isVisible && sectionRef.current) {
      const children = sectionRef.current.querySelectorAll('.stagger-child');
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * staggerDelay}ms`;
        child.classList.add('stagger-visible');
      });
    }
  }, [isVisible, staggerChildren, staggerDelay]);

  const getAnimationClass = () => {
    if (animation === 'none') return '';

    const baseClass = 'animated-section';
    const animClass = `animate-${animation}`;
    const visibleClass = isVisible ? 'is-visible' : '';

    return `${baseClass} ${animClass} ${visibleClass}`;
  };

  return (
    <div
      ref={sectionRef}
      className={`${getAnimationClass()} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

// Animated sticker wrapper
export const AnimatedSticker = ({
  children,
  animation = 'pop', // pop, bounce, slide, float
  delay = 0,
  floatSpeed = 'normal', // slow, normal, fast
  rotation = 0,
  className = '',
  style = {}
}) => {
  const stickerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = stickerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [delay]);

  const floatDuration = {
    slow: '8s',
    normal: '5s',
    fast: '3s'
  };

  const getAnimationStyle = () => {
    if (!isVisible) {
      return {
        opacity: 0,
        transform: `scale(0) rotate(${rotation}deg)`,
        ...style
      };
    }

    return {
      '--rotation': `${rotation}deg`,
      '--float-duration': floatDuration[floatSpeed],
      ...style
    };
  };

  const getClassName = () => {
    const base = 'animated-sticker';
    const animClass = isVisible ? `sticker-${animation}-in` : 'sticker-hidden';
    const floatClass = isVisible && animation !== 'none' ? 'sticker-float' : '';

    return `${base} ${animClass} ${floatClass} ${className}`;
  };

  return (
    <div
      ref={stickerRef}
      className={getClassName()}
      style={getAnimationStyle()}
    >
      {children}
    </div>
  );
};

// Ripple button effect hook
export const useRipple = () => {
  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const circle = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    // Remove existing ripple
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(circle);

    // Clean up after animation
    setTimeout(() => circle.remove(), 600);
  };

  return createRipple;
};

export default AnimatedSection;
