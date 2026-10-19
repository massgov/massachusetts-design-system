import { create } from 'storybook/theming';
import stateSeal from '@massds/mds-assets/dist/state-seal/state-seal-white.svg';
import storybookPackage from '../package.json';

const fontBase = '"Noto Sans", Helvetica, Arial, sans-serif';
const fontCode = '"SFMono-Regular", Consolas, "Liberation Mono", monospace';
const documentationVersion = storybookPackage.dependencies['@massds/mds-components'];
export const massdsSiteName = `Massachusetts Design System`;
const brandTitle = `
  <span style='display:flex;align-items:center;gap:8px;'>
    <img src='${stateSeal}' alt='' style='width:40px;height:40px;flex-shrink:0;' />
    <span style='font:600 18px/1.2 ${fontBase};'>
      ${massdsSiteName}
      <span style='font:400 14px/1.2 ${fontBase};'>v${documentationVersion}</span>
    </span>
  </span>
`;

const sharedTheme = {

  colorPrimary: '#14558f',

  appContentBg: '#fdfdfd',
  appPreviewBg: '#fdfdfd',
  appBorderColor: '#dcdcdc',
  appBorderRadius: 4,

  fontBase,
  fontCode,

  inputBg: '#ffffff',
  inputBorder: '#bababa',
  inputTextColor: '#141414',
  inputBorderRadius: 4,

  buttonBg: '#ffffff',
  buttonBorder: '#bababa'
};

export const massdsDocsTheme = create({
  ...sharedTheme,
  base: 'light',

});

export const massdsManagerTheme = create({
  brandTitle,
  brandUrl: '/',
  brandTarget: '_blank',
  base: 'dark',
  appBg: '#0a2b48',
  fontBase,
  fontCode
});

export default massdsDocsTheme;
