---
name: twig-component-conversion
description: Convert legacy HTML components into `packages/components` Twig components in this repo. Use when moving markup into `.twig`, defining schema-backed `.data.js` files, or checking repo conventions for Twig includes, defaults, and validation.
---

# Twig Component Conversion

Use this skill when turning an HTML component into a Twig component under `packages/components/src/<component>/`.

## Workflow

1. Inspect the existing HTML component and its styles.
2. Create or update the component trio:
   - `<component>.twig` for markup and Twig logic
   - `<component>.schema.js` for accepted inputs, defaults, and enum options
   - `<component>.data.js` for defaults, option lists, and computed render data
3. Move the HTML structure into `.twig`.
   - Replace hard-coded values with Twig variables.
   - Read values from `<component>Defaults`.
   - Validate enum-like inputs against exported option arrays before rendering.
   - Keep the template responsible for markup decisions, classes, and includes.
4. Keep `.data.js` schema-driven.
   - Import `getSchemaDefaults()` and `getSchemaOptions()` from `../shared/schema.js`.
   - Re-export the schema.
   - Export `<component>Defaults` at minimum.
   - Export option arrays or lookup maps only when Twig needs them.
5. Use static Twig includes for nested components.
   - Prefer `{% include 'icon.twig' %}` style includes.
   - Avoid dynamic include targets.
   - If an included component has exported defaults or options, let the shared build expose them through the render context.
6. Validate the conversion.
   - Confirm the default render still works.
   - Check that invalid enum values fall back safely.

## Repo Conventions

- `packages/components/src/<component>/<component>.twig` is the source of rendered markup.
- `packages/components/src/<component>/<component>.data.js` is the source of render context for the shared build.
- `packages/components/src/<component>/<component>.schema.js` is the source of truth for accepted fields.
- Keep the skill focused on the standard path. Only introduce custom renderers or build hooks when the component truly cannot be expressed with Twig plus exported data.

## When to Read the Reference

Read `references/conversion-example.md` for a compact before/after pattern when you want a concrete template for the `.twig` and `.data.js` split.
