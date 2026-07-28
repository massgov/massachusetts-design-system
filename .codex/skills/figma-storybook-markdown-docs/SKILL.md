---
name: figma-storybook-markdown-docs
description: Generate or update Storybook MDX documentation pages from Figma frames. Use when creating component overview, usage, or guidance pages in Storybook from a Figma design URL/frame, especially when the desired output should use normal Markdown/MDX content styles while reusing local component renderers and design-system assets.
---

# Figma Storybook Markdown Docs

Use this skill to translate a Figma documentation frame into a Storybook MDX page that feels native to this repo. Treat the Figma output as content and structure reference, not as paste-ready React/Tailwind code.

## Workflow

1. Load the Figma design-to-code skill and call `get_design_context` for the exact frame URL before editing.
   - Extract `fileKey` and `nodeId` from the Figma URL.
   - Pass `skillNames: "resource:figma-design-to-code"` when the Figma skill was read as an MCP resource.
   - Use the returned screenshot/reference code to identify heading hierarchy, prose, lists, examples, component snippets, dark surfaces, and special callouts.

2. Inspect the local Storybook/component patterns before editing.
   - Read the target `Overview.mdx`, sibling `Code.mdx`, and `*.stories.js`.
   - Find existing component renderers in `storybook/src/utils/component-renderers.js`.
   - Read `storybook/.storybook/docs-markdown.css` before adding docs layout classes.
   - Reuse local component data defaults, options, CSS imports, icon names, and render helpers.
   - Reuse styles package utility classes from `@massds/mds-styles`, such as `mds-gap-*`, `mds-padding-*`, `mds-margin-*`, `mds-background-*`, `mds-radius-*`, and text/color utilities, when they cover spacing, background, radius, color, or typography needs.
   - If Figma includes `CodeConnectSnippet` for a component, map it to the repo's real renderer or story helper rather than hand-written static HTML.

3. Write content as default Markdown/MDX.
   - Use Markdown headings, paragraphs, lists, horizontal rules, and inline code for documentation text.
   - Use Markdown blockquote syntax for key messages, notes, and callouts from Figma, e.g. `> - Use the lowest-emphasis variant...`; do not wrap these in custom `<div>` callout classes.
   - Do not add custom CSS for content typography, heading sizes, paragraph spacing, list styling, or inline code styling.
   - Keep prose close to the Figma frame, but adapt prop names and examples to the repo's actual component API.

4. Use utilities first, then shared docs helpers for example layout.
   - Prefer styles package utilities in MDX for spacing, background, radius, shadow, color, and text styling.
   - Use shared docs layout classes from `storybook/.storybook/docs-markdown.css` for reusable patterns that utilities do not express, such as rendered example rows, stacks, inline example wrappers, or surfaces.
   - If a new custom layout style is needed and can apply to multiple component overview pages, add it to `docs-markdown.css` with a generic `mds-docs-*` name and scope it under `#storybook-docs`.
   - Create component-specific overview CSS only for behavior or layout that is genuinely unique to that component and cannot be generalized.
   - Avoid selectors like `.page h1`, `.page p`, `.page li`, or `.page code` unless the user explicitly asks to override Storybook's default docs typography.

5. Preserve component and asset fidelity.
   - Render examples through existing local components/renderers whenever possible.
   - Use existing icon names from the repo instead of Figma remote asset URLs when they match.
   - If Figma supplies a unique image/SVG that must be committed, download the exact asset; remote MCP asset URLs expire.
   - Keep dark-surface examples as wrappers around the real component, not as altered component styles.

6. Verify.
   - Run the relevant Storybook build, usually:
     ```sh
     /Users/minghuasun/.volta/bin/npm run storybook:build --workspace @massds/storybook
     ```
   - If browser tooling is available, visually inspect the docs page. Otherwise, confirm the static bundle contains the expected content and report that browser inspection was unavailable.

## MDX Pattern

Prefer a small helper only for rendered examples:

```mdx
import { Meta } from '@storybook/addon-docs/blocks';
import '@massds/mds-components/button.css';
import { buttonDefaults } from '../../../../packages/components/src/button/button.data.js';
import { renderButton } from '../../utils/component-renderers.js';
import * as ButtonStories from './button.stories.js';

export const ButtonExample = (args) => (
  <span
    className="mds-docs-example-item"
    dangerouslySetInnerHTML={{
      __html: renderButton({
        ...buttonDefaults,
        ...args
      })
    }}
  />
);

<Meta of={ButtonStories} />

# Button overview

Use normal Markdown for documentation text.

> - Use Markdown blockquote syntax for key messages
> - Keep prose styling in the shared Markdown stylesheet

<div className="mds-docs-example-row mds-gap-md">
  <ButtonExample text="Primary" type="Fill" color="Primary" />
  <ButtonExample text="Secondary" type="Fill" color="Secondary" />
  <span className="mds-docs-example-surface mds-padding-inline-xs mds-padding-block-xs mds-background-section-utility-static-black">
    <ButtonExample text="Light" type="Fill" color="Light" />
  </span>
</div>
```

Use shared docs helpers only when utilities are not enough:

```css
#storybook-docs .mds-docs-example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

#storybook-docs .mds-docs-example-stack {
  display: grid;
  justify-items: start;
}

#storybook-docs .mds-docs-example-item,
#storybook-docs .mds-docs-example-surface {
  display: inline-flex;
}
```

Apply utilities in MDX for the rest, for example `mds-gap-md`, `mds-padding-inline-xs`, `mds-padding-block-xs`, and `mds-background-section-utility-static-black`.
