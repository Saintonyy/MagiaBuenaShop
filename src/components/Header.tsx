import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, Calculator, Filter } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchCategorias } from '@/services/catalogRepo';
import CartSummary from '@/components/CartSummary';
import ProductFilters from '@/components/ProductFilters';
import { useDropdownPosition } from '@/hooks/use-dropdown-position';
import { useClickOutside } from '@/hooks/use-click-outside';
import logo from '@/assets/logo.png';
// import logoBanner from '@/assets/logo-banner.png'; // ❌ no usado
import { openTelegramByPhone } from '@/lib/openTelegram';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Refs for dropdown positioning
  const catalogDropdownRef = useRef<HTMLDivElement>(null);
  const catalogTriggerRef = useRef<HTMLButtonElement>(null);

  // Smart dropdown positioning
  const catalogPosition = useDropdownPosition(isCatalogOpen, catalogDropdownRef, catalogTriggerRef);

  // Close dropdown when clicking outside
  useClickOutside(isCatalogOpen, setIsCatalogOpen, [catalogDropdownRef, catalogTriggerRef]);

  // Fetch categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategorias();

        const categoryList =
          data?.map((item) => item.categoria)
            .filter(Boolean)
            .filter((cat) => cat !== 'psicodelico') // Filtrar psicodelico si existe
            .sort() || []; // Ordenar alfabéticamente

        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback a categorías por defecto
        setCategories(['flores', 'pre-rolls', 'vapes', 'parafernalia', 'importado']);
      }
    };

    loadCategories();
  }, []);

  const getCatalogItems = () => {
    return categories.map((cat) => ({
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
  };

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
          <Link to="/" className="flex items-center space-x-3 group transition-glass hover:scale-105">
            <img
              src={logo}
              alt="Magia Buena Logo"
              className="h-12 w-auto object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-glass hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Inicio
            </Link>

            {/* Catalog Dropdown */}
            <div className="relative">
              <button
                ref={catalogTriggerRef}
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-foreground/80 hover:text-primary transition-bounce glass-button-interactive px-3 py-2 rounded-glass"
              >
                <span>Catálogo</span>
                <ChevronDown className={`w-4 h-4 transition-all duration-500 ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatalogOpen && (
                <div
                  ref={catalogDropdownRef}
                  className="absolute top-full left-0 sm:left-0 right-0 sm:right-auto mt-2 w-48 sm:w-48 max-w-[calc(100vw-2rem)] backdrop-blur-md bg-background/85 supports-[backdrop-filter]:bg-background/70 border border-glass-border/30 rounded-2xl shadow-glass z-50 will-change-transform mobile-dropdown"
                  style={catalogPosition}
                >
                  <div className="p-4">
                    {/* Inicio */}
                    <Link
                      to="/"
                      onClick={() => setIsCatalogOpen(false)}
                      className="block px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass/20 rounded-xl transition-bounce"
                    >
                      Inicio
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-glass-border/20 my-3"></div>

                    {/* Categories */}
                    {getCatalogItems().map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleCategoryNavigation(item.category, item.href)}
                        className="block w-full text-left px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass/20 rounded-xl transition-bounce"
                      >
                        {item.name}
                      </button>
                    ))}

                    {/* Divider */}
                    <div className="border-t border-glass-border/20 my-3"></div>

                    {/* Contacto → Telegram (por número) */}
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

            {/* Promos → Coming soon (desactivado) */}
            <span className="text-sm font-medium text-foreground/50 cursor-not-allowed select-none">
              Promos (coming soon)
            </span>

            {/* Cart Summary */}
            <CartSummary />

            {/* Contacto (abre Telegram) */}
            <button
              onClick={openTelegramByPhone}
              className="glass-button-interactive px-6 py-2 rounded-glass text-sm font-medium text-primary-foreground liquid-ripple"
            >
              Contacto
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden glass-button-interactive p-2 rounded-glass liquid-ripple"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-primary-foreground" /> : <Menu className="w-6 h-6 text-primary-foreground" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 backdrop-blur-md bg-background/85 supports-[backdrop-filter]:bg-background/70 border border-glass-border/30 rounded-2xl p-6 will-change-transform">
            <nav className="flex flex-col space-y-4">
              {/* Inicio */}
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-bounce px-3 py-2 rounded-xl hover:bg-glass/20"
              >
                Inicio
              </Link>

              {/* Divider */}
              <div className="border-t border-glass-border/20"></div>

              {/* Categories */}
              <div className="space-y-2">
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

              {/* Divider */}
              <div className="border-t border-glass-border/20"></div>

              {/* Mobile Tools - Calculadora y Filtros */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
                  Herramientas
                </span>

                {/* Calculadora Button */}
                <button
                  onClick={() => {
                    setIsCalculatorOpen(!isCalculatorOpen);
                  }}
                  className="flex items-center w-full text-left text-sm text-foreground/80 hover:text-primary transition-bounce px-3 py-3 rounded-xl hover:bg-glass/20 border border-glass-border/20"
                >
                  <Calculator className="w-4 h-4 mr-3 text-emerald-500" />
                  <span>Calculadora</span>
                </button>

                {/* Calculator Dropdown */}
                {isCalculatorOpen && (
                  <div className="ml-4 pl-4 border-l border-glass-border/20">
                    <CartSummary inline={true} />
                  </div>
                )}

                {/* Filtros Button (home o catálogo) */}
                {(location.pathname.includes('/catalogo') || location.pathname === '/') && (
                  <>
                    <button
                      onClick={() => {
                        setIsFiltersOpen(!isFiltersOpen);
                      }}
                      className="flex items-center w-full text-left text-sm text-foreground/80 hover:text-primary transition-bounce px-3 py-3 rounded-xl hover:bg-glass/20 border border-glass-border/20"
                    >
                      <Filter className="w-4 h-4 mr-3 text-blue-500" />
                      <span>Filtros</span>
                    </button>

                    {isFiltersOpen && (
                      <div className="ml-4 pl-4 border-l border-glass-border/20">
                        <ProductFilters onFiltersChange={handleFiltersChange} categories={categories} selectedCategory="all" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-glass-border/20"></div>

              {/* Contacto (abre Telegram) */}
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
