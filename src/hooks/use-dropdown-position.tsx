import { useEffect, useState } from 'react';

interface DropdownPosition {
  left?: string;
  right?: string;
  transform?: string;
  maxWidth?: string;
}

export function useDropdownPosition(
  isOpen: boolean,
  dropdownRef: React.RefObject<HTMLDivElement>,
  triggerRef?: React.RefObject<HTMLElement>
) {
  const [position, setPosition] = useState<DropdownPosition>({});

  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const updatePosition = () => {
      const dropdown = dropdownRef.current;
      const trigger = triggerRef?.current;
      
      if (!dropdown) return;

      // Store original styles
      const originalStyles = {
        left: dropdown.style.left,
        right: dropdown.style.right,
        transform: dropdown.style.transform,
        maxWidth: dropdown.style.maxWidth
      };

      // Reset position to calculate natural bounds
      dropdown.style.left = '';
      dropdown.style.right = '';
      dropdown.style.transform = '';
      dropdown.style.maxWidth = '';

      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const margin = 16; // Safety margin
      
      let newPosition: DropdownPosition = {};

      // Mobile-first: Always constrain to viewport with margins
      if (window.innerWidth <= 768) {
        newPosition = {
          left: `${margin}px`,
          right: `${margin}px`,
          transform: 'none',
          maxWidth: `calc(100vw - ${margin * 2}px)`
        };
      } else {
        // Desktop: Smart positioning based on overflow
        if (rect.right > viewportWidth - margin) {
          // Dropdown overflows right edge
          newPosition.right = `${margin}px`;
          newPosition.left = 'auto';
          newPosition.maxWidth = `calc(100vw - ${margin * 2}px)`;
        } else if (rect.left < margin) {
          // Dropdown overflows left edge
          newPosition.left = `${margin}px`;
          newPosition.right = 'auto';
          newPosition.maxWidth = `calc(100vw - ${margin * 2}px)`;
        }
      }

      // Restore original styles before applying new position
      Object.assign(dropdown.style, originalStyles);
      setPosition(newPosition);
    };

    // Delay positioning to allow for DOM updates
    const timeoutId = setTimeout(updatePosition, 0);

    // Update on resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updatePosition, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, dropdownRef, triggerRef]);

  return position;
}