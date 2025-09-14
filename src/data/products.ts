import cannabisFlower1 from '@/assets/cannabis-flower-1.jpg';
import preRoll1 from '@/assets/pre-roll-1.jpg';
import paraphernalia1 from '@/assets/paraphernalia-1.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  strain: string;
  thc: string;
  type: string;
  available: boolean;
  sizes: Array<{
    weight: string;
    price: number;
  }>;
  badges: string[];
  // New pricing fields
  price_onza?: number; // For flores category - main price display
  price_por_pieza?: number; // For non-flores that have piece pricing
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Gorila Rainbow',
    description: 'Sativa cítrica. Energía creativa. Notas de limón y piña. Una experiencia única que despierta la creatividad y eleva el ánimo con su perfil terpénico tropical.',
    price: 3200, // Base price for reference
    price_onza: 3200, // Main display price for 1 onza
    image: cannabisFlower1,
    category: 'flores',
    strain: 'Gorila Rainbow',
    thc: '18-22%',
    type: 'Sativa',
    available: true,
    sizes: [
      { weight: '1 onza (28g)', price: 3200 },
      { weight: 'Media onza (14g)', price: 1700 },
      { weight: '50 gramos', price: 5600 },
      { weight: 'Por gramo', price: 120 }
    ],
    badges: ['Disponible', 'Sativa', 'Indoor', 'Premium']
  },
  {
    id: '2',
    name: 'Purple Haze',
    description: 'Híbrido balanceado con dominancia sativa. Efectos relajantes y creativos. Aroma floral con notas terrosas y dulces que proporcionan una experiencia equilibrada.',
    price: 2800,
    price_onza: 2800,
    image: cannabisFlower1,
    category: 'flores',
    strain: 'Purple Haze',
    thc: '16-20%',
    type: 'Híbrido',
    available: true,
    sizes: [
      { weight: '1 onza (28g)', price: 2800 },
      { weight: 'Media onza (14g)', price: 1500 },
      { weight: '50 gramos', price: 4900 },
      { weight: 'Por gramo', price: 105 }
    ],
    badges: ['Disponible', 'Híbrido', 'Indoor']
  },
  {
    id: '3',
    name: 'OG Kush',
    description: 'Indica clásica. Efectos profundamente relajantes. Perfil terroso con toques cítricos. Ideal para relajación nocturna y descanso reparador.',
    price: 3500,
    price_onza: 3500,
    image: cannabisFlower1,
    category: 'flores',
    strain: 'OG Kush',
    thc: '20-24%',
    type: 'Indica',
    available: false,
    sizes: [
      { weight: '1 onza (28g)', price: 3500 },
      { weight: 'Media onza (14g)', price: 1850 },
      { weight: '50 gramos', price: 6100 },
      { weight: 'Por gramo', price: 130 }
    ],
    badges: ['Agotado', 'Indica', 'Premium', 'Indoor']
  },
  {
    id: '4',
    name: 'Pre-Roll Premium Mix',
    description: 'Mezcla selecta de nuestras mejores cepas. Perfectamente enrollado para una experiencia sin complicaciones. Ideal para ocasiones especiales.',
    price: 75,
    price_por_pieza: 75,
    image: preRoll1,
    category: 'pre-rolls',
    strain: 'Mix Premium',
    thc: '18-20%',
    type: 'Híbrido',
    available: true,
    sizes: [
      { weight: '1 unidad', price: 75 },
      { weight: '5 unidades', price: 350 },
      { weight: '10 unidades', price: 650 }
    ],
    badges: ['Disponible', 'Pre-Roll', 'Premium']
  },
  {
    id: '5',
    name: 'Grinder Glass Pro',
    description: 'Grinder de cristal de alta calidad con compartimento para polen. Diseño ergonómico y resistente. Perfecto para un molido uniforme.',
    price: 80,
    price_por_pieza: 0, // No piece pricing for this item
    image: paraphernalia1,
    category: 'parafernalia',
    strain: 'N/A',
    thc: 'N/A',
    type: 'Accesorio',
    available: true,
    sizes: [
      { weight: 'Unitario', price: 80 }
    ],
    badges: ['Disponible', 'Premium', 'Resistente']
  },
  {
    id: '6',
    name: 'White Widow',
    description: 'Híbrido legendario con balance perfecto. Efectos cerebrales y corporales equilibrados. Aroma dulce con toques terrosos y especiados.',
    price: 3000,
    price_onza: 3000,
    image: cannabisFlower1,
    category: 'flores',
    strain: 'White Widow',
    thc: '17-21%',
    type: 'Híbrido',
    available: true,
    sizes: [
      { weight: '1 onza (28g)', price: 3000 },
      { weight: 'Media onza (14g)', price: 1600 },
      { weight: '50 gramos', price: 5200 },
      { weight: 'Por gramo', price: 110 }
    ],
    badges: ['Disponible', 'Híbrido', 'Clásico']
  },
  {
    id: '7',
    name: 'Papel Rizla Silver',
    description: 'Papeles ultra finos de alta calidad para una experiencia de fumar suave y limpia.',
    price: 45,
    price_por_pieza: 15, // Price per individual booklet
    image: paraphernalia1,
    category: 'parafernalia',
    strain: 'N/A',
    thc: 'N/A',
    type: 'Accesorio',
    available: true,
    sizes: [
      { weight: 'Paquete (3 libritos)', price: 45 }
    ],
    badges: ['Disponible', 'Premium']
  }
];

export const promotions = [
  {
    id: 'promo1',
    name: '2x1 Orange Juice',
    description: 'Lleva 2 onzas de Orange Juice por el precio de una. Incluye entrega local y sticker de edición limitada.',
    originalPrice: 3800,
    promoPrice: 1900,
    savings: 1900,
    items: [
      '2 onzas Orange Juice',
      'Entrega local',
      'Sticker edición limitada'
    ],
    image: cannabisFlower1,
    available: true,
    tags: ['2x1', 'Exclusiva']
  },
  {
    id: 'promo2',
    name: 'Pack Starter',
    description: 'El combo perfecto para nuevos usuarios. Incluye una selección variada de productos premium.',
    originalPrice: 800,
    promoPrice: 600,
    savings: 200,
    items: [
      '1 Pre-roll premium',
      '7g de flor selecta',
      'Grinder básico',
      'Papers premium'
    ],
    image: preRoll1,
    available: true,
    tags: ['Pack', 'Starter']
  },
  {
    id: 'promo3',
    name: 'Premium Experience',
    description: 'La experiencia completa con nuestros productos más exclusivos y accesorios premium.',
    originalPrice: 1500,
    promoPrice: 1200,
    savings: 300,
    items: [
      '25g flor premium',
      '5 Pre-rolls selectos',
      'Grinder glass pro',
      'Kit de limpieza'
    ],
    image: paraphernalia1,
    available: true,
    tags: ['Premium', 'Exclusivo']
  }
];