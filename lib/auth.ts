import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { jwtSecret } from './jwt-secret'

export interface UserSession {
  sub:   string
  email: string
  role:  'tenant' | 'landlord'
  name:  string
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const store = await cookies()
    const token = store.get('user_token')?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, jwtSecret())
    return payload as unknown as UserSession
  } catch {
    return null
  }
}
