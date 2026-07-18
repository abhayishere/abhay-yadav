import crypto from 'crypto'

// Server-only. Computes a deterministic HMAC token for a blog slug so a
// "review link" can be shared (e.g. via Telegram) without storing any
// token in content/blogs.json. Anyone without REVIEW_SIGNING_SECRET
// cannot forge a valid token for a pending post.
export function tokenForSlug(slug) {
  const secret = process.env.REVIEW_SIGNING_SECRET
  if (!secret) {
    throw new Error('REVIEW_SIGNING_SECRET is not set')
  }
  return crypto.createHmac('sha256', secret).update(slug).digest('hex')
}

export function isValidReviewToken(slug, token) {
  if (!slug || !token) return false
  let expected
  try {
    expected = tokenForSlug(slug)
  } catch {
    return false
  }
  const a = Buffer.from(expected)
  const b = Buffer.from(String(token))
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
