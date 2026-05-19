# CUET Result Dashboard

A student result viewer for CUET (Chittagong University of Engineering & Technology) Electronics & Telecommunication Engineering department. Students log in with their student ID, password, and a captcha to view their semester-by-semester grades, GPA trend chart, and cumulative CGPA.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/app run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (unused currently, no DB needed)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (provisioned but unused — app is stateless)
- HTML scraping: cheerio (in api-server)
- Charts: recharts
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/app/` — React + Vite frontend (login form, results dashboard, GPA chart, semester cards)
- `artifacts/app/src/components/` — LoginForm, ResultsDashboard, SemesterCard, GpaChart
- `artifacts/app/src/utils/` — grading.ts (grade-to-point logic), buildSemesters.ts (maps raw rows to catalog)
- `artifacts/app/src/data/courseCatalog.ts` — ETE curriculum catalog (all 8 semesters, all courses)
- `artifacts/api-server/src/routes/cuet.ts` — `/api/cuet-captcha` and `/api/cuet-login` proxy routes
- `lib/api-spec/openapi.yaml` — API spec (health check only; CUET routes bypass codegen)

## Architecture decisions

- The Supabase Edge Functions from the original Bolt app were ported to Express routes in the shared API server — no Supabase dependency.
- CUET portal scraping uses cheerio server-side; the frontend never talks to cuet.ac.bd directly (avoids CORS issues).
- The course catalog is a static TypeScript file — it maps raw result rows (which only have course codes) to human-readable names and credit values.
- The GpaChart is a recharts LineChart showing per-semester GPA trend with a CGPA reference line.
- No database is needed — the app is fully stateless (fetch-and-display on each login).

## Product

- Login page: dark slate glassmorphism card, student ID + password + captcha (auto-loaded from CUET portal)
- Results dashboard: student profile card, 4 stat cards (CGPA, best semester, credits earned, semesters), GPA trend chart, expandable semester cards showing per-course grades
- Semester cards: color-coded by semester index, collapsible, show course code / name / credit / grade / grade points

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The CUET portal occasionally shows a Cloudflare challenge — the API returns a descriptive error in that case.
- `cuet.functions.ts` in the migration backup used `@tanstack/react-start` server functions — this was replaced with plain Express routes.
- `GpaChart.tsx` in the migration backup was a stub — replaced with a real recharts implementation.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
