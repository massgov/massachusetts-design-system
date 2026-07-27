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
   - Reuse local component data defaults, options, CSS imports, icon names, and render helpers.
   - If Figma includes `CodeConnectSnippet` for a component, map it to the repo's real renderer or story helper rather than hand-written static HTML.

3. Write content as default Markdown/MDX.
   - Use Markdown headings, paragraphs, lists, horizontal rules, and inline code for documentation text.
   - Do not add custom CSS for content typography, heading sizes, paragraph spacing, list styling, or inline code styling.
   - Keep prose close to the Figma frame, but adapt prop names and examples to the repo's actual component API.

4. Add only layout-helper CSS when needed.
   - CSS may arrange rendered component examples, dark/background surfaces, key-message borders, grids, stacks, and responsive wrapping.
   - Scope helpers to the page, e.g. `mds-button-overview__button-row`.
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
import './button.overview.css';

export const ButtonExample = (args) => (
  <span
    className="mds-button-overview__button-example"
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

<div className="mds-button-overview__button-row">
  <ButtonExample text="Primary" type="Fill" color="Primary" />
  <ButtonExample text="Secondary" type="Fill" color="Secondary" />
</div>
```

Keep the companion CSS limited to helpers:

```css
.mds-button-overview__button-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--mds-space-md);
  align-items: center;
}

.mds-button-overview__surface {
  display: inline-flex;
  padding: var(--mds-space-xs);
}
```
