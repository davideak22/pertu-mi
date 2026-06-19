# GEMINI.md — Gemini CLI & Antigravity Configuration for Pertu MI Ai

## Project Context
- **App**: Pertu MI Ai
- **Stack**: Next.js (App Router, TypeScript), Vanilla CSS, Framer Motion, BroadcastChannel API
- **Stage**: MVP Development
- **User Level**: Developer (Level B/C — Intermediate)

---

## Directives
1. **Master Plan**: Always read `AGENTS.md` and `MEMORY.md` first. They contain the active phase, roadmap, and tasks.
2. **Project Documentation**: Refer to `agent_docs/` for specific tech stack implementations, folder organization, coding patterns, and verification checkpoints.
3. **Plan-First Execution**: Propose a plan explaining proposed additions or edits, and wait for explicit user approval before executing them.
4. **Step-by-Step Changes**: Complete one feature at a time. Run tests and type verification before moving on to the next one.
5. **Quality Gates**: Ensure typescript compilation succeeds without errors (`npx tsc --noEmit`) and lint tests pass.
6. **No Spurious Dependencies**: Check the existing packages list before adding any libraries. Prefer native web APIs over external imports (e.g. `BroadcastChannel` over web sockets or localStorage wrappers).
7. **Communication**: Keep chat feedback concise. Address issues immediately and outline clear test steps.

---

## What NOT To Do
- Do NOT delete files without explicit confirmation.
- Do NOT modify database schemas or introduce server-side logic (this is client-only).
- Do NOT skip checks or bypass pre-commit configs.
- Do NOT use deprecated libraries or mock wrappers where native APIs exist.

---

## Commands
- `npm run dev` — Start the local client development server
- `npm run build` — Compile Next.js production build
- `npm run lint` — Lint code style check
- `npx tsc --noEmit` — Run TypeScript compilation type checking
