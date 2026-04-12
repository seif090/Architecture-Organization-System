# Frontend ERP (Vite + React)

واجهة نظام ERP العربي المبنية بـ React + TypeScript + Vite.

## Local Run

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy On Vercel

1. Create a new Vercel project from this repository.
2. Set Root Directory to `frontend`.
3. Add environment variable:
   - `VITE_API_BASE_URL` = your backend API URL, for example: `https://api.example.com/api`
4. Deploy.

Notes:

- `vercel.json` is included for SPA routing rewrite to `index.html`.
- Use `frontend/.env.example` as the reference for required environment variables.
