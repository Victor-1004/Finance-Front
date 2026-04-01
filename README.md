# 🎨 Finance Control - Frontend

## 📌 Sobre

This is the frontend for a personal financial control system, built with modern web technologies and **component-driven architecture**.

The application provides users with an intuitive interface to manage income, expenses, categories, and financial goals.

> ⚠️ Portfolio project, simulating a real production environment.

---

## 🧠 Arquitetura

The project is organized with a **component-based structure** following React best practices:

```
src/
├── components/
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   ├── Layout.tsx           # Main layout wrapper
│   ├── ProtectedRoute.tsx   # Route protection
│   └── theme-provider.tsx   # Theme context
│
├── pages/
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Categories.tsx       # Categories management
│   ├── Login.tsx            # Authentication
│   └── Register.tsx         # User registration
│
├── contexts/
│   └── AuthContext.tsx      # Authentication state
│
├── hooks/
│   └── use-mobile.ts        # Responsive utilities
│
├── lib/
│   ├── api.ts               # API client
│   └── utils.ts             # Utility functions
│
├── types/
│   └── index.ts             # TypeScript definitions
│
└── main.tsx
```

---

## 🛠️ Tecnologias

* **React** 19 - UI library
* **TypeScript** - Type safety
* **Vite** - Build tool
* **React Router** - Navigation
* **Tailwind CSS** - Styling
* **shadcn/ui** - Component library
* **Recharts** - Data visualization
* **Radix UI** - Accessible components
* **date-fns** - Date utilities
* **Lucide React** - Icons
* **Sonner** - Toast notifications
* **js-cookie** - Cookie management
* **ESLint + Prettier** - Code quality

---

## 🔐 Funcionalidades

### Autenticação

* User registration
* Login/Logout with JWT
* Protected routes
* Token persistence

### Dashboard

* Financial summary overview
* Transaction history
* Expense vs Income visualization
* Period filtering

### Transações

* Create, edit, and delete transactions
* Category association
* Transaction listing with filters
* Real-time updates

### Categorias

* Category management
* Category-based filtering
* Visual organization

### Tema

* Dark/Light mode
* Responsive design
* Mobile-first approach

### Interface

* Intuitive navigation
* Real-time feedback (toasts)
* Accessible components
* Smooth animations

---

## ⚙️ Como Rodar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Build

```bash
npm run build
```

### Verificação

```bash
# TypeScript check
npm run typecheck

# ESLint
npm run lint

# Formatting
npm run format
```

### Preview

```bash
npm run preview
```

---

## 🔗 Variáveis de Ambiente

Crie um arquivo `.env`:

```
API_URL=http://localhost:8080
```

---

## 📚 Estrutura de Componentes

Os componentes da UI são baseados em **shadcn/ui**, um conjunto de componentes acessíveis construído com Radix UI e Tailwind CSS.

Para adicionar novos componentes:

```bash
npx shadcn@latest add component-name
```

Importar componentes:

```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

---

## 🚀 Deploy

O frontend pode ser deployado em plataformas como:
* Vercel
* Netlify
* GitHub Pages
* Firebase Hosting

Build stático gerado em `dist/`
