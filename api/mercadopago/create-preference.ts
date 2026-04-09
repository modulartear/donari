type Customer = {
  fullName: string
  email: string
  phone?: string
  document?: string
  address?: string
  notes?: string
}

type Item = {
  id: string
  title: string
  quantity: number
  unit_price: number
}

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function getBaseUrl(req: any) {
  const host =
    (req.headers['x-forwarded-host'] as string | undefined) ??
    (req.headers.host as string | undefined) ??
    'localhost:5173'
  const defaultProto = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https'
  const proto =
    (req.headers['x-forwarded-proto'] as string | undefined) ??
    (req.headers['x-forwarded-protocol'] as string | undefined) ??
    defaultProto
  return `${proto}://${host}`
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' })
    return
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) {
    res.status(500).json({ error: 'Falta MP_ACCESS_TOKEN en variables de entorno' })
    return
  }

  const body = req.body ?? {}
  const customer = body.customer as Customer | undefined
  const items = body.items as Item[] | undefined

  if (!customer || !isNonEmptyString(customer.fullName) || !isNonEmptyString(customer.email)) {
    res.status(400).json({ error: 'Datos de cliente incompletos' })
    return
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'El carrito está vacío' })
    return
  }

  const normalizedItems = items
    .map((i) => {
      if (!i) return null
      if (!isNonEmptyString(i.id)) return null
      if (!isNonEmptyString(i.title)) return null
      if (typeof i.quantity !== 'number' || !Number.isFinite(i.quantity) || i.quantity <= 0)
        return null
      if (
        typeof i.unit_price !== 'number' ||
        !Number.isFinite(i.unit_price) ||
        i.unit_price <= 0
      )
        return null
      return {
        id: String(i.id),
        title: String(i.title),
        quantity: Math.floor(i.quantity),
        unit_price: Number(i.unit_price),
        currency_id: 'ARS',
      }
    })
    .filter(Boolean)

  if (normalizedItems.length === 0) {
    res.status(400).json({ error: 'Items inválidos' })
    return
  }

  const baseUrl = getBaseUrl(req)
  const preference = {
    items: normalizedItems,
    payer: {
      name: customer.fullName,
      email: customer.email,
      phone: customer.phone ? { number: customer.phone } : undefined,
      identification: customer.document ? { type: 'DNI', number: customer.document } : undefined,
      address: customer.address ? { street_name: customer.address } : undefined,
    },
    back_urls: {
      success: `${baseUrl}/confirmacion?status=success`,
      failure: `${baseUrl}/confirmacion?status=failure`,
      pending: `${baseUrl}/confirmacion?status=pending`,
    },
    auto_return: 'approved',
    statement_descriptor: 'DON ARII',
    metadata: {
      customer,
    },
  }

  try {
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    const data = await mpRes.json()
    if (!mpRes.ok) {
      res.status(502).json({
        error: 'No se pudo crear la preferencia',
        details: data,
      })
      return
    }

    res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    })
  } catch (e: any) {
    res.status(500).json({ error: 'Error inesperado', details: e?.message })
  }
}
