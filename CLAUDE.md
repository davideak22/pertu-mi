# CLAUDE.md — Claude Code Configuration for Pertu MI Ai

## Project Context
- **App**: Pertu MI Ai
- **Stack**: Next.js (App Router, TypeScript), Vanilla CSS, Framer Motion, BroadcastChannel API
- **Stage**: MVP Development
- **User Level**: Developer (Level B/C — Intermediate)

---

## Directives
1. **Master Plan**: Always read `AGENTS.md` and `MEMORY.md` first. They contain the current phase, tasks, and state.
2. **Project Documentation**: Refer to `agent_docs/` for specific tech stack details, styling guidelines, and testing files.
3. **Plan-First Execution**: Propose a plan explaining proposed changes, and wait for user approval before coding.
4. **Incremental Build**: Implement one feature chunk at a time. Test frequently and keep codebase stable.
5. **Quality Gates**: Ensure typescript compilation succeeds without errors and lints pass.
6. **No Spurious Dependencies**: Do not install external libraries without confirmation. Use browser-native APIs where possible.
7. **Communication**: Keep responses concise and focused. Do not output verbose descriptions of what your code does unless asked.

---

## What NOT To Do
- Do NOT delete files without confirmation.
- Do NOT add remote server APIs or web sockets (local-first BroadcastChannel client only).
- Do NOT skip test verification steps or bypass check scripts.
- Do NOT cast types using `any`.

---

## Commands
- `npm run dev` — Start Next.js local server
- `npm run build` — Compile client app production build
- `npm run lint` — Lint code style check
- `npx tsc --noEmit` — Run TypeScript type checking
