export const buttonTypes = ['Fill', 'Outline', 'Ghost'];
export const buttonColors = ['Primary', 'Secondary', 'Light', 'Danger'];
export const buttonSizes = ['Regular', 'LG'];
export const buttonIcons = ['', 'arrow-right'];
export const htmlButtonTypes = ['button', 'submit', 'reset'];

export const buttonOptions = {
  color: buttonColors,
  htmlType: htmlButtonTypes,
  icon: buttonIcons,
  size: buttonSizes,
  type: buttonTypes
};

export const buttonDefaults = {
  ariaLabel: '',
  color: 'Primary',
  disabled: false,
  fullWidth: false,
  htmlType: 'button',
  id: '',
  leftIcon: '',
  rightIcon: 'arrow-right',
  size: 'LG',
  text: 'Button',
  type: 'Fill'
};

export const buttonExamples = {
  primary: {
    size: 'Regular'
  },
  secondary: {
    color: 'Secondary',
    text: 'Secondary button'
  },
  disabled: {
    disabled: true,
    text: 'Disabled button'
  }
};
