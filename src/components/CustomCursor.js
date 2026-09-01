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

/* Ring diameter, kept in sync with the CSS below. The free-roaming state
   offsets by half of this to centre the ring on the pointer. */
var RING = 46;
var DOT = 6;

var css_248z = `
body{cursor:none!important}

/* Both layers are positioned purely with transform. Writing left/top every
   frame invalidates layout; transform stays on the compositor. */
.cursor-dot{
  background-color:var(--accent-green,#4ade80);
  border-radius:50%;
  width:${DOT}px;height:${DOT}px;
  left:0;top:0;
  position:fixed;
  pointer-events:none;
  will-change:transform;
  transition:opacity .15s ease, background-color .3s ease;
  z-index:9999999999999;
}
.cursor-dot-hidden{opacity:0}

.cursor-circle{
  border:1.5px solid var(--accent-green,#4ade80);
  border-radius:50%;
  box-sizing:border-box;
  opacity:.45;
  width:${RING}px;height:${RING}px;
  left:0;top:0;
  position:fixed;
  pointer-events:none;
  will-change:transform;
  /* transform is driven frame-by-frame in JS while free, so it must not be
     transitioned here: that was the original source of the lag. */
  transition:width .22s cubic-bezier(.22,1,.36,1),
             height .22s cubic-bezier(.22,1,.36,1),
             border-radius .22s cubic-bezier(.22,1,.36,1),
             opacity .25s ease,
             border-color .3s ease;
  z-index:9999999999998;
}

/* Locked onto an element: the transform now carries a real position, so it
   gets a short ease to glide onto the target and ride any hover lift. */
.cursor-circle.hovered{
  opacity:.75;
  transition:width .18s cubic-bezier(.22,1,.36,1),
             height .18s cubic-bezier(.22,1,.36,1),
             border-radius .18s cubic-bezier(.22,1,.36,1),
             transform .18s cubic-bezier(.22,1,.36,1),
             border-color .3s ease;
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
        ) ||
        window.matchMedia('(pointer: coarse)').matches
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
      // Where the ring has caught up to. Separate from `position` so the ring
      // can trail the dot instead of being welded to it.
      let ringPos = { x: position.x, y: position.y };
      let isHovered = false;
      let currentHoveredElement = null;
      let hoveredRadius = '50%';
      let rafId = null;
      let settled = false;

      // Fraction of the remaining gap the ring closes each frame. This is
      // the trail. Lower = more lag behind the dot; higher = tighter.
      const FOLLOW = 0.22;

      const resetHoverState = () => {
        isHovered = false;
        currentHoveredElement = null;
        cursorDot.classList.remove('cursor-dot-hidden');
        cursorCircle.classList.remove('hovered');
        cursorCircle.style.width = '';
        cursorCircle.style.height = '';
        cursorCircle.style.borderRadius = '';
        // Resume the trail from the pointer rather than sliding back from the
        // element's corner
        ringPos.x = position.x;
        ringPos.y = position.y;
        settled = false;
      };

      const render = () => {
        rafId = requestAnimationFrame(render);

        // The dot always tracks the pointer exactly: no smoothing, no lag.
        cursorDot.style.transform =
          `translate3d(${position.x - DOT / 2}px, ${position.y - DOT / 2}px, 0)`;

        if (isHovered && currentHoveredElement) {
          if (!document.body.contains(currentHoveredElement)) {
            resetHoverState();
            return;
          }
          // Re-measured every frame: buttons that lift or scale on hover
          // finish moving after mouseenter fired, so a single measurement
          // leaves the ring where the button used to be.
          const rect = currentHoveredElement.getBoundingClientRect();
          cursorCircle.style.transform =
            `translate3d(${rect.left}px, ${rect.top}px, 0)`;
          cursorCircle.style.width = `${rect.width}px`;
          cursorCircle.style.height = `${rect.height}px`;
          cursorCircle.style.borderRadius = hoveredRadius;
          return;
        }

        const dx = position.x - ringPos.x;
        const dy = position.y - ringPos.y;

        // Once the ring has caught a stationary pointer there is nothing to
        // redraw, so stop writing to the DOM until it moves again.
        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          if (settled) return;
          settled = true;
          ringPos.x = position.x;
          ringPos.y = position.y;
        } else {
          settled = false;
          ringPos.x += dx * FOLLOW;
          ringPos.y += dy * FOLLOW;
        }

        cursorCircle.style.transform =
          `translate3d(${ringPos.x - RING / 2}px, ${ringPos.y - RING / 2}px, 0)`;
      };

      const updatePosition = e => {
        position.x = e.clientX;
        position.y = e.clientY;
        settled = false;
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
        // render() takes over size and position from here
      };

      const handleMouseLeave = () => {
        resetHoverState();
      };

      const SELECTOR = 'button, a, .social-button, .card-btn, .tab-heading, .nav-link, .hire-me-button, .theme-toggle, .like-button, .suggestion-card, .chatbot-toggle, .new-chat-btn, .back-to-portfolio, .send-button, .mobile-close-btn, .saved-chat-item, .delete-chat-btn, .download-resume-btn, .show-more-btn, .hero-cta, .footer-link, .footer-top, .scroll-cue';

      const attachCursorListeners = () => {
        document.querySelectorAll(SELECTOR).forEach(target => {
          // Already-wired elements are skipped. The previous version re-bound
          // every match and ran getComputedStyle on each one for every DOM
          // mutation, which is what made this expensive.
          if (target.dataset.cursorBound === '1') return;
          target.dataset.cursorBound = '1';

          target.addEventListener('mouseenter', handleMouseEnter);
          target.addEventListener('mouseleave', handleMouseLeave);

          if (window.getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
          }
        });
      };

      attachCursorListeners();

      // Coalesce mutation bursts into one pass per frame instead of running a
      // full querySelectorAll for every individual DOM change.
      let attachRaf = null;
      const scheduleAttach = () => {
        if (attachRaf !== null) return;
        attachRaf = requestAnimationFrame(() => {
          attachRaf = null;
          attachCursorListeners();
        });
      };

      const observer = new MutationObserver(scheduleAttach);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      window.addEventListener('mousemove', updatePosition, { passive: true });
      rafId = requestAnimationFrame(render);

      return () => {
        window.removeEventListener('mousemove', updatePosition);
        if (rafId) cancelAnimationFrame(rafId);
        if (attachRaf) cancelAnimationFrame(attachRaf);
        observer.disconnect();
        document.querySelectorAll(SELECTOR).forEach(target => {
          target.removeEventListener('mouseenter', handleMouseEnter);
          target.removeEventListener('mouseleave', handleMouseLeave);
          delete target.dataset.cursorBound;
        });
        cursorDot.remove();
        cursorCircle.remove();
      };
    }
  }, []);

  return null;
};

export { CustomCursor, CustomCursor as default };
