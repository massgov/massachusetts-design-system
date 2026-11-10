import { useEffect, useId, useMemo, useRef } from 'react';
import '@massds/mds-components/main-navigation.css';
import { mainNavigationDefaults } from '../../../../packages/components/src/main-navigation/main-navigation.data.js';
import { initMainNavigation } from '../../../../packages/components/src/main-navigation/main-navigation.js';
import { renderMainNavigation } from '../../utils/component-renderers.js';
import './main-navigation.examples.css';

export function MainNavigationExample({ layout = 'desktop' }) {
  const ref = useRef(null);
  const id = `main-navigation-example-${useId()}`;
  const html = useMemo(() => renderMainNavigation({
    ...mainNavigationDefaults,
    id,
    variant: layout === 'desktop' ? 'Responsive' : 'Stacked'
  }), [id, layout]);
  useEffect(() => initMainNavigation(ref.current), [html]);
  return <div
    ref={ref}
    className={`sb-unstyled mds-docs-example-frame mds-main-navigation-example mds-main-navigation-example--${layout}`}
    dangerouslySetInnerHTML={{ __html: html }}
  />;
}
