import { useMemo, useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import DynamicProductCard from "./DynamicProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Product interface matching DynamicProductCard
interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio_unidad?: number;
  precio_gramo?: number;
  precio_onza?: number;
  precio_media_onza?: number;
  precio_pieza?: number;
  disponible: boolean;
  cantidad_disponible?: number;
  foto_url?: string | null;
}

interface PagedCatalogProps {
  items: Product[];
  itemsPerPage?: number;
  className?: string;
}

export default function PagedCatalog({
  items,
  itemsPerPage = 6, // 3x2
  className = ""
}: PagedCatalogProps) {
  const pages = useMemo(() => {
    const chunks: Product[][] = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      chunks.push(items.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [items, itemsPerPage]);

  const [page, setPage] = useState(0);
  const last = pages.length - 1;

  // Reset to first page when items change
  useEffect(() => {
    setPage(0);
  }, [items]);

  const go = useCallback((n: number) => {
    setPage((p) => Math.min(Math.max(p + n, 0), last));
  }, [last]);

  // Keyboard navigation (← →)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Swipe support
  const swipe = useSwipeable({
    onSwipedLeft: () => go(1),
    onSwipedRight: () => go(-1),
    trackMouse: true,
    preventScrollOnSwipe: true,
    trackTouch: true
  });

  // Don't render if no items
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  // Single page - no navigation needed
  if (pages.length <= 1) {
    return (
      <div className={`w-full ${className}`}>
        <div className="
          grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 
          gap-4 sm:gap-6
          auto-rows-max
          p-4
        ">
          {items.slice(0, itemsPerPage).map((item) => (
            <div key={item.id} className="w-full">
              <DynamicProductCard product={item} />
            </div>
          ))}
          {/* Fill empty slots to maintain grid structure */}
          {Array.from({ length: Math.max(0, itemsPerPage - items.length) }).map((_, i) => (
            <div key={`ghost-${i}`} className="opacity-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Catálogo paginado"
      className={`
        relative
        w-full
        ${className}
      `}
      {...swipe}
    >
      {/* Carousel of pages */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${page * 100}%)` }}
      >
        {pages.map((group, idx) => (
          <div key={idx} className="shrink-0 w-full">
            {/* Fixed 3x2 Grid - Responsive */}
            <div className="
              grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
              gap-4 sm:gap-6
              auto-rows-max
              p-4
              w-full
            ">
              {group.map((item) => (
                <div key={item.id} className="w-full">
                  <DynamicProductCard product={item} />
                </div>
              ))}
              {/* Fill empty slots to maintain 3x2 structure */}
              {Array.from({ length: Math.max(0, itemsPerPage - group.length) }).map((_, i) => (
                <div key={`ghost-${i}`} className="opacity-0" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button
        aria-label="Página anterior"
        onClick={() => go(-1)}
        className="
          absolute left-2 top-1/2 -translate-y-1/2 z-10 
          rounded-full bg-background/80 backdrop-blur-sm border border-glass-border/30
          text-foreground w-12 h-12 
          flex items-center justify-center 
          hover:bg-background/90 hover:border-primary/50
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg
        "
        disabled={page === 0}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        aria-label="Página siguiente"
        onClick={() => go(1)}
        className="
          absolute right-2 top-1/2 -translate-y-1/2 z-10 
          rounded-full bg-background/80 backdrop-blur-sm border border-glass-border/30
          text-foreground w-12 h-12 
          flex items-center justify-center 
          hover:bg-background/90 hover:border-primary/50
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg
        "
        disabled={page === last}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Page Dots */}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`
              h-2.5 w-2.5 rounded-full transition-all duration-200
              ${i === page 
                ? "bg-primary w-6 shadow-glow" 
                : "bg-muted-foreground/50 hover:bg-muted-foreground/70"
              }
            `}
            aria-label={`Ir a la página ${i + 1}`}
          />
        ))}
      </div>

      {/* Page Counter */}
      <div className="absolute top-4 right-4 z-10">
        <div className="
          bg-background/80 backdrop-blur-sm border border-glass-border/30
          px-3 py-1.5 rounded-full text-sm text-muted-foreground
          shadow-sm
        ">
          {page + 1} / {pages.length}
        </div>
      </div>
    </section>
  );
}