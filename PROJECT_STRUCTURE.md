# 📁 DESIGN CANVAS - COMPLETE PROJECT STRUCTURE

> **Created for**: Quick project setup with single-command run capability  
> **Developer**: Santosh Mourya  
> **Last Updated**: January 27, 2026

---

## 🎯 PROJECT TYPE
**Full-Stack React Portfolio with Admin Panel**
- Frontend: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- Backend: Node.js + Express + MongoDB
- Auth: Clerk
- Deployment: Vercel

---

## 📂 COMPLETE DIRECTORY STRUCTURE

```
design-canvas/
│
├── 📄 package.json              # Dependencies & Scripts (IMPORTANT!)
├── 📄 .env                      # Environment Variables (CRITICAL!)
├── 📄 .gitignore                # Git ignore configuration
├── 📄 vercel.json               # Vercel deployment config
├── 📄 PROJECT_GUIDE.txt         # User instructions
├── 📄 PROJECT_STRUCTURE.md      # This file
├── 📄 README.md                 # Project documentation
│
├── 📄 vite.config.ts            # Vite configuration
├── 📄 tailwind.config.ts        # Tailwind CSS config
├── 📄 postcss.config.js         # PostCSS config
├── 📄 tsconfig.json             # TypeScript config
├── 📄 tsconfig.app.json         # App TypeScript config
├── 📄 tsconfig.node.json        # Node TypeScript config
├── 📄 components.json           # shadcn/ui config
├── 📄 eslint.config.js          # ESLint configuration
├── 📄 playwright.config.ts      # Testing configuration
├── 📄 vitest.config.ts          # Unit testing config
│
├── 📁 api/                      # Backend API (Vercel Serverless)
│   ├── index.js                 # Main API routes
│   ├── seed.js                  # Database seeding
│   └── models/
│       └── Portfolio.js         # MongoDB schema
│
├── 📁 server/                   # Local development server (same as api/)
│   ├── index.js
│   ├── seed.js
│   └── models/
│       └── Portfolio.js
│
├── 📁 src/                      # Frontend source code
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component
│   ├── App.css                  # App styles
│   ├── index.css                # Global styles
│   ├── vite-env.d.ts            # Vite types
│   │
│   ├── 📁 components/           # UI Components (70+ files)
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── HeroSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── CertificationsSection.tsx
│   │   └── ... (many more)
│   │
│   ├── 📁 pages/                # Route pages
│   │   ├── HomePage.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   │
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── use-toast.ts
│   │   ├── use-mobile.tsx
│   │   └── ...
│   │
│   ├── 📁 lib/                  # Utilities
│   │   └── utils.ts             # Helper functions
│   │
│   ├── 📁 assets/               # Static assets
│   │   └── (images, icons, etc.)
│   │
│   └── 📁 test/                 # Test files
│       ├── App.test.tsx
│       └── setup.ts
│
├── 📁 public/                   # Public static files
│   ├── vite.svg
│   └── ...
│
└── 📁 node_modules/             # Dependencies (auto-generated)
```

---

## 🔧 CRITICAL FILES BREAKDOWN

### 1️⃣ **package.json** - सबसे Important!

```json
{
  "name": "your-project-name",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",                              // Frontend only
    "server": "node api/index.js",              // Backend only
    "seed": "node api/seed.js",                 // Seed database
    "dev:all": "concurrently \"npm run dev\" \"npm run server\"",  // ⭐ Single command!
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@clerk/clerk-react": "^5.59.5",           // Authentication
    "axios": "^1.13.2",                        // API calls
    "express": "^5.2.1",                       // Backend server
    "mongoose": "^9.1.5",                      // MongoDB
    "dotenv": "^17.2.3",                       // Environment variables
    "cors": "^2.8.6",                          // CORS middleware
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "framer-motion": "^12.28.1",
    "lucide-react": "^0.462.0",
    // ... (add all radix-ui components)
    // ... (add all other dependencies)
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^3.11.0",
    "concurrently": "^9.2.1",                  // ⭐ Run multiple commands
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vite": "^5.4.19",
    // ... (add all other dev dependencies)
  }
}
```

### 2️⃣ **.env** - Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority&appName=AppName

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# API Configuration
VITE_API_URL=/api
```

### 3️⃣ **vercel.json** - Deployment Config

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    }
  ],
  "build": {
    "env": {
      "VITE_API_URL": "/api"
    }
  }
}
```

