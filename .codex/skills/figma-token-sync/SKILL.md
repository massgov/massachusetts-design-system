---
name: figma-token-sync
description: Keep the Massachusetts Design System primitive CSS tokens aligned with the Base Tokens Figma variables using Codex's authenticated Figma MCP access. Use when comparing Figma variables to `packages/tokens/src/primitives.css`, updating primitive token values, reporting Figma-only tokens, or deciding whether new Figma token collections should become public CSS primitives.
---

# Figma Token Sync

Use this skill for the MDS primitive token sync workflow. The source of truth for synced primitive values is the Base Tokens Figma file; the package deliverable remains `packages/tokens/src/primitives.css`. In Codex, use the authenticated Figma MCP tools instead of requiring a separate Figma REST token.

## Workflow

1. Inspect the repo state before changing anything:

```bash
git status --short
sed -n '1,260p' packages/tokens/src/primitives.css
```

2. For live Figma comparison in Codex, use `mcp__figma.use_figma` against file `Vyi82tH3VdXfny4TYPSwZz` to inspect local variable collections and values. Load `figma-use` before calling `use_figma`, and return compact summaries or comparison results from the Figma script.

3. If the user asks to sync values, update `packages/tokens/src/primitives.css` directly using the comparison result. Keep edits limited to primitive token values unless the user explicitly expands the public token surface.

4. After any token change, validate:

```bash
npm run lint --workspace @massds/mds-tokens
npm run build --workspace @massds/mds-tokens
git diff --check
```

If `npm` is not on `PATH`, check for Volta at `/Users/minghuasun/.volta/bin/npm`.

5. Inspect the diff and confirm it only updates expected primitive values. Do not edit generated-looking value changes blindly; if the Figma source appears wrong, report the Figma correction instead.

## Mapping Rules

- Sync current public primitive CSS values from Figma collections `Color`, `Type`, `Space`, `Elevation`, and `Border radius`.
- Treat newer Figma-only collections as report-only until the public CSS API is intentionally expanded: `Color (Dark mode variants)`, `Color (COB)`, data-viz colors, and prototype purple.
- Normalize Figma names by stripping trailing `*`, lowercasing, replacing `/` and spaces with `-`, and converting numeric segments like `050` to `50`.
- Convert Figma colors to lowercase hex, preserving alpha as 8-digit hex when needed.
- Convert Figma float pixel values to `rem` for font size, space, and non-round radius tokens using base `16`; keep elevation values in `px`.
- Treat current code-only primitives as intentionally unmapped unless the user asks to add matching Figma variables: motion tokens, shadow opacity tokens, `--mds-space-0`, and elevation `*-none` aliases.

## Known Context

- `packages/tokens/src/primitives.css` currently publishes the final primitive CSS surface; `dist/` is copied from `src/` by `packages/tokens/scripts/build.js`.
- The linked Figma URL’s `var-set-id=6092-2764` is the `Color (COB)` collection, but that collection is not published by this first pipeline.
- The observed Figma value for `Border radius/round` was `999`; CSS has used `--mds-border-radius-round: 1000px`. Under Figma-to-code sync, this becomes a real drift decision: correct Figma or accept the CSS update.
- There is no standalone token sync script in this package. The skill is the operating guide, and Codex performs Figma reads through MCP.

## Guardrails

- Do not publish new token families from report-only Figma collections without an explicit user request, README update, changelog fragment, and review of semantic token references.
- Do not put Figma tokens or secrets in tracked files. Use Codex Figma MCP auth for this workflow.
