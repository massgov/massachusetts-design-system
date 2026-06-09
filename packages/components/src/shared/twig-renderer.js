import Twig from 'twig';

export function createTwigRenderer(templateSource, getContext = (data) => data) {
  const template = Twig.twig({ data: templateSource });

  return function renderTwig(data = {}) {
    const context = getContext(data);

    if (context === null) {
      return '';
    }

    return template.render(context);
  };
}
