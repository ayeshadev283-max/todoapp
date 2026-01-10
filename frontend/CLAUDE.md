# Frontend Development Rules

This file contains frontend-specific development rules for the Next.js application.

## TypeScript Configuration

- **Strict Mode**: Always enabled (`"strict": true` in tsconfig.json)
- **Type Safety**: No `any` types unless absolutely necessary (use `unknown` instead)
- **Explicit Returns**: All functions must have explicit return types
- **Props Interface**: All React components must define props interfaces

## Code Style

- **Formatter**: Prettier with default settings
- **Linter**: ESLint with `eslint-config-next`
- **Import Order**:
  1. React/Next.js imports
  2. Third-party libraries
  3. Local components
  4. Types
  5. Styles

## Component Structure

```typescript
// components/ExampleComponent.tsx
import { useState } from 'react';
import type { ExampleProps } from '@/lib/types';

export function ExampleComponent({ prop1, prop2 }: ExampleProps) {
  const [state, setState] = useState<string>('');

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

## File Naming

- Components: PascalCase (e.g., `TaskList.tsx`)
- Utilities: camelCase (e.g., `apiFetch.ts`)
- Types: camelCase (e.g., `types.ts`)
- Pages: lowercase with Next.js routing conventions

## API Calls

- Use custom `apiFetch` wrapper from `lib/api.ts`
- Always include error handling
- Show loading states
- Display user-friendly error messages

## State Management

- Use React hooks (`useState`, `useEffect`, `useContext`)
- No global state library needed (use Better Auth for auth state)
- Server state fetched from API, not stored globally

## Authentication

- Use Better Auth hooks (`useSession`, `useSignIn`, `useSignOut`)
- Protect routes with `AuthGuard` component
- Store JWT in Better Auth session (handled automatically)

## Styling

- **Tailwind CSS**: Utility-first approach
- **Responsive**: Mobile-first design (use `sm:`, `md:`, `lg:` breakpoints)
- **Dark Mode**: Not in scope for Phase 2
- **Touch Targets**: Minimum 44px for buttons and interactive elements

## Performance

- Use Next.js Image component for images
- Lazy load components where appropriate
- Minimize bundle size (check with `npm run build`)

## Error Handling

- Display toast notifications for success/error
- Show loading spinners during async operations
- Redirect to /login on 401 errors
- Show user-friendly messages for 500 errors

## Testing

- Manual testing only (no automated tests in Phase 2)
- Test all flows: signup → login → CRUD → logout
- Test responsiveness at 320px, 768px, 1920px

## Constitution Compliance

- Max function length: 50 lines (extract helpers if needed)
- Max cyclomatic complexity: 10
- All code must be traceable to tasks.md
