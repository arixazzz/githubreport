# 🚀 Next.js 15.x Custom Template – Newus Boilerplate

Welcome to the **Next.js 15** based project with internal customization from the Newus Technology team. This template uses the `pr-template-nextjs` boilerplate as the main foundation, developed to accelerate the development of modern, fast and scalable web applications.

---

## Project Structure

```
src/
├── __tests__/                    # Unit Testing
├── app/[locale]/                 # Page and Layout
├── assets/                       # Static files (images, fonts)
├── components/                   # Reusable UI components
│   ├── parts/                    # Parts of Component
│   │   └──[folder-name]
│   │        │──api.ts
│   │        │──interface.d.ts
│   │        └──validation.ts
│   ├── sections/                 # Sections of Component
│   ├── shared/                   # Global component
│   └── ui/                       # Component form ShadCN/UI
├── constants/                    # Constants value or objects
├── hooks/                        # Custom React hooks
├── libs/                         # Helper functions and constants
├── services/                     # API calls and external services
│   └── api/
│       └── fetcher.ts
├── store/             # State management
└── types/             # Global TypeScript type definitions
```

---

## Teknologi dan Library

- **Framework**: Next.js (App Router / Pages Router)
- **Styling**: Tailwind CSS + Custom Theme
- **State Management**: React Context / Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: fetch bawaan dengan custom fetching
- **UI Component**: shadcn/ui (Headless UI + Radix UI)
- **Icon Library**: lucide-react
- **Multi Language Support**: (i18n) - Optional & Flexible
- **Linting**: ESLint, Prettier, Husky
- **CI/CD Ready**: GitHub Actions
- **Deployment**: VPS

---

## Commit Message Guidelines

Follow these conventions for clear and meaningful commit messages [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) :

- **Format:** type(scope): description
- **Types:**
  - feat: new feature
  - fix: bug fix
  - docs: documentation changes
  - style: formatting, missing semicolons, etc.
  - refactor: code restructuring
  - test: adding tests
  - chore: maintenance tasks

Example: `feat(auth): implement OAuth2 login system`

---

## Naming Conventions

### Components

- Use PascalCase for component files and names: `UserProfile.tsx`
- Use .tsx extension for TypeScript components
- Keep one component per file

### Files and Folders

- Use kebab-case for folders: `user-profile/`
- Use camelCase for utility files: `formatDate.ts`
- Use index.ts for barrel exports

### **Variable & Function**

- Use camelCase for variables and functions: userData, fetchUserData()
- Use UPPER_CASE for constants and environment variables: API_URL, MAX_LIMIT
- Boolean variables must be preceded by a verb: isLoading, hasError, shouldFetch

### Object & API Mockup

- Use camelCase for object properties: `userName`, `userEmail`
- Use meaningful and descriptive property names: `userId` instead of `id`
- Mock API responses should mimic real-world data structures
- Example of an API mockup:

```json
{
  "userId": 123,
  "userName": "John Doe",
  "userEmail": "john.doe@example.com",
  "isActive": true
}
```

### **Type & Interface**

- Use PascalCase for types and interfaces: `UserProfile`, `AuthResponse`
- Prefix interfaces with `I`: `IUser`, `IItem`
- Use meaningful and descriptive names for types and interfaces
- Example of a well-defined interface:

```tsx
interface IUser {
  userId: number;
  userName: string;
  userEmail: string;
  isActive: boolean;
}

type UserResponse = {
  data: IUser;
  status: string;
};
```

---

## Code Style Guidelines

### General Rules

- Use consistent indentation (2 spaces recommended)
- Add semicolons at the end of statements
- Use double quotes for strings
- Always use type annotations in TypeScript

### React Specific

- Use functional components with hooks
- Destructure props in component parameters
- Keep components small and focused
- Use meaningful prop names
- Avoid using any, use data types that are compatible with TypeScript

---

## Contribution Guide

Please select your preferred language:

- 🇮🇩 [Panduan Kontribusi Bahasa Indonesia](./CONTRIBUTING_ID.md)
- 🇬🇧 [Contribution Guide in English](./CONTRIBUTING.md)

## Best Practices

- Write unit tests for components and utilities //if timeline is enough, if not can skip this unit test
- Document complex logic with comments
- Examples of good code comments:

```tsx
// Bad comment
// This function gets user data
const getUserData = async (id: string) => {...}

// Good comment
/**
 * Fetches user profile data from the API
 * @param id - The unique identifier of the user
 * @returns UserProfile object containing user details
 * @throws ApiError if user not found or network fails
 */
const getUserData = async (id: string): Promise<UserProfile> => {...}
*/
```

- Use environment variables for configuration
- Example of environment variables configuration:

```tsx
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
AUTH_SECRET=your-secret-key

// Using environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

// Validate environment variables
if (!process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET environment variable is required');
}

// Type-safe environment variables
const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL as string,
  gaId: process.env.NEXT_PUBLIC_GA_ID as string,
  authSecret: process.env.AUTH_SECRET as string,
};
```

- Optimize images and assets
- Implement proper error handling
- Use code-splitting for better performance
- Example of code-splitting implementation:

