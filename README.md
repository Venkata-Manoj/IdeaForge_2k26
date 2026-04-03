# IDEAFORGE 2K26 - E-Certificate Platform

A modern web application for generating and managing participation certificates for the IDEAFORGE 2K26 event at SIMATS Engineering. Built with React, TypeScript, and Node.js.

## Features

### For Participants
- **Username Validation** - Secure validation system to verify eligible participants
- **Certificate Preview** - Real-time preview of certificate before downloading
- **One-Click Download** - Download high-quality PNG certificates instantly
- **Mobile Responsive** - Fully responsive design (desktop-optimized with mobile blocker)

### For Administrators
- **Secure Admin Dashboard** - Protected admin interface for certificate management
- **Bulk Operations** - Export all certificates as ZIP archive
- **Usage Tracking** - Monitor certificate generation statistics
- **Username Management** - Add and manage eligible participant usernames

### Technical Features
- **Pixel-Perfect PDF Generation** - Certificates match preview exactly using html2canvas
- **Database Integration** - MongoDB backend for data persistence
- **Rate Limiting** - Protection against abuse and spam
- **CORS Enabled** - Secure cross-origin resource sharing
- **Environment-Based Configuration** - Flexible deployment options

## Tech Stack

### Frontend
- **React 19** - UI library with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations and transitions
- **html2canvas** - DOM-to-canvas rendering for certificates

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework for API routes
- **MongoDB + Mongoose** - Database and ODM
- **pdf-lib** - PDF generation library
- **JWT** - Authentication tokens

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Glassmorphism Design** - Modern frosted glass UI effects
- **Custom Color Palette** - Brand-matched colors (#FF5500 primary)

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB instance

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IdeaForge_2k26
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ideaforge
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_PASSWORD=your-secure-admin-password
   VITE_API_URL=http://localhost:3001
   ```

4. **Seed the database with usernames**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   # Terminal 1 - Backend API
   node server.js
   
   # Terminal 2 - Frontend dev server
   npm run dev
   ```

6. **Open the application**
   Navigate to `http://localhost:5173`

## Usage

### Generating a Certificate

1. Enter your registered username
2. Enter your full name (as it should appear on the certificate)
3. Select your event type (e.g., Technical, Non-Technical)
4. Click "Generate Certificate"
5. Preview your certificate
6. Click "Download Certificate" to save as PNG

### Admin Access

1. Navigate to `/admin`
2. Login with admin credentials
3. Access certificate statistics and export features

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/validate-username` | Validate if username is eligible |
| POST | `/api/generate-certificate` | Generate certificate for user |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin authentication |
| GET | `/api/admin/stats` | Get certificate statistics |
| GET | `/api/admin/export-zip` | Export all certificates as ZIP |

## Scripts

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once

# Database
npm run seed         # Seed usernames to database
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `ADMIN_PASSWORD` | Password for admin login | Yes |
| `VITE_API_URL` | Backend API URL (frontend) | Yes |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No (default: 60000) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No (default: 5) |
| `NODE_ENV` | Environment mode | No (default: development) |

## Project Structure

```
IdeaForge_2k26/
├── src/
│   ├── api/              # Serverless API routes
│   │   ├── _lib/         # Shared utilities (db, pdfGenerator)
│   │   ├── generate-certificate.js
│   │   ├── validate-username.js
│   │   └── admin/        # Admin API routes
│   ├── components/       # React components
│   │   ├── CertificateForm/
│   │   ├── CertificatePreview/
│   │   ├── Hero/
│   │   ├── Layout/
│   │   └── UI/           # Reusable UI components
│   ├── models/           # Mongoose models
│   ├── services/         # API client functions
│   ├── App.tsx           # Main application
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── dist/                 # Production build
└── server.js             # Express server (dev/local)
```

## Security Considerations

- Input validation on all endpoints
- Rate limiting prevents abuse
- HTTP-only cookies for JWT storage
- CORS configured for production domains
- Username whitelist prevents unauthorized access

## License

This project is proprietary and developed for SIMATS Engineering.

## Support

For technical support or issues, please contact the development team.

---

Built with care for IDEAFORGE 2K26 at SIMATS Engineering.
