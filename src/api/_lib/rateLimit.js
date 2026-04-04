// Rate limiting utility for API endpoints
// Note: For production serverless deployments, use Redis/Vercel KV for shared state

const rateLimitStore = new Map();
const lockoutStore = new Map();

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > CLEANUP_INTERVAL) {
      rateLimitStore.delete(key);
    }
  }
  for (const [key, data] of lockoutStore.entries()) {
    if (now > data.lockedUntil) {
      lockoutStore.delete(key);
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
 * Check brute-force lockout for a given key.
 * Tracks consecutive failures. After maxFailures within windowMs, locks out
 * for lockoutDurationMs. Call recordFailure() on failed attempts and
 * clearFailures() on success.
 * @param {string} key - Unique identifier (e.g., "login:" + IP)
 * @returns {object} - { locked: boolean, remainingMs: number }
 */
export function checkLockout(key) {
  const now = Date.now();
  const lockout = lockoutStore.get(key);

  if (lockout && now < lockout.lockedUntil) {
    return {
      locked: true,
      remainingMs: lockout.lockedUntil - now,
    };
  }

  // Expired lockout, clean up
  if (lockout && now >= lockout.lockedUntil) {
    lockoutStore.delete(key);
  }

  return { locked: false, remainingMs: 0 };
}

/**
 * Record a failed attempt. If failures exceed threshold, engage lockout.
 * @param {string} key - Unique identifier
 * @param {number} maxFailures - Max failures before lockout (default: 5)
 * @param {number} windowMs - Window to count failures (default: 15 min)
 * @param {number} lockoutDurationMs - How long to lock out (default: 15 min)
 */
export function recordFailure(key, maxFailures = 5, windowMs = 15 * 60 * 1000, lockoutDurationMs = 15 * 60 * 1000) {
  const now = Date.now();
  let record = lockoutStore.get(key);

  if (!record || now > record.windowEnd) {
    record = { failures: 1, windowEnd: now + windowMs, lockedUntil: 0 };
  } else {
    record.failures++;
  }

  if (record.failures >= maxFailures) {
    record.lockedUntil = now + lockoutDurationMs;
  }

  lockoutStore.set(key, record);
}

/**
 * Clear failures on successful action (e.g., successful login).
 * @param {string} key - Unique identifier
 */
export function clearFailures(key) {
  lockoutStore.delete(key);
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
