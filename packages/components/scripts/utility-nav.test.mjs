import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createTwigRenderer } from '../src/shared/twig-renderer.js';
import * as utilityNavData from '../src/utility-nav/utility-nav.data.js';
import * as buttonData from '../src/button/button.data.js';
import * as iconData from '../src/icon/icon.data.js';
import { normalizeIconSvg } from '../src/icon/icon-svg.js';

const source = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const render = createTwigRenderer(source('../src/utility-nav/utility-nav.twig'), data => ({
  ...utilityNavData,
  ...buttonData,
  ...iconData,
  iconSvgMap: {
    'house-line': { regular: normalizeIconSvg(source('../../assets/src/icons/static/house-line.svg')) }
  },
  ...data
}), {
  includes: {
    'shared/html-attributes.twig': source('../src/shared/html-attributes.twig'),
    'icon.twig': source('../src/icon/icon.twig'),
    'button.twig': source('../src/button/button.twig')
  }
});

test('home-link utility navigation renders the Mass.gov anchor and home icon', () => {
  const html = render({ navigationType: 'home-link', actionButtons: [] });
  assert.match(html, /href="https:\/\/www\.mass\.gov\/"/);
  assert.match(html, /mds-utility-nav__button--home/);
  assert.match(html, /mds-button__label">Mass\.gov<\/span>/);
  assert.match(html, /<svg[\s\S]*?<\/svg>/);
  assert.doesNotMatch(html, /mds-button__label">Button<\/span>/);
});

test('home-link utility navigation respects custom link content', () => {
  const html = render({ navigationType: 'home-link', actionButtons: [], homeLinkText: 'Agency on Mass.gov', homeLinkHref: 'https://www.mass.gov/example', homeLinkAriaLabel: 'Visit the agency' });
  assert.match(html, /href="https:\/\/www\.mass\.gov\/example"/);
  assert.match(html, /mds-button__label">Agency on Mass\.gov<\/span>/);
  assert.match(html, /aria-label="Visit&#x20;the&#x20;agency"/);
});
