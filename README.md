# Smashing Design System

A small React design system documented in Storybook: two atoms and one module that
composes them, layered on a themed token set.

```
src/tokens    primitives → two themes (light / dark) → semantic keys
src/atoms     Button (primary | secondary), Input
src/modules   SearchForm — composes both atoms, owns the behaviour
src/docs      Introduction and Tokens MDX pages
```

## Running it

```bash
npm install
npm run storybook        # http://localhost:6006
```

Use the **Theme** control in the toolbar to flip every story between light and dark.

## Scriptsnp

| Script                    | What it does                                                            |
| ------------------------- | ----------------------------------------------------------------------- |
| `npm run storybook`       | Dev server on port 6006                                                 |
| `npm run build-storybook` | Static build into `storybook-static/`                                   |
| `npm run test:storybook`  | Runs every story headlessly in Chromium, including the `play` functions |
| `npm run typecheck`       | `tsc --noEmit`                                                          |
| `npm run lint`            | ESLint (type-aware)                                                     |
| `npm run format`          | Prettier                                                                |

`npm run test:storybook` needs a Chromium build: `npx playwright install chromium`.

## How the theming works

`src/tokens/tokens.ts` holds raw primitives. `src/tokens/themes.ts` maps them onto
semantic keys (`primary`, `border`, `focusRing`, …) — components read only those, never
a hex.

Both themes satisfy the same `Theme` interface, so a key added to one must exist in the
other. The brand green inverts across them: light uses `brand.600` (`#1f5c36`) on white,
dark uses the much lighter `brand.400` (`#479a63`), because a dark green button on a dark
surface is invisible. That inversion is the reason the semantic layer exists.

## Notes

- Components take `ref` as a plain prop — React 19 needs no `forwardRef`.
- Styling props are transient (`$variant`, `$fullWidth`) so they never reach the DOM.
- Preview annotations are applied automatically by `@storybook/addon-vitest` (10.3+), so
  there is no `.storybook/vitest.setup.ts`.
- `typescript` is pinned to 5.9.x: `typescript-eslint` does not yet support TypeScript 7.
