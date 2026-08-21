# Kinetic

![Kinetic Banner](public/favicon.svg)

**The all-in-one workspace for modern teams to plan, track, and collaborate in real-time.**

Kinetic is a modern task management web application built with React, TypeScript, and Vite. It provides teams with a comprehensive workspace to manage projects, track tasks, schedule events, and collaborate — all within a clean, responsive, and themeable interface powered by Material UI.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
  - [Linting](#linting)
- [Configuration](#configuration)
- [Routing](#routing)
- [Authentication](#authentication)
- [Theming](#theming)
- [Components](#components)
- [Utilities](#utilities)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Authentication** — Sign in, sign up, and password reset flows with form validation
- **Dashboard** — Overview with task highlights, priority tasks, and recent activity timeline
- **Projects** — Create and manage team projects
- **Calendar** — Schedule and track events
- **Teams** — Manage team members and collaboration
- **Responsive Design** — Fully responsive layout with mobile and desktop navigation
- **Dark / Light / System Mode** — Theme switching with system preference detection
- **Glass Morphism** — Modern frosted-glass UI effects
- **Form Validation** — Schema-based validation using Zod and React Hook Form
- **Animations** — Smooth transitions and micro-interactions with Motion (Framer Motion)
- **Loading Indicators** — Navigation loading bar and splash screen for async routes

---

## Tech Stack

| Category           | Technology                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **Framework**      | [React 19](https://react.dev/) with [React Compiler](https://react.dev/learn/react-compiler) |
| **Build Tool**     | [Vite 8](https://vite.dev/)                                                                  |
| **Language**       | [TypeScript 6](https://www.typescriptlang.org/)                                              |
| **UI Library**     | [Material UI (MUI) v9](https://mui.com/)                                                     |
| **Lab Components** | [@mui/lab](https://mui.com/lab/) (Timeline)                                                  |
| **Tree View**      | [@mui/x-tree-view](https://mui.com/x/react-tree-view/)                                       |
| **Routing**        | [React Router v8](https://reactrouter.com/)                                                  |
| **Forms**          | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)                    |
| **Animations**     | [Motion](https://motion.dev/) (Framer Motion)                                                |
| **Icons**          | [React Icons](https://react-icons.github.io/react-icons/)                                    |
| **Date Utils**     | [date-fns](https://date-fns.org/)                                                            |
| **Linting**        | [ESLint 10](https://eslint.org/) + [TypeScript ESLint](https://typescript-eslint.io/)        |
| **Transpiler**     | [Babel](https://babeljs.io/)                                                                 |

---

## Project Structure

```
kinetic/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── logo.svg
│   ├── components/
│   │   ├── form/
│   │   │   ├── Form.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   ├── FormTextField.tsx
│   │   │   └── index.ts
│   │   └── ui/
│   │       ├── ActionMenu.tsx
│   │       ├── Label.tsx
│   │       ├── ListHeader.tsx
│   │       ├── Logo.tsx
│   │       ├── SplashScreen.tsx
│   │       ├── ThemeSwitcher.tsx
│   │       └── index.ts
│   ├── config.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   ├── checkUserSession.ts
│   │   │   │   ├── signIn.ts
│   │   │   │   ├── signOut.ts
│   │   │   │   └── signUp.ts
│   │   │   ├── components/
│   │   │   │   ├── ResetPasswordView.tsx
│   │   │   │   ├── SignInView.tsx
│   │   │   │   └── SignUpView.tsx
│   │   │   └── index.ts
│   │   ├── calendar/
│   │   │   ├── components/
│   │   │   │   └── CalendarView.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardContent.tsx
│   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   ├── DashboardHighlights.tsx
│   │   │   │   ├── DashboardPriorityTasks.tsx
│   │   │   │   ├── DashboardRecentActivity.tsx
│   │   │   │   └── DashboardView.tsx
│   │   │   └── index.ts
│   │   ├── landing/
│   │   │   ├── about/
│   │   │   │   └── AboutView.tsx
│   │   │   ├── contact/
│   │   │   │   └── ContactView.tsx
│   │   │   ├── home/
│   │   │   │   ├── HomeView.tsx
│   │   │   │   └── components/
│   │   │   │       ├── AdvertisementSection.tsx
│   │   │   │       ├── ClientSection.tsx
│   │   │   │       ├── FeatureSection.tsx
│   │   │   │       ├── HeroSection.tsx
│   │   │   │       └── HighlightSection.tsx
│   │   │   └── index.ts
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   │   └── ProjectsView.tsx
│   │   │   └── index.ts
│   │   └── teams/
│   │       ├── components/
│   │       │   └── TeamsView.tsx
│   │       └── index.ts
│   ├── layouts/
│   │   ├── auth/
│   │   │   └── AuthLayout.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── components/
│   │   │       ├── Header.tsx
│   │   │       ├── Navbar.tsx
│   │   │       ├── NavDesktop.tsx
│   │   │       └── NavMobile.tsx
│   │   ├── main/
│   │   │   ├── MainLayout.tsx
│   │   │   └── components/
│   │   │       ├── Footer.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── NavHorizontal.tsx
│   │   │       └── NavMobile.tsx
│   │   ├── root/
│   │   │   ├── RootLayout.tsx
│   │   │   └── components/
│   │   │       └── LoadingBar.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── AboutPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── SignInPage.tsx
│   │   ├── SignUpPage.tsx
│   │   └── TeamsPage.tsx
│   ├── routes/
│   │   ├── index.ts
│   │   ├── paths.ts
│   │   └── router.tsx
│   ├── theme/
│   │   ├── styles.ts
│   │   └── theme.ts
│   ├── utils/
│   │   ├── helpers/
│   │   │   ├── checkOverdue.ts
│   │   │   ├── formateDate.ts
│   │   │   ├── index.ts
│   │   │   └── varAlpha.ts
│   │   ├── hooks/
│   │   │   └── index.ts
│   │   └── types/
│   │       └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS)
- **npm** 10+ (or your preferred package manager)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/iamxeshandev/kinetic-task-management.git
cd kinetic-task-management
npm install
```

### Development

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

Create an optimized production build:

```bash
npm run build
```

This runs TypeScript type-checking (`tsc -b`) followed by Vite's production build. The output is written to the `dist/` directory.

### Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality and style issues:

```bash
npm run lint
```

---

## Configuration

Application-level configuration is centralized in [`src/config.ts`](src/config.ts):

```ts
export const config = {
  appName: 'Kinetic',
  appDescription:
    'The all-in-one workspace for modern teams to plan, track, and collaborate in real-time.',
};
```

---

## Routing

Routing is managed with [React Router v8](https://reactrouter.com/) using `createHashRouter`. All route paths are defined in [`src/routes/paths.ts`](src/routes/paths.ts) and the router configuration is in [`src/routes/router.tsx`](src/routes/router.tsx).

### Route Map

| Route                  | Layout          | Auth Required | Description         |
| ---------------------- | --------------- | ------------- | ------------------- |
| `/`                    | MainLayout      | No            | Home / Landing page |
| `/about`               | MainLayout      | No            | About page          |
| `/contact`             | MainLayout      | No            | Contact page        |
| `/auth/sign-in`        | AuthLayout      | No (redirect) | Sign in page        |
| `/auth/sign-up`        | AuthLayout      | No (redirect) | Sign up page        |
| `/auth/reset-password` | AuthLayout      | No (redirect) | Password reset page |
| `/dashboard`           | DashboardLayout | Yes           | Dashboard overview  |
| `/dashboard/projects`  | DashboardLayout | Yes           | Projects management |
| `/dashboard/calendar`  | DashboardLayout | Yes           | Calendar view       |
| `/dashboard/teams`     | DashboardLayout | Yes           | Teams management    |

### Layouts

- **RootLayout** — Top-level layout with a navigation loading bar (`LoadingBar`) that shows during route transitions.
- **MainLayout** — Public-facing layout with a header (navigation + theme switcher + sign-in button), main content area, and footer.
- **AuthLayout** — Centered card layout for authentication pages.
- **DashboardLayout** — Authenticated layout with a dashboard header (search, notifications, theme switcher, user menu) and a responsive sidebar navbar (desktop drawer / mobile bottom bar).

### Route Guards

- `requireAuth` — Redirects unauthenticated users to the sign-in page.
- `checkAuth` — Redirects authenticated users away from auth pages to the dashboard.

---

## Authentication

Authentication is handled via a simple token-based mechanism stored in `localStorage`:

- **`checkUserSession()`** — Returns `true` if a `token` exists in `localStorage`.
- **`signIn()`** — Sets a mock token in `localStorage`.
- **`signOut()`** — Removes the token from `localStorage`.
- **`signUp()`** — Placeholder for future sign-up logic.

> **Note:** The current implementation uses mock authentication. In a production environment, these functions should be replaced with real API calls.

---

## Theming

Kinetic uses [Material UI's theming system](https://mui.com/material-ui/customization/theming/) with support for **light**, **dark**, and **system** color schemes.

- The theme is defined in [`src/theme/theme.ts`](src/theme/theme.ts) with custom typography, button, card, link, and tooltip styles.
- Global CSS styles (including a glass morphism effect) are defined in [`src/theme/styles.ts`](src/theme/styles.ts).
- The `ThemeSwitcher` component (`src/components/ui/ThemeSwitcher.tsx`) cycles through `system` → `light` → `dark` modes.
- The `ThemeProvider` in `App.tsx` uses `defaultMode="system"` to respect the user's OS preference.

---

## Components

### UI Components (`src/components/ui/`)

| Component       | Description                                               |
| --------------- | --------------------------------------------------------- |
| `Logo`          | Application logo with optional link wrapper               |
| `SplashScreen`  | Animated loading screen shown during route hydration      |
| `ThemeSwitcher` | IconButton that cycles between system/light/dark themes   |
| `ActionMenu`    | Reusable dropdown menu with configurable actions          |
| `Label`         | Styled label/badge component with color and size variants |
| `ListHeader`    | Section header with title, optional action, and divider   |

### Form Components (`src/components/form/`)

| Component       | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| `Form`          | Wrapper around `react-hook-form`'s `FormProvider`           |
| `FormTextField` | `TextField` connected to `react-hook-form` via `Controller` |
| `FormSelect`    | `Select` connected to `react-hook-form` via `Controller`    |

---

## Utilities

### Helpers (`src/utils/helpers/`)

| Function       | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `checkOverdue` | Checks if a given date has passed (used for task overdue detection)                  |
| `formatDate`   | Formats dates with `short`, `medium`, `long`, or `relative` formats using `date-fns` |
| `varAlpha`     | Generates an `rgba()` color string from a CSS color channel and alpha value          |

---

## Deployment

Kinetic is configured for deployment on GitHub Pages. The Vite config sets `base: '/kinetic/'` for proper asset path resolution.

To deploy:

1. Build the project: `npm run build`
2. Deploy the `dist/` directory to your hosting provider (e.g., GitHub Pages, Vercel, Netlify).

For GitHub Pages, update the `homepage` field in `package.json` and use the `gh-pages` package or GitHub Actions.

---

## License

This project is licensed under the MIT License.

---

## Author

**Zeshan Mehmood** — [iamxeshandev](https://github.com/iamxeshandev)

---

## Acknowledgments

- [Vite](https://vite.dev/) — Next-generation build tooling
- [Material UI](https://mui.com/) — React component library
- [React Router](https://reactrouter.com/) — Declarative routing
- [React Hook Form](https://react-hook-form.com/) — Performant form state management
- [Zod](https://zod.dev/) — TypeScript-first schema validation
- [Motion](https://motion.dev/) — Animation library
- [date-fns](https://date-fns.org/) — Modern JavaScript date utility
