# Example Game Package

This package serves as a template for creating Leiamos games. It demonstrates the structure and patterns used to build games that can be integrated into Next.js applications.

## 📦 Package Structure

```
example-game/
├── src/
│   ├── components/     # Reusable game components
│   ├── constants/      # Constants (images, config, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── store/          # State management
│   ├── styles.css      # Tailwind CSS imports
│   └── utils/          # Utility functions
├── public/             # Assets (reference - must be duplicated in consuming app)
│   └── example-game/
│       └── images/
├── dist/               # Build output (generated)
├── package.json
├── tsconfig.json
└── turbo.json
```

## 🚀 Getting Started

### Creating a New Game

1. **Duplicate this package folder** and rename it to your game name (e.g., `my-awesome-game`)

2. **Update the package name** in `package.json`:
   ```json
   {
     "name": "@repo/my-awesome-game",
     ...
   }
   ```

3. **Update the game component** in `src/pages/page.tsx`:
   - Modify the `GamePage` component to implement your game logic
   - Update imports, constants, and UI as needed

4. **Update image constants** in `src/constants/images.ts`:
   - Update the path prefix to match your game name
   - Add your game's image references

5. **Build the package**:
   ```bash
   npm run build
   ```
   Or run development mode with watch:
   ```bash
   npm run dev
   ```

## 🔌 Integrating into an App

### 1. Add the Game Package as a Dependency

In your Next.js app's `package.json`, add your game package to `devDependencies`:

```json
{
  "devDependencies": {
    "@repo/my-awesome-game": "*",
    ...
  }
}
```

### 2. Create a Route

Create a route file in your Next.js app to render the game. Following the example-app pattern:

**`apps/your-app/app/my-awesome-game/page.tsx`**:
```tsx
import { GamePage } from "@repo/my-awesome-game/page"

export default function Page() {
  return <GamePage />;
}
```

### 3. Add Game Assets

**Important**: The public folder must be duplicated in **both** the package and the consuming app.

#### In the Package (for reference)

Create a `public` folder in your game package to serve as a reference:

```
packages/my-awesome-game/
├── public/
│   └── my-awesome-game/
│       └── images/
│           └── your-images.avif
└── ...
```

**Why?** This allows the lead developer to replicate the folder structure when deploying the package to the main app.

#### In the Consuming App (for testing/production)

Create the same folder structure in your Next.js app:

```
apps/your-app/public/my-awesome-game/
└── images/
    └── your-images.avif
```

**Why?** This is where the assets actually need to be for the app to work correctly at runtime.

Update the path in your game's `src/constants/images.ts`:
```ts
const path = "/my-awesome-game/images";
```

## 🛠️ Development

### Build Commands

- **`npm run build`** - Builds both styles and components
- **`npm run build:styles`** - Builds only Tailwind CSS styles
- **`npm run build:components`** - Compiles TypeScript to JavaScript
- **`npm run dev`** - Runs development mode with watch (styles + components)
- **`npm run dev:styles`** - Watches and rebuilds styles on changes
- **`npm run dev:components`** - Watches and rebuilds TypeScript on changes

### Type Checking & Linting

- **`npm run check-types`** - Type checks without emitting files
- **`npm run lint`** - Runs ESLint

### Troubleshooting

**HMR (Hot Module Replacement) not working?**

If changes aren't reflecting in your app during development, try:

1. Remove the `dist` folder:
   ```bash
   rm -rf dist
   ```

2. Run dev mode again:
   ```bash
   npm run dev
   ```

This clears any stale build artifacts that might be preventing hot reloading from working correctly.

## 📝 Exports

The package exports:

- **`@repo/example-game/page`** - The main GamePage component
- **`@repo/example-game/styles.css`** - Compiled Tailwind CSS styles

Import the styles in your app's layout or page:
```tsx
import "@repo/example-game/styles.css";
```

## 🖼️ Image Handling

### Public Folder Duplication

**The public folder must exist in both places:**

1. **In the package** (`packages/your-game/public/your-game-name/`):
   - Serves as a reference for the lead developer
   - Allows replication of the folder structure when deploying to the main app
   - Documents which assets are needed

2. **In the consuming app** (`apps/your-app/public/your-game-name/`):
   - Where assets must be located for the app to work at runtime
   - Next.js serves static files from the `public` folder
   - This is what gets deployed to production

### Setup Steps

1. **Create the folder structure in your package**:
   ```
   packages/your-game/public/your-game-name/images/
   └── your-images.avif
   ```

2. **Duplicate it in the consuming app**:
   ```
   apps/your-app/public/your-game-name/images/
   └── your-images.avif
   ```

3. **Reference images in your code** (`src/constants/images.ts`):
   ```ts
   const path = "/your-game-name/images";
   
   export const myImage = {
     src: `${path}/your-images.avif`,
     alt: "Description",
     width: 400,
     height: 400,
   };
   ```

4. **Use Next.js Image component**:
   ```tsx
   import Image from "next/image";
   import { myImage } from "../constants/images";

   <Image 
     src={myImage.src} 
     alt={myImage.alt} 
     width={myImage.width} 
     height={myImage.height} 
   />
   ```

### Why Duplicate?

- **Package folder**: Reference for developers to understand what assets are needed and how to replicate the structure
- **App folder**: Required for Next.js to serve the assets at runtime
- **Example-app**: Shows how it will work in the main app for testing purposes

## 📋 Dependencies

### Peer Dependencies
- `react`: ^19
- `react-dom`: ^19
- `next`: ^16.0.1

### Internal Dependencies
- `@repo/eslint-config` - Shared ESLint configuration
- `@repo/tailwindcss-config` - Shared Tailwind CSS configuration
- `@repo/typescript-config` - Shared TypeScript configuration

## 🎯 Example App Reference

See `apps/example-app` for a complete working example:
- Route: `apps/example-app/app/example-game/page.tsx`
- Assets: `apps/example-app/public/example-game/images/`
- Package dependency: `apps/example-app/package.json`

## 💡 Tips

- Keep game logic in the `pages/page.tsx` component or break it into smaller components in `components/`
- Use custom hooks in `hooks/` for reusable game logic
- Store game state in `store/` if using state management
- Keep utility functions in `utils/`
- Remember to build the package before testing it in your app
- In development, use `npm run dev` to watch for changes automatically
