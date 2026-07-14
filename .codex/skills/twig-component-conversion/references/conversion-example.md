# Conversion Example

## Before

Legacy HTML often hard-codes values directly in the markup:

```html
<section class="mds-state-banner" aria-label="Official website banner">
  <div class="mds-state-banner__container">
    ...
  </div>
</section>
```

## After

Split the component into a Twig template plus schema-backed data:

### `state-banner.twig`

```twig
{% set bannerPanelId = panelId|default(stateBannerDefaults.panelId) %}
{% set bannerSummaryLabel = summaryLabel|default(stateBannerDefaults.summaryLabel) %}

<section class="mds-state-banner" aria-label="{{ bannerSummaryLabel|e }}">
  <div class="mds-state-banner__container">
    ...
  </div>
</section>
```

### `state-banner.data.js`

```js
import { getSchemaDefaults } from '../shared/schema.js';
import { stateBannerSchema } from './state-banner.schema.js';

export { stateBannerSchema } from './state-banner.schema.js';

export const stateBannerDefaults = getSchemaDefaults(stateBannerSchema);
```

## Pattern to Reuse

- Put rendered markup in `.twig`.
- Put defaults and option lists in `.data.js`.
- Keep accepted fields in `.schema.js`.
- Use Twig fallbacks for missing values.
