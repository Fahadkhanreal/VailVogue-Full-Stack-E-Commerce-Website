<!--
Sync Impact Report:
- Version: NEW → 1.0.0 (Initial constitution)
- Modified principles: N/A (initial creation)
- Added sections: All core principles, tech stack, development workflow, governance
- Removed sections: N/A
- Templates requiring updates:
  ✅ plan-template.md (reviewed - compatible)
  ✅ spec-template.md (reviewed - compatible)
  ✅ tasks-template.md (reviewed - compatible)
- Follow-up TODOs: None
-->

# VeilVogue E-Commerce Constitution

## Core Principles

### I. User-First Experience (NON-NEGOTIABLE)
Every feature MUST prioritize user experience and performance:
- Checkout flow MUST complete in under 2 minutes
- Page load time MUST be under 2 seconds
- Mobile-first responsive design MANDATORY
- Clear error messages and loading states REQUIRED
- Cart persistence across sessions MANDATORY

**Rationale**: Pakistani women shopping for modest fashion need a fast, trustworthy, and seamless experience. Slow or confusing interfaces lead to cart abandonment and lost sales.

### II. Security & Privacy First
All user data and transactions MUST be protected:
- JWT-based authentication with httpOnly cookies MANDATORY
- Password hashing with bcryptjs REQUIRED
- Role-based access control (USER, ADMIN) ENFORCED
- Input validation on all forms and API endpoints REQUIRED
- No hardcoded secrets or tokens (use .env) MANDATORY

**Rationale**: E-commerce platforms handle sensitive personal and payment information. Security breaches destroy trust and violate user privacy.

### III. Performance Standards
System MUST meet these measurable performance targets:
- API response time: < 300ms (p95)
- Page load time: < 2 seconds
- Images optimized via Cloudinary
- Database queries optimized with Prisma
- No blocking operations on main thread

**Rationale**: Performance directly impacts conversion rates. Slow sites lose customers, especially on mobile networks common in Pakistan.

### IV. Local Market Adaptation
Platform MUST serve Pakistani market needs:
- Payment methods: COD (primary), JazzCash, Easypaisa REQUIRED
- WhatsApp ordering integration MANDATORY
- Urdu/English bilingual support (future consideration)
- Local shipping and address formats
- Cultural sensitivity in UI/UX (modest fashion focus)

**Rationale**: Generic international e-commerce patterns don't match local payment preferences and shopping behaviors. WhatsApp is the primary communication channel.

### V. Code Quality & Maintainability
All code MUST follow these standards:
- TypeScript MANDATORY (no `any` types without justification)
- Proper error handling with try-catch and error boundaries
- Toast notifications (Sonner) for user feedback
- Loading states for all async operations
- Component reusability with ShadCN UI
- Clear file structure following Next.js App Router conventions

**Rationale**: TypeScript catches errors at compile time. Consistent patterns make the codebase maintainable as features grow.

### VI. Scalability & Future-Proofing
Architecture MUST support growth:
- Prisma ORM for database abstraction
- Neon PostgreSQL for horizontal scaling
- Stateless API design
- Cloudinary for image CDN and optimization
- Modular component architecture

**Rationale**: Starting with scalable foundations prevents costly rewrites. Neon and Cloudinary handle infrastructure scaling automatically.

### VII. Accessibility & Inclusivity
UI MUST be accessible to all users:
- Basic ARIA labels on interactive elements REQUIRED
- Keyboard navigation support
- Sufficient color contrast (WCAG AA minimum)
- Responsive design for all screen sizes
- Clear visual hierarchy

**Rationale**: Accessible design serves users with disabilities and improves usability for everyone. It's also increasingly a legal requirement.

## Tech Stack (Fixed & Authoritative)

**Frontend**:
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS (Pastel theme: #F8E7EE, #F5EDE1, #A8B5A2)
- ShadCN UI components
- Zustand (state management with localStorage persistence)
- Sonner (toast notifications)

**Backend**:
- Next.js Route Handlers (API routes)
- Prisma ORM
- bcryptjs (password hashing)
- JWT (authentication tokens)

**Database**:
- PostgreSQL via Neon DB
- Prisma migrations

**External Services**:
- Cloudinary (image hosting and optimization)
- JazzCash/Easypaisa (payment gateways - sandbox for development)
- WhatsApp Business API (order integration)

**Deployment**:
- Frontend & Backend: Vercel
- Database: Neon DB (managed PostgreSQL)

**Rationale**: This stack balances developer experience, performance, and deployment simplicity. Next.js 15 with App Router provides modern React patterns. Neon DB offers generous free tier and automatic scaling.

## Development Workflow

### Spec-Driven Development (SDD)
All features MUST follow this workflow:
1. **Specification Phase**: Write detailed spec with user stories and acceptance criteria
2. **Planning Phase**: Create architectural plan with technical decisions
3. **Task Breakdown**: Generate dependency-ordered tasks from plan
4. **Implementation**: Execute tasks with TDD where applicable
5. **Validation**: Test against acceptance criteria
6. **Refinement**: Update spec/plan if requirements change

### Database Schema as Source of Truth
Prisma schema MUST be the authoritative data model:
- All entities defined in `prisma/schema.prisma`
- Migrations generated via `prisma migrate dev`
- No manual SQL unless absolutely necessary
- Schema changes require migration files

### Authentication Flow
JWT authentication MUST follow this pattern:
- Register/Login → Generate JWT → Set httpOnly cookie
- Protected routes check JWT validity
- Role-based middleware for admin routes
- Token refresh strategy for long sessions

### Error Handling Standards
All errors MUST be handled consistently:
- API errors return structured JSON: `{ error: string, details?: any }`
- Frontend displays toast notifications for user-facing errors
- Loading states prevent duplicate submissions
- Validation errors show field-specific messages
- Unexpected errors log to console (future: error tracking service)

### Git & Branching Strategy
- `main` branch: production-ready code
- Feature branches: `feature/[feature-name]`
- Commit messages: Clear, descriptive (e.g., "Add product filtering by category")
- No direct commits to `main` (future: enforce via branch protection)

## Governance

### Constitution Authority
This constitution supersedes all other development practices. When conflicts arise, constitution principles take precedence.

### Amendment Process
Constitution amendments require:
1. Clear justification for the change
2. Impact analysis on existing features
3. Version bump following semantic versioning:
   - MAJOR: Breaking changes to core principles
   - MINOR: New principles or significant expansions
   - PATCH: Clarifications, typo fixes, non-semantic refinements
4. Update to dependent templates and documentation

### Compliance & Review
- All PRs MUST verify compliance with constitution principles
- Architecture decisions that deviate from principles MUST be documented with justification
- Complexity MUST be justified (see plan-template.md Complexity Tracking)
- Use `CLAUDE.md` for runtime development guidance

### Validation Gates
Before merging any feature:
- [ ] User stories have acceptance criteria
- [ ] Performance targets met (< 2s load, < 300ms API)
- [ ] Security checklist passed (auth, validation, no secrets)
- [ ] Mobile responsive design verified
- [ ] Error handling and loading states implemented
- [ ] TypeScript compilation with no errors
- [ ] Prisma migrations applied successfully

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
