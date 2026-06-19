# AGENTS.md — AI Agent Master Plan for Pertu MI Ai

## Project Overview
**Pertu MI Ai** is a local-first, browser-based multi-screen display system designed for live podcast producers. It enables near-zero latency (< 5ms) dynamic prompt and response sync between an operator's dashboard and a presenter's projector screen using native browser APIs, completely offline and without a server backend.

---

## How I Should Think
1. **Understand Intent First**: Before answering or writing code, identify what the user actually needs.
2. **Ask If Unsure**: If critical details are missing (e.g., specific animation timing, design properties), ask before proceeding.
3. **Plan Before Coding**: Propose an execution plan, ask for approval, and then implement.
4. **Verify After Changes**: Run tests, check TypeScript compilations, or execute manual checks after each change.
5. **Explain Trade-offs**: When recommending a library, function structure, or layout pattern, mention alternatives.

---

## Plan → Execute → Verify Workflow
- **Plan**: Outline a brief approach of what you will modify/create and request the user's approval.
- **Execute**: Implement one feature or logical chunk at a time.
- **Verify**: Run build/lint scripts or ask the user to test in a browser before moving to the next task. Fix any issues immediately.

---

## Project Structure & Documentation Index
All detailed code conventions, design systems, and strategies are stored in the `agent_docs/` directory. Refer to them as needed:
- **[project_brief.md](file:///Users/deakdavid/Documents/Portfolio/pertu-mi/agent_docs/project_brief.md)**: Persistent project rules, coding conventions, quality gates, and CLI command references.
- **[product_requirements.md](file:///Users/deakdavid/Documents/Portfolio/pertu-mi/agent_docs/product_requirements.md)**: User stories, functional features, success metrics, and MVP scope.
- **[tech_stack.md](file:///Users/deakdavid/Documents/Portfolio/pertu-mi/agent_docs/tech_stack.md)**: Frontend frameworks, style systems, hooks, and typescript templates.
- **[testing.md](file:///Users/deakdavid/Documents/Portfolio/pertu-mi/agent_docs/testing.md)**: Unit tests, E2E checks, manual projector validations, and pre-commit configurations.

Refer to **[MEMORY.md](file:///Users/deakdavid/Documents/Portfolio/pertu-mi/MEMORY.md)** in the project root to check the current active phase and tasks.

---

## What NOT To Do
- **Do NOT** delete files without explicit confirmation.
- **Do NOT** introduce external databases or complex server-side backend logic (the app is offline-first client-side only).
- **Do NOT** add features that are not in the current active phase.
- **Do NOT** skip verification loops for "simple" changes.
- **Do NOT** use deprecated React or Next.js APIs.
- **Do NOT** bypass strict typing rules.
