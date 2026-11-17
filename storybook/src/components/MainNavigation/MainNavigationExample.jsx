import { useEffect, useId, useMemo, useRef } from 'react';
import '@massds/mds-components/main-navigation.css';
import '@massds/mds-components/button.css';
import '@massds/mds-components/utility-nav.css';
import '@massds/mds-components/inline-message.css';
import { mainNavigationDefaults } from '../../../../packages/components/src/main-navigation/main-navigation.data.js';
import { initMainNavigation } from '../../../../packages/components/src/main-navigation/main-navigation.js';
import { renderInlineMessage, renderMainNavigation, renderUtilityNav } from '../../utils/component-renderers.js';
import './main-navigation.examples.css';

const exampleItems = count => Array.from({ length: count }, (_, index) => index === 2
  ? { text: 'Menu item', href: '#' }
  : { text: 'Menu item', children: Array.from({ length: 3 }, () => ({ text: 'Submenu item', href: '#' })) });

export function MainNavigationExample({ itemCount = 3, utility = null }) {
  const ref = useRef(null);
  const id = `main-navigation-example-${useId()}`;
  const html = useMemo(() => {
    const navigation = renderMainNavigation({ ...mainNavigationDefaults, id, items: exampleItems(itemCount) });
    if (!utility) return navigation;
    return renderUtilityNav({
      navigationType: utility,
      homeLinkText: 'Mass.gov',
      homeLinkHref: 'https://www.mass.gov/',
      homeLinkAriaLabel: 'Go to Mass.gov',
      actionButtons: []
    })
      + (utility === 'menu'
        ? `<div id="${id}" class="mds-main-navigation-example__menu" hidden>${renderMainNavigation({ ...mainNavigationDefaults, id: `${id}-stacked`, variant: 'Stacked', items: exampleItems(itemCount) })}</div>`
        : navigation);
  }, [id, itemCount, utility]);
  useEffect(() => {
    const cleanup = initMainNavigation(ref.current);
    const root = ref.current;
    const button = root.querySelector('.mds-utility-nav__button--menu');
    const panel = root.querySelector(`#${CSS.escape(id)}`);
    if (!button || !panel) return cleanup;
    button.setAttribute('aria-controls', id);
    const setOpen = open => {
      panel.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    const toggle = () => setOpen(panel.hidden);
    const close = event => {
      if (event.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        button.focus();
      }
    };
    button.addEventListener('click', toggle);
    root.addEventListener('keydown', close);
    return () => {
      cleanup();
      button.removeEventListener('click', toggle);
      root.removeEventListener('keydown', close);
    };
  }, [html, id]);
  return <div ref={ref} className="sb-unstyled mds-main-navigation-example" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MainNavigationPlaygroundMessage() {
  return <div className="sb-unstyled" dangerouslySetInnerHTML={{ __html: renderInlineMessage({
    type: 'Informative',
    variant: 'Neutral',
    heading: 'View the full width demo in the playground',
    description: 'The width of the menus shown here in Storybook are constrained by the content container, <a href="?path=/story/components-main-navigation--playground" target="_top">view the full width demo in the playground</a> to see the responsive behavior.'
  }) }} />;
}
