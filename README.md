# Agentic QA Planning Assistant — Frontend 🎨

The user interface for the **Agentic QA Planning Assistant**, built with **React**, **Vite**, **TypeScript**, and **Material UI (MUI)** following enterprise White + Blue design guidelines.

---

## 🎯 Overview

This repository contains the frontend application which allows developers to:
- Authenticate via secure JWT developer logins.
- Create new proposed QA Plans with custom titles, requirements, implementation notes, and acceptance criteria.
- View developer-scoped QA plans with live title, description, and date search.
- Inspect acceptance criteria coverage (`Covered: X / Y`, `Coverage: Z%`).
- View structured RAG QA guidance checklists.
- Download server-generated enterprise PDF documents.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **UI Component Library**: Material UI (MUI v5)
- **Icons**: MUI Icons
- **HTTP Client**: Axios with Bearer JWT Interceptors
- **State & Forms**: React Hook Form, Context API
- **Notifications**: React Toastify

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file in the root directory:

```env
# URL of the Spring Boot Backend Service
VITE_API_URL=https://agentic-qa-planner-backend.onrender.com/api
```

For local development:
```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🚀 Getting Started Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   App will launch at `http://localhost:5173`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📦 Vercel Deployment

1. Connect `agentic-qa-planner-frontend` repository to Vercel.
2. Select **Vite** framework preset.
3. Configure environment variable: `VITE_API_URL` pointing to your deployed backend API URL.
