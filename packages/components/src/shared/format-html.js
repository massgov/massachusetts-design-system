function splitTagParts(tag) {
  const trimmedTag = tag.trim();
  const match = trimmedTag.match(/^<\/?\s*([^\s/>]+)([\s\S]*?)(\/?)>$/);

  if (!match) {
    return null;
  }

  const [, tagName, rawAttributes, selfClosingSlash] = match;
  const isClosingTag = trimmedTag.startsWith('</');
  const attributes = [];
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>=]+))?/g;
  let attributeMatch;

  while ((attributeMatch = attributePattern.exec(rawAttributes)) !== null) {
    const [, name, value] = attributeMatch;

    attributes.push(value === undefined ? name : `${name}=${value}`);
  }

  return {
    attributes,
    isClosingTag,
    isSelfClosing: selfClosingSlash === '/',
    tagName
  };
}

function formatTag(tag, indent) {
  const tagParts = splitTagParts(tag);

  if (!tagParts || tagParts.isClosingTag || tagParts.attributes.length === 0) {
    return `${indent}${tag.trim()}`;
  }

  const compactTag = `<${tagParts.tagName} ${tagParts.attributes.join(' ')}${tagParts.isSelfClosing ? ' /' : ''}>`;

  if (compactTag.length <= 100 && tagParts.attributes.length <= 2) {
    return `${indent}${compactTag}`;
  }

  const childIndent = `${indent}  `;
  const closingLine = tagParts.isSelfClosing ? `${indent}/>` : `${indent}>`;

  return [
    `${indent}<${tagParts.tagName}`,
    ...tagParts.attributes.map((attribute) => `${childIndent}${attribute}`),
    closingLine
  ].join('\n');
}

function getTagName(tag) {
  return tag.match(/^<\/?\s*([^\s/>]+)/)?.[1] ?? '';
}

function isClosingTag(tag) {
  return /^<\//.test(tag.trim());
}

function isSelfClosingTag(tag) {
  return /\/>$/.test(tag.trim());
}

function isVoidTag(tag) {
  return /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(getTagName(tag));
}

function isMatchingClosingTag(openingTag, closingTag) {
  return isClosingTag(closingTag) && getTagName(openingTag) === getTagName(closingTag);
}

export function formatHtml(contents) {
  if (!contents.trim()) {
    return '';
  }

  const tokens = contents.match(/<!--[\s\S]*?-->|<\/?[^>]+>|[^<]+/g) ?? [];
  const lines = [];
  let depth = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const trimmedToken = token.trim();

    if (!trimmedToken) {
      continue;
    }

    const indent = '  '.repeat(Math.max(depth, 0));

    if (!trimmedToken.startsWith('<')) {
      lines.push(`${indent}${trimmedToken}`);
      continue;
    }

    if (isClosingTag(trimmedToken)) {
      depth -= 1;
      lines.push(formatTag(trimmedToken, '  '.repeat(Math.max(depth, 0))));
      continue;
    }

    const nextToken = tokens[index + 1]?.trim();
    const closingToken = tokens[index + 2]?.trim();

    if (
      nextToken &&
      closingToken &&
      !nextToken.startsWith('<') &&
      isMatchingClosingTag(trimmedToken, closingToken)
    ) {
      lines.push(`${indent}${formatTag(trimmedToken, '').trim()}${nextToken}${formatTag(closingToken, '').trim()}`);
      index += 2;
      continue;
    }

    lines.push(formatTag(trimmedToken, indent));

    if (!isSelfClosingTag(trimmedToken) && !isVoidTag(trimmedToken)) {
      depth += 1;
    }
  }

  return `${lines.join('\n')}\n`;
}
