# Landing Page Module

This module contains all components and assets for the Insync landing page.

## Structure

- `Landing.tsx` - Main landing page component
- `components/` - Landing-specific components
- `assets/` - Landing-specific images and assets

## Usage

```tsx
import { Landing } from "@/landing";

// In your route
<Route path="/" element={<Landing />} />
```

## Components

- **Navigation**: Top navigation bar with auth state
- **Hero**: Main hero section with CTAs
- **HowItWorks**: Interactive how it works section
- **ClosingCTA**: Bottom call-to-action
- **Footer**: Footer with social links
- **FloatingParticles**: Background animation

## Future Integration

This module is designed to support sign-in flows that will be integrated later.
