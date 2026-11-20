const initialized = new WeakSet();

/** Wire up disclosures after inserting the Twig markup; call the returned function before removal. */
export function initMainNavigation(root = document) {
  const navs = [...root.querySelectorAll('[data-mds-main-navigation]')];
  if (root.matches?.('[data-mds-main-navigation]')) navs.unshift(root);
  const cleanups = [];

  for (const nav of navs) {
    if (initialized.has(nav)) continue;
    initialized.add(nav);
    const doc = nav.ownerDocument;
    const win = doc.defaultView;
    const abort = new win.AbortController();
    const { signal } = abort;
    const media = win.matchMedia('(max-width: 768px)');
    const hover = win.matchMedia('(hover: hover)');
    const buttons = [...nav.querySelectorAll('.mds-main-navigation__parent[aria-controls]')];
    const initialStates = buttons.map(button => button.getAttribute('aria-expanded') === 'true');
    let keyboard = false;
    const stacked = () => nav.classList.contains('mds-main-navigation--stacked') || media.matches;

    function setExpanded(button, expanded) {
      button.setAttribute('aria-expanded', String(expanded));
      button.nextElementSibling.hidden = !expanded;
    }

    function closeOthers(except) {
      for (const button of buttons) if (button !== except) setExpanded(button, false);
    }

    function open(button) {
      closeOthers(button);
      setExpanded(button, true);
      const submenu = button.nextElementSibling;
      submenu.style.removeProperty('inset-inline-start');
      submenu.style.removeProperty('inset-inline-end');
      if (!stacked() && submenu.getBoundingClientRect().right > win.innerWidth) {
        submenu.style.insetInlineStart = 'auto';
        submenu.style.insetInlineEnd = '0';
      }
    }

    nav.addEventListener('click', event => {
      const button = event.target.closest('.mds-main-navigation__parent[aria-controls]');
      if (button) {
        if (button.getAttribute('aria-expanded') === 'true') setExpanded(button, false);
        else open(button);
      } else if (!stacked() && event.target.closest('a')) {
        const parent = event.target.closest('.mds-main-navigation__item')?.querySelector('button');
        closeOthers();
        parent?.focus();
      }
    }, { signal });

    nav.addEventListener('keydown', event => {
      keyboard = true;
      const button = event.target.closest('.mds-main-navigation__item')?.querySelector('button');
      if (!button) return;
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setExpanded(button, false);
        button.focus();
      } else if (event.key === 'ArrowDown' && event.target === button) {
        event.preventDefault();
        open(button);
        button.nextElementSibling.querySelector('a')?.focus();
      }
    }, { signal });

    doc.addEventListener('pointerdown', event => {
      keyboard = false;
      if (!stacked() && !nav.contains(event.target)) {
        const parent = buttons.find(button => button.parentElement.contains(doc.activeElement));
        closeOthers();
        parent?.focus();
      }
    }, { signal });

    doc.addEventListener('focusin', event => {
      if (stacked()) return;
      const item = nav.contains(event.target) ? event.target.closest('.mds-main-navigation__item') : null;
      closeOthers(item?.querySelector('button'));
    }, { signal });

    for (const item of nav.querySelectorAll('.mds-main-navigation__item')) {
      const button = item.querySelector('button');
      item.addEventListener('pointerenter', event => {
        if (stacked() || !hover.matches || event.pointerType !== 'mouse') return;
        if (keyboard && nav.contains(doc.activeElement) && !item.contains(doc.activeElement)) return;
        if (button) open(button);
        else closeOthers();
      }, { signal });
      item.addEventListener('pointerleave', () => {
        if (!stacked() && button && !(keyboard && item.contains(doc.activeElement))) setExpanded(button, false);
      }, { signal });
    }

    cleanups.push(() => {
      abort.abort();
      buttons.forEach((button, index) => setExpanded(button, initialStates[index]));
      initialized.delete(nav);
    });
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
