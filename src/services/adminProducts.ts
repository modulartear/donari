import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from './firebase'

export type AdminProductCategory = 'computadoras' | 'perifericos' | 'consolas'

export type AdminProductImage = {
  url: string
  path: string
}

export type AdminProduct = {
  id: string
  name: string
  slug: string
  category: AdminProductCategory
  price: number
  compareAtPrice?: number
  shortDescription: string
  description: string
  stock: number
  images: AdminProductImage[]
  createdAt?: any
  updatedAt?: any
}

export type AdminProductInput = Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>

const productsCol = collection(db, 'products')

export function subscribeProducts(onChange: (items: AdminProduct[]) => void) {
  const q = query(productsCol, orderBy('updatedAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const items: AdminProduct[] = snap.docs.map((d) => {
      const data = d.data() as any
      return {
        id: d.id,
        name: data.name ?? '',
        slug: data.slug ?? '',
        category: data.category ?? 'computadoras',
        price: Number(data.price ?? 0),
        compareAtPrice:
          typeof data.compareAtPrice === 'number' ? data.compareAtPrice : undefined,
        shortDescription: data.shortDescription ?? '',
        description: data.description ?? '',
        stock: Number(data.stock ?? 0),
        images: Array.isArray(data.images) ? data.images : [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    })
    onChange(items)
  })
}

export async function createProduct(input: AdminProductInput) {
  const payload = {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  const created = await addDoc(productsCol, payload)
  return created.id
}

export async function updateProduct(productId: string, input: Partial<AdminProductInput>) {
  await updateDoc(doc(productsCol, productId), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(productId: string) {
  await deleteDoc(doc(productsCol, productId))
}

export async function uploadProductImage(productId: string, file: File) {
  const safeName = file.name.replace(/[^\w.-]+/g, '_')
  const path = `products/${productId}/${Date.now()}_${safeName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  const url = await getDownloadURL(storageRef)
  return { url, path } satisfies AdminProductImage
}

export async function deleteProductImage(path: string) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

