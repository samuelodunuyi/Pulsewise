# Pulsewise

A hospital management dashboard: appointments, patients, doctors and reports. Built with Vue 3, Vite, Tailwind CSS, shadcn-style components (radix-vue) and Chart.js.

This is a front-end demo with no backend. The JSON files in `src/data/` seed the app, and every change you make (patients, appointments, beds, invoices, shifts and so on) is saved in the browser's localStorage, so it survives reloads. Use **Reset demo data** in the account menu to start over.

## Setup

```sh
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint and auto-fix with ESLint |
