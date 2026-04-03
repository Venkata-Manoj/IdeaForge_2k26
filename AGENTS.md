# IDEAFORGE 2k26 - AGENTS.md

Guidance for agentic coding agents on the IDEAFORGE 2k26 e-certificate platform.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run test         # Run tests (watch mode)
npm run test:run     # Run tests once
npm run seed         # Seed usernames to database
```

### Running Single Tests
```bash
npx vitest run path/to/test.file.ts
npx vitest run -t "test name pattern"
```

## Code Style

### File Organization
- Components: `PascalCase.tsx` in `src/components/`
- Hooks: `camelCase.ts` in `src/hooks/`
- Services: `camelCase.ts` in `src/services/`
- API routes: `src/api/*.js` (serverless functions)
- Styles: CSS modules or Tailwind classes

### Import Order
1. React imports
2. Third-party libraries (alphabetical)
3. Relative imports (@/...)
4. Styles, assets

### Component Guidelines
- Functional components with hooks
- Export default for pages/components, named for utilities
- Small, focused components (single responsibility)
- TypeScript for new components

### Styling
- Primary: `#FF5500`, Hover: `#FF6A1A`
- Success: `#00C853`, Error: `#FF1744`, Warning: `#FF9100`
- Background: `#080808`, Card: `rgba(255,255,255,0.03)`
- Fonts: 'Space Grotesk' for body, 'Unbounded' for headings
- Glassmorphism: `backdrop-filter: blur(20px)`
- Border radius: 12px (buttons/inputs), 24px (cards)
- Animations: Use Framer Motion with 0.3s ease transitions

### Error Handling
- Client-side validation with inline errors
- API errors with toast notifications
- Loading states with spinners/skeletons
- Error boundaries for unexpected errors

### Security
- Sanitize all inputs
- Rate limit API endpoints
- HTTP-only cookies for JWT
- Never commit secrets

### Testing
- Unit tests for utilities/validators (90% coverage target)
- Component tests for UI states/interactions (80% coverage)
- API tests for endpoints (100% coverage)
- Mock external services

## Project Conventions

### Certificate Flow
1. Validate username available
2. Validate name format (alphabets/spaces, 2-50 chars)
3. Validate event type selection
4. Generate PDF, mark username used
5. Return PDF for download

### Database
- Use Mongoose models
- Handle connection errors gracefully
- Use indexes on `username`, `isGenerated`

### Device Support
- Desktop only (min 1024px width)
- Show MobileBlocker modal on smaller screens