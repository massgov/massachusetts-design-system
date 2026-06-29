import path from 'node:path';
import { formatHtml } from '../src/shared/format-html.js';

function splitTopLevelCommas(value) {
  const parts = [];
  let currentPart = '';
  let depth = 0;
  let quote = '';

  for (const character of value) {
    if (quote) {
      currentPart += character;

      if (character === quote) {
        quote = '';
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      currentPart += character;
      continue;
    }

    if (character === '(') {
      depth += 1;
      currentPart += character;
      continue;
    }

    if (character === ')') {
      depth -= 1;
      currentPart += character;
      continue;
    }

    if (character === ',' && depth === 0) {
      parts.push(currentPart.trim());
      currentPart = '';
      continue;
    }

    currentPart += character;
  }

  parts.push(currentPart.trim());

  return parts.filter(Boolean);
}

function formatCss(contents) {
  return `${contents
    .trim()
    .split('\n')
    .map((line) => {
      const declarationMatch = line.match(/^(\s*[\w-]+:\s)(.+);$/);

      if (!declarationMatch || line.length <= 100) {
        return line;
      }

      const [, property, value] = declarationMatch;
      const parts = splitTopLevelCommas(value);

      if (parts.length < 2) {
        return line;
      }

      const declarationIndent = property.match(/^\s*/)?.[0] ?? '';
      const valueIndent = `${declarationIndent}  `;

      return [
        property.trimEnd(),
        ...parts.map((part, index) => {
          const punctuation = index === parts.length - 1 ? ';' : ',';
          return `${valueIndent}${part}${punctuation}`;
        })
      ].join('\n');
    })
    .join('\n')}\n`;
}

export function formatGeneratedOutput(destination, contents) {
  const extension = path.extname(destination);

  if (extension === '.html') {
    return formatHtml(contents);
  }

  if (extension === '.css') {
    return formatCss(contents);
  }

  return contents;
}
