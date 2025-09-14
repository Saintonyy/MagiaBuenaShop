import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { promotions } from '@/data/products';
import { ShoppingCart, Gift, Clock, Percent } from 'lucide-react';

const Promotions = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Gift className="w-8 h-8 text-primary animate-float" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Promociones
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ofertas especiales y paquetes exclusivos con los mejores precios.
            Aprovecha estas oportunidades limitadas.
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="glass-card rounded-glass p-12 text-center animate-fade-in-up">
          <div className="max-w-2xl mx-auto">
            <Clock className="w-16 h-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Estamos preparando promociones increíbles para ti. Vuelve pronto para ver ofertas exclusivas y descuentos especiales.
            </p>
            <Button className="glass-button text-lg px-8 py-3">
              Contactar por Telegram
            </Button>
          </div>
        </div>

        {/* Promotions Grid - Hidden for now */}
        <div className="hidden grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <div
              key={promo.id}
              className="glass-card glass-hover rounded-glass p-6 animate-fade-in-up group"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Promo Image */}
              <div className="relative mb-6 overflow-hidden rounded-glass">
                <img
                  src={promo.image}
                  alt={promo.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/60 to-transparent" />
                
                {/* Promo Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {promo.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      className="bg-primary text-primary-foreground shadow-glow"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Savings Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-primary rounded-full px-3 py-1 shadow-glow">
                    <div className="flex items-center space-x-1">
                      <Percent className="w-4 h-4 text-primary-foreground" />
                      <span className="text-primary-foreground font-bold text-sm">
                        Ahorra ${promo.savings}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {promo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {promo.description}
                  </p>
                </div>

                {/* Items Included */}
                <div className="glass-card rounded-glass p-4 bg-glass/20">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                    <Gift className="w-4 h-4 mr-2 text-primary" />
                    Incluye:
                  </h4>
                  <ul className="space-y-1">
                    {promo.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 animate-pulse" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        ${promo.promoPrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${promo.originalPrice}
                      </span>
                    </div>
                    <div className="text-xs text-primary font-medium">
                      Ahorras ${promo.savings}
                    </div>
                  </div>

                  {promo.available ? (
                    <Button className="glass-button">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="glass-card border-glass-border/30">
                      <Clock className="w-4 h-4 mr-2" />
                      Agotado
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 glass-card rounded-glass p-8 text-center animate-fade-in-up">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contáctanos para promociones personalizadas y ofertas especiales.
              Siempre tenemos algo nuevo para nuestros clientes regulares.
            </p>
            <Button className="glass-button text-lg px-8 py-3">
              Contactar por Telegram
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Promotions;