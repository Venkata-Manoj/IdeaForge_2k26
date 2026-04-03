

# 📜 Product Requirements Document (PRD)

## **IDEAFORGE 2k26 — E-Certificate Generation Platform**

| Field | Detail |
|---|---|
| **Document Version** | v1.0.0 |
| **Status** | Final |
| **Author** | Claude AI |
| **Created** | 2025 |
| **Stakeholders** | Admin, Students, Faculty |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Audience & Personas](#4-target-audience--personas)
5. [Scope & Constraints](#5-scope--constraints)
6. [Information Architecture](#6-information-architecture)
7. [Feature Specifications](#7-feature-specifications)
8. [User Flows & Journeys](#8-user-flows--journeys)
9. [Design System & UI Specification](#9-design-system--ui-specification)
10. [Certificate Template Specification](#10-certificate-template-specification)
11. [Technical Architecture](#11-technical-architecture)
12. [Database Schema](#12-database-schema)
13. [API Contract](#13-api-contract)
14. [Security & Compliance](#14-security--compliance)
15. [Error Handling & Edge Cases](#15-error-handling--edge-cases)
16. [Performance Budget](#16-performance-budget)
17. [Testing Strategy](#17-testing-strategy)
18. [Deployment & DevOps](#18-deployment--devops)
19. [Timeline & Milestones](#19-timeline--milestones)
20. [Risks & Mitigations](#20-risks--mitigations)
21. [Acceptance Criteria](#21-acceptance-criteria)
22. [Appendix](#22-appendix)

---

## 1. Executive Summary

**IDEAFORGE 2k26** is a single-page, desktop-only web application that enables participants of the IDEAFORGE 2k26 event to generate and download personalized e-certificates. Participants authenticate via a unique pre-assigned username, enter their name, select their event category (Technical / Non-Technical), and instantly generate a beautifully designed PDF certificate — all in one seamless flow.

> **Elevator Pitch:**
> *"Thank you for participating in IDEAFORGE 2k26! Verify your identity, generate your personalized certificate, and download it — all in under 30 seconds."*

The platform features a bold, dark-themed UI with glassmorphism effects, micro-interactions, and a striking black & orange-red color palette designed to leave a lasting impression.

---

## 2. Problem Statement

### 2.1 Current Pain Points

| # | Problem | Impact |
|---|---------|--------|
| P1 | Manual certificate creation for 150+ participants is time-consuming | Hours of admin effort per event |
| P2 | Physical certificates have printing/distribution costs | Budget constraint (₹0) |
| P3 | No verification mechanism for certificate authenticity | Certificates can be forged |
| P4 | Participants may lose physical certificates | No way to retrieve/redownload |
| P5 | Tracking who collected certificates is tedious | No audit trail |

### 2.2 Solution

A self-service web platform where **pre-registered participants** enter their unique username and name, select the event type, and generate a downloadable PDF certificate — **one time only** per username — ensuring authenticity, traceability, and zero manual effort.

---

## 3. Goals & Success Metrics

### 3.1 Business Goals

| Goal | Description |
|------|-------------|
| **G1** | 100% of eligible participants can generate their certificate |
| **G2** | Zero manual intervention required after initial setup |
| **G3** | Zero budget expenditure (free-tier services only) |
| **G4** | Single-day development and deployment |

### 3.2 User Goals

| Goal | Description |
|------|-------------|
| **UG1** | Participant generates and downloads certificate in < 30 seconds |
| **UG2** | Certificate is professional, visually appealing, and personalized |
| **UG3** | Process is intuitive with zero learning curve |

### 3.3 Key Performance Indicators (KPIs)

| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| Certificate Generation Success Rate | ≥ 98% | Server logs |
| Average Time to Certificate (form open → download) | < 30s | Analytics |
| Page Load Time (FCP) | < 1.5s | Lighthouse |
| Error Rate | < 2% | Error logging |
| Uptime during event window | 99.9% | Vercel dashboard |

---

## 4. Target Audience & Personas

### 4.1 Persona 1: **The Participant (Primary)**

```
Name:           Ravi Kumar
Age:            19-22
Role:           B.Tech Student
Device:         Laptop (Windows/macOS), College Lab Desktop
Tech Savviness: Medium
Goal:           Download my event certificate quickly
Frustration:    Complex forms, slow websites, unclear instructions
Scenario:       Ravi attended a technical event at IDEAFORGE 2k26.
                He receives his username via email/WhatsApp.
                He opens the website on his laptop, enters details,
                and downloads his certificate in one click.
```

### 4.2 Persona 2: **The Faculty Coordinator (Secondary)**

```
Name:           Dr. Priya Sharma
Age:            35-50
Role:           Event Faculty Coordinator
Device:         Desktop / Laptop
Tech Savviness: Low-Medium
Goal:           Ensure all participants received certificates; view stats
Frustration:    Manually tracking certificate distribution
Scenario:       Dr. Priya logs into the admin panel to see how many
                certificates have been generated and verify records.
```

### 4.3 Persona 3: **The Admin (Secondary)**

```
Name:           Arun (Student Organizer / Tech Lead)
Age:            20-23
Role:           Event Admin
Device:         Laptop
Tech Savviness: High
Goal:           Set up usernames, monitor generation, manage data
Frustration:    Lack of control, security vulnerabilities
Scenario:       Arun uploads the list of valid usernames before the
                event, monitors certificate generation in real-time,
                and can reset/revoke certificates if needed.
```

### 4.4 Device Matrix

| Device | Supported | Min Resolution |
|--------|-----------|----------------|
| Desktop (Windows/Mac/Linux) | ✅ Yes | 1280 × 720 |
| Laptop | ✅ Yes | 1280 × 720 |
| Tablet | ❌ No | — |
| Mobile | ❌ No | — |

> **Note:** A "Desktop Only" banner/modal will be shown if viewport width < 1024px.

---

## 5. Scope & Constraints

### 5.1 In Scope (MVP)

| # | Feature |
|---|---------|
| S1 | Single-page certificate generation flow |
| S2 | Username validation against pre-loaded database |
| S3 | Name input with validation |
| S4 | Event type selection (Technical / Non-Technical) |
| S5 | PDF certificate generation with participant details |
| S6 | One-time generation enforcement per username |
| S7 | Admin panel (separate route: `/admin`) |
| S8 | Glassmorphism UI with animations |
| S9 | Security hardening (rate limiting, input sanitization) |
| S10 | Desktop-only enforcement |

### 5.2 Out of Scope

| # | Feature | Reason |
|---|---------|--------|
| O1 | Mobile responsive design | Client requirement |
| O2 | Email delivery of certificates | No email service budget |
| O3 | Payment gateway | Free event |
| O4 | Multi-language support | English only |
| O5 | CMS | Not required |
| O6 | Post-launch maintenance | Single launch |
| O7 | User registration/signup | Usernames pre-assigned |

### 5.3 Constraints

| Constraint | Detail |
|------------|--------|
| **Budget** | ₹0 — All services must be free tier |
| **Timeline** | Single day (today) |
| **Hosting** | Vercel (free tier) |
| **Database** | MongoDB Atlas (free tier — 512MB) |
| **Traffic** | ~150 concurrent users max |
| **Scalability** | Not required |
| **Maintenance** | None post-launch |

---

## 6. Information Architecture

### 6.1 Sitemap

```
IDEAFORGE 2k26
│
├── / (Main Page - Certificate Generation)
│   ├── Hero Section (Event branding + tagline)
│   ├── Certificate Form Section
│   │   ├── Username Input
│   │   ├── Name Input
│   │   ├── Event Type Selector
│   │   └── Generate Button
│   ├── Certificate Preview + Download Section
│   └── Footer
│
├── /admin (Admin Dashboard — Protected)
│   ├── Login
│   ├── Statistics Overview
│   ├── Username Management (Add/Remove/Reset)
│   ├── Certificate Logs
│   └── Bulk Upload (CSV)
│
└── /404 (Not Found)
```

### 6.2 Page Layout — Main Page (Single Scroll)

```
┌─────────────────────────────────────────────────┐
│  NAVBAR (Logo + Event Name + Desktop-Only Tag)  │
├─────────────────────────────────────────────────┤
│                                                 │
│              🔥 HERO SECTION 🔥                 │
│     "IDEAFORGE 2k26" (Large Display Text)       │
│     Tagline + Particle/Glow Animation           │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│         📝 CERTIFICATE FORM SECTION             │
│    ┌─────────────────────────────────────┐      │
│    │  Glassmorphism Card                 │      │
│    │                                     │      │
│    │  [Username Input      ]             │      │
│    │  [Full Name Input     ]             │      │
│    │  [Event Type ▼        ]             │      │
│    │                                     │      │
│    │  [ 🔥 GENERATE CERTIFICATE ]        │      │
│    └─────────────────────────────────────┘      │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│     📜 CERTIFICATE PREVIEW (Hidden initially)   │
│    ┌─────────────────────────────────────┐      │
│    │  Certificate Canvas/Preview         │      │
│    │  [Name, Event, Date, Unique ID]     │      │
│    └─────────────────────────────────────┘      │
│    [ ⬇ DOWNLOAD PDF ]                          │
│                                                 │
├─────────────────────────────────────────────────┤
│              FOOTER                             │
│   Made with ❤️ by IDEAFORGE Team                │
└─────────────────────────────────────────────────┘
```

---

## 7. Feature Specifications

### 7.1 F1: Hero Section

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Description** | Full-width hero with event branding |
| **Elements** | Event name "IDEAFORGE 2k26" in Unbounded font (160px), tagline, subtle particle/glow animation in background |
| **Animations** | Text reveal on load (staggered), floating gradient orbs, subtle grain texture overlay |
| **Interaction** | Scroll indicator (animated chevron) |

### 7.2 F2: Username Input Field

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Field Type** | Text input |
| **Placeholder** | `"Enter your unique username"` |
| **Validation Rules** | Required; alphanumeric + underscore only; 3-30 chars; must exist in database; must not have already generated a certificate |
| **Error States** | Empty → "Username is required"; Invalid format → "Only letters, numbers, and underscores allowed"; Not found → "Username not found. Please contact admin."; Already used → "Certificate already generated for this username." |
| **Micro-interaction** | Orange glow border on focus; shake animation on error; green checkmark on valid username (async validation) |

### 7.3 F3: Name Input Field

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Field Type** | Text input |
| **Placeholder** | `"Enter your full name (as it appears on certificate)"` |
| **Validation Rules** | Required; alphabets and spaces only; 2-50 chars; auto-capitalize first letter of each word |
| **Error States** | Empty → "Name is required"; Invalid → "Only alphabets and spaces allowed"; Too short → "Name must be at least 2 characters" |
| **Micro-interaction** | Real-time preview of name formatting (Title Case) |

### 7.4 F4: Event Type Selector

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Field Type** | Custom styled dropdown / toggle buttons |
| **Options** | `Technical` · `Non-Technical` |
| **Default** | None selected (must choose) |
| **Validation** | Required — "Please select an event type" |
| **Design** | Two pill-style toggle buttons with active state glow |
| **Micro-interaction** | Selected pill fills with `#FF5500`, unselected stays glass-morphic |

### 7.5 F5: Generate Certificate Button

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Label** | `"🔥 GENERATE CERTIFICATE"` |
| **States** | Default → Hover → Loading → Success → Disabled |
| **Behavior** | Validates all fields → API call → Generates PDF → Shows preview → Enables download |
| **Loading State** | Button text changes to "GENERATING..." with spinner animation |
| **Success State** | Button morphs into "✅ CERTIFICATE READY" (green) |
| **Disabled State** | Greyed out when fields are incomplete |
| **Micro-interaction** | Ripple effect on click; confetti/particle burst on success |

### 7.6 F6: Certificate Preview & Download

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Behavior** | After generation, certificate slides up into view |
| **Preview** | Scaled-down canvas rendering of the certificate |
| **Download Button** | `"⬇ DOWNLOAD PDF"` — downloads as `IDEAFORGE2k26_[Username]_Certificate.pdf` |
| **Animation** | Fade-in + slide-up with parallax effect |
| **Re-download** | Not available after page refresh (one-time generation) |

### 7.7 F7: Desktop-Only Enforcement

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Trigger** | Viewport width < 1024px |
| **Behavior** | Full-screen overlay/modal blocking all content |
| **Message** | "⚠️ This website is designed for desktop/laptop only. Please open on a larger screen." |
| **Design** | Dark overlay with glassmorphism card, event branding |
| **Dismissible** | ❌ No |

### 7.8 F8: Admin Panel (`/admin`)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Access** | Protected by admin password |
| **Features** | See table below |

#### Admin Panel Features

| Sub-Feature | Description |
|-------------|-------------|
| **Login** | Simple password-based auth (hashed, stored in env) |
| **Dashboard Stats** | Total usernames loaded, certificates generated, remaining, generation rate |
| **Username Management** | View all usernames; status (generated / pending); search & filter |
| **Add Username** | Single add (text input) or bulk upload (CSV: `username` column) |
| **Delete Username** | Remove a username from the database |
| **Reset Username** | Allow a username to generate certificate again |
| **Certificate Log** | Table: Username, Name, Event Type, Generated At, Certificate ID |
| **Export Data** | Download all logs as CSV |
| **Logout** | Destroys session |

### 7.9 F9: Animations & Micro-Interactions (Nice-to-Have)

| Animation | Location | Type |
|-----------|----------|------|
| Particle/glow orbs | Hero background | CSS/JS ambient animation |
| Text reveal | Hero title | Staggered letter animation (GSAP/CSS) |
| Glassmorphism hover | Form card | `backdrop-filter` + subtle movement |
| Input focus glow | All inputs | `box-shadow` with `#FF5500` |
| Shake on error | Invalid inputs | CSS keyframe shake |
| Button ripple | Generate button | Radial gradient ripple |
| Confetti burst | On certificate generation | Canvas-based confetti |
| Slide-up reveal | Certificate preview | `transform` + `opacity` |
| Scroll indicator | Hero bottom | Bouncing chevron |
| Noise/grain overlay | Full page | CSS `background-image` with grain SVG |

---

## 8. User Flows & Journeys

### 8.1 Primary Flow: Certificate Generation (Guest)

```
┌──────────────┐
│  User opens   │
│  website URL  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐     Viewport < 1024px    ┌─────────────────────┐
│  Check Viewport  │ ──────────────────────►  │  Show "Desktop Only" │
│  Width           │                           │  Overlay (BLOCKED)   │
└──────┬───────────┘                           └─────────────────────┘
       │ ≥ 1024px
       ▼
┌──────────────────┐
│  Render Hero +   │
│  Certificate Form│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ User enters      │
│ Username         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐         ┌─────────────────────────┐
│ Async Validate   │──FAIL──►│ Show Error:             │
│ Username (API)   │         │ "Username not found" OR  │
└──────┬───────────┘         │ "Already generated"      │
       │ PASS                └─────────────────────────┘
       ▼
┌──────────────────┐
│ User enters      │
│ Full Name        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ User selects     │
│ Event Type       │
│ (Tech/Non-Tech)  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Clicks "GENERATE │
│ CERTIFICATE"     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Client-side      │──FAIL──► Show inline errors
│ Validation       │
└──────┬───────────┘
       │ PASS
       ▼
┌──────────────────┐
│ POST /api/       │
│ generate         │
│ {username, name, │
│  eventType}      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐        ┌──────────────────┐
│ Server validates │─FAIL──►│ Return error     │
│ + checks DB      │        │ (already used,   │
│                  │        │  not found, etc) │
└──────┬───────────┘        └──────────────────┘
       │ PASS
       ▼
┌──────────────────┐
│ Generate unique  │
│ Certificate ID   │
│ (UUID/short hash)│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Generate PDF     │
│ (server-side     │
│  with PDFKit/    │
│  Puppeteer)      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Mark username as │
│ "generated" in DB│
│ Store metadata   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Return PDF blob  │
│ to client        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ 🎉 Show Preview  │
│ + Download Button │
│ + Confetti        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ User downloads   │
│ PDF certificate  │
└──────────────────┘
       │
       ▼
      ✅ DONE
```

### 8.2 Admin Flow

```
Navigate to /admin
       │
       ▼
┌──────────────────┐
│ Admin Login Form │
│ [Password Input] │
│ [LOGIN]          │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐       ┌─────────────────┐
│ Validate Password│─FAIL─►│ "Invalid        │
│ (bcrypt compare) │       │  credentials"   │
└──────┬───────────┘       └─────────────────┘
       │ PASS
       ▼
┌──────────────────┐
│ Admin Dashboard  │
│                  │
│ • Stats Cards    │
│ • Username Table │
│ • Actions        │
│ • CSV Upload     │
│ • Export Logs    │
└──────────────────┘
```

---

## 9. Design System & UI Specification

### 9.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#080808` | Page background |
| `--bg-card` | `rgba(255,255,255,0.03)` | Glassmorphism card background |
| `--bg-card-border` | `rgba(255,255,255,0.08)` | Card border |
| `--color-primary` | `#FF5500` | Primary accent, CTAs, highlights |
| `--color-primary-hover` | `#FF6A1A` | Hover state of primary |
| `--color-primary-glow` | `rgba(255,85,0,0.3)` | Glow effects |
| `--color-secondary` | `#F5EFE0` | Secondary text, light elements |
| `--color-text-primary` | `#FFFFFF` | Primary body text |
| `--color-text-secondary` | `#6B6B6B` | Muted text, placeholders |
| `--color-text-heading` | `#F5EFE0` | Heading text |
| `--color-success` | `#00C853` | Success states |
| `--color-error` | `#FF1744` | Error states |
| `--color-warning` | `#FF9100` | Warning states |
| `--color-link` | `#9C3603` | Links |
| `--color-border` | `#212121` | Subtle borders |

### 9.2 Typography

| Element | Font Family | Size | Weight | Line Height |
|---------|------------|------|--------|-------------|
| Hero Title (H1) | Unbounded | 120-160px | 700 | 1.0 |
| Section Heading (H2) | Unbounded | 48-60px | 600 | 1.2 |
| Sub-heading (H3) | Space Grotesk | 24-32px | 600 | 1.3 |
| Body Text | Space Grotesk | 18px | 400 | 1.6 |
| Button Text | Space Grotesk | 16px | 600 | 1.0 |
| Input Text | Space Grotesk | 16px | 400 | 1.5 |
| Caption/Label | Space Grotesk | 14px | 500 | 1.4 |
| Error Text | Space Grotesk | 13px | 400 | 1.4 |

**Font Loading Strategy:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@600;700;800&display=swap" rel="stylesheet">
```

### 9.3 Spacing System

| Token | Value |
|-------|-------|
| `--space-1` | 8px |
| `--space-2` | 16px |
| `--space-3` | 24px |
| `--space-4` | 32px |
| `--space-5` | 40px |
| `--space-6` | 48px |
| `--space-8` | 64px |
| `--space-10` | 80px |
| `--space-12` | 96px |
| `--space-16` | 128px |

### 9.4 Component Specifications

#### 9.4.1 Primary Button

```css
.btn-primary {
  background: #FF5500;
  color: #080808;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none;
}
.btn-primary:hover {
  background: #FF6A1A;
  box-shadow: 0 0 30px rgba(255, 85, 0, 0.4);
  transform: translateY(-2px);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-primary:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
  box-shadow: none;
}
```

#### 9.4.2 Secondary Button

```css
.btn-secondary {
  background: transparent;
  color: #6B6B6B;
  border: 1px solid #212121;
  border-radius: 12px;
  padding: 16px 32px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-secondary:hover {
  border-color: #FF5500;
  color: #FF5500;
}
```

#### 9.4.3 Input Field

```css
.input-field {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #FFFFFF;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.input-field:focus {
  border-color: #FF5500;
  box-shadow: 0 0 20px rgba(255, 85, 0, 0.15);
}
.input-field.error {
  border-color: #FF1744;
  box-shadow: 0 0 20px rgba(255, 23, 68, 0.15);
  animation: shake 0.5s ease;
}
.input-field.success {
  border-color: #00C853;
}
```

#### 9.4.4 Glassmorphism Card

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 48px;
  position: relative;
  overflow: hidden;
}
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 85, 0, 0.3),
    transparent
  );
}
```

#### 9.4.5 Event Type Toggle Pills

```css
.pill-toggle {
  display: flex;
  gap: 16px;
}
.pill-option {
  padding: 14px 28px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #6B6B6B;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}
.pill-option.active {
  background: #FF5500;
  color: #080808;
  border-color: #FF5500;
  box-shadow: 0 0 25px rgba(255, 85, 0, 0.3);
}
```

### 9.5 Glassmorphism Specification

| Property | Value |
|----------|-------|
| Background | `rgba(255, 255, 255, 0.02–0.05)` |
| Backdrop Filter | `blur(16px–24px)` |
| Border | `1px solid rgba(255, 255, 255, 0.06–0.1)` |
| Border Radius | `16px–24px` |
| Top Highlight | Linear gradient line (optional) |

### 9.6 Animation Specifications

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Page load fade-in | 800ms | `ease-out` | On mount |
| Hero text reveal | 1200ms staggered | `cubic-bezier(0.4, 0, 0.2, 1)` | On mount |
| Input focus glow | 300ms | `ease` | On focus |
| Error shake | 500ms | `ease` | On validation fail |
| Button hover lift | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | On hover |
| Certificate slide-up | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | On generation |
| Confetti burst | 3000ms | Linear | On success |
| Floating orbs | 20s loop | `ease-in-out` | Continuous |
| Grain overlay | Static | — | Always |

---

## 10. Certificate Template Specification

### 10.1 Certificate Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │            ★  IDEAFORGE 2k26  ★                     │    │
│  │                                                     │    │
│  │          CERTIFICATE OF PARTICIPATION               │    │
│  │                                                     │    │
│  │   This is to certify that                           │    │
│  │                                                     │    │
│  │              [PARTICIPANT NAME]                      │    │
│  │           ─────────────────────                      │    │
│  │                                                     │    │
│  │   has successfully participated in the              │    │
│  │   [Technical/Non-Technical] event                   │    │
│  │   conducted during IDEAFORGE 2k26                   │    │
│  │                                                     │    │
│  │   Date: [Event Date]                                │    │
│  │   Certificate ID: [UNIQUE-ID]                       │    │
│  │                                                     │    │
│  │                                                     │    │
│  │   ________________          ________________        │    │
│  │   Event Coordinator         Head of Department      │    │
│  │                                                     │    │
│  │                    [QR Code]                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Certificate Specs

| Property | Value |
|----------|-------|
| **Page Size** | A4 Landscape (297mm × 210mm) |
| **Resolution** | 300 DPI (for PDF) |
| **Background** | Dark gradient (`#080808` → `#0D0D0D`) with subtle border design |
| **Border** | Double-line border with `#FF5500` accent corners |
| **Title Font** | Unbounded, 36pt, `#FF5500` |
| **"Certificate of Participation"** | Unbounded, 28pt, `#F5EFE0` |
| **Participant Name** | Unbounded, 32pt, `#FFFFFF`, underlined with `#FF5500` |
| **Body Text** | Space Grotesk, 14pt, `#CCCCCC` |
| **Certificate ID** | Space Grotesk, 10pt, `#666666` |
| **QR Code** | Encodes verification URL or certificate ID |
| **Decorative Elements** | Geometric patterns, subtle glow effects |

### 10.3 Dynamic Fields

| Field | Source |
|-------|--------|
| `[PARTICIPANT NAME]` | User input (Title Case formatted) |
| `[Technical/Non-Technical]` | User selection |
| `[Event Date]` | Admin-configured or hardcoded |
| `[UNIQUE-ID]` | Generated: `IF2K26-XXXX-XXXX` format |
| `[QR Code]` | Encoded verification data |

---

## 11. Technical Architecture

### 11.1 Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 (Vite) | Fast build, modern DX, component-based |
| **Styling** | Tailwind CSS + Custom CSS | Rapid UI development, utility-first |
| **Animations** | Framer Motion | Declarative animations for React |
| **PDF Generation** | `@react-pdf/renderer` OR server-side `pdf-lib` | High-quality PDF output |
| **Backend** | Node.js + Express (or Next.js API routes) | Simple, fast, JS ecosystem |
| **Database** | MongoDB Atlas (Free Tier) | Flexible schema, free 512MB |
| **ODM** | Mongoose | Schema validation, query building |
| **Auth** | JWT (jsonwebtoken) + bcrypt | Stateless admin auth |
| **Hosting** | Vercel | Free, auto-deploy, serverless functions |
| **Version Control** | Git + GitHub | Standard |

### 11.2 Architecture Diagram

```
                    ┌──────────────┐
                    │   VERCEL     │
                    │   (CDN)      │
                    └──────┬───────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
     ┌──────▼──────┐              ┌───────▼───────┐
     │   Static    │              │   Serverless  │
     │   Frontend  │              │   API Routes  │
     │   (React)   │              │   (/api/*)    │
     │             │──── API ────►│               │
     │  - Hero     │   Calls      │  - /validate  │
     │  - Form     │              │  - /generate  │
     │  - Preview  │              │  - /admin/*   │
     └─────────────┘              └───────┬───────┘
                                          │
                                          │ Mongoose
                                          │
                                  ┌───────▼───────┐
                                  │  MongoDB Atlas │
                                  │  (Free Tier)   │
                                  │                │
                                  │  Collections:  │
                                  │  - users       │
                                  │  - certificates│
                                  │  - admins      │
                                  └────────────────┘
```

### 11.3 Project Structure

```
ideaforge-2k26/
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── certificate-bg.png
│   │   ├── logo.png
│   │   └── signatures/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── Hero/
│   │   │   ├── Hero.jsx
│   │   │   ├── ParticleBackground.jsx
│   │   │   └── Hero.module.css
│   │   ├── CertificateForm/
│   │   │   ├── CertificateForm.jsx
│   │   │   ├── UsernameInput.jsx
│   │   │   ├── NameInput.jsx
│   │   │   ├── EventTypeSelector.jsx
│   │   │   └── CertificateForm.module.css
│   │   ├── CertificatePreview/
│   │   │   ├── CertificatePreview.jsx
│   │   │   ├── CertificateTemplate.jsx
│   │   │   └── CertificatePreview.module.css
│   │   ├── Admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UsernameTable.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── BulkUpload.jsx
│   │   │   └── Admin.module.css
│   │   ├── UI/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── MobileBlocker.jsx
│   │   │   ├── Confetti.jsx
│   │   │   └── Toast.jsx
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useValidateUsername.js
│   │   └── useGenerateCertificate.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   ├── App.jsx
│   └── main.jsx
├── api/                        # Vercel Serverless Functions
│   ├── validate-username.js
│   ├── generate-certificate.js
│   ├── admin/
│   │   ├── login.js
│   │   ├── stats.js
│   │   ├── usernames.js
│   │   ├── upload.js
│   │   ├── reset.js
│   │   ├── delete.js
│   │   └── export.js
│   └── _lib/
│       ├── db.js
│       ├── auth.js
│       ├── rateLimiter.js
│       ├── sanitize.js
│       └── pdfGenerator.js
├── scripts/
│   └── seedUsernames.js        # Script to seed initial usernames
├── .env.local
├── .env.example
├── vercel.json
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 12. Database Schema

### 12.1 Collection: `usernames`

```javascript
{
  _id: ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9_]{3,30}$/
  },
  isGenerated: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### 12.2 Collection: `certificates`

```javascript
{
  _id: ObjectId,
  certificateId: {
    type: String,
    required: true,
    unique: true,
    index: true
    // Format: "IF2K26-XXXX-XXXX"
  },
  username: {
    type: String,
    required: true,
    unique: true,
    ref: 'usernames'
  },
  participantName: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Technical', 'Non-Technical']
  },
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String
    // For security audit
  },
  userAgent: {
    type: String
  }
}
```

### 12.3 Collection: `admins`

```javascript
{
  _id: ObjectId,
  passwordHash: {
    type: String,
    required: true
    // bcrypt hashed
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### 12.4 Storage Estimation

| Collection | Records | Avg Doc Size | Total |
|------------|---------|--------------|-------|
| usernames | 200 | ~200 bytes | ~40 KB |
| certificates | 200 | ~500 bytes | ~100 KB |
| admins | 1 | ~200 bytes | ~200 bytes |
| **Total** | | | **~140 KB** |

> Well within MongoDB Atlas free tier (512 MB).

---

## 13. API Contract

### 13.1 `POST /api/validate-username`

**Purpose:** Check if a username exists and is available for certificate generation.

```
Request:
  POST /api/validate-username
  Content-Type: application/json
  Body: {
    "username": "john_doe_2k26"
  }

Success Response (200):
  {
    "valid": true,
    "message": "Username is valid and available"
  }

Error Responses:
  400 - { "valid": false, "error": "Username is required" }
  404 - { "valid": false, "error": "Username not found" }
  409 - { "valid": false, "error": "Certificate already generated for this username" }
  429 - { "valid": false, "error": "Too many requests. Try again later." }
```

### 13.2 `POST /api/generate-certificate`

**Purpose:** Validate inputs, generate PDF, mark username as used.

```
Request:
  POST /api/generate-certificate
  Content-Type: application/json
  Body: {
    "username": "john_doe_2k26",
    "name": "John Doe",
    "eventType": "Technical"
  }

Success Response (200):
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="IDEAFORGE2k26_john_doe_2k26_Certificate.pdf"
  Body: <PDF Binary>

  + Headers:
    X-Certificate-ID: IF2K26-A1B2-C3D4

Error Responses:
  400 - { "error": "Invalid input", "details": { ... } }
  404 - { "error": "Username not found" }
  409 - { "error": "Certificate already generated" }
  429 - { "error": "Rate limit exceeded" }
  500 - { "error": "Certificate generation failed" }
```

### 13.3 `POST /api/admin/login`

```
Request:
  POST /api/admin/login
  Body: { "password": "admin_secret_password" }

Success (200):
  {
    "token": "eyJhbGciOi...",
    "expiresIn": "24h"
  }

Error:
  401 - { "error": "Invalid credentials" }
```

### 13.4 `GET /api/admin/stats`

```
Request:
  GET /api/admin/stats
  Headers: { Authorization: "Bearer <token>" }

Response (200):
  {
    "totalUsernames": 150,
    "certificatesGenerated": 87,
    "remaining": 63,
    "generationRate": "58%",
    "recentGenerations": [
      { "username": "john_doe", "name": "John Doe", "time": "2025-01-15T10:30:00Z" }
    ]
  }
```

### 13.5 `GET /api/admin/usernames`

```
Request:
  GET /api/admin/usernames?page=1&limit=20&search=john&filter=pending
  Headers: { Authorization: "Bearer <token>" }

Response (200):
  {
    "usernames": [
      {
        "username": "john_doe",
        "isGenerated": false,
        "createdAt": "2025-01-14T08:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
```

### 13.6 `POST /api/admin/upload`

```
Request:
  POST /api/admin/upload
  Content-Type: multipart/form-data
  Headers: { Authorization: "Bearer <token>" }
  Body: { file: <CSV file> }

  CSV Format:
    username
    john_doe_2k26
    jane_smith_2k26

Response (200):
  {
    "added": 45,
    "skipped": 5,
    "errors": ["duplicate: john_doe_2k26"]
  }
```

### 13.7 `POST /api/admin/reset/:username`

```
Request:
  POST /api/admin/reset/john_doe_2k26
  Headers: { Authorization: "Bearer <token>" }

Response (200):
  { "message": "Username 'john_doe_2k26' has been reset" }
```

### 13.8 `DELETE /api/admin/delete/:username`

```
Request:
  DELETE /api/admin/delete/john_doe_2k26
  Headers: { Authorization: "Bearer <token>" }

Response (200):
  { "message": "Username 'john_doe_2k26' has been deleted" }
```

### 13.9 `GET /api/admin/export`

```
Request:
  GET /api/admin/export
  Headers: { Authorization: "Bearer <token>" }

Response (200):
  Content-Type: text/csv
  Content-Disposition: attachment; filename="ideaforge2k26_certificates_export.csv"
```

---

## 14. Security & Compliance

### 14.1 Security Measures

| # | Threat | Mitigation |
|---|--------|------------|
| S1 | **Brute Force** | Rate limiting: 10 requests/min per IP for `/generate`, 5 attempts/min for admin login |
| S2 | **SQL/NoSQL Injection** | Mongoose schema validation + `express-mongo-sanitize` |
| S3 | **XSS (Cross-Site Scripting)** | Input sanitization with `DOMPurify`/`xss` library; Helmet.js headers; CSP headers |
| S4 | **CSRF** | SameSite cookies; CORS restricted to deployment domain |
| S5 | **Certificate Forgery** | Unique Certificate ID (`IF2K26-XXXX-XXXX`) stored in DB; QR code for verification |
| S6 | **Admin Auth Bypass** | bcrypt password hashing (12 salt rounds); JWT with short expiry (24h); HttpOnly cookies |
| S7 | **Data Tampering** | Server-side validation of all inputs; never trust client data |
| S8 | **DDoS** | Vercel edge network protection; API rate limiting |
| S9 | **Path Traversal** | File upload validation (CSV only, max 1MB) |
| S10 | **Information Leakage** | Generic error messages; no stack traces in production |
| S11 | **HTTPS** | Enforced by Vercel (automatic SSL) |
| S12 | **Environment Variables** | All secrets in Vercel env vars, never committed |

### 14.2 Security Headers

```javascript
// helmet.js configuration
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  xssFilter: true,
  frameguard: { action: "deny" }
}
```

### 14.3 Input Validation Rules

```javascript
const validationRules = {
  username: {
    type: 'string',
    required: true,
    pattern: /^[a-zA-Z0-9_]{3,30}$/,
    sanitize: ['trim', 'lowercase', 'escapeHtml']
  },
  name: {
    type: 'string',
    required: true,
    pattern: /^[a-zA-Z\s]{2,50}$/,
    sanitize: ['trim', 'escapeHtml', 'titleCase']
  },
  eventType: {
    type: 'string',
    required: true,
    enum: ['Technical', 'Non-Technical']
  }
};
```

### 14.4 Environment Variables

```env
# .env.example
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ideaforge2k26
ADMIN_PASSWORD_HASH=$2b$12$... (bcrypt hash)
JWT_SECRET=<random-64-char-string>
JWT_EXPIRY=24h
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
NODE_ENV=production
```

---

## 15. Error Handling & Edge Cases

### 15.1 Edge Cases Matrix

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| E1 | User enters username with leading/trailing spaces | Auto-trim before validation |
| E2 | User enters name in ALL CAPS | Auto-convert to Title Case |
| E3 | User refreshes page mid-generation | If DB already marked as generated → show "already generated" error on retry |
| E4 | User opens multiple tabs and tries to generate simultaneously | Database-level atomicity — first request wins, second gets 409 |
| E5 | Network failure during PDF download | Show retry button (but since DB is already marked, return cached/regenerated PDF) |
| E6 | Admin uploads CSV with duplicate usernames | Skip duplicates, report count of skipped |
| E7 | Admin uploads malformed CSV | Validate CSV structure; return detailed error |
| E8 | User enters special characters in name (é, ñ) | Only allow A-Z, a-z, and spaces; show error for others |
| E9 | User tries `/admin` without auth | Redirect to admin login |
| E10 | JWT token expires mid-session | Return 401; frontend redirects to login |
| E11 | MongoDB connection fails | Return 503 with "Service temporarily unavailable" |
| E12 | User opens site on mobile | Show full-screen "Desktop Only" blocker |
| E13 | PDF generation fails on server | Log error; return 500 with user-friendly message; don't mark username as used |
| E14 | Username exists but with different casing | Normalize to lowercase before lookup |
| E15 | Browser back button after certificate generation | Show message "Certificate already generated. Contact admin for issues." |

### 15.2 Error Message UX

| Error Type | Color | Icon | Position |
|------------|-------|------|----------|
| Field Validation | `#FF1744` | ⚠️ | Below input field |
| API Error | `#FF1744` | ❌ | Toast notification (top-right) |
| Success | `#00C853` | ✅ | Toast notification (top-right) |
| Warning | `#FF9100` | ⚡ | Toast notification (top-right) |
| Info | `#2196F3` | ℹ️ | Toast notification (top-right) |

---

## 16. Performance Budget

### 16.1 Core Web Vitals Targets

| Metric | Target | Max Acceptable |
|--------|--------|----------------|
| **FCP** (First Contentful Paint) | < 1.0s | < 1.5s |
| **LCP** (Largest Contentful Paint) | < 1.5s | < 2.5s |
| **FID** (First Input Delay) | < 50ms | < 100ms |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 |
| **TTI** (Time to Interactive) | < 2.0s | < 3.0s |
| **Total Bundle Size** (gzipped) | < 150KB | < 250KB |

### 16.2 Optimization Strategies

| Strategy | Implementation |
|----------|---------------|
| Code Splitting | Lazy-load admin panel (`React.lazy`) |
| Font Optimization | `font-display: swap`; preconnect to Google Fonts |
| Image Optimization | WebP format; lazy loading; compressed assets |
| CSS Optimization | Tailwind purge unused classes; minification |
| API Response Caching | Cache static data (username validation can be debounced) |
| Gzip/Brotli | Enabled by Vercel by default |
| Tree Shaking | Vite handles this automatically |

---

## 17. Testing Strategy

### 17.1 Test Coverage Plan

| Test Type | Tool | Coverage Target |
|-----------|------|-----------------|
| **Unit Tests** | Vitest | Validators, formatters, utilities — 90% |
| **Component Tests** | React Testing Library | Form components, UI states — 80% |
| **API Tests** | Supertest / Thunder Client | All endpoints — 100% |
| **E2E Tests** | Manual (given timeline) | Critical path — 100% |
| **Security Tests** | Manual + OWASP checklist | Auth, injection, XSS — 100% |

### 17.2 Critical Test Cases

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| T1 | Valid username + name + event → Generate | PDF downloads successfully |
| T2 | Same username tries again | "Already generated" error |
| T3 | Invalid username format | Inline validation error |
| T4 | Non-existent username | "Username not found" error |
| T5 | Empty form submission | All required field errors shown |
| T6 | Name with numbers/special chars | Validation error |
| T7 | Rapid-fire generate button clicks | Rate limited; only 1 generation |
| T8 | Admin login with wrong password | "Invalid credentials" error |
| T9 | Admin login with correct password | Dashboard renders with stats |
| T10 | CSV upload with valid data | Usernames added successfully |
| T11 | CSV upload with duplicates | Duplicates skipped, count shown |
| T12 | Viewport < 1024px | Desktop-only modal blocks content |
| T13 | XSS in name field (`<script>alert(1)</script>`) | Sanitized; no script execution |
| T14 | NoSQL injection in username (`{"$gt": ""}`) | Blocked by sanitization |
| T15 | Concurrent generation requests (same username) | Only 1 succeeds, other gets 409 |

---

## 18. Deployment & DevOps

### 18.1 Deployment Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Code on  │────►│  Push to │────►│  Vercel  │────►│   LIVE   │
│  Local    │     │  GitHub  │     │  Auto    │     │  🌐      │
│           │     │  (main)  │     │  Deploy  │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### 18.2 Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### 18.3 Environment Setup Checklist

- [ ] Create MongoDB Atlas cluster (free tier, M0)
- [ ] Create database `ideaforge2k26`
- [ ] Create collections: `usernames`, `certificates`
- [ ] Set up database indexes
- [ ] Generate JWT secret
- [ ] Hash admin password with bcrypt
- [ ] Configure Vercel environment variables
- [ ] Connect GitHub repo to Vercel
- [ ] Set custom domain (if any)
- [ ] Run seed script for initial usernames
- [ ] Verify deployment
- [ ] Run smoke tests on production

---

## 19. Timeline & Milestones

### Single-Day Sprint Plan

| Time Block | Duration | Milestone | Deliverable |
|------------|----------|-----------|-------------|
| **09:00 – 09:30** | 30 min | **M0: Project Setup** | Vite + React initialized; Tailwind configured; GitHub repo created; Vercel connected |
| **09:30 – 10:00** | 30 min | **M1: Database Setup** | MongoDB Atlas cluster; Mongoose schemas; seed script |
| **10:00 – 11:30** | 90 min | **M2: Backend APIs** | All 9 API endpoints functional and tested |
| **11:30 – 13:00** | 90 min | **M3: Frontend — Core UI** | Hero section, form components, glassmorphism cards, inputs, buttons |
| **13:00 – 13:30** | 30 min | 🍕 **LUNCH BREAK** | — |
| **13:30 – 14:30** | 60 min | **M4: Certificate Template** | PDF generation with dynamic fields, styled template |
| **14:30 – 15:30** | 60 min | **M5: Integration** | Frontend ↔ Backend connected; end-to-end flow working |
| **15:30 – 16:30** | 60 min | **M6: Admin Panel** | Admin login, dashboard, username management, CSV upload |
| **16:30 – 17:30** | 60 min | **M7: Polish & Animations** | Micro-interactions, confetti, transitions, error states |
| **17:30 – 18:00** | 30 min | **M8: Security Hardening** | Rate limiting, sanitization, CORS, headers |
| **18:00 – 18:30** | 30 min | **M9: Testing** | Manual E2E testing, edge cases, fix critical bugs |
| **18:30 – 19:00** | 30 min | **M10: Deploy & Verify** | Final deployment, smoke tests, seed production data |

**Total Development Time: ~9 hours**

---

## 20. Risks & Mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|-------------|--------|------------|
| R1 | MongoDB Atlas free tier rate limits hit | Low | High | Optimize queries; add connection pooling; cache where possible |
| R2 | PDF generation is slow/fails | Medium | High | Use lightweight `pdf-lib` instead of Puppeteer; pre-build template |
| R3 | Vercel serverless function cold starts | Medium | Medium | Keep functions small; use edge functions if possible |
| R4 | 150 users generate simultaneously | Low | High | Rate limiting; queue-based processing if needed |
| R5 | Font loading delays cause layout shift | Medium | Low | Preload fonts; use `font-display: swap` |
| R6 | Browser incompatibility | Low | Medium | Test on Chrome, Firefox, Edge; use standard APIs |
| R7 | Timeline overrun | Medium | High | Prioritize MVP features; cut animations if needed |
| R8 | Certificate ID collision | Very Low | High | Use `crypto.randomUUID()` + DB unique constraint |
| R9 | Admin password leaked | Low | Critical | Use strong password; bcrypt hashing; env vars only |
| R10 | Data loss | Low | High | MongoDB Atlas has built-in backups on free tier |

---

## 21. Acceptance Criteria

### 21.1 MVP Acceptance Criteria (Must Pass)

| # | Criteria | Status |
|---|----------|--------|
| AC1 | ✅ User can enter a valid username and see confirmation | ⬜ |
| AC2 | ✅ User can enter their name (auto Title Case) | ⬜ |
| AC3 | ✅ User can select Technical or Non-Technical event type | ⬜ |
| AC4 | ✅ Clicking "Generate Certificate" produces a downloadable PDF | ⬜ |
| AC5 | ✅ PDF contains correct name, event type, date, and unique certificate ID | ⬜ |
| AC6 | ✅ Same username cannot generate certificate twice | ⬜ |
| AC7 | ✅ Invalid/non-existent username shows appropriate error | ⬜ |
| AC8 | ✅ Admin can log in with correct password | ⬜ |
| AC9 | ✅ Admin can view statistics (total, generated, remaining) | ⬜ |
| AC10 | ✅ Admin can add usernames (single + CSV bulk) | ⬜ |
| AC11 | ✅ Admin can reset a username to allow re-generation | ⬜ |
| AC12 | ✅ Admin can delete a username | ⬜ |
| AC13 | ✅ Admin can export certificate logs as CSV | ⬜ |
| AC14 | ✅ Mobile/tablet users see "Desktop Only" blocker | ⬜ |
| AC15 | ✅ Page loads in < 2 seconds on average connection | ⬜ |
| AC16 | ✅ All inputs are sanitized against XSS/injection | ⬜ |
| AC17 | ✅ Rate limiting is active on API endpoints | ⬜ |
| AC18 | ✅ Site is deployed and accessible on Vercel | ⬜ |

### 21.2 Nice-to-Have Acceptance Criteria

| # | Criteria | Status |
|---|----------|--------|
| NAC1 | ✨ Hero section has animated text reveal | ⬜ |
| NAC2 | ✨ Background has particle/glow animation | ⬜ |
| NAC3 | ✨ Form card has glassmorphism effect | ⬜ |
| NAC4 | ✨ Inputs glow orange on focus | ⬜ |
| NAC5 | ✨ Error inputs shake | ⬜ |
| NAC6 | ✨ Confetti bursts on certificate generation | ⬜ |
| NAC7 | ✨ Certificate preview slides up with animation | ⬜ |
| NAC8 | ✨ Button has ripple effect on click | ⬜ |
| NAC9 | ✨ Grain/noise texture overlay on page | ⬜ |
| NAC10 | ✨ Certificate has QR code with verification data | ⬜ |

---

## 22. Appendix

### 22.1 Glossary

| Term | Definition |
|------|-----------|
| **Certificate ID** | A unique alphanumeric identifier in format `IF2K26-XXXX-XXXX` assigned to each generated certificate |
| **Username** | A pre-assigned unique identifier for each event participant |
| **Event Type** | Category of the event attended — either "Technical" or "Non-Technical" |
| **Glassmorphism** | A UI design trend featuring translucent, blurred glass-like surfaces |
| **MVP** | Minimum Viable Product — the smallest set of features needed for launch |
| **Serverless Function** | Backend code that runs on-demand without managing servers (Vercel Functions) |

### 22.2 Reference Links

| Resource | URL |
|----------|-----|
| Vercel Docs | https://vercel.com/docs |
| MongoDB Atlas | https://www.mongodb.com/atlas |
| Tailwind CSS | https://tailwindcss.com |
| Framer Motion | https://www.framer.com/motion |
| pdf-lib | https://pdf-lib.js.org |
| Google Fonts - Space Grotesk | https://fonts.google.com/specimen/Space+Grotesk |
| Google Fonts - Unbounded | https://fonts.google.com/specimen/Unbounded |

### 22.3 Certificate ID Generation Algorithm

```javascript
function generateCertificateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  return `IF2K26-${segment()}-${segment()}`;
  // Example: IF2K26-A7K2-M9X4
}
```

### 22.4 Sample CSV Format for Bulk Upload

```csv
username
student_001
student_002
ravi_kumar_2k26
priya_cs_2k26
tech_enthusiast_42
```

---

## ✍️ Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | _______________ | _______ | _________ |
| Tech Lead | _______________ | _______ | _________ |
| Designer | _______________ | _______ | _________ |
| QA Lead | _______________ | _______ | _________ |

---

> **📌 Document Status: FINAL v1.0.0**
> **This PRD is a living document created as a single-launch specification. No revisions are planned post-deployment.**

---

*Built with precision. Shipped with confidence. 🔥*