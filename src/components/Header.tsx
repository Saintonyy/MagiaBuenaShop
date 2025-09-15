import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, Calculator, Filter } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchCategorias } from '@/services/catalogRepo';
import CartSummary from '@/components/CartSummary';
import ProductFilters from '@/components/ProductFilters';
import { useDropdownPosition } from '@/hooks/use-dropdown-position';
import { useClickOutside } from '@/hooks/use-click-outside';
import logo from '@/assets/logo.png';
// import logoBanner from '@/assets/logo-banner.png'; // no usado
import { openTelegramByPhone } from '@/lib/openTelegram';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Refs para posicionar el dropdown
  const catalogDropdownRef = useRef<HTMLDivElement>(null);
  const catalogTriggerRef = useRef<HTMLButtonElement>(null);

  // Posicionamiento inteligente
  const catalogPosition = useDropdownPosition(
    isCatalogOpen,
    catalogDropdownRef,
    catalogTriggerRef
  );

  // Cerrar dropdown al click fuera
  useClickOutside(isCatalogOpen, setIsCatalogOpen, [
    catalogDropdownRef,
    catalogTriggerRef,
  ]);

  // Cargar categorías desde Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategorias();
        const categoryList =
          data
            ?.map((item) => item.categoria)
            .filter(Boolean)
            .filter((cat) => cat !== 'psicodelico')
            .sort() || [];
        setCategories(categoryList);
      } catch (e) {
        console.error('Error fetching categories:', e);
        setCategories(['flores', 'pre-rolls', 'vapes', 'parafernalia', 'importado']);
      }
    };
    loadCategories();
  }, []);

  const getCatalogItems = () =>
    categories.map((cat) => ({
      name:
        cat === 'pre-rolls'
          ? "Pre-Roll's"
          : cat === 'flores'
          ? 'Flores'
          : cat === 'parafernalia'
          ? 'Parafernalia'
          : cat.charAt(0).toUpperCase() + cat.slice(1),
      href: `/catalogo?category=${cat}`,
      category: cat,
    }));

  const handleCategoryNavigation = (category: string, href: string) => {
    setIsCatalogOpen(false);
    setIsMenuOpen(false);
    navigate(href, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60 border-b border-glass-border/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group transition-glass hover:scale-105"
          >
            <img
              src={logo}
              alt="Magia Buena Logo"
              className="h-12 w-auto object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
            />
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-glass hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Inicio
            </Link>

            {/* Catálogo (dropdown) */}
            <div className="relative">
              <button
                ref={catalogTriggerRef}
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-foreground/80 hover:text-primary transition-bounce glass-button-interactive px-3 py-2 rounded-glass"
              >
                <span>Catálogo</span>
                <ChevronDown
                  className={`w-4 h-4 transition-all duration-500 ${
                    isCatalogOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCatalogOpen && (
                <div
                  ref={catalogDropdownRef}
                  className="absolute top-full left-0 sm:left-0 right-0 sm:right-auto mt-2 w-48 sm:w-48 max-w-[calc(100vw-2rem)] backdrop-blur-md bg-background/85 supports-[backdrop-filter]:bg-background/70 border border-glass-border/30 rounded-2xl shadow-glass z-50 will-change-transform mobile-dropdown"
                  style={catalogPosition}
                >
                  <div className="p-4">
                    <Link
                      to="/"
                      onClick={() => setIsCatalogOpen(false)}
                      className="block px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass/20 rounded-xl transition-bounce"
                    >
                      Inicio
                    </Link>

                    <div className="border-t border-glass-border/20 my-3" />

                    {getCatalogItems().map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleCategoryNavigation(item.category, item.href)}
                        className="block w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass/20 rounded-xl transition-bounce"
                      >
                        {item.name}
                      </button>
                    ))}

                    <div className="border-t border-glass-border/20 my-3" />

                    <button
                      onClick={() => {
                        setIsCatalogOpen(false);
                        openTelegramByPhone();
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass/20 rounded-xl transition-bounce"
                    >
                      Contacto
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Promos desactivado */}
            <span className="text-sm font-medium text-foreground/50 cursor-not-allowed select-none">
              Promos (coming soon)
            </span>

            <CartSummary />

            <button
              onClick={openTelegramByPhone}
              className="glass-button-interactive px-6 py-2 rounded-glass text-sm font-medium text-primary-foreground liquid-ripple"
            >
              Contacto
            </button>
          </nav>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden glass-button-interactive p-2 rounded-glass liquid-ripple"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-primary-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-primary-foreground" />
            )}
          </button>
        </div>

        {/* Navegación móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 backdrop-blur-md bg-background/85 supports-[backdrop-filter]:bg-background/70 border border-glass-border/30 rounded-2xl p-6 will-change-transform">
            {/* nav scrolleable */}
            <nav
              className="flex flex-col space-y-4 max-h-[70vh] overflow-y-auto pr-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-bounce px-3 py-2 rounded-xl hover:bg-glass/20"
              >
                Inicio
              </Link>

              <div className="border-t border-glass-border/20" />

              {/* Lista de categorías scrolleable */}
              <div
                className="space-y-2 max-h-[50vh] overflow-y-auto pr-1"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {getCatalogItems().map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleCategoryNavigation(item.category, item.href)}
                    className="block w-full text-left text-sm text-foreground/80 hover:text-primary transition-bounce px-3 py-2 rounded-xl hover:bg-glass/20"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="border-t border-glass-border/20" />

              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                  Herramientas
                </span>

                <button
                  onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                  className="flex items-center w-full text-left text-sm text-foreground/80 hover:text-primary transition-bounce px-3 py-3 rounded-xl hover:bg-glass/20 border border-glass-border/20"
                >
                  <Calculator className="w-4 h-4 mr-3 text-emerald-500" />
                  <span>Calculadora</span>
                </button>

                {isCalculatorOpen && (
                  <div className="ml-4 pl-4 border-l border-glass-border/20">
                    <CartSummary inline={true} />
                  </div>
                )}

                {(location.pathname.includes('/catalogo') || location.pathname === '/') && (
                  <>
                    <button
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className="flex items-center w-full text-left text-sm text-foreground/80 hover:text-primary transition-bounce px-3 py-3 rounded-xl hover:bg-glass/20 border border-glass-border/20"
                    >
                      <Filter className="w-4 h-4 mr-3 text-blue-500" />
                      <span>Filtros</span>
                    </button>

                    {isFiltersOpen && (
                      <div className="ml-4 pl-4 border-l border-glass-border/20">
                        <ProductFilters
                          onFiltersChange={handleFiltersChange}
                          categories={categories}
                          selectedCategory="all"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-t border-glass-border/20" />

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openTelegramByPhone();
                }}
                className="glass-button-interactive px-6 py-3 rounded-xl text-sm font-medium text-primary-foreground text-center liquid-ripple"
              >
                Contacto
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
