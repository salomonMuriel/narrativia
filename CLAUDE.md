# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

**IMPORTANT: Always use `pnpm` for all operations.**

```bash
pnpm install          # Install dependencies
pnpm dev              # Development server (localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Lint code
```

## Project Overview

"Narrativia" is a Next.js 16 landing page for the "Colombia es Buena" movement. Collects user info and generates personalized AI narratives about community transformation in Colombia.

**Stack**: Next.js 16, React 19, TypeScript (strict), Tailwind CSS 4, Framer Motion, OpenAI Agents SDK

## Architecture

### Frontend (`src/app/page.tsx`)

Single-page landing with premium animations:
- **Hero**: Glass morphism card, gradient overlays, staggered animations
- **Form**: Floating label pattern with micro-interactions
- **Sections**: Scroll-triggered animations using `useInView`
- **Success**: Confetti celebration (35 particles, Colombian colors)

**Animation System:**
- Custom easing: `[0.16, 1, 0.3, 1]` (smooth deceleration)
- GPU-accelerated: Only animates `transform` and `opacity` (never `width`, `height`, `top`, `left`)
- Respects `prefers-reduced-motion`
- Uses `once: true` in viewport config for performance

### Backend (`src/app/api/`)

#### `/api/generate-narrative` - Multi-Agent System

**3-step deterministic pipeline using OpenAI Agents SDK:**

```
User Input → Research Agent → Validation Agent → Narrative Agent → Response
```

1. **Research Agent**: Investigates user's Colombian city/neighborhood (culture, challenges, strengths)
2. **Validation Agent**: Validates research quality using Zod structured output (`is_detailed`, `has_cultural_context`, `is_useful`)
3. **Narrative Agent**: Generates 600-800 word personalized narrative in first person from year 2028

Each agent uses `run(agent, prompt)`. Includes full narrative examples in prompts for style consistency.

#### `/api/submit-form`

Basic form submission endpoint (placeholder implementation).

## Design System

**Colombian Flag Colors:**
- Yellow (Primary): `#FBBF24` → `#F59E0B` for actions
- Blue (Secondary): `#3B82F6` → `#2563EB` for trust
- Red (Accent): `#EF4444` for emphasis

**Warm Grays** (approachable vs cold):
- Text: `#1C1917`, `#44403C`, `#57534E`
- Backgrounds: `#FAFAF9`, `#F5F5F4`, `#E7E5E4`

**Typography**: Geist Sans, Hero 48-72px responsive, Body 18px/1.625 leading

**Spacing**: Sections `py-24` desktop / `py-16` mobile

**Border Radius**: `rounded-xl` (inputs), `rounded-2xl` (cards), `rounded-3xl` (form card)

**Design Philosophy**: "Professional warmth with Colombian soul"

## File Structure

```
src/app/
├── api/
│   ├── generate-narrative/route.ts  # Multi-agent AI system
│   └── submit-form/route.ts         # Form submission
├── globals.css                      # Tailwind + Colombian colors
├── layout.tsx                       # Root layout with Geist fonts
└── page.tsx                         # Main landing page
```

Path alias: `@/*` maps to `src/*`

## Development Guidelines

**Code Style:**
- **Prefer simplicity over abstraction** - straightforward, repetitive code over complex patterns
- Inline logic when it improves readability
- Don't over-engineer (this is a landing page, not a framework)

**Accessibility:**
- All interactive elements have yellow focus rings
- Color contrast meets WCAG AA
- Respects reduced motion preferences
- Semantic HTML with proper ARIA labels

**Multi-Agent Pattern:**
1. Define agents with clear, specific instructions
2. Use `run(agent, prompt)` for each step
3. Add validation with Zod structured output
4. Log each step, handle errors gracefully
5. Requires `OPENAI_API_KEY` in `.env.local`

## Reusable Patterns

**AnimatedSection** (scroll-triggered fade-in):
```tsx
<AnimatedSection>
  <h2>Content</h2>
</AnimatedSection>
```

**Floating Labels**: All inputs use label-floats-up-on-focus pattern (200ms transition, yellow accent)

## Important Documentation

- `DESIGN_SUMMARY.md`: All design tokens, colors, animations
- `DESIGN_IMPLEMENTATION.md`: Detailed implementation guide
- `PREMIUM_FEATURES.md`: Visual highlights and UX details
- `README_API.md`: API documentation (Spanish)

## Common Pitfalls

1. Don't use npm/yarn - always `pnpm`
2. Don't animate `width`, `height`, `top`, `left` - only `transform` and `opacity`
3. Don't skip accessibility - focus states required
4. Don't over-abstract - keep code simple
5. Don't forget mobile optimization
