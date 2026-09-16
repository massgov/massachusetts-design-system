export default {
  id: 'massds-button',
  url: 'https://www.figma.com/design/D5Ju48AoqIXmdCopPwBr6N/Core-Components?node-id=924-22414&t=TD9KWAqxGi8t9BmU-0',
  stylesheet: '@massds/mds-components/button.css',
  properties: [
    {
      figmaName: 'Type',
      options: {
        Fill: { type: 'Fill' },
        Outline: { type: 'Outline' },
        Ghost: { type: 'Ghost' }
      }
    },
    {
      figmaName: 'Color',
      options: {
        Primary: { color: 'Primary' },
        Accent: { color: 'Secondary' },
        White: { color: 'White' },
        Danger: { color: 'Danger' }
      }
    },
    {
      figmaName: 'State',
      options: {
        Default: { disabled: false },
        Hover: { disabled: false },
        Active: { disabled: false },
        Disabled: { disabled: true },
        Loading: { disabled: false }
      }
    }
  ]
}
