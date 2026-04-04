# IDEAFORGE 2k26 - Deep Security Remediation Plan

## Overview
This document outlines a structured, actionable remediation plan addressing the findings from the IDEAFORGE 2K26 Deep Security Audit Report (2026-04-04). The goal is to aggressively triage high-risk vulnerabilities, strengthen input validation/handling, and introduce robust CI/CD security gating—all while rigorously adhering to the "Do-Not-Break" functionality constraints.

---

## Phase 1: Immediate Action Items (Target: This Week)
These high-priority tasks tackle exposed attack surfaces and critical security shortfalls. 

- [ ] **R-01: Add Rate Limiting to All Public Endpoints** (Finding: F-01 | Severity: HIGH)
  - **Files:** `server.js`, Vercel Deployment Settings.
  - **Action:** Install `express-rate-limit`. Apply limits to `/api/validate-username` (60s, max 10 request), `/api/generate-certificate` (60s, max 10), and especially `/api/admin/login` (60s, max 5). If using serverless edge, implement shared storage (Vercel KV/Upstash) for cross-instance rate tracking.
- [ ] **R-02: Enforce bcrypt Admin Password Hashing** (Finding: F-02 | Severity: HIGH)
  - **Files:** `src/api/admin/login.js`, `server.js`, `.env`
  - **Action:** Remove plaintext comparison `password !== ADMIN_PASSWORD`. Implement `bcrypt.compare()`. Update `ADMIN_PASSWORD` in environment variables with pre-hashed keys.
- [ ] **R-03: Strip isAdmin Privilege from Public APIs** (Finding: F-03 | Severity: HIGH)
  - **Files:** `src/api/validate-username.js`, `src/api/generate-certificate.js`
  - **Action:** Delete the `user.isAdmin` exception checks that bypassed the `isGenerated` barrier. Execute a DB migration to set all `isAdmin: false` or delete seeded `admin_*` test users entirely.
- [ ] **R-04: Secure the Authentication Cookie** (Finding: F-07 | Severity: MEDIUM)
  - **Files:** `src/api/admin/login.js`
  - **Action:** Modify the `Set-Cookie` header. Include the `Secure` flag alongside `HttpOnly; SameSite=Strict` (Ensure HTTPS during dev testing going forward).
- [ ] **R-05: Remove JWT from JSON Responses** (Finding: F-14 | Severity: LOW)
  - **Files:** `src/api/admin/login.js`
  - **Action:** Refactor so `token` is excluded from the returned JSON `{ expiresIn: '24h' }` effectively relying completely on the `HttpOnly` cookie.

---

## Phase 2: Near-Term Remediation (Target: This Sprint)
These medium severity findings center primarily on payload processing, enumerations, predictive IDs, and headers.

- [ ] **R-06: Insert Security Response Headers** (Finding: F-08 | Severity: MEDIUM)
  - **Files:** `vercel.json`
  - **Action:** Add global headers `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Strict-Transport-Security`. Phase in `Content-Security-Policy`.
- [ ] **R-07: Escape Regex Arguments in Search** (Finding: F-04 | Severity: MEDIUM)
  - **Files:** `src/api/admin/usernames.js`
  - **Action:** Pre-process the `search` string payload using `.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` before wrapping it into `$regex` to protect MongoDB against ReDoS logic.
- [ ] **R-08: Use Cryptographically Secure RNG** (Finding: F-09 | Severity: MEDIUM)
  - **Files:** `src/api/generate-certificate.js`, `server.js`
  - **Action:** Replace `Math.random().toString(36)` with Node's native `crypto.randomBytes(3).toString('hex').toUpperCase()` to establish mathematically secure PRNG logic for Certificates IDs.
- [ ] **R-09: Thwart Username Enumeration via Response Normalization** (Finding: F-05 | Severity: MEDIUM)
  - **Files:** `src/api/validate-username.js`, `src/api/generate-certificate.js`
  - **Action:** Return uniform `200 OK` statuses whether a non-generated or missing username hits the endpoint to standardize HTTP responses. Control messaging internally with generic `valid: false` json payloads.
- [ ] **R-10: Cap CSV Bulk Upload File Sizes** (Finding: F-12 | Severity: LOW)
  - **Files:** `src/api/admin/upload.js`
  - **Action:** Configure Busboy strictly limiting processing footprints to memory restrictions (`limits: { fileSize: 512 * 1024 }`).
- [ ] **R-11: Box the Limit Pagination Bounds** (Finding: F-13 | Severity: LOW)
  - **Files:** `src/api/admin/usernames.js`
  - **Action:** Coerce the query params defensively (`Math.min(parseInt(limit) || 20, 100)`).
- [ ] **R-12: Handle X-Forwarded-For Accurately** (Finding: F-06 | Severity: MEDIUM)
  - **Files:** `src/api/generate-certificate.js`
  - **Action:** Strip multi-chain proxy limits cleanly by fetching purely the closest trusted network boundary string IP (split by index `[0]`).

---

## Phase 3: Long-term Hardening (Target: Next Sprint)
Implement strict local development limitations and defensive workflow gating against dependencies/secrets.

- [ ] **R-13: Bootstrap Secure CI Pipeline Actions** (Finding: F-15)
  - **Files:** `.github/workflows/ci.yml`
  - **Action:** Configure automated `npm run lint`, `npm test:run`, `npm audit`, utilizing strictly SHA-pinned GitHub workflows upon PR pushes.
- [ ] **R-14: Implement Dependabot** (Finding: F-15)
  - **Files:** `.github/dependabot.yml`
  - **Action:** Monitor and autogenerate safe PRs weekly against package vulnerabilities.
- [ ] **R-15: Enforce Admin Brute-Force Lockouts**
  - **Action:** Block login attempts dynamically across concurrent distributed sessions if >5 login failures occur within a defined cooling window.
- [ ] **R-16: Dev Server Middleware Authentication Setup** (Finding: F-10 | Severity: HIGH in dev)
  - **Files:** `server.js`
  - **Action:** Protect dev proxy routes directly injecting a robust `requireAdmin` cookie matching logic block filtering un-authenticated queries immediately.
- [ ] **R-17: Enable strict CORS origins**
  - **Files:** `server.js`
  - **Action:** Scrap wildcard origin rules passing specific array rules via `.env` files preventing CSRF/Domain hijacking.

---

## QA Checks / Do-Not-Break Checklist
Ensure post-implementation regression testing hits standard operational behavior criteria:
* [ ] Normal frontend submissions still strictly grant only one valid `.pdf` file per approved member.
* [ ] Frontend `AdminLogin.tsx` continues to function natively storing cookies appropriately behind HTTPS testing without `response.data.token` references breaking layout components.
* [ ] `IF2K26-XXXX-XXXX` certificates construct fully accurately utilizing the newly implemented crypto-lib bytes logic.
* [ ] Uploads of heavy `~450` row payload .csv sheets iterate safely below the newly enforced memory byte parameters limits without causing busboy pipeline stalls.
* [ ] Existing data structures remain perfectly accessible despite escaping the backend Mongoose regex querying behaviors.

---

## Technical Debt / Open Verifications
- [ ] Confirm where the `server.js` footprint officially routes to explicitly communicate its Local-Dev Only guidelines in the `/README.md` file comprehensively.
- [ ] Address orphaned files (e.g., `src/models/Admin.js`) regarding removal versus complete implementation of an `Admin` entity setup.
- [ ] Verify `npm run seed` configurations to ensure no pseudo-admins escape into production configurations unintentionally.
