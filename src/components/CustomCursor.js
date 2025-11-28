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

var css_248z = "body{cursor:none!important}.cursor-dot{background-color:#ff0;border-radius:50%;height:5px;left:0;pointer-events:none;position:fixed;top:0;transform:translate(-50%,-50%);transition:opacity .2s ease;width:5px;z-index:99999}.cursor-dot-hidden{opacity:0}.cursor-circle{border:2px solid #8B8000;border-radius:50%;box-sizing:border-box;height:30px;left:0;pointer-events:none;position:fixed;top:0;transform:translate(-50%,-50%);transition:all 0.1s ease;width:30px;z-index:99998}.cursor-circle.hovered{box-sizing:border-box;margin:0;padding:0;transform:none;transition:all .2s ease}.social-button,a,button{cursor:none!important}";
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

      let position = { x: 0, y: 0 };
      let isHovered = false;

      const updatePosition = e => {
        position.x = e.clientX;
        position.y = e.clientY;
        if (!isHovered) {
          cursorDot.style.left = `${position.x}px`;
          cursorDot.style.top = `${position.y}px`;
          cursorCircle.style.left = `${position.x}px`;
          cursorCircle.style.top = `${position.y}px`;
        }
      };

      const handleMouseEnter = e => {
        isHovered = true;
        cursorDot.classList.add('cursor-dot-hidden');
        cursorCircle.classList.add('hovered');
        const rect = e.target.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(e.target);
        const isIcon = e.target.tagName === 'IMG' || computedStyle.borderRadius === '50%';
        Object.assign(cursorCircle.style, {
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          borderRadius: isIcon ? '50%' : computedStyle.borderRadius,
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          border: '2px solid yellow'
        });
      };

      const handleMouseLeave = () => {
        isHovered = false;
        cursorDot.classList.remove('cursor-dot-hidden');
        cursorCircle.classList.remove('hovered');
        cursorCircle.style = '';
      };

      const attachCursorListeners = () => {
        const targetsToListen = document.querySelectorAll('button, .social-button, .card-btn, .tab-heading, .nav-link, .hire-me-button');
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

      window.addEventListener('mousemove', updatePosition);

      return () => {
        window.removeEventListener('mousemove', updatePosition);
        observer.disconnect();
        cursorDot.remove();
        cursorCircle.remove();
      };
    }
  }, []);

  return null;
};

export { CustomCursor, CustomCursor as default };