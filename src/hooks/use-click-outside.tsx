import { useEffect } from 'react';

/**
 * Hook para cerrar dropdowns automáticamente cuando se hace clic fuera del elemento
 * @param isOpen - Estado del dropdown (abierto/cerrado)
 * @param setIsOpen - Función para cambiar el estado del dropdown
 * @param refs - Array de refs de elementos que no deben cerrar el dropdown al hacer clic
 */
export function useClickOutside(
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
  refs: React.RefObject<HTMLElement>[]
) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Verificar si el clic fue dentro de alguno de los elementos referenciados
      const clickedInside = refs.some(ref => {
        return ref.current && ref.current.contains(target);
      });

      if (!clickedInside) {
        setIsOpen(false);
      }
    };

    // Agregar el event listener después de un pequeño delay
    // para evitar que se ejecute inmediatamente al abrir el dropdown
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, setIsOpen, refs]);
}