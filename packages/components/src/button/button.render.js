import Twig from 'twig';
import {
  buttonDefaults,
  buttonIcons,
  buttonOptions,
  buttonTypes,
  htmlButtonTypes
} from './button.data.js';

function normalizeOption(value, options, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const match = options.find((option) => option.toLowerCase() === value.toLowerCase());

  return match === undefined ? fallback : match;
}

function getLegacyVariantDefaults(variant) {
  if (variant === 'secondary') {
    return {
      color: 'Primary',
      size: buttonDefaults.size,
      type: 'Outline'
    };
  }

  return {
    color: buttonDefaults.color,
    size: buttonDefaults.size,
    type: buttonDefaults.type
  };
}

export function normalizeButtonData(data = {}) {
  const legacyVariantDefaults = getLegacyVariantDefaults(data.variant);
  const legacyHtmlType = htmlButtonTypes.includes(data.type) ? data.type : '';
  const htmlType = htmlButtonTypes.includes(data.htmlType)
    ? data.htmlType
    : legacyHtmlType || buttonDefaults.htmlType;
  const type = normalizeOption(
    legacyHtmlType ? legacyVariantDefaults.type : data.type,
    buttonTypes,
    legacyVariantDefaults.type
  );

  return {
    ...buttonDefaults,
    ...data,
    color: normalizeOption(data.color, buttonOptions.color, legacyVariantDefaults.color),
    htmlType,
    leftIcon: normalizeOption(data.leftIcon, buttonIcons, buttonDefaults.leftIcon),
    rightIcon: normalizeOption(data.rightIcon, buttonIcons, buttonDefaults.rightIcon),
    size: normalizeOption(data.size, buttonOptions.size, legacyVariantDefaults.size),
    text: data.text || data.label || buttonDefaults.text,
    type
  };
}

function renderButtonIcon(renderIcon, iconName, position) {
  if (!iconName) {
    return '';
  }

  return renderIcon({
    className: `mds-button__icon${position === 'left' ? ' mds-button__icon--left' : ''}`,
    decorative: true,
    name: iconName,
    weight: 'Bold'
  });
}

export function createButtonRenderer(templateSource, options = {}) {
  const buttonTemplate = Twig.twig({ data: templateSource });
  const renderIcon = typeof options.renderIcon === 'function' ? options.renderIcon : () => '';

  return function renderButton(data = {}) {
    const normalizedData = normalizeButtonData(data);

    return buttonTemplate.render({
      ...normalizedData,
      leftIconMarkup: renderButtonIcon(renderIcon, normalizedData.leftIcon, 'left'),
      rightIconMarkup: renderButtonIcon(renderIcon, normalizedData.rightIcon, 'right')
    });
  };
}
