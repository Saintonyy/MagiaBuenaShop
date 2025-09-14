import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { fetchCategorias } from '@/services/catalogRepo';
import CartSummary from '@/components/CartSummary';
import logo from '@/assets/logo.png';
import logoBanner from '@/assets/logo-banner.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const location = useLocation();

  // Fetch categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategorias();
        
        const categoryList = data?.map(item => item.categoria)
          .filter(Boolean)
          .filter(cat => cat !== 'psicodelico') || [];
        // Set specific categories for the new menu structure
        setCategories(['flores', 'pre-rolls', 'vapes', 'parafernalia', 'importado']);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories
        setCategories(['flores', 'pre-rolls', 'vapes', 'parafernalia', 'importado']);
      }
    };

    loadCategories();
  }, []);

  const getCatalogItems = () => {
    return categories.map(cat => ({
      name: cat === 'pre-rolls' ? 'Pre-Roll\'s' : cat.charAt(0).toUpperCase() + cat.slice(1),
      href: `/catalogo?category=${cat}`
    }));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border/30">
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
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-foreground/80 hover:text-primary transition-bounce glass-button-interactive px-3 py-2 rounded-glass"
              >
                <span>Catálogo</span>
                <ChevronDown className={`w-4 h-4 transition-all duration-500 ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatalogOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 glass-card-animated mobile-dropdown border border-glass-border/30 rounded-2xl shadow-glass animate-scale-in z-50">
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
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsCatalogOpen(false)}
                        className="block px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass/20 rounded-xl transition-bounce"
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* Divider */}
                    <div className="border-t border-glass-border/20 my-3"></div>
                    
                    {/* Contacto */}
                    <Link
                      to="/contacto"
                      onClick={() => setIsCatalogOpen(false)}
                      className="block px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-glass/20 rounded-xl transition-bounce"
                    >
                      Contacto
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link 
              to="/promociones" 
              className={`text-sm font-medium transition-glass hover:text-primary ${
                location.pathname === '/promociones' ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Promos
            </Link>

            {/* Cart Summary */}
            <CartSummary />

            <Link 
              to="/contacto" 
              className="glass-button-interactive px-6 py-2 rounded-glass text-sm font-medium text-primary-foreground liquid-ripple"
            >
              Contacto
            </Link>
          </nav>

          {/* Mobile Menu Button */}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 glass-card-animated mobile-dropdown border border-glass-border/30 rounded-2xl p-6 animate-scale-in">
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
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm text-foreground/80 hover:text-primary transition-bounce px-3 py-2 rounded-xl hover:bg-glass/20"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-glass-border/20"></div>
              
              {/* Mobile Cart Summary */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
                  Calculadora de Precio
                </span>
                <CartSummary />
              </div>
              
              {/* Divider */}
              <div className="border-t border-glass-border/20"></div>
              
              {/* Contacto */}
              <Link 
                to="/contacto" 
                onClick={() => setIsMenuOpen(false)}
                className="glass-button-interactive px-6 py-3 rounded-xl text-sm font-medium text-primary-foreground text-center liquid-ripple"
              >
                Contacto
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;