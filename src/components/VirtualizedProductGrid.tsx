import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import DynamicProductCard from './DynamicProductCard';

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio_unidad?: number;
  precio_gramo?: number;
  precio_onza?: number;
  precio_media_onza?: number;
  disponible: boolean;
  cantidad_disponible?: number;
}

interface VirtualizedProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
  className?: string;
}

const ITEM_HEIGHT = 420; // Altura estimada por card
const OVERSCAN = 5; // Items extras para renderizar fuera del viewport

const VirtualizedProductGrid = ({ 
  products, 
  viewMode, 
  className = '' 
}: VirtualizedProductGridProps) => {
  const [containerHeight, setContainerHeight] = useState(600);
  const [scrollTop, setScrollTop] = useState(0);
  const [columnsPerRow, setColumnsPerRow] = useState(4);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calcular columnas según viewport
  const updateColumnsPerRow = useCallback(() => {
    if (viewMode === 'list') {
      setColumnsPerRow(1);
      return;
    }

    const width = window.innerWidth;
    if (width >= 1280) setColumnsPerRow(4); // xl
    else if (width >= 1024) setColumnsPerRow(3); // lg
    else if (width >= 768) setColumnsPerRow(2); // md
    else setColumnsPerRow(1); // sm
  }, [viewMode]);

  // Listener de resize optimizado
  useEffect(() => {
    updateColumnsPerRow();
    
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateColumnsPerRow, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateColumnsPerRow]);

  // Scroll listener optimizado
  useEffect(() => {
    const scrollElement = scrollElementRef.current;
    if (!scrollElement) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollTop(scrollElement.scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcular altura del contenedor
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  // Calcular items visibles
  const { visibleItems, totalHeight } = useMemo(() => {
    const totalRows = Math.ceil(products.length / columnsPerRow);
    const startRow = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
    const endRow = Math.min(
      totalRows - 1, 
      Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN
    );

    const startIndex = startRow * columnsPerRow;
    const endIndex = Math.min(products.length - 1, (endRow + 1) * columnsPerRow - 1);
    
    const visible = products.slice(startIndex, endIndex + 1).map((product, index) => ({
      product,
      index: startIndex + index,
      row: Math.floor((startIndex + index) / columnsPerRow),
      col: (startIndex + index) % columnsPerRow
    }));

    return {
      visibleItems: visible,
      totalHeight: totalRows * ITEM_HEIGHT
    };
  }, [products, columnsPerRow, scrollTop, containerHeight]);

  // Solo activar virtualización con muchos productos
  const shouldVirtualize = products.length > 60;

  if (!shouldVirtualize) {
    return (
      <div 
        className={`catalog-section ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
        } ${className}`}
      >
        {products.map((product) => (
          <DynamicProductCard 
            key={product.id} 
            product={product}
            className={viewMode === 'list' ? 'flex-row' : ''}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`catalog-section ${className}`}
      style={{ height: '70vh', overflow: 'hidden' }}
    >
      <div
        ref={scrollElementRef}
        className="scroll-area"
        style={{ 
          height: '100%', 
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            className={viewMode === 'grid' 
              ? 'grid gap-6' 
              : 'space-y-4'
            }
            style={{
              gridTemplateColumns: viewMode === 'grid' ? `repeat(${columnsPerRow}, 1fr)` : undefined,
              transform: `translateY(${Math.floor(visibleItems[0]?.row || 0) * ITEM_HEIGHT}px)`,
              position: 'absolute',
              width: '100%',
              top: 0
            }}
          >
            {visibleItems.map(({ product, index }) => (
              <DynamicProductCard 
                key={`${product.id}-${index}`}
                product={product}
                className={viewMode === 'list' ? 'flex-row' : ''}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedProductGrid;