import { create } from 'storybook/theming';
import stateSeal from '@massds/mds-assets/dist/state-seal/state-seal-white.svg';

const fontBase = '"Noto Sans", Helvetica, Arial, sans-serif';
const fontCode = '"SFMono-Regular", Consolas, "Liberation Mono", monospace';
const brandTitle = `
  <span style='display:flex;align-items:center;gap:8px;color:#ffffff;font:600 18px/1.2 ${fontBase};'>
    <img src='${stateSeal}' alt='' style='width:40px;height:40px;' />
    <span style='display:block;'>Massachusetts Design System</span>
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
  brandUrl: 'https://www.mass.gov/',
  brandTarget: '_blank',
  base: 'dark',
  appBg: '#0a2b48',
  fontBase,
  fontCode
});

export default massdsDocsTheme;
