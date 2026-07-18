import hashlib
import hmac


def token_for_slug(slug: str, secret: str) -> str:
    """Must match the HMAC computation in src/lib/reviewToken.js exactly."""
    return hmac.new(secret.encode(), slug.encode(), hashlib.sha256).hexdigest()
