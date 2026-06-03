import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { User } from '../api'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  setUser: Dispatch<SetStateAction<User | null>>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
