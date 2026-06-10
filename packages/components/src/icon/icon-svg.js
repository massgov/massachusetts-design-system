export function normalizeIconSvg(svg = '') {
  let nextSvg = svg.trim();

  if (nextSvg && !/\sfocusable=/.test(nextSvg)) {
    nextSvg = nextSvg.replace('<svg ', '<svg focusable="false" ');
  }

  return nextSvg;
}
