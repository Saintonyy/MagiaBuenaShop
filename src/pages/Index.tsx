import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import DynamicProductCard from '@/components/DynamicProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { products, promotions } from '@/data/products';
import { fetchProductos } from '@/services/catalogRepo';
import heroImage from '@/assets/hero-bg.jpg';
import logoBanner from '@/assets/logo-banner.png';
import { 
  Leaf, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  Clock, 
  ArrowRight, 
  Gift, 
  Sparkles 
} from 'lucide-react';

const Index = () => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Cargar productos del catálogo real
  useEffect(() => {
    const loadRealProducts = async () => {
      try {
        const products = await fetchProductos();
        setDynamicProducts(products || []);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setDynamicProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadRealProducts();
  }, []);
  
  // Productos sugeridos del catálogo real - selección curada por categoría y disponibilidad
  const getFeaturedProducts = () => {
    if (loadingProducts || dynamicProducts.length === 0) return [];
    
    // Seleccionar productos disponibles de diferentes categorías
    const availableFlores = dynamicProducts.filter(p => p.categoria === 'flores' && p.disponible);
    const availablePreRolls = dynamicProducts.filter(p => p.categoria === 'pre-rolls' && p.disponible);
    const availableParafernalia = dynamicProducts.filter(p => p.categoria === 'parafernalia' && p.disponible);
    
    const featured = [];
    
    // Añadir los mejores productos de flores
    if (availableFlores.length > 0) {
      featured.push(...availableFlores.slice(0, 2)); // Tomar los primeros 2 de flores
    }
    
    // Añadir pre-rolls disponibles
    if (availablePreRolls.length > 0 && featured.length < 4) {
      featured.push(availablePreRolls[0]);
    }
    
    // Añadir parafernalia si hay espacio
    if (availableParafernalia.length > 0 && featured.length < 4) {
      featured.push(availableParafernalia[0]);
    }
    
    // Si aún necesitamos más productos, agregar cualquier disponible
    const remainingProducts = dynamicProducts.filter(p => 
      p.disponible && !featured.find(f => f.id === p.id)
    );
    
    while (featured.length < 4 && remainingProducts.length > 0) {
      featured.push(remainingProducts.shift());
    }
    
    return featured.slice(0, 4); // Asegurar máximo 4 productos
  };
  
  const featuredProducts = getFeaturedProducts();

  // Auto-rotate promotions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Cannabis dispensary background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="flex items-center justify-center mb-6 md:mb-8">
              <img
                src={logoBanner}
                alt="Magia Buena Logo"
                className="h-12 md:h-16 lg:h-20 w-auto object-contain animate-float shadow-glow"
              />
            </div>

            <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 mb-6 md:mb-8 font-medium">
              Premium Cannabis Para Preferencia
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed px-4">
              Descubre nuestra seleccion curada de productos de cannabis de la mas alta calidad. 
              Experiencia premium, entrega segura, y atencion personalizada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-12 md:mb-16 px-4">
              <Link to="/catalogo" className="w-full sm:w-auto">
                <Button size="lg" className="glass-button text-base md:text-lg px-6 md:px-8 py-3 md:py-4 shadow-glow w-full sm:w-auto">
                  <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3" />
                  Explorar Catalogo
                </Button>
              </Link>
              <Link to="/contacto" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="glass-card border-glass-border/40 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 hover:border-primary/50 w-full sm:w-auto"
                >
                  <Leaf className="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3" />
                  Contactar
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto px-4">
              {[
                { icon: Shield, title: 'Calidad Premium', desc: 'Productos certificados' },
                { icon: Truck, title: 'Entrega Rapida', desc: 'Mismo dia en CDMX' },
                { icon: Clock, title: '24/7 Disponible', desc: 'Atencion continua' }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title} 
                    className="glass-card rounded-glass p-4 md:p-6 text-center animate-fade-in-up"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="w-10 md:w-12 h-10 md:h-12 mx-auto mb-3 md:mb-4 bg-glass/20 rounded-full flex items-center justify-center">
                      <Icon className="w-5 md:w-6 h-5 md:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="hidden md:block absolute bottom-40 right-20 w-12 h-12 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="hidden md:block absolute top-1/2 right-10 w-16 h-16 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '3s' }} />
      </section>

      <section id="sugeridos" className="py-20 bg-gradient-to-b from-transparent to-glass/10 pb-24 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <img 
                src={logoBanner} 
                alt="Magia Buena Banner" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary mr-3 animate-float" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Productos Sugeridos
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestras cepas más populares y productos estrella seleccionados especialmente para ti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {loadingProducts ? (
              // Skeleton loading para productos
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="glass-card rounded-glass p-6 animate-pulse">
                  <div className="h-48 bg-glass/20 rounded-lg mb-4"></div>
                  <div className="h-4 bg-glass/20 rounded mb-2"></div>
                  <div className="h-3 bg-glass/20 rounded mb-4 w-3/4"></div>
                  <div className="h-6 bg-glass/20 rounded w-1/2"></div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <DynamicProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in-up"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No hay productos disponibles en este momento</p>
              </div>
            )}
          </div>
          
          {featuredProducts.length < 4 && (
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {featuredProducts.length} productos disponibles
              </p>
            </div>
          )}

          <div className="text-center animate-fade-in-up">
            <Link to="/catalogo">
              <Button size="lg" variant="outline" className="glass-card border-glass-border/40">
                Ver Todo el Catalogo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-glass/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-primary mr-3 animate-float" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Promociones Especiales
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ofertas limitadas y paquetes exclusivos con los mejores precios del mercado.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto mb-8">
            <div className="glass-card rounded-glass overflow-hidden animate-fade-in-up">
              <div className="relative">
                {promotions.map((promo, index) => (
                  <div
                    key={promo.id}
                    className={`transition-all duration-500 ${
                      index === currentPromo ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
                      <div className="relative">
                        <img
                          src={promo.image}
                          alt={promo.name}
                          className="w-full h-64 md:h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-glass-shadow/60" />
                        
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {promo.tags?.map((tag) => (
                            <Badge key={tag} className="bg-primary text-primary-foreground shadow-glow">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          {promo.name}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {promo.description}
                        </p>

                        <div className="glass-card rounded-glass p-4 mb-6 bg-glass/20">
                          <h5 className="font-semibold text-foreground mb-2 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-primary" />
                            Incluye:
                          </h5>
                          <ul className="space-y-1">
                            {promo.items?.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm text-muted-foreground flex items-center">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-3xl font-bold text-primary">
                                ${promo.promoPrice}
                              </span>
                              <span className="text-lg text-muted-foreground line-through">
                                ${promo.originalPrice}
                              </span>
                            </div>
                            <p className="text-primary font-semibold">
                              Ahorras ${promo.savings}
                            </p>
                          </div>
                          <Button className="glass-button">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Agregar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromo(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPromo
                    ? 'bg-primary shadow-glow'
                    : 'bg-glass-border/40 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center animate-fade-in-up">
          <Link to="/promociones">
            <Button size="lg" variant="outline" className="glass-card border-glass-border/40">
              Ver Todas las Promociones
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-glass p-12 text-center max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Listo para tu proxima experiencia?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unete a miles de clientes satisfechos que confian en nuestra calidad premium 
              y servicio excepcional. Tu experiencia cannabis perfecta te espera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogo">
                <Button size="lg" className="glass-button text-lg px-8 py-4">
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Comprar Ahora
                </Button>
              </Link>
              <Link to="/contacto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="glass-card border-glass-border/40 text-lg px-8 py-4"
                >
                  Contactar por Telegram
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;