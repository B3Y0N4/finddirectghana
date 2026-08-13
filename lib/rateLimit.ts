// In-memory rate limiting — per-instance only. Resets on redeploy/restart
// and doesn't coordinate across multiple serverless instances; a stopgap
// against casual abuse, not a production-grade multi-instance solution.
const buckets = new Map<string, { count: number; resetAt: number }>()

/** Returns true if the call is allowed, false if the key has hit its limit within the window. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = buckets.get(key)
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}
