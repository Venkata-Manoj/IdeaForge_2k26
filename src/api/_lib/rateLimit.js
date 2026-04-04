// Rate limiting utility for API endpoints
// Note: For production serverless deployments, use Redis/Vercel KV for shared state

const rateLimitStore = new Map();

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > CLEANUP_INTERVAL) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup periodically
setInterval(cleanupOldEntries, CLEANUP_INTERVAL);

/**
 * Check rate limit for a given key
 * @param {string} key - Unique identifier (e.g., IP + endpoint)
 * @param {number} maxRequests - Maximum requests allowed in window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} - { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(key, maxRequests, windowMs) {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // New window
    const newRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newRecord.resetTime,
    };
  }

  // Existing window
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get client IP from request headers
 * @param {object} req - Request object
 * @returns {string} - Client IP address
 */
export function getClientIP(req) {
  // Get the first IP from X-Forwarded-For (handles proxy chains)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Standard rate limit configurations
 */
export const RATE_LIMITS = {
  // Public endpoints: 10 requests per minute
  PUBLIC: { maxRequests: 10, windowMs: 60000 },
  // Admin login: 5 requests per minute (stricter)
  LOGIN: { maxRequests: 5, windowMs: 60000 },
  // Admin operations: 60 requests per minute
  ADMIN: { maxRequests: 60, windowMs: 60000 },
};
