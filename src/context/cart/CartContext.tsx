import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import type { ReactNode } from 'react'

export type CartItem = {
  productId: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'cart/open' }
  | { type: 'cart/close' }
  | { type: 'cart/toggle' }
  | { type: 'cart/setItems'; payload: CartItem[] }
  | { type: 'cart/add'; payload: { productId: string; quantity: number } }
  | { type: 'cart/remove'; payload: { productId: string } }
  | { type: 'cart/setQuantity'; payload: { productId: string; quantity: number } }
  | { type: 'cart/clear' }

type CartApi = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (productId: string, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
  totalItems: number
}

const STORAGE_KEY = 'donarii.cart.v1'

function safeParseItems(value: string | null): CartItem[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((x) => {
        if (!x || typeof x !== 'object') return null
        const productId = (x as any).productId
        const quantity = (x as any).quantity
        if (typeof productId !== 'string') return null
        if (typeof quantity !== 'number' || !Number.isFinite(quantity)) return null
        return { productId, quantity: Math.max(0, Math.floor(quantity)) }
      })
      .filter(Boolean) as CartItem[]
  } catch {
    return []
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'cart/open') return { ...state, isOpen: true }
  if (action.type === 'cart/close') return { ...state, isOpen: false }
  if (action.type === 'cart/toggle') return { ...state, isOpen: !state.isOpen }
  if (action.type === 'cart/setItems') return { ...state, items: action.payload }
  if (action.type === 'cart/clear') return { ...state, items: [] }

  if (action.type === 'cart/add') {
    const { productId, quantity } = action.payload
    if (!productId || quantity <= 0) return state
    const existing = state.items.find((i) => i.productId === productId)
    if (!existing) return { ...state, items: [...state.items, { productId, quantity }] }
    return {
      ...state,
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
      ),
    }
  }

  if (action.type === 'cart/remove') {
    const { productId } = action.payload
    return { ...state, items: state.items.filter((i) => i.productId !== productId) }
  }

  if (action.type === 'cart/setQuantity') {
    const { productId, quantity } = action.payload
    if (!productId) return state
    if (quantity <= 0) {
      return { ...state, items: state.items.filter((i) => i.productId !== productId) }
    }
    return {
      ...state,
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    }
  }

  return state
}

const CartContext = createContext<CartApi | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = safeParseItems(window.localStorage.getItem(STORAGE_KEY))
    if (saved.length) dispatch({ type: 'cart/setItems', payload: saved })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!state.isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [state.isOpen])

  const openCart = useCallback(() => dispatch({ type: 'cart/open' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'cart/close' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'cart/toggle' }), [])

  const addItem = useCallback((productId: string, quantity = 1) => {
    dispatch({ type: 'cart/add', payload: { productId, quantity } })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'cart/remove', payload: { productId } })
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'cart/setQuantity', payload: { productId, quantity } })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'cart/clear' }), [])

  const getItemQuantity = useCallback(
    (productId: string) => state.items.find((i) => i.productId === productId)?.quantity ?? 0,
    [state.items],
  )

  const totalItems = useMemo(
    () => state.items.reduce((acc, i) => acc + i.quantity, 0),
    [state.items],
  )

  const value: CartApi = useMemo(
    () => ({
      items: state.items,
      isOpen: state.isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      getItemQuantity,
      totalItems,
    }),
    [
      state.items,
      state.isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      getItemQuantity,
      totalItems,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return ctx
}
