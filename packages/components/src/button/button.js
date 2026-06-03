export function initMdsButtons(root = document) {
  const buttons = root.querySelectorAll('[data-mds-button]');

  buttons.forEach((button) => {
    if (button.dataset.mdsButtonInitialized === 'true') {
      return;
    }

    button.dataset.mdsButtonInitialized = 'true';
    button.addEventListener('click', () => {
      if (button.disabled || button.getAttribute('aria-disabled') === 'true') {
        return;
      }

      button.dispatchEvent(
        new CustomEvent('mds:button-click', {
          bubbles: true
        })
      );
    });
  });
}
