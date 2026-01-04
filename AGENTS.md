# AGENTS.md - Coding Guidelines for AI Agents

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

This is a **real-time chat application** built for Goorm ICT Internship with:
- **Frontend**: React 18 + TypeScript + Vite + Bootstrap 5
- **Backend**: Express + Socket.io + MongoDB/Mongoose + TypeScript
- **Real-time**: Socket.io for bidirectional communication

## Project Structure

```
byby123/
├── backend/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── models/          # Mongoose schemas (user, message, conversation)
│   │   ├── routes/          # Express routers (auth, conversations, files, messages, users)
│   │   ├── services/        # Business logic layer
│   │   ├── sockets/         # Socket.io server handlers
│   │   └── types.ts         # Shared TypeScript interfaces
│   └── index.ts             # Server entry point
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── assets/          # SVG icons
│   │   ├── components/      # React components (Chat, LoginForm)
│   │   ├── context/         # React Context (AuthContext, SocketContext)
│   │   └── pages/           # Page components (Home, Login, Signup, Layout)
│   └── vite.config.ts
├── .eslintrc.js             # ESLint configuration
├── .prettierrc.js           # Prettier configuration
└── package.json             # Root scripts for linting/formatting
```

---

## Build/Lint/Test Commands

### Root Commands (run from `byby123/` directory)

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint both frontend and backend with ESLint |
| `npm run lint:fe` | Lint frontend only with auto-fix |
| `npm run lint:be` | Lint backend only with auto-fix |
| `npm run format` | Format both frontend and backend with Prettier |
| `npm run format:fe` | Format frontend only |
| `npm run format:be` | Format backend only |
| `npm run start:dev` | Start both frontend and backend in dev mode |
| `npm run start:prod` | Build and start production mode |
| `npm run start:db` | Start MongoDB (`mongod`) |

### Backend Commands (run from `byby123/backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon hot reload |
| `npm run build` | Compile TypeScript to JavaScript (`tsc`) |
| `npm start` | Run compiled production server |

### Frontend Commands (run from `byby123/frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build on port 3000 |

### Testing

**No test framework is configured.** If adding tests, consider:
- Frontend: Vitest + React Testing Library
- Backend: Jest or Vitest

---

## Code Style Guidelines

### Prettier Configuration

```javascript
{
    trailingComma: 'es5',    // Trailing commas where valid in ES5
    useTabs: true,           // Use tabs for indentation
    tabWidth: 4,             // 4-space tab width
    semi: true,              // Always use semicolons
    singleQuote: true,       // Use single quotes for strings
}
```

### ESLint Configuration

- Parser: `@typescript-eslint/parser`
- Extends: `eslint:recommended`
- Frontend overrides: `plugin:@typescript-eslint/recommended`, `plugin:react-hooks/recommended`
- `no-unused-vars` is disabled (TypeScript handles this)

---

## TypeScript Guidelines

### Backend TypeScript
- **Target**: ES2016
- **Module**: CommonJS
- **Strict mode**: Enabled
- **Output**: `./dist` directory

### Frontend TypeScript
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx
- **Strict mode**: Enabled with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

### Path Aliases (Frontend only)

```typescript
import Component from '@components/Component';  // → src/components/Component
import Page from '@pages/Page';                 // → src/pages/Page
import useHook from '@hooks/useHook';           // → src/hooks/useHook
```

---

## Naming Conventions

### Files and Folders
- **Components**: PascalCase folder with `ComponentName.tsx` + `index.tsx` re-export
- **Services/Routes**: camelCase (e.g., `user.ts`, `auth.ts`)
- **Models**: Folder per entity with `schema.ts` and `entity.ts`

### Code
- **Interfaces**: Suffix with `Interface` (e.g., `UserInterface`, `AuthInterface`)
- **React Contexts**: Named as `<Name>Context` with `use<Name>` custom hook
- **Components**: PascalCase (e.g., `LoginForm`, `Chat`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants

### Examples

```typescript
// Interface naming
interface UserInterface {
    id: string;
    username: string;
}

// Context pattern
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => { ... };

// Component structure
// components/Chat/Chat.tsx - main component
// components/Chat/index.tsx - re-export: export { default } from './Chat';
```

---

## Import Order

1. External libraries (react, axios, express, etc.)
2. Internal modules using path aliases (`@pages/`, `@components/`)
3. Relative imports (`./`, `../`)
4. Assets (SVGs, images)

```typescript
// Example
import { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

import SendIcon from '../../assets/send.svg';
```

---

## Error Handling

### Backend Pattern
```typescript
router.post('/endpoint', async (req: Request, res: Response) => {
    try {
        const result = await serviceFunction();
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ result: false, message: error.message });
    }
});
```

### Frontend Pattern
```typescript
try {
    const response = await fetch(url, { credentials: 'include' });
    if (response.ok) {
        const data = await response.json();
        // handle success
    } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
    }
} catch (error) {
    console.error('Error:', error);
    alert('An error occurred.');
}
```

---

## Architecture Patterns

### Backend
- **Routes** → **Services** → **Models** separation
- Session-based authentication with `express-session`
- Socket.io for real-time messaging

### Frontend
- React Context for global state (Auth, Socket)
- Functional components with hooks
- Bootstrap 5 for styling (no CSS-in-JS)
- SCSS for custom styles

---

## Environment Variables

```bash
# .env file (root level)
VITE_SERVER_URL=http://localhost:4000   # Frontend uses this
CLIENT_URL=http://localhost:3000         # Backend CORS origin
MONGO_URI=mongodb://localhost:27017/db   # MongoDB connection
```

---

## Common Gotchas

1. **Credentials**: Always include `credentials: 'include'` in fetch requests for session cookies
2. **Socket cleanup**: Always clean up socket listeners in `useEffect` return function
3. **Path aliases**: Only work in frontend; backend uses relative imports
4. **MongoDB**: Ensure `mongod` is running before starting the backend
5. **Comments**: Codebase uses Korean comments - maintain consistency if adding comments
