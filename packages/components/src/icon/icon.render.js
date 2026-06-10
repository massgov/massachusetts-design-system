import { createTwigRenderer } from '../shared/twig-renderer.js';
import { iconDefaults, iconOptions } from './icon.data.js';

function normalizeOption(value, options, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const match = options.find((option) => option.toLowerCase() === value.toLowerCase());

  return match === undefined ? fallback : match;
}

function normalizeClassName(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().split(/\s+/).filter(Boolean).join(' ');
}

function normalizeIconName(value, iconSvgMap, fallback) {
  if (value === undefined || value === '') {
    return fallback;
  }

  if (typeof value !== 'string') {
    return '';
  }

  return iconSvgMap[value] === undefined ? '' : value;
}

function ensureSvgAttributes(svg) {
  if (!svg) {
    return '';
  }

  let nextSvg = svg.trim();

  if (!/\sfocusable=/.test(nextSvg)) {
    nextSvg = nextSvg.replace('<svg ', '<svg focusable="false" ');
  }

  return nextSvg;
}

export function normalizeIconData(data = {}, iconSvgMap = {}) {
  const name = normalizeIconName(data.name, iconSvgMap, iconDefaults.name);
  const weight = normalizeOption(data.weight, iconOptions.weight, iconDefaults.weight);
  const weightKey = weight.toLowerCase();
  const svg = iconSvgMap[name]?.[weightKey] ?? iconSvgMap[name]?.regular ?? '';

  return {
    ...iconDefaults,
    ...data,
    ariaLabel: typeof data.ariaLabel === 'string' ? data.ariaLabel : iconDefaults.ariaLabel,
    className: normalizeClassName(data.className),
    decorative: data.decorative !== false,
    name,
    svg: ensureSvgAttributes(svg),
    weight,
    weightKey
  };
}

export function createIconRenderer(templateSource, options = {}) {
  const iconSvgMap = options.iconSvgMap ?? options;

  return createTwigRenderer(templateSource, (data = {}) => {
    const normalizedData = normalizeIconData(data, iconSvgMap);

    if (!normalizedData.svg) {
      return null;
    }

    return normalizedData;
  });
}
