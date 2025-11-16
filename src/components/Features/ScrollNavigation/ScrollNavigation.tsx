import { useState, useEffect, useCallback } from 'react';
import './ScrollNavigation.css';

const ScrollNavigation = () => {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Throttle function to limit scroll event frequency
  const throttle = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;
    return () => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func();
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func();
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // Check scroll position and update button visibility
  const checkScrollPosition = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const windowHeight = window.innerHeight || 0;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    // Show scroll up button when scrolled down more than 200px
    setShowScrollUp(scrollY > 200);
    
    // Show scroll down button when near the top (within 100px of top)
    // and there's enough content to scroll down (at least 200px more than viewport)
    const isNearTop = scrollY < 100;
    const hasScrollableContent = documentHeight > windowHeight + 200;
    setShowScrollDown(isNearTop && hasScrollableContent);
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Direct scroll method - most reliable
    const scrollToTopDirect = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
      if (currentScroll > 0) {
        // Use smooth scroll if available
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Fallback: instant scroll
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }
    };
    
    // Execute immediately
    scrollToTopDirect();
    
    // Also try with requestAnimationFrame as backup
    requestAnimationFrame(scrollToTopDirect);
  }, []);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    // Initial check with a small delay to ensure DOM is ready
    const initialCheck = setTimeout(() => {
      checkScrollPosition();
    }, 100);

    // Throttled scroll handler (runs max once every 100ms)
    const throttledCheck = throttle(checkScrollPosition, 100);

    // Add scroll event listener
    window.addEventListener('scroll', throttledCheck, { passive: true });
    
    // Check on resize (content height might change)
    window.addEventListener('resize', throttledCheck, { passive: true });

    // Also check when page becomes visible (handles tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkScrollPosition();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearTimeout(initialCheck);
      window.removeEventListener('scroll', throttledCheck);
      window.removeEventListener('resize', throttledCheck);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkScrollPosition, throttle]);

  return (
    <>
      {showScrollUp && (
        <button
          type="button"
          className="scroll-btn scroll-btn-up"
          onClick={scrollToTop}
          onTouchEnd={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
      {showScrollDown && (
        <button
          className="scroll-btn scroll-btn-down"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <i className="fas fa-arrow-down"></i>
        </button>
      )}
    </>
  );
};

export default ScrollNavigation;

