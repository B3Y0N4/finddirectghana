/**
 * Shared JWT signing secret. Throws instead of silently falling back to a
 * hardcoded default, so a missing env var fails loudly rather than issuing
 * forgeable tokens. Runtime-agnostic (no `next/headers`) so it's safe to
 * import from middleware.ts (Edge runtime) as well as route handlers.
 */
export function jwtSecret(): Uint8Array {
  const value = process.env.JWT_SECRET
  if (!value) {
    throw new Error('Missing required env var: JWT_SECRET')
  }
  return new TextEncoder().encode(value)
}