### 4️⃣ **vite.config.ts** - Frontend Config

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 5️⃣ **api/index.js** - Backend Server

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// More routes...

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
```

### 6️⃣ **tailwind.config.ts** - Styling

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      // Your custom theme
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

---

## 🚀 SINGLE COMMAND SETUP MAGIC

### ये सब automatically होता है `npm run dev:all` से:

1. ✅ Frontend starts on `http://localhost:8081`
2. ✅ Backend starts on `http://localhost:3001`
3. ✅ Database connects automatically
4. ✅ API proxy configured (`/api` → backend)
5. ✅ Both run in parallel using `concurrently`

### Key Ingredient: **concurrently**

```json
"scripts": {
  "dev:all": "concurrently \"npm run dev\" \"npm run server\""
}
```

---

## 📦 DEPENDENCIES CHECKLIST

### Core Dependencies (Production):
- [x] react, react-dom, react-router-dom
- [x] @clerk/clerk-react (Auth)
- [x] axios (API calls)
- [x] express (Backend)
- [x] mongoose (MongoDB)
- [x] dotenv (Environment)
- [x] cors (CORS handling)
- [x] framer-motion (Animations)
- [x] lucide-react (Icons)
- [x] All @radix-ui components
- [x] tailwindcss utilities

### Dev Dependencies:
- [x] vite
- [x] @vitejs/plugin-react-swc
- [x] concurrently ⭐
- [x] typescript
- [x] tailwindcss
- [x] autoprefixer
- [x] eslint

---

## 🎨 UI COMPONENTS PATTERN

### shadcn/ui Integration:
```bash
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add card
# ... add all needed components
```

### Component Structure:
```
components/
├── ui/                    # shadcn primitives
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── HeroSection.tsx        # Custom sections
├── SkillsSection.tsx
└── ...
```

---

## 🔐 ADMIN PANEL SETUP

### Role-Based Access (Clerk):
1. User logs in via Clerk
2. Check public metadata for `admin: true`
3. Grant access to `/admin` route

```typescript
// In AdminDashboard.tsx
const { user } = useUser();
const isAdmin = user?.publicMetadata?.admin === true;

if (!isAdmin) {
  return <div>Access Denied</div>;
}
```

---

## 🌍 DEPLOYMENT CHECKLIST

### Vercel Deployment:
1. ✅ Push to GitHub
2. ✅ Connect to Vercel
3. ✅ Add environment variables:
   - `MONGODB_URI`
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL=/api`
4. ✅ Deploy!

### Files Required:
- `vercel.json` (API rewrites)
- `api/index.js` (Serverless function)
- `.env.example` (Template for users)

---

## 🆕 HOW TO USE THIS STRUCTURE FOR A NEW PROJECT

### Step 1: Create Base Files
```bash
mkdir my-new-project
cd my-new-project

# Copy this structure
npm init -y
```

### Step 2: Copy Critical Files
Copy these from `design-canvas`:
- `package.json` (modify name)
- `.env.example` → `.env` (add your values)
- `vercel.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `postcss.config.js`
- `components.json`

### Step 3: Create Folders
```bash
mkdir -p api/models
mkdir -p server/models
mkdir -p src/{components/ui,pages,hooks,lib,assets,test}
mkdir public
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run!
```bash
npm run dev:all
```

---

## 💡 PRO TIPS

1. **Always use `.env` for secrets** - Never commit!
2. **`concurrently` is the magic** - Runs both servers
3. **Vite proxy** - Frontend `/api` → Backend `localhost:3001`
4. **Vercel rewrites** - Production `/api` → Serverless function
5. **MongoDB Atlas** - Free tier is enough
6. **Clerk Auth** - Free for small projects
7. **shadcn/ui** - Copy-paste components

---

## 🔗 USEFUL LINKS

- Vite Docs: https://vitejs.dev
- Vercel Docs: https://vercel.com/docs
- Clerk Docs: https://clerk.com/docs
- MongoDB Atlas: https://www.mongodb.com/atlas
- shadcn/ui: https://ui.shadcn.com

---

## ✅ VERIFICATION CHECKLIST

After setup, verify:
- [ ] `npm install` runs without errors
- [ ] `.env` file exists with all variables
- [ ] `npm run dev:all` starts both servers
- [ ] Frontend accessible at `localhost:8081`
- [ ] Backend accessible at `localhost:3001`
- [ ] Database connects successfully
- [ ] API calls work (`/api/health`)
- [ ] Admin panel loads
- [ ] Deployment works on Vercel

---

**🎉 You're all set! Copy this structure to any new project and run `npm run dev:all`**

**Created with ❤️ by Santosh Mourya**
