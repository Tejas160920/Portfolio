import { useEffect } from 'react';

function styleInject(css, ref) {
  if ( ref === undefined ) ref = {};
  var insertAt = ref.insertAt;
  if (typeof document === 'undefined') { return; }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = `
body{cursor:none!important}

.cursor-dot{
  background-color:var(--accent-green,#4ade80);
  border-radius:50%;
  width:6px;height:6px;
  left:0;top:0;
  position:fixed;
  pointer-events:none;
  transform:translate(-50%,-50%);
  transition:opacity .15s ease, background-color .3s ease;
  z-index:9999999999999;
}
.cursor-dot-hidden{opacity:0}

/* Free-roaming ring. Position is driven frame-by-frame in JS, so only the
   morph properties are transitioned here — transitioning left/top is what
   made the cursor feel sluggish. */
.cursor-circle{
  border:2px solid var(--accent-green,#4ade80);
  border-radius:50%;
  box-sizing:border-box;
  width:34px;height:34px;
  left:0;top:0;
  position:fixed;
  pointer-events:none;
  transform:translate(-50%,-50%);
  transition:width .22s cubic-bezier(.22,1,.36,1),
             height .22s cubic-bezier(.22,1,.36,1),
             border-radius .22s cubic-bezier(.22,1,.36,1),
             border-color .3s ease,
             background-color .3s ease;
  z-index:9999999999998;
}

/* Locked onto an element: left/top now carry real positions, so they get a
   short ease. The rect is re-read every frame, so a button that lifts on
   hover keeps the ring with it. */
.cursor-circle.hovered{
  box-sizing:border-box;margin:0;padding:0;
  transform:none;
  transition:all .18s cubic-bezier(.22,1,.36,1);
}

a,button,input,textarea,select,label,[role="button"],.social-button,.theme-toggle,.like-button,.suggestion-card,.chatbot-toggle,.new-chat-btn,.back-to-portfolio,.send-button,.mobile-close-btn,.saved-chat-item,.delete-chat-btn,.hero-cta,.footer-link,.footer-top,.scroll-cue,.sw-wheel{cursor:none!important}
`;
styleInject(css_248z);

const CustomCursor = () => {
  useEffect(() => {
    // Check if the device is mobile/touch device
    const isMobileDevice = () => {
      return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };

    // Only proceed if it's not a mobile device
    if (!isMobileDevice()) {
      const cursorDot = document.createElement('div');
      const cursorCircle = document.createElement('div');
      cursorDot.className = 'cursor-dot';
      cursorCircle.className = 'cursor-circle';
      document.body.appendChild(cursorDot);
      document.body.appendChild(cursorCircle);

      let position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      // Where the ring has caught up to. Kept separate from `position` so the
      // ring can trail the dot instead of being welded to it.
      let ringPos = { x: position.x, y: position.y };
      let isHovered = false;
      let currentHoveredElement = null;
      let hoveredRadius = '50%';
      let rafId = null;

      // Fraction of the remaining gap the ring closes each frame. Higher =
      // snappier. 0.18 read as laggy; 0.34 keeps the trail but stays tight.
      const FOLLOW = 0.34;

      const resetHoverState = () => {
        isHovered = false;
        currentHoveredElement = null;
        cursorDot.classList.remove('cursor-dot-hidden');
        cursorCircle.classList.remove('hovered');
        // Clear the inline box left behind by the morph
        cursorCircle.style.width = '';
        cursorCircle.style.height = '';
        cursorCircle.style.borderRadius = '';
        cursorCircle.style.border = '';
        // Resume the trail from wherever the ring currently sits
        ringPos.x = position.x;
        ringPos.y = position.y;
      };

      const render = () => {
        // The dot always tracks the pointer exactly — no smoothing, no lag.
        cursorDot.style.left = `${position.x}px`;
        cursorDot.style.top = `${position.y}px`;

        if (isHovered && currentHoveredElement) {
          if (!document.body.contains(currentHoveredElement)) {
            resetHoverState();
          } else {
            // Re-measure every frame. Buttons that lift or scale on hover
            // move after mouseenter fired, and reading the rect once left
            // the ring sitting where the button used to be.
            const rect = currentHoveredElement.getBoundingClientRect();
            cursorCircle.style.left = `${rect.left}px`;
            cursorCircle.style.top = `${rect.top}px`;
            cursorCircle.style.width = `${rect.width}px`;
            cursorCircle.style.height = `${rect.height}px`;
            cursorCircle.style.borderRadius = hoveredRadius;
          }
        }

        if (!isHovered) {
          ringPos.x += (position.x - ringPos.x) * FOLLOW;
          ringPos.y += (position.y - ringPos.y) * FOLLOW;
          cursorCircle.style.left = `${ringPos.x}px`;
          cursorCircle.style.top = `${ringPos.y}px`;
        }

        rafId = requestAnimationFrame(render);
      };

      const updatePosition = e => {
        position.x = e.clientX;
        position.y = e.clientY;
      };

      const handleMouseEnter = e => {
        const el = e.currentTarget;
        const computedStyle = window.getComputedStyle(el);
        const isIcon = el.tagName === 'IMG' || computedStyle.borderRadius === '50%';

        isHovered = true;
        currentHoveredElement = el;
        hoveredRadius = isIcon ? '50%' : computedStyle.borderRadius;

        cursorDot.classList.add('cursor-dot-hidden');
        cursorCircle.classList.add('hovered');
        cursorCircle.style.border = '2px solid var(--accent-green)';
        // render() takes over size and position from here
      };

      const handleMouseLeave = () => {
        resetHoverState();
      };

      const attachCursorListeners = () => {
        const targetsToListen = document.querySelectorAll('button, a, .social-button, .card-btn, .tab-heading, .nav-link, .hire-me-button, .theme-toggle, .like-button, .suggestion-card, .chatbot-toggle, .new-chat-btn, .back-to-portfolio, .send-button, .mobile-close-btn, .saved-chat-item, .delete-chat-btn, .download-resume-btn, .show-more-btn, .hero-cta, .footer-link, .footer-top, .scroll-cue');
        targetsToListen.forEach(target => {
          target.removeEventListener('mouseenter', handleMouseEnter);
          target.removeEventListener('mouseleave', handleMouseLeave);

          target.addEventListener('mouseenter', handleMouseEnter);
          target.addEventListener('mouseleave', handleMouseLeave);

          if (window.getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
          }
        });
      };

      attachCursorListeners();

      const portfolioContent = document.querySelector('.portfolio-content');
      const observer = new MutationObserver(attachCursorListeners);

      if (portfolioContent) {
        observer.observe(portfolioContent, {
          childList: true,
          subtree: true
        });
      }

      // Also observe document body for chatbot and other dynamic elements
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      window.addEventListener('mousemove', updatePosition, { passive: true });
      rafId = requestAnimationFrame(render);

      return () => {
        window.removeEventListener('mousemove', updatePosition);
        if (rafId) cancelAnimationFrame(rafId);
        observer.disconnect();
        cursorDot.remove();
        cursorCircle.remove();
      };
    }
  }, []);

  return null;
};

export { CustomCursor, CustomCursor as default };
