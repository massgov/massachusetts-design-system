---
name: figma-icon-sync
description: Sync the Massachusetts Design System icon library from the Figma Icons file into the repo. Use when the task is to compare Figma icon component sets against `packages/assets/src/icons/static`, export SVGs, normalize names to kebab-case, and write regular and bold assets into the repo folders.
---

# Figma Icon Sync

Use this skill when updating the MDS icon asset package from the Figma icon library.

## Workflow

1. Inspect the repo icon directories:
   - `packages/assets/src/icons/static`
   - `packages/assets/src/icons/static/bold`
2. Query the Figma file for component-set names and variant node ids from the `Functional icons` page.
   - Save the component-set names into `packages/assets/src/icons/scripts/figma-component-set-names.json`.
   - Use a JSON array of strings or objects shaped like `{ "name": "ArrowRight" }`.
3. Normalize Figma component names to kebab-case.
   - Regular files live in `static/<name>.svg`
   - Bold files live in `static/bold/<name>--bold.svg`
   - Special case duplicate `Check` names explicitly if needed.
4. Compare normalized Figma names to repo filenames and classify:
   - exact matches
   - renamed files
   - Figma-only new icons
   - repo-only stale icons
   - Run:

```bash
node packages/assets/src/icons/scripts/icon-name-inventory.js --figma-names packages/assets/src/icons/scripts/figma-component-set-names.json
```

   - Read the structured outputs in `icon-name-inventory.json`:
     - `exact_matches`
     - `renamed_high_confidence`
     - `renamed_needs_review`
     - `figma_only`
     - `repo_only_stale`
5. Export SVGs from Figma in batches.
   - Keep batches small enough for tool output limits.
   - Build a manifest JSON array with entries shaped like:

```json
[
  {
    "fileBaseName": "arrow-right",
    "regularSvg": "<svg .../>",
    "boldSvg": "<svg .../>"
  }
]
```

   - Save incremental exports to:
     `packages/assets/src/icons/scripts/figma-unsynced-manifest.json`
   - Save full-library exports to:
     `packages/assets/src/icons/scripts/figma-sync-manifest.json`

6. Apply the manifest.
   - Incremental sync of new or changed icons:

```bash
npm --prefix packages/assets run sync:figma-icons -- --manifest packages/assets/src/icons/scripts/figma-unsynced-manifest.json
```

   - Full sync with stale cleanup:

```bash
npm --prefix packages/assets run sync:figma-icons -- --manifest packages/assets/src/icons/scripts/figma-sync-manifest.json --prune
```

   - If a partial sync should also remove confirmed repo-only stale icons, use:

```bash
npm --prefix packages/assets run sync:figma-icons -- --manifest packages/assets/src/icons/scripts/figma-unsynced-manifest.json --remove-repo-only packages/assets/src/icons/scripts/icon-name-inventory.json
```

7. Validate the sync:
   - check file counts in both directories
   - inspect `git status`
   - spot-check a few exported SVGs

## Scripts

- Apply a Figma export manifest into the repo:
  `packages/assets/src/icons/scripts/applyFigmaIconManifest.js`
- Optimize written SVGs:
  `packages/assets/src/icons/scripts/prepIcons.js`
- Generate inventory snapshots:
  `packages/assets/src/icons/scripts/icon-name-inventory.js`

## Rules

- Preserve kebab-case filenames.
- Write bold variants only into `static/bold`.
- Use `--bold` suffix for bold filenames.
- Prefer updating via the manifest script instead of hand-editing dozens of SVG files.
- Populate the repo manifest files before running the sync command. Do not leave `figma-unsynced-manifest.json` empty.
- Use `--prune` only with a full-library manifest.
- Use `--remove-repo-only` only after checking `repo_only_stale` in `icon-name-inventory.json`.
- If the Figma export step fails due to tool or response-size limits, continue in small batches instead of abandoning the sync.
