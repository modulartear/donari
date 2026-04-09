import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Loader } from '../../components/Loader'
import { SectionHeading } from '../../components/SectionHeading'
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  subscribeProducts,
  type AdminProduct,
  type AdminProductCategory,
  type AdminProductImage,
  updateProduct,
  uploadProductImage,
} from '../../services/adminProducts'

type FormState = {
  name: string
  slug: string
  category: AdminProductCategory
  price: string
  compareAtPrice: string
  shortDescription: string
  description: string
  stock: string
  images: AdminProductImage[]
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function parseMoney(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<AdminProduct[]>([])
  const [query, setQuery] = useState('')

  const [selected, setSelected] = useState<AdminProduct | null>(null)
  const [form, setForm] = useState<FormState>({
    name: '',
    slug: '',
    category: 'computadoras',
    price: '',
    compareAtPrice: '',
    shortDescription: '',
    description: '',
    stock: '0',
    images: [],
  })

  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const unsub = subscribeProducts((next) => {
      setItems(next)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((p) => `${p.name} ${p.slug}`.toLowerCase().includes(q))
  }, [items, query])

  const beginCreate = () => {
    setSelected(null)
    setFormError(null)
    setForm({
      name: '',
      slug: '',
      category: 'computadoras',
      price: '',
      compareAtPrice: '',
      shortDescription: '',
      description: '',
      stock: '0',
      images: [],
    })
  }

  const beginEdit = (p: AdminProduct) => {
    setSelected(p)
    setFormError(null)
    setForm({
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      shortDescription: p.shortDescription,
      description: p.description,
      stock: String(p.stock),
      images: p.images ?? [],
    })
  }

  const validate = () => {
    if (!form.name.trim()) return 'El nombre es obligatorio.'
    if (!form.slug.trim()) return 'El slug es obligatorio.'
    if (parseMoney(form.price) <= 0) return 'El precio debe ser mayor a 0.'
    const stockN = Number(form.stock)
    if (!Number.isFinite(stockN) || stockN < 0) return 'Stock inválido.'
    if (!form.shortDescription.trim()) return 'La descripción corta es obligatoria.'
    return null
  }

  const onSave = async () => {
    setFormError(null)
    const err = validate()
    if (err) {
      setFormError(err)
      return
    }

    setSaving(true)
    try {
      const input = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category,
        price: parseMoney(form.price),
        compareAtPrice: form.compareAtPrice ? parseMoney(form.compareAtPrice) : undefined,
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        stock: Math.floor(Number(form.stock)),
        images: form.images,
      }

      if (selected) {
        await updateProduct(selected.id, input)
      } else {
        const id = await createProduct(input)
        const created: AdminProduct = { ...input, id }
        setSelected(created)
      }
    } catch (e: any) {
      setFormError(e?.message ?? 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!selected) return
    setFormError(null)
    setSaving(true)
    try {
      await Promise.all((form.images ?? []).map((img) => deleteProductImage(img.path).catch(() => null)))
      await deleteProduct(selected.id)
      beginCreate()
    } catch (e: any) {
      setFormError(e?.message ?? 'No se pudo eliminar.')
    } finally {
      setSaving(false)
    }
  }

  const onUploadImages = async (files: FileList | null) => {
    if (!files || !files.length) return
    setFormError(null)
    setUploading(true)
    try {
      let productId = selected?.id
      if (!productId) {
        const err = validate()
        if (err) {
          setFormError('Completá el formulario antes de subir imágenes.')
          setUploading(false)
          return
        }
        const input = {
          name: form.name.trim(),
          slug: form.slug.trim(),
          category: form.category,
          price: parseMoney(form.price),
          compareAtPrice: form.compareAtPrice ? parseMoney(form.compareAtPrice) : undefined,
          shortDescription: form.shortDescription.trim(),
          description: form.description.trim(),
          stock: Math.floor(Number(form.stock)),
          images: [],
        }
        productId = await createProduct(input)
        setSelected({ ...input, id: productId })
      }

      const uploaded = await Promise.all(
        Array.from(files).map((f) => uploadProductImage(productId!, f)),
      )
      const next = [...form.images, ...uploaded]
      setForm((s) => ({ ...s, images: next }))
      await updateProduct(productId!, { images: next })
    } catch (e: any) {
      setFormError(e?.message ?? 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  const onRemoveImage = async (img: AdminProductImage) => {
    if (!selected) return
    setFormError(null)
    setSaving(true)
    try {
      await deleteProductImage(img.path)
      const next = form.images.filter((x) => x.path !== img.path)
      setForm((s) => ({ ...s, images: next }))
      await updateProduct(selected.id, { images: next })
    } catch (e: any) {
      setFormError(e?.message ?? 'No se pudo eliminar la imagen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <SectionHeading
        eyebrow="ADMIN"
        title="Productos"
        subtitle="CRUD, stock e imágenes con Firebase."
        action={
          <Button variant="neon" onClick={beginCreate}>
            Nuevo producto
          </Button>
        }
      />

      <div className="mt-7 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs font-semibold text-white/70">Buscar</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o slug…"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/30">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="text-sm font-extrabold text-white">Listado</div>
              {loading ? <Loader size="sm" /> : <div className="text-sm text-white/60">{filtered.length}</div>}
            </div>

            <div className="max-h-[520px] overflow-auto">
              {loading ? (
                <div className="flex items-center gap-3 p-4 text-sm text-white/70">
                  <Loader size="sm" /> Cargando…
                </div>
              ) : filtered.length ? (
                <div className="divide-y divide-white/10">
                  {filtered.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => beginEdit(p)}
                      className={[
                        'w-full px-4 py-4 text-left transition hover:bg-white/5',
                        selected?.id === p.id ? 'bg-white/5' : '',
                      ].join(' ')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-extrabold text-white">{p.name}</div>
                          <div className="mt-1 text-sm text-white/60">{p.slug}</div>
                        </div>
                        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white">
                          Stock {p.stock}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-white/70">Sin productos.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-white">
                  {selected ? 'Editar producto' : 'Crear producto'}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  {selected ? `ID: ${selected.id}` : 'Completá los datos y guardá.'}
                </div>
              </div>

              <div className="flex gap-2">
                {selected ? (
                  <Button variant="secondary" size="sm" onClick={onDelete} loading={saving}>
                    Eliminar
                  </Button>
                ) : null}
                <Button variant="neon" size="sm" onClick={onSave} loading={saving}>
                  Guardar
                </Button>
              </div>
            </div>

            {formError ? (
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {formError}
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-white/70">Nombre</label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    const nextName = e.target.value
                    setForm((s) => ({
                      ...s,
                      name: nextName,
                      slug: s.slug ? s.slug : slugify(nextName),
                    }))
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-white/70">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((s) => ({ ...s, slug: slugify(e.target.value) }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, category: e.target.value as AdminProductCategory }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                >
                  <option value="computadoras">Computadoras</option>
                  <option value="perifericos">Periféricos</option>
                  <option value="consolas">Consolas</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Stock</label>
                <input
                  inputMode="numeric"
                  value={form.stock}
                  onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Precio</label>
                <input
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70">Precio antes (opcional)</label>
                <input
                  inputMode="numeric"
                  value={form.compareAtPrice}
                  onChange={(e) => setForm((s) => ({ ...s, compareAtPrice: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-white/70">Descripción corta</label>
                <input
                  value={form.shortDescription}
                  onChange={(e) => setForm((s) => ({ ...s, shortDescription: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-white/70">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand-neon/40 focus:ring-2 focus:ring-brand-neon/20"
                />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-white">Imágenes</div>
                  <div className="mt-1 text-sm text-white/60">
                    Subí imágenes a Storage y guardamos URLs en Firestore.
                  </div>
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onUploadImages(e.target.files)}
                    disabled={uploading || saving}
                  />
                  <span className="inline-flex items-center gap-2 rounded-xl bg-brand-neon px-4 py-3 text-sm font-extrabold text-black shadow-glow hover:shadow-glowStrong">
                    {uploading ? (
                      <>
                        <Loader size="sm" className="border-black/20 border-t-black/70" /> Subiendo…
                      </>
                    ) : (
                      'Subir'
                    )}
                  </span>
                </label>
              </div>

              {form.images.length ? (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {form.images.map((img) => (
                    <div
                      key={img.path}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30"
                    >
                      <img src={img.url} alt="" loading="lazy" className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(img)}
                        disabled={saving || uploading}
                        className="absolute right-2 top-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-extrabold text-white opacity-0 transition group-hover:opacity-100"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-sm text-white/60">Sin imágenes.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

