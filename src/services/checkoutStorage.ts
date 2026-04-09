import type { CartItem } from '../context/cart/CartContext'

export type CheckoutCustomer = {
  fullName: string
  email: string
  phone?: string
  document?: string
  address?: string
  notes?: string
}

export type CheckoutSnapshot = {
  id: string
  createdAt: number
  customer: CheckoutCustomer
  items: CartItem[]
  total: number
}

const KEY = 'donarii.checkout.last.v1'

export function saveCheckoutSnapshot(snapshot: CheckoutSnapshot) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(snapshot))
}

export function loadCheckoutSnapshot(): CheckoutSnapshot | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CheckoutSnapshot
    if (!parsed || typeof parsed !== 'object') return null
    if (typeof parsed.id !== 'string') return null
    if (typeof parsed.createdAt !== 'number') return null
    if (!Array.isArray(parsed.items)) return null
    if (typeof parsed.total !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function clearCheckoutSnapshot() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY)
}

