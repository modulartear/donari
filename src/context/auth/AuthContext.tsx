import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../../services/firebase'

type AuthApi = {
  user: User | null
  loading: boolean
  signInGoogle: () => Promise<void>
  signInEmail: (email: string, password: string) => Promise<void>
  registerEmail: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthApi | null>(null)

function mapFirebaseError(code?: string) {
  if (!code) return 'Ocurrió un error. Intentá nuevamente.'
  if (code === 'auth/invalid-credential') return 'Email o contraseña incorrectos.'
  if (code === 'auth/invalid-email') return 'Email inválido.'
  if (code === 'auth/too-many-requests')
    return 'Demasiados intentos. Probá de nuevo más tarde.'
  if (code === 'auth/email-already-in-use') return 'Ese email ya está registrado.'
  if (code === 'auth/weak-password') return 'La contraseña es muy débil.'
  if (code === 'auth/popup-closed-by-user') return 'Se cerró la ventana de Google.'
  return 'No se pudo completar la operación. Intentá nuevamente.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const api = useMemo<AuthApi>(
    () => ({
      user,
      loading,
      signInGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider()
          await signInWithPopup(auth, provider)
        } catch (e: any) {
          throw new Error(mapFirebaseError(e?.code))
        }
      },
      signInEmail: async (email: string, password: string) => {
        try {
          await signInWithEmailAndPassword(auth, email, password)
        } catch (e: any) {
          throw new Error(mapFirebaseError(e?.code))
        }
      },
      registerEmail: async (fullName: string, email: string, password: string) => {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password)
          const name = fullName.trim()
          if (name) await updateProfile(cred.user, { displayName: name })
        } catch (e: any) {
          throw new Error(mapFirebaseError(e?.code))
        }
      },
      logout: async () => {
        await signOut(auth)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

