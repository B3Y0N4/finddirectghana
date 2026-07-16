import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export interface UserSession {
  sub:   string
  email: string
  role:  'tenant' | 'landlord'
  name:  string
}

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me')
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const store = await cookies()
    const token = store.get('user_token')?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret())
    return payload as unknown as UserSession
  } catch {
    return null
  }
}
