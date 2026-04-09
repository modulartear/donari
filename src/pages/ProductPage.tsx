import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { CardProducto } from '../components/CardProducto'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { useCart } from '../context/cart/CartContext'
import { categoryLabels, getProductBySlug, getRelatedProducts } from '../services/products'

export default function ProductPage() {
  const { addItem, openCart, getItemQuantity } = useCart()

  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const related = useMemo(() => (product ? getRelatedProducts(product, 4) : []), [product])

  const [activeIndex, setActiveIndex] = useState(0)

  if (!product) {
    return (
      <div className="py-12">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-sm font-semibold text-brand-neon">Producto no encontrado</div>
            <h1 className="mt-2 text-3xl font-black text-white">
              No pudimos cargar este producto
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Volvé a la tienda para seguir explorando.
            </p>
            <div className="mt-6">
              <Link to="/tienda">
                <Button variant="neon">Ir a la tienda</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  const images = product.images.length ? product.images : []
  const active = images[activeIndex] ?? images[0]
  const discount =
    typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price
  const qtyInCart = getItemQuantity(product.id)

  return (
    <div className="py-10 md:py-14">
      <Container>
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Link to="/" className="hover:text-white">
            Inicio
          </Link>
          <span> / </span>
          <Link to="/tienda" className="hover:text-white">
            Tienda
          </Link>
          <span> / </span>
          <span className="text-white/80">{categoryLabels[product.category]}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30">
              {active ? (
                <img
                  src={active.src}
                  alt={active.alt}
                  className="h-[340px] w-full object-cover md:h-[520px]"
                  loading="eager"
                />
              ) : (
                <div className="grid h-[340px] place-items-center text-white/60 md:h-[520px]">
                  Sin imagen
                </div>
              )}
            </div>

            {images.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={img.alt + idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={[
                      'overflow-hidden rounded-2xl border bg-black/30 transition',
                      idx === activeIndex
                        ? 'border-brand-neon/40 ring-2 ring-brand-neon/20'
                        : 'border-white/10 hover:border-white/20',
                    ].join(' ')}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-20 w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {discount ? <Badge variant="oferta">Oferta</Badge> : <Badge variant="nuevo">Nuevo</Badge>}
              <Badge variant="default">{categoryLabels[product.category]}</Badge>
            </div>

            <h1 className="mt-4 text-balance text-3xl font-black text-white md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-3 text-pretty text-base text-white/70 md:text-lg">
              {product.description}
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-3xl font-black text-white">
                    {new Intl.NumberFormat('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </div>
                  {discount ? (
                    <div className="mt-1 text-sm text-white/50 line-through">
                      {new Intl.NumberFormat('es-AR', {
                        style: 'currency',
                        currency: 'ARS',
                        maximumFractionDigits: 0,
                      }).format(product.compareAtPrice!)}
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-white/50">Precio final</div>
                  )}
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Button
                    variant="neon"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      addItem(product.id, 1)
                      openCart()
                    }}
                  >
                    Comprar
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      addItem(product.id, 1)
                      openCart()
                    }}
                  >
                    {qtyInCart > 0 ? 'Agregar más' : 'Agregar al carrito'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <SectionHeading
                eyebrow="ESPECIFICACIONES"
                title="Ficha técnica"
                subtitle="Características clave para decidir más rápido."
              />

              <dl className="mt-5 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2">
                {product.specs.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <dt className="text-xs font-semibold text-white/60">{s.label}</dt>
                    <dd className="mt-1 text-sm font-extrabold text-white">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {related.length ? (
          <div className="mt-12">
            <SectionHeading
              eyebrow="RELACIONADOS"
              title="Productos relacionados"
              subtitle="Opciones similares para comparar antes de comprar."
              action={
                <Link to="/tienda">
                  <Button variant="secondary">Ver tienda</Button>
                </Link>
              }
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <CardProducto
                  key={p.id}
                  name={p.name}
                  description={p.shortDescription}
                  price={p.price}
                  compareAtPrice={p.compareAtPrice}
                  imageSrc={p.images[0]?.src}
                  imageAlt={p.images[0]?.alt}
                  badgeVariant={p.compareAtPrice ? 'oferta' : 'nuevo'}
                  badgeText={p.compareAtPrice ? 'Oferta' : 'Nuevo'}
                  action={
                    <Link
                      to={`/tienda/${p.slug}`}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white hover:bg-white/10"
                    >
                      Ver
                    </Link>
                  }
                  ctaLabel="Agregar al carrito"
                  onCtaClick={() => {
                    addItem(p.id, 1)
                    openCart()
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  )
}
