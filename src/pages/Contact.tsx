import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Instagram, Facebook, Twitter, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const socialLinks = [
    {
      name: 'Telegram',
      icon: MessageCircle,
      href: 'https://t.me/magiabuena',
      description: 'Chat directo para pedidos y consultas',
      primary: true,
      bgColor: 'bg-gradient-primary',
      textColor: 'text-primary-foreground'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/magiabuena',
      description: 'Síguenos para novedades y contenido',
      primary: false,
      bgColor: 'glass-card',
      textColor: 'text-foreground'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/magiabuena',
      description: 'Únete a nuestra comunidad',
      primary: false,
      bgColor: 'glass-card',
      textColor: 'text-foreground'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/magiabuena',
      description: 'Noticias y actualizaciones rápidas',
      primary: false,
      bgColor: 'glass-card',
      textColor: 'text-foreground'
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      info: '+1 (555) 123-4567',
      description: 'Llamadas y WhatsApp'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      info: 'Ciudad de México',
      description: 'Entrega en zona metropolitana'
    },
    {
      icon: Clock,
      title: 'Horarios',
      info: 'Lun - Dom: 10:00 - 22:00',
      description: 'Atención todos los días'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contacto
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Elige tu método de contacto preferido
            y te responderemos lo más pronto posible.
          </p>
        </div>

        {/* Primary Contact - Telegram */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card rounded-glass p-8 text-center border-2 border-primary/30 shadow-glow">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
              <MessageCircle className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Contacto Preferido
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Para pedidos, consultas y atención personalizada, contáctanos directamente por Telegram.
              Respuesta garantizada en menos de 30 minutos.
            </p>
            <Button 
              size="lg" 
              className="glass-button text-lg px-8 py-4 shadow-glow"
              onClick={() => window.open('https://t.me/magiabuena', '_blank')}
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Abrir Telegram
            </Button>
          </div>
        </div>

        {/* Other Social Media */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Síguenos en Redes Sociales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialLinks.slice(1).map((social, index) => {
              const Icon = social.icon;
              return (
                <Card 
                  key={social.name}
                  className="glass-card glass-hover border-glass-border/30 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * (index + 3)}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 glass-card rounded-full flex items-center justify-center border border-glass-border/30">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {social.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {social.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="glass-card border-glass-border/30 w-full"
                      onClick={() => window.open(social.href, '_blank')}
                    >
                      Seguir
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card 
                  key={info.title}
                  className="glass-card border-glass-border/30 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * (index + 5)}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 glass-card rounded-full flex items-center justify-center border border-glass-border/30">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {info.title}
                    </h3>
                    <p className="text-base text-foreground font-medium mb-2">
                      {info.info}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card rounded-glass p-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Cómo realizo un pedido?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Contáctanos por Telegram con los productos que deseas y te guiaremos en el proceso.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Cuál es el tiempo de entrega?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Entregamos el mismo día en CDMX. Para otras zonas, consulta tiempos específicos.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Qué métodos de pago aceptan?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Efectivo, transferencia bancaria y métodos digitales. Consulta opciones disponibles.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Tienen garantía de calidad?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Todos nuestros productos son probados y garantizamos su calidad premium.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
