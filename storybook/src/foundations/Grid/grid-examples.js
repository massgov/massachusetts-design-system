export const responsiveClasses = [
  'mds-grid-span-2',
  'lg:mds-grid-span-3',
  'md:mds-grid-span-2',
  'sm:mds-grid-span-6'
];

export const cardLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

export const spanRows = [[12], [11, 1], [10, 2], [9, 3], [8, 4], [7, 5], [6, 6]];

export const wrapperCodeTabs = [
  {
    label: 'HTML (utility classes)',
    language: 'html',
    code: `<div class="mds-section-container">
  <div class="mds-grid">
    <!-- Place grid items here. -->
  </div>
</div>`
  },
  {
    label: 'HTML (custom classes)',
    language: 'html',
    code: `<div class="page-section">
  <div class="content-grid">
    <!-- Place grid items here. -->
  </div>
</div>`
  },
  {
    label: 'Mixins (custom classes)',
    language: 'scss',
    code: `@use "pkg:@massds/mds-styles/scss/mixins" as mixins;

.page-section {
  @include mixins.section-container;
}

.content-grid {
  @include mixins.grid;
}`
  }
];

export function getColumnLayoutCodeTabs(columns) {
  const layoutClass = columns === 1 ? 'mds-grid-full' : `mds-grid-${columns}-column`;

  return [
    {
      label: 'HTML (utility classes)',
      language: 'html',
      code: `<div class="mds-section-container">
  <div class="mds-grid" style="row-gap: var(--mds-space-sm)">
${Array.from({ length: columns }, (_, index) => `    <div class="${layoutClass}">Item ${index + 1}</div>`).join('\n')}
  </div>
</div>`
    },
    {
      label: 'HTML (custom classes)',
      language: 'html',
      code: `<div class="page-section">
  <div class="content-grid">
${Array.from({ length: columns }, (_, index) => `    <div class="content-grid__item">Item ${index + 1}</div>`).join('\n')}
  </div>
</div>`
    },
    {
      label: 'Mixins (custom classes)',
      language: 'scss',
      code: `@use "pkg:@massds/mds-styles/scss/mixins" as mixins;

.page-section {
  @include mixins.section-container;
}

.content-grid {
  @include mixins.grid;

  row-gap: var(--mds-space-sm);
}

.content-grid__item {
  @include mixins.${layoutClass.replace('mds-', '')};
}`
    }
  ];
}

export const spanCodeTabs = [
  {
    label: 'HTML (utility classes)',
    language: 'html',
    code: `<div class="mds-section-container">
  <div class="mds-grid" style="row-gap: var(--mds-space-sm)">
    <div class="mds-grid-span-8 md:mds-grid-span-6">Main content</div>
    <div class="mds-grid-span-4 md:mds-grid-span-6">Related content</div>
  </div>
</div>`
  },
  {
    label: 'HTML (custom classes)',
    language: 'html',
    code: `<div class="page-section">
  <div class="content-grid">
    <div class="main-content">Main content</div>
    <div class="related-content">Related content</div>
  </div>
</div>`
  },
  {
    label: 'Mixins (custom classes)',
    language: 'scss',
    code: `@use "pkg:@massds/mds-styles/scss/mixins" as mixins;

.page-section {
  @include mixins.section-container;
}

.content-grid {
  @include mixins.grid;

  row-gap: var(--mds-space-sm);
}

.main-content {
  grid-column: span 8;

  @include mixins.max-width(md) {
    grid-column: span 6;
  }
}

.related-content {
  grid-column: span 4;

  @include mixins.max-width(md) {
    grid-column: span 6;
  }
}`
  }
];

export const responsiveCodeTabs = [
  {
    label: 'HTML (utility classes)',
    language: 'html',
    code: `<div class="mds-section-container">
  <div class="mds-grid" style="row-gap: var(--mds-space-sm)">
${cardLabels.map((label) => `    <div class="${responsiveClasses.join(' ')}">${label}</div>`).join('\n')}
  </div>
</div>`
  },
  {
    label: 'HTML (custom classes)',
    language: 'html',
    code: `<div class="page-section">
  <div class="content-grid">
${cardLabels.map((label) => `    <div class="content-grid__item">${label}</div>`).join('\n')}
  </div>
</div>`
  },
  {
    label: 'Mixins (custom classes)',
    language: 'scss',
    code: `@use "pkg:@massds/mds-styles/scss/mixins" as mixins;

.page-section {
  @include mixins.section-container;
}

.content-grid {
  @include mixins.grid;

  row-gap: var(--mds-space-sm);
}

.content-grid__item {
  grid-column: span 2;

  @include mixins.max-width(lg) {
    grid-column: span 3;
  }

  @include mixins.max-width(md) {
    grid-column: span 2;
  }

  @include mixins.max-width(sm) {
    grid-column: span 6;
  }
}`
  }
];
