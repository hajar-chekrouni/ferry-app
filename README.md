# 🚢 ferry-app

> Ferry comparison & booking platform — Morocco ↔ Spain routes

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Status](https://img.shields.io/badge/status-in_development-orange?style=flat-square)]()

---

## What it does

Real-time ferry comparison and booking app covering Morocco–Spain crossings (Tanger Med → Algeciras, Tanger Ville → Tarifa, and more).

Users can compare schedules, prices, and operators in one place — then book directly.

---

## Features

- 🔍 Multi-operator search (Baleària, FRS, Trasmediterránea, IMTC...)
- 📅 Real-time schedule comparison
- 💶 Price comparison across operators
- 🎟️ Direct booking flow
- 🌍 Multilingual (FR / ES / EN / AR)
- 📱 Mobile-first design

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | React Query |
| Auth | Supabase Auth |
| DB | Supabase (PostgreSQL) |

---

## Getting started

```bash
# Clone the repo
git clone https://github.com/hajar-chekrouni/ferry-app.git
cd ferry-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project context

Built as part of a broader exploration of Morocco–Spain transport infrastructure and digital booking UX. Inspired by the complexity of planning ferry crossings across Strait of Gibraltar — dozens of operators, routes, and schedules with no unified comparison tool.

---

## Author

**Hajar Chekrouni El Merouani** — Product Manager & Digital Transformation Consultant  
Co-founder @ [MediaCaris](https://mediacaris.com) · Tanger, Morocco 🇲🇦  
[LinkedIn](https://linkedin.com/in/hajar-chekrouni-el-merouani)
