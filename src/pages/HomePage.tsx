

import heroImg from '../assets/hero.png'
import { Container } from '../components/Container'
import { NeonButton } from '../components/NeonButton'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { CategoryCard } from '../components/CategoryCard'
import { ProductCard } from '../components/ProductCard'
import { BuilderComponent } from '@builder.io/react'
import '../builder'

const categories = [
  {
    title: 'Computadoras',
    description: 'PCs armadas, notebooks y setups listos para competir.',
    to: '/tienda?categoria=computadoras',
    accent: 'neon' as const,
  },
  {
    title: 'Periféricos',
    description: 'Teclados, mice, auriculares y monitores con ventaja real.',
    to: '/tienda?categoria=perifericos',
    accent: 'electric' as const,
  },
  {
    title: 'Consolas',
    description: 'Todo para jugar en consola: hardware, accesorios y más.',
    to: '/tienda?categoria=consolas',
    accent: 'neon' as const,
  },
]

const featuredProducts = [
  {
    name: 'PC Gamer Aurora',
    description: 'Ryzen 7 • RTX 4070 • 32GB RAM • 1TB NVMe',
    price: 1899999,
    compareAtPrice: 2099999,
    badge: 'Top ventas',
  },
  {
    name: 'Teclado Mecánico Neon TKL',
    description: 'Switches lineales • RGB • Hot-swap',
    price: 169999,
    compareAtPrice: 199999,
    badge: 'Oferta flash',
  },
  {
    name: 'Auriculares Pro Spatial',
    description: '7.1 • Micrófono HD • Aislamiento premium',
    price: 139999,
    compareAtPrice: 159999,
    badge: 'Recomendado',
  },
  {
    name: 'Mouse UltraLight 8K',
    description: '49g • 26K DPI • 8K polling • Grip pro',
    price: 119999,
    compareAtPrice: 149999,
    badge: 'Nuevo',
  },
]

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-[-120px] h-[520px] w-[520px] rounded-full bg-brand-neon/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-[40px] h-[560px] w-[560px] rounded-full bg-brand-electric/15 blur-3xl" />

      <div className="py-10 md:py-14">
        <Container>
          <section className="grid items-center gap-10 md:grid-cols-2">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                <span className="h-2 w-2 rounded-full bg-brand-neon shadow-glow" />
                Stock verificado + envío rápido
              </div>

              <h1 className="mt-5 text-balance text-4xl font-black leading-tight text-white md:text-6xl">
                Mejorá tu <span className="text-brand-neon">setup gamer</span>
              </h1>

              <p className="mt-4 max-w-xl text-pretty text-base text-white/70 md:text-lg">
                Computadoras, hardware gamer y periféricos premium para subir FPS, mejorar
                precisión y ganar ventaja real.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/tienda">
                  <NeonButton className="w-full sm:w-auto">Ver productos</NeonButton>
                </Link>
                <Link to="/ofertas">
                  <NeonButton variant="ghost" className="w-full sm:w-auto">
                    Ver ofertas
                  </NeonButton>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/70 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10">
                  <div className="text-white">Pagos seguros</div>
                  <div className="mt-1 text-white/60">Mercado Pago</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10">
                  <div className="text-white">Garantía</div>
                  <div className="mt-1 text-white/60">Productos originales</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10">
                  <div className="text-white">Asesoramiento</div>
                  <div className="mt-1 text-white/60">Para cada build</div>
                </div>
              </div>
            </div>

            <div className="relative md:justify-self-end">
              <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-brand-neon/10 blur-2xl" />
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[2rem] bg-brand-electric/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-glow">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_10%,rgba(0,255,136,0.18),transparent_55%),radial-gradient(700px_circle_at_80%_30%,rgba(109,40,217,0.18),transparent_55%)]" />
                <img
                  src={heroImg}
                  alt="Setup gamer RGB"
                  className="relative h-[360px] w-full object-cover md:h-[560px]"
                  loading="eager"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div>
                  <div className="text-sm font-extrabold text-white">Gaming Premium</div>
                  <div className="mt-1 text-sm text-white/60">
                    Productos seleccionados para rendimiento real
                  </div>
                </div>
                <div className="h-11 w-11 animate-float rounded-2xl bg-brand-neon/10 ring-1 ring-brand-neon/30" />
              </div>
            </div>
          </section>
        </Container>
      </div>

      <div className="py-10 md:py-14">
        <Container>
          <SectionHeading
            eyebrow="CATEGORÍAS"
            title="Elegí tu próxima mejora"
            subtitle="Explorá por tipo de producto y encontrá lo que tu setup necesita hoy."
          />

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard
                key={c.title}
                title={c.title}
                description={c.description}
                to={c.to}
                accent={c.accent}
              />
            ))}
          </div>
        </Container>
      </div>

      <div className="py-10 md:py-14">
        <Container>
          <SectionHeading
            eyebrow="PROMOCIONES"
            title="Destacados con precio competitivo"
            subtitle="Selección premium lista para comprar: rendimiento, estética y valor."
            action={
              <Link to="/tienda">
                <NeonButton variant="ghost">Ver más</NeonButton>
              </Link>
            }
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.name}
                name={p.name}
                description={p.description}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                badge={p.badge}
              />
            ))}
          </div>
        </Container>
      </div>

      <div className="py-10 md:py-14">
        <Container>
          <div className="grid gap-6 rounded-[2.25rem] border border-white/10 bg-white/5 p-7 md:grid-cols-2 md:p-10">
            <div>
              <div className="text-xs font-semibold tracking-wider text-brand-neon/90">
                SECCIÓN LOCAL
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
                Visitá nuestro local
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
                Probá periféricos, retirás compras y resolvés dudas con asesoramiento
                experto. Vení con tu idea de build y lo armamos juntos.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noreferrer"
                >
                  <NeonButton className="w-full sm:w-auto">Cómo llegar</NeonButton>
                </a>
                <Link to="/contacto">
                  <NeonButton variant="ghost" className="w-full sm:w-auto">
                    Contacto
                  </NeonButton>
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 text-sm text-white/70">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-white">Atención</div>
                  <div className="mt-1 text-white/60">Lun a Sáb</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-white">Retiro</div>
                  <div className="mt-1 text-white/60">En el día</div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40">
              <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_20%,rgba(0,255,136,0.16),transparent_55%),radial-gradient(800px_circle_at_80%_60%,rgba(109,40,217,0.2),transparent_55%)]" />
              <div className="relative grid h-full min-h-[260px] place-items-center p-6">
                <div className="text-center">
                  <div className="text-sm font-extrabold text-white">
                    DON ARII Gamer Store
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Ubicación en el mapa (próximo módulo)
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-neon shadow-glow" />
                    Local físico + postventa
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

