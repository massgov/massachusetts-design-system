# Component Code Standards

These standards apply to component code in `@massds/mds-components`. They are
intended to keep component markup and styles predictable, portable, and aligned
with the Massachusetts Design System token and style packages.

## Class Naming

Always apply component styles through component classes. Avoid styling raw HTML
elements directly inside component styles.

```scss
/* Avoid */
* {}
html {}
body {}
```

Class-based styling keeps selectors scoped and portable without risking overrides. 

All externally exposed classes must be prefixed with `mds-`.

```scss
.mds-button {}
.mds-utility-nav {}
.mds-padding-block-xs {}
```

### Component Classes

For component classes, use BEM naming:

```text
.mds-block
.mds-block__element
.mds-block--modifier
.mds-block__element--modifier
```

Examples:

```scss
.mds-section {}
.mds-section__container {}
.mds-section--narrow {}
.mds-section__heading--compact {}
```

Use the block class for the component root. Use element classes for named parts of the component. Use modifier classes for supported variants, states, or configuration options.

### Utility And Helper Classes

For utility and helper classes, use simple slugified class names prefixed with
`mds-`.

```scss
.mds-padding-block-xs {}
.mds-margin-inline-md {}
.mds-visually-hidden {}
```

Utility classes should describe a reusable behavior or styling outcome. They should not be tied to one component's internal structure.

Use component BEM classes when the style belongs to a component part. Use utility classes when the style is intentionally reusable across components.

## Selectors

Keep selectors direct and easy to override.

```scss
/* Preferred */
.mds-state-banner__toggle {}

/* Avoid */
.mds-state-banner .mds-state-banner__summary button {}
```

Avoid styling by tag name, DOM depth, or broad descendant selectors. These patterns make components harder to reuse and easier to break during markup changes.

Acceptable exceptions should be intentional and limited, such as:

- global reset styles owned by the styles package
- rich text or content areas where the component intentionally owns unknown
  authored HTML
- minor selectors for child Design System components when the relationship is
  part of the component contract

## Tokens And Mixins

In component SCSS, import the styles package at the top of the file to access
shared mixins as a build-time dependency.

```scss
@use "pkg:@massds/mds-styles/scss" as mixins;
```

Use existing design tokens and mixins wherever available.

```scss
.mds-example {
  padding-block: var(--mds-space-sm);
  color: var(--mds-text-and-icons-brand-neutral-high);

  @include mixins.text("body-md");
}
```

Do not add fallback values to token usage. Component styles should remain fully
token-driven.

```scss
/* Preferred */
padding-block: var(--mds-space-sm);

/* Avoid */
padding-block: var(--mds-space-sm, 1rem);
```

## Component Custom Properties

Use component-scoped custom properties when they make variants or states easier
to maintain.

```scss
.mds-button {
  --mds-button-background: var(--mds-background-adaptive-brand-primary-mid);

  background-color: var(--mds-button-background);
}
```

Component custom properties must also use the `--mds-` prefix. Prefer names that
include the component block, such as `--mds-button-background`, so they do not
collide with tokens or other components.

## Markup Contracts

Component markup should expose stable classes for styled parts. Do not rely on
consumers to preserve a specific tag hierarchy for styling to work.

```twig
<section class="mds-section">
  <div class="mds-section__container">
    <h2 class="mds-section__heading">{{ heading }}</h2>
  </div>
</section>
```

Prefer adding a clearly named element class over targeting the same element by
its parent and tag name.

## Review Checklist

Before opening a component PR, check that:

- [] externally exposed classes use the `mds-` prefix
- [] component classes follow BEM naming
- [] utility classes use simple slugified names
- [] styles target classes instead of raw HTML elements
- [] selectors stay low-specificity and avoid unnecessary nesting
- [] spacing, color, typography, radius, motion, and shadow values use tokens or
  mixins where available
- [] token references do not include fallback values
- [] repeatable or themable values are abstracted as component-scoped custom properties and are prefixed and named accordingly