```tsx
// Without code-splitting
import HeavyComponent from "./HeavyComponent";

// With code-splitting
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

// Route-based code-splitting
const ProductPage = dynamic(() => import("./pages/Product"), {
  loading: () => <LoadingSpinner />,
});

// Component-based code-splitting with React.lazy
const HeavyChart = React.lazy(() => import("./components/HeavyChart"));
return (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyChart />
  </Suspense>
);
```

- Use Zustand for global state management
- Always use the English language for naming convention
- General rendering strategy selection guidelines:
  - Use SSR when you need real-time data and SEO
  - Use SSG for static content that rarely changes
  - Use ISR for content that changes occasionally but needs good performance
  - Use CSR for highly interactive features or private pages
  - Consider mixing strategies based on specific page sections' needs

## Version Control

- Create feature branches from the dev
- Branch naming conventions:
  - `feature/add-payment-gateway` - for new features
  - `fix/login-validation` - for bug fixes
  - `hotfix/security-patch` - for urgent fixes
  - `refactor/auth-module` - for code refactoring
  - `docs/api-documentation` - for documentation updates
  - `test/user-authentication` - for test-related changes
- Always include ticket number if available: `feature/ABC-123-user-profile`
- Use hyphens to separate words: `feature/add-google-analytics` not `feature/addGoogleAnalytics`
- Regularly pull from the dev branch

---

## 🌐 Multi Language Support (i18n) - Optional & Flexible

This project is ready to support multiple languages using [`next-intl`](https://next-intl-docs.vercel.app/), but it is **optional**. You **do not need to change any folder or file structure** if you do not want to use this feature.

---

### ✅ Default Behavior (No Multi Language)

By default, this project uses **English** and will run normally without the `/id` prefix in the URL.

#### Example:

- `/login` → Bahasa Indonesia
- No need for manual routing
- No need for any setup

---

### 🚀 Enable Multi Language (Indonesian + English)

1. Open `.env` file  
   Change or ensure the following environment variables:

   ```env
   NEXT_PUBLIC_I18N_ENABLED=true
   ```

2. Restart the project:

   ```bash
   pnpm dev
   ```

3. The URL will change to use the language prefix:

   | Language   | URL         |
   | ---------- | ----------- |
   | Indonesian | `/id/login` |
   | English    | `/en/login` |

4. The system will automatically render the content based on the `locale` of the URL, without the need for you to manually change the routing.

---

### 🌍 Language File Structure

All language content is stored in:

```
messages/
├── id.json ← Bahasa Indonesia
├── en.json ← English (if active)
```

- Format using **nested JSON** (i18n Ally recommendation)
- Files can be edited directly or with the help of the [i18n Ally] plugin (https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)

---

### 🔄 Language Switching

There is a dropdown based `LangSwitcher` component (with 🌐 icon) that can be used to switch languages in realtime.

``tsx
import { LangSwitcher } from “@/components/shared/langSwitcher”;

<LangSwitcher />
```

---

### ⚠️ Not Using Multi Language?

If you **don't want to use i18n**:

- Leave `NEXT_PUBLIC_I18N_ENABLED=false` (default).
- No need to delete the `[locale]` folder
- Project will run as usual without `/id` or `/en` prefix.

---

### 🧪 Adding a New Language

1. Duplicate `id.json` to `fr.json` (for example)
2. Add `“fr”` in `routing.ts`:

```ts
locales: [“id”, “en”, “fr”]
```

3. Add text in `fr.json` as needed

---

### 🔁 Auto Translate with Script (Optional)

If you want to speed up the creation of `en.json` file from `id.json`, you can use the provided CLI script:

```bash
pnpm translate:en
```

> This script will read the `src/messages/id.json` file, translate to English, and save it in `src/messages/en.json`.

You can also run simulation mode (no file writing):

```bash
pnpm translate:en --dry-run
```

---

### 📦 Tips

- Use `LangSwitcher` for the best multilingual experience
- Use **i18n Ally** plugin for the best multilingual text editor in VSCode
- Use `translate:en` only for initial help - check manual translation results
- Use `nested` structure for neatness and readability

---

If you have any questions or want to disable this feature in deployment, just set:

```env
NEXT_PUBLIC_I18N_ENABLED=false
```

And everything will return to the default one language mode (Bahasa Indonesia).

---

## How to Run a Project

### 1. Repositori Clone

```bash
git clone git@github.com:NewusTech/maincore-fe.git
# or
git clone https://github.com/NewusTech/maincore-fe.git
cd nama-repo
```

### 2. Dependency Install

```bash
pnpm install
```

### 3. Make FIle `.env`

```bash
cp .env.example .env
```

Fill in the configuration according to your environment (see `.env` section below).

### 4. Running in Local

```bash
pnpm dev
```

Accses your aplication on : [http://localhost:3000](http://localhost:3000)

---

## Credits

This template is setup by newus teams :

- [@aldngrha](https://github.com/aldngrha/)
- [@sakatimuna7](https://github.com/sakatimuna7/)
- [@robinta19](https://github.com/robinta19/)
- [@Kaben011201](https://github.com/Kaben011201/)

---

## Contact

📧 Email: newustechnology@gmail.com  
🌐 Website: [newus.id](https://newus.id/)

---

> Created with ❤️ by Team Newus Teknologi
