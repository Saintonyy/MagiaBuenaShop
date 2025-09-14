import cannabisFlower1 from '@/assets/cannabis-flower-1.jpg';
import preRoll1 from '@/assets/pre-roll-1.jpg';
import paraphernalia1 from '@/assets/paraphernalia-1.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Main price (1 onza for flores, unidad for others)
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
  // New pricing structure
  precio_onza?: number;
  precio_media_onza?: number;
  precio_gramo?: number;
  precio_por_pieza?: number;
  precio_unidad?: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Gorila Rainbow',
    description: 'Sativa cítrica. Energía creativa. Notas de limón y piña. Una experiencia única que despierta la creatividad y eleva el ánimo con su perfil terpénico tropical.',
    price: 3800, // Main price - 1 onza
    image: cannabisFlower1,
    category: 'flores',
    strain: 'Gorila Rainbow',
    thc: '18-22%',
    type: 'Sativa',
    available: true,
    sizes: [
      { weight: '1 onza', price: 3800 },
      { weight: '1/2 onza', price: 2000 },
      { weight: 'Por gramo', price: 140 }
    ],
    badges: ['Disponible', 'Sativa', 'Indoor', 'Premium'],
    precio_onza: 3800,
    precio_media_onza: 2000,
    precio_gramo: 140
  },
  {
    id: '2',
    name: 'Purple Haze',
    description: 'Híbrido balanceado con dominancia sativa. Efectos relajantes y creativos. Aroma floral con notas terrosas y dulces que proporcionan una experiencia equilibrada.',
    price: 3600, // Main price - 1 onza
    image: cannabisFlower1,
    category: 'flores',
    strain: 'Purple Haze',
    thc: '16-20%',
    type: 'Híbrido',
    available: true,
    sizes: [
      { weight: '1 onza', price: 3600 },
      { weight: '1/2 onza', price: 1900 },
      { weight: 'Por gramo', price: 130 }
    ],
    badges: ['Disponible', 'Híbrido', 'Indoor'],
    precio_onza: 3600,
    precio_media_onza: 1900,
    precio_gramo: 130
  },
  {
    id: '3',
    name: 'OG Kush',
    description: 'Indica clásica. Efectos profundamente relajantes. Perfil terroso con toques cítricos. Ideal para relajación nocturna y descanso reparador.',
    price: 4200, // Main price - 1 onza
    image: cannabisFlower1,
    category: 'flores',
    strain: 'OG Kush',
    thc: '20-24%',
    type: 'Indica',
    available: false,
    sizes: [
      { weight: '1 onza', price: 4200 },
      { weight: '1/2 onza', price: 2200 },
      { weight: 'Por gramo', price: 150 }
    ],
    badges: ['Agotado', 'Indica', 'Premium', 'Indoor'],
    precio_onza: 4200,
    precio_media_onza: 2200,
    precio_gramo: 150
  },
  {
    id: '4',
    name: 'Pre-Roll Premium Mix',
    description: 'Mezcla selecta de nuestras mejores cepas. Perfectamente enrollado para una experiencia sin complicaciones. Ideal para ocasiones especiales.',
    price: 350, // Main price - por unidad
    image: preRoll1,
    category: 'pre-rolls',
    strain: 'Mix Premium',
    thc: '18-20%',
    type: 'Híbrido',
    available: true,
    sizes: [
      { weight: 'Unidad', price: 350 },
      { weight: 'Por pieza', price: 80 }
    ],
    badges: ['Disponible', 'Pre-Roll', 'Premium'],
    precio_unidad: 350,
    precio_por_pieza: 80
  },
  {
    id: '5',
    name: 'Grinder Glass Pro',
    description: 'Grinder de cristal de alta calidad con compartimento para polen. Diseño ergonómico y resistente. Perfecto para un molido uniforme.',
    price: 450, // Main price - por unidad
    image: paraphernalia1,
    category: 'parafernalia',
    strain: 'N/A',
    thc: 'N/A',
    type: 'Accesorio',
    available: true,
    sizes: [
      { weight: 'Unidad', price: 450 }
    ],
    badges: ['Disponible', 'Premium', 'Resistente'],
    precio_unidad: 450,
    precio_por_pieza: 0 // This will not show the "por pieza" option
  },
  {
    id: '6',
    name: 'White Widow',
    description: 'Híbrido legendario con balance perfecto. Efectos cerebrales y corporales equilibrados. Aroma dulce con toques terrosos y especiados.',
    price: 3700, // Main price - 1 onza
    image: cannabisFlower1,
    category: 'flores',
    strain: 'White Widow',
    thc: '17-21%',
    type: 'Híbrido',
    available: true,
    sizes: [
      { weight: '1 onza', price: 3700 },
      { weight: '1/2 onza', price: 1950 },
      { weight: 'Por gramo', price: 135 }
    ],
    badges: ['Disponible', 'Híbrido', 'Clásico'],
    precio_onza: 3700,
    precio_media_onza: 1950,
    precio_gramo: 135
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