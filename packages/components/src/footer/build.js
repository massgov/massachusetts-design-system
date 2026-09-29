import { createComponentBuild } from '../../scripts/component-build.js';
import { footerExampleData } from './footer.data.js';

export default createComponentBuild({
  componentName: 'footer',
  writeAdditionalOutputs: async ({ renderComponent, writeOutputFile }) => {
    await writeOutputFile('footer.storybook.html', renderComponent(footerExampleData));
  }
});
