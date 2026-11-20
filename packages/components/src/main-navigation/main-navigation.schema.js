const children = () => Array.from({ length: 3 }, () => ({ text: 'Submenu item', href: '#' }));

export const mainNavigationSchema = {
  id: { type: 'string', default: 'main-navigation' },
  ariaLabel: { type: 'string', default: 'Main navigation' },
  variant: { type: 'enum', default: 'Responsive', options: ['Responsive', 'Stacked'] },
  items: {
    type: 'array',
    default: [
      { text: 'Your career', children: children() },
      { text: 'About Local Public Health', stackedText: 'About local public health', children: children() },
      { text: 'Hiring', children: children(), expanded: true }
    ]
  }
};
