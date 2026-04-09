import heroImg from '../assets/hero.png'

export type ProductCategory = 'computadoras' | 'perifericos' | 'consolas'

export type Product = {
  id: string
  slug: string
  category: ProductCategory
  name: string
  price: number
  compareAtPrice?: number
  shortDescription: string
  description: string
  images: { src: string; alt: string }[]
  specs: { label: string; value: string }[]
}

export const categoryLabels: Record<ProductCategory, string> = {
  computadoras: 'Computadoras',
  perifericos: 'Periféricos',
  consolas: 'Consolas',
}

export const products: Product[] = [
  {
    id: 'pc-aurora',
    slug: 'pc-gamer-aurora-rtx-4070',
    category: 'computadoras',
    name: 'PC Gamer Aurora (RTX 4070)',
    price: 1899999,
    compareAtPrice: 2099999,
    shortDescription: 'Ryzen 7 • RTX 4070 • 32GB RAM • 1TB NVMe',
    description:
      'Una PC gamer pensada para jugar en alto/ultra con streaming. Balance ideal entre FPS, temperaturas y estética premium.',
    images: [
      { src: heroImg, alt: 'PC Gamer Aurora - imagen 1' },
      { src: heroImg, alt: 'PC Gamer Aurora - imagen 2' },
      { src: heroImg, alt: 'PC Gamer Aurora - imagen 3' },
    ],
    specs: [
      { label: 'CPU', value: 'Ryzen 7' },
      { label: 'GPU', value: 'RTX 4070' },
      { label: 'RAM', value: '32GB' },
      { label: 'Almacenamiento', value: '1TB NVMe' },
      { label: 'Conectividad', value: 'Wi‑Fi + Bluetooth' },
    ],
  },
  {
    id: 'pc-onyx',
    slug: 'pc-gamer-onyx-rtx-4060',
    category: 'computadoras',
    name: 'PC Gamer Onyx (RTX 4060)',
    price: 1299999,
    compareAtPrice: 1399999,
    shortDescription: 'Ryzen 5 • RTX 4060 • 16GB RAM • 1TB NVMe',
    description:
      'Configuración sólida para 1080p alto con excelente relación precio/rendimiento. Ideal para dar el salto a RTX.',
    images: [
      { src: heroImg, alt: 'PC Gamer Onyx - imagen 1' },
      { src: heroImg, alt: 'PC Gamer Onyx - imagen 2' },
    ],
    specs: [
      { label: 'CPU', value: 'Ryzen 5' },
      { label: 'GPU', value: 'RTX 4060' },
      { label: 'RAM', value: '16GB' },
      { label: 'Almacenamiento', value: '1TB NVMe' },
    ],
  },
  {
    id: 'notebook-storm',
    slug: 'notebook-gamer-storm-144hz',
    category: 'computadoras',
    name: 'Notebook Gamer Storm 144Hz',
    price: 1599999,
    shortDescription: 'Pantalla 144Hz • SSD NVMe • GPU dedicada',
    description:
      'Portabilidad sin resignar rendimiento. Ideal para gaming y creación, con panel 144Hz para una experiencia fluida.',
    images: [{ src: heroImg, alt: 'Notebook Gamer Storm - imagen 1' }],
    specs: [
      { label: 'Pantalla', value: '144Hz' },
      { label: 'Almacenamiento', value: 'SSD NVMe' },
      { label: 'Gráficos', value: 'GPU dedicada' },
    ],
  },
  {
    id: 'kb-neon-tkl',
    slug: 'teclado-mecanico-neon-tkl',
    category: 'perifericos',
    name: 'Teclado Mecánico Neon TKL',
    price: 169999,
    compareAtPrice: 199999,
    shortDescription: 'Switches lineales • RGB • Hot-swap',
    description:
      'Formato TKL para más espacio de mouse. Switches lineales suaves, RGB potente y construcción sólida.',
    images: [
      { src: heroImg, alt: 'Teclado Mecánico Neon TKL - imagen 1' },
      { src: heroImg, alt: 'Teclado Mecánico Neon TKL - imagen 2' },
    ],
    specs: [
      { label: 'Formato', value: 'TKL' },
      { label: 'RGB', value: 'Sí' },
      { label: 'Switches', value: 'Lineales' },
      { label: 'Hot-swap', value: 'Sí' },
    ],
  },
  {
    id: 'mouse-ultralight',
    slug: 'mouse-ultralight-8k',
    category: 'perifericos',
    name: 'Mouse UltraLight 8K',
    price: 119999,
    compareAtPrice: 149999,
    shortDescription: '49g • 26K DPI • 8K polling • Grip pro',
    description:
      'Diseñado para esports: liviano, rápido y preciso. Sensor premium y polling alto para tracking consistente.',
    images: [{ src: heroImg, alt: 'Mouse UltraLight 8K - imagen 1' }],
    specs: [
      { label: 'Peso', value: '49g' },
      { label: 'DPI', value: '26K' },
      { label: 'Polling', value: '8K' },
    ],
  },
  {
    id: 'headset-spatial',
    slug: 'auriculares-pro-spatial-7-1',
    category: 'perifericos',
    name: 'Auriculares Pro Spatial 7.1',
    price: 139999,
    compareAtPrice: 159999,
    shortDescription: '7.1 • Micrófono HD • Aislamiento premium',
    description:
      'Sonido espacial para posicionamiento preciso. Micrófono nítido y confort para sesiones largas.',
    images: [{ src: heroImg, alt: 'Auriculares Pro Spatial 7.1 - imagen 1' }],
    specs: [
      { label: 'Audio', value: '7.1' },
      { label: 'Micrófono', value: 'HD' },
      { label: 'Conectividad', value: 'USB' },
    ],
  },
  {
    id: 'monitor-165',
    slug: 'monitor-165hz-1ms',
    category: 'perifericos',
    name: 'Monitor 165Hz 1ms',
    price: 299999,
    shortDescription: '165Hz • 1ms • Panel IPS • FreeSync',
    description:
      'Fluidez real para shooters y competitivos. Panel IPS con gran color y baja latencia.',
    images: [{ src: heroImg, alt: 'Monitor 165Hz 1ms - imagen 1' }],
    specs: [
      { label: 'Frecuencia', value: '165Hz' },
      { label: 'Respuesta', value: '1ms' },
      { label: 'Panel', value: 'IPS' },
      { label: 'Sync', value: 'FreeSync' },
    ],
  },
  {
    id: 'ps5-bundle',
    slug: 'consola-next-gen-bundle',
    category: 'consolas',
    name: 'Consola Next‑Gen Bundle',
    price: 999999,
    shortDescription: 'Incluye consola + control + juego',
    description:
      'Bundle listo para jugar con experiencia next‑gen. Ideal para living gamer y 4K.',
    images: [{ src: heroImg, alt: 'Consola Next‑Gen Bundle - imagen 1' }],
    specs: [
      { label: 'Resolución', value: 'Hasta 4K' },
      { label: 'Almacenamiento', value: 'SSD' },
      { label: 'Incluye', value: 'Control + juego' },
    ],
  },
  {
    id: 'console-controller',
    slug: 'control-pro-wireless',
    category: 'consolas',
    name: 'Control Pro Wireless',
    price: 129999,
    shortDescription: 'Vibración • Gatillos adaptativos • Wireless',
    description:
      'Control premium con gran ergonomía y respuesta. Ideal para shooters, deportes y aventura.',
    images: [{ src: heroImg, alt: 'Control Pro Wireless - imagen 1' }],
    specs: [
      { label: 'Conexión', value: 'Wireless' },
      { label: 'Vibración', value: 'Sí' },
      { label: 'Gatillos', value: 'Adaptativos' },
    ],
  },
  {
    id: 'console-headset',
    slug: 'auriculares-console-3d',
    category: 'consolas',
    name: 'Auriculares Console 3D',
    price: 149999,
    shortDescription: 'Audio 3D • Micrófono • Comfort',
    description:
      'Audio inmersivo para juegos de consola. Confort premium y micrófono claro.',
    images: [{ src: heroImg, alt: 'Auriculares Console 3D - imagen 1' }],
    specs: [
      { label: 'Audio', value: '3D' },
      { label: 'Micrófono', value: 'Integrado' },
    ],
  },
  {
    id: 'pc-ignite',
    slug: 'pc-gamer-ignite-rtx-4080',
    category: 'computadoras',
    name: 'PC Gamer Ignite (RTX 4080)',
    price: 3299999,
    shortDescription: 'Ryzen 9 • RTX 4080 • 64GB RAM • 2TB NVMe',
    description:
      'Para máximo rendimiento en 1440p/4K. Ideal para creadores y gamers exigentes que buscan lo mejor.',
    images: [{ src: heroImg, alt: 'PC Gamer Ignite - imagen 1' }],
    specs: [
      { label: 'CPU', value: 'Ryzen 9' },
      { label: 'GPU', value: 'RTX 4080' },
      { label: 'RAM', value: '64GB' },
      { label: 'Almacenamiento', value: '2TB NVMe' },
    ],
  },
  {
    id: 'mousepad-xl',
    slug: 'mousepad-control-xl',
    category: 'perifericos',
    name: 'Mousepad Control XL',
    price: 39999,
    compareAtPrice: 49999,
    shortDescription: 'Superficie control • Antideslizante • XL',
    description:
      'Deslizamiento controlado para tracking estable. Base antideslizante para sesiones intensas.',
    images: [{ src: heroImg, alt: 'Mousepad Control XL - imagen 1' }],
    specs: [
      { label: 'Tamaño', value: 'XL' },
      { label: 'Base', value: 'Antideslizante' },
      { label: 'Tipo', value: 'Control' },
    ],
  },
]

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}

