function addSvgClass(svg, className) {
  if (!className) {
    return svg;
  }

  if (/\sclass=/.test(svg)) {
    return svg.replace(/\sclass=(["'])(.*?)\1/, (_, quote, classes) => {
      const classList = new Set(classes.split(/\s+/).filter(Boolean));

      for (const nextClass of className.split(/\s+/).filter(Boolean)) {
        classList.add(nextClass);
      }

      return ` class=${quote}${Array.from(classList).join(' ')}${quote}`;
    });
  }

  return svg.replace('<svg ', `<svg class="${className}" `);
}

export function normalizeIconSvg(svg = '') {
  let nextSvg = svg.trim();

  if (nextSvg && !/\sfocusable=/.test(nextSvg)) {
    nextSvg = nextSvg.replace('<svg ', '<svg focusable="false" ');
  }

  if (nextSvg && !/\saria-hidden=/.test(nextSvg)) {
    nextSvg = nextSvg.replace('<svg ', '<svg aria-hidden="true" ');
  }

  nextSvg = addSvgClass(nextSvg, 'mds-icon');

  return nextSvg;
}
