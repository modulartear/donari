import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CardProducto } from '../components/CardProducto'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { Button } from '../components/Button'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useCart } from '../context/cart/CartContext'
import { categoryLabels, products, type ProductCategory } from '../services/products'

type SortKey = 'relevancia' | 'precio_asc' | 'precio_desc' | 'nombre_asc' | 'nombre_desc'

function clampNumber(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export default function StorePage() {
  const { addItem, openCart, getItemQuantity } = useCart()

  const [searchParams, setSearchParams] = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''
  const initialCategory = (searchParams.get('categoria') as ProductCategory | null) ?? null
  const initialMin = searchParams.get('min') ? Number(searchParams.get('min')) : undefined
  const initialMax = searchParams.get('max') ? Number(searchParams.get('max')) : undefined
  const initialSort = (searchParams.get('sort') as SortKey | null) ?? 'relevancia'

  const [query, setQuery] = useState(initialQ)
  const debouncedQuery = useDebouncedValue(query, 250)

  const [category, setCategory] = useState<ProductCategory | 'all'>(
    initialCategory ?? 'all',
  )
  const [minPrice, setMinPrice] = useState<number | ''>(
    typeof initialMin === 'number' && Number.isFinite(initialMin) ? initialMin : '',
  )
  const [maxPrice, setMaxPrice] = useState<number | ''>(
    typeof initialMax === 'number' && Number.isFinite(initialMax) ? initialMax : '',
  )
  const [sort, setSort] = useState<SortKey>(initialSort)

  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return { min, max }
  }, [])

  const normalizedMin = useMemo(() => {
    if (minPrice === '' || !Number.isFinite(minPrice)) return undefined
    return clampNumber(minPrice, 0, priceBounds.max)
  }, [minPrice, priceBounds.max])

  const normalizedMax = useMemo(() => {
    if (maxPrice === '' || !Number.isFinite(maxPrice)) return undefined
    return clampNumber(maxPrice, 0, priceBounds.max)
  }, [maxPrice, priceBounds.max])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()

    let list = products.filter((p) => {
      const matchesCategory = category === 'all' ? true : p.category === category
      const matchesMin = typeof normalizedMin === 'number' ? p.price >= normalizedMin : true
      const matchesMax = typeof normalizedMax === 'number' ? p.price <= normalizedMax : true
      const matchesQuery = q
        ? `${p.name} ${p.shortDescription}`.toLowerCase().includes(q)
        : true
      return matchesCategory && matchesMin && matchesMax && matchesQuery
    })

    if (sort === 'precio_asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'precio_desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'nombre_asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'nombre_desc') list = [...list].sort((a, b) => b.name.localeCompare(a.name))

    return list
  }, [category, debouncedQuery, normalizedMax, normalizedMin, sort])

  const applyToUrl = (next: {
    q?: string
    categoria?: string
    min?: string
    max?: string
    sort?: string
  }) => {
    const sp = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (!v) sp.delete(k)
      else sp.set(k, v)
    })
    setSearchParams(sp, { replace: true })
  }

  const onReset = () => {
    setQuery('')
    setCategory('all')
    setMinPrice('')
    setMaxPrice('')
    setSort('relevancia')
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const onAddToCart = (id: string) => {
    addItem(id, 1)
    openCart()
  }

  return (
    <div className="py-10 md:py-14">
      <Container>
        <SectionHeading
          eyebrow="TIENDA"
          title="Productos"
          subtitle="Buscá, filtrá y ordená para encontrar tu próxima mejora."
          action={
            <Button variant="secondary" onClick={onReset}>
              Limpiar
            </Button>
          }
        />

        <div className="mt-7 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <label className="text-xs font-semibold text-white/70">Buscador</label>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                applyToUrl({ q: e.target.value.trim() || undefined })
              }}
              placeholder="Buscar PC, RTX, teclado, monitor..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-white/70">Categoría</label>
            <select
              value={category}
              onChange={(e) => {
                const next = e.target.value as ProductCategory | 'all'
                setCategory(next)
                applyToUrl({ categoria: next === 'all' ? undefined : next })
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
            >
              <option value="all">Todas</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 md:col-span-3">
            <div>
              <label className="text-xs font-semibold text-white/70">Precio mín</label>
              <input
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => {
                  const raw = e.target.value
                  const next = raw === '' ? '' : Number(raw)
                  setMinPrice(next === '' || Number.isFinite(next) ? (next as any) : '')
                  applyToUrl({ min: raw || undefined })
                }}
                placeholder={`${priceBounds.min}`}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/70">Precio máx</label>
              <input
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => {
                  const raw = e.target.value
                  const next = raw === '' ? '' : Number(raw)
                  setMaxPrice(next === '' || Number.isFinite(next) ? (next as any) : '')
                  applyToUrl({ max: raw || undefined })
                }}
                placeholder={`${priceBounds.max}`}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="text-xs font-semibold text-white/70">Orden</label>
            <select
              value={sort}
              onChange={(e) => {
                const next = e.target.value as SortKey
                setSort(next)
                applyToUrl({ sort: next === 'relevancia' ? undefined : next })
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none transition focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
            >
              <option value="relevancia">Relev.</option>
              <option value="precio_asc">Precio ↑</option>
              <option value="precio_desc">Precio ↓</option>
              <option value="nombre_asc">Nombre A‑Z</option>
              <option value="nombre_desc">Nombre Z‑A</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-white/70">
          <div>
            Mostrando <span className="text-white">{filtered.length}</span> productos
          </div>
          <div className="hidden sm:block">
            <span className="text-white/60">Tip:</span> probá “rtx”, “tkl”, “165hz”
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
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
              ctaLabel={getItemQuantity(p.id) > 0 ? 'Agregar más' : 'Agregar al carrito'}
              onCtaClick={() => onAddToCart(p.id)}
              className="h-full"
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-lg font-extrabold text-white">Sin resultados</div>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Ajustá filtros o buscá con menos términos. También podés limpiar y empezar
              de nuevo.
            </p>
            <div className="mt-5">
              <Button variant="neon" onClick={onReset}>
                Limpiar filtros
              </Button>
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  )
}

