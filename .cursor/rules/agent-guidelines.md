# AI Agent Guidelines (Minimal)

These guidelines aim to keep output clean and consistent without limiting creativity.

---

## TypeScript

- Prefer proper typing over type assertions.
- Minimize `as` usage. Use it only when unavoidable (e.g., narrowing after runtime checks, DOM APIs).
- Prefer type-safe patterns: generics, discriminated unions, explicit return types when helpful.

---

## JavaScript Style

- Use ES6+ syntax.
- Prefer arrow functions (e.g. `const fn = () => {}`) for functions and React components.

---

## Output Style

- Write minimal code focused on the core logic.
- Avoid unnecessary boilerplate, extra layers, and unused code.
- Only include what is required to solve the request.

---

## Constraint

- Do not invent requirements or add features that were not requested.
