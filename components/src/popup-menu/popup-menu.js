let popupMenu = {
  initialized: false,

  /**
   * Initializes popup menu triggers, menu state, positioning, and keyboard/mouse interactions.
   * Prevents duplicate setup if initialization has already run once.
   */
  init: function () {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    
    // rest of the current init function...
    let popupMenuTriggers = document.querySelectorAll(".mds-popup-menu-trigger");
    let allMenus = document.querySelectorAll(".mds-popup-menu");
    let menuItemSelector = "[role='menuitem']";

    /**
     * Sets whether a menu should visibly style focused items even when it was opened with a pointer.
     *
     * @param {HTMLElement} menu - The popup menu whose focus styling mode should be updated.
     * @param {boolean} shouldForceVisibleFocus - Whether the menu should force visible focus styling on its active item.
     */
    let setMenuFocusVisibility = function (menu, shouldForceVisibleFocus) {
      if (!menu) {
        return;
      }

      if (shouldForceVisibleFocus) {
        menu.dataset.forceFocusVisible = "true";
      } else {
        delete menu.dataset.forceFocusVisible;
      }
    };

    /**
     * Reads the spacing values used to position a popup menu within the viewport.
     *
     * @param {HTMLElement} menu - The popup menu element whose computed custom properties should be read.
     * @returns {{offset: number, viewportPadding: number}} The menu offset from its trigger and the viewport edge padding.
     */
    let getMenuMeasurements = function (menu) {
      let menuStyles = window.getComputedStyle(menu);
      return {
        offset: parseFloat(
          menuStyles.getPropertyValue("--mds-popup-menu-offset")
        ) || 4,
        viewportPadding:
          parseFloat(
            menuStyles.getPropertyValue("--mds-popup-menu-viewport-padding")
          ) || 16,
      };
    };

    /**
     * Returns the enabled, interactive menu items for a popup menu.
     *
     * @param {HTMLElement} menu - The popup menu element to query for menu items.
     * @returns {HTMLElement[]} A list of menu items that are not disabled or aria-disabled.
     */
    let getMenuItems = function (menu) {
      return Array.from(menu.querySelectorAll(menuItemSelector)).filter((item) => {
        return !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true";
      });
    };

    /**
     * Updates roving tabindex so only the provided menu item is tabbable.
     *
     * @param {HTMLElement} menu - The popup menu whose items should be updated.
     * @param {HTMLElement} nextItem - The menu item that should receive `tabindex="0"`.
     */
    let setActiveMenuItem = function (menu, nextItem) {
      let items = getMenuItems(menu);
      items.forEach((item) => {
        item.setAttribute("tabindex", item === nextItem ? "0" : "-1");

        if (menu.dataset.forceFocusVisible === "true" && item === nextItem) {
          item.dataset.forceFocusVisible = "true";
        } else {
          delete item.dataset.forceFocusVisible;
        }
      });
    };

    /**
     * Moves focus to a menu item by index, wrapping around when the index is out of range.
     *
     * @param {HTMLElement} menu - The popup menu whose items should be focused.
     * @param {number} index - The target item index before wraparound normalization.
     */
    let focusMenuItem = function (menu, index) {
      let items = getMenuItems(menu);
      if (!items.length) {
        return;
      }

      let normalizedIndex = ((index % items.length) + items.length) % items.length;
      let nextItem = items[normalizedIndex];
      setActiveMenuItem(menu, nextItem);
      nextItem.focus();
    };

    /**
     * Positions an open popup menu relative to its trigger while keeping it inside the viewport.
     *
     * @param {HTMLElement} menu - The popup menu element to position.
     */
    let positionMenu = function (menu) {
      if (!menu || !menu.dataset.triggerId) {
        return;
      }

      let trigger = document.getElementById(menu.dataset.triggerId);
      if (!trigger) {
        return;
      }

      let { offset, viewportPadding } = getMenuMeasurements(menu);
      let viewportWidth = window.innerWidth;
      let viewportHeight = window.innerHeight;
      let maxMenuWidth = Math.min(480, viewportWidth - viewportPadding * 2);

      menu.style.maxWidth = maxMenuWidth + "px";
      menu.style.maxHeight = viewportHeight - viewportPadding * 2 + "px";
      menu.style.left = "0px";
      menu.style.top = "0px";

      let triggerRect = trigger.getBoundingClientRect();
      let menuRect = menu.getBoundingClientRect();

      let left = triggerRect.left;
      let rightAlignedLeft = triggerRect.right - menuRect.width;

      if (left + menuRect.width > viewportWidth - viewportPadding) {
        left = rightAlignedLeft;
      }

      left = Math.min(left, viewportWidth - viewportPadding - menuRect.width);
      left = Math.max(viewportPadding, left);

      let top = triggerRect.bottom + offset;
      let aboveTop = triggerRect.top - offset - menuRect.height;

      if (top + menuRect.height > viewportHeight - viewportPadding) {
        top = aboveTop;
      }

      top = Math.min(top, viewportHeight - viewportPadding - menuRect.height);
      top = Math.max(viewportPadding, top);

      menu.style.left = left + "px";
      menu.style.top = top + "px";
    };

    /**
     * Opens a popup menu, positions it, updates trigger state, and optionally focuses an item.
     *
     * @param {HTMLElement} menu - The popup menu element to open.
     * @param {"none"|"first"|"last"} [focusTarget="none"] - Which menu item should receive focus after opening.
     * @param {boolean} [shouldForceVisibleFocus=false] - Whether the active item should display visible focus styling when opened by pointer.
     */
    let openMenu = function (menu, focusTarget = "none", shouldForceVisibleFocus = false) {
      if (!menu) {
        return;
      }

      let trigger = menu.dataset.triggerId
        ? document.getElementById(menu.dataset.triggerId)
        : null;

      menu.style.display = "flex";
      setMenuFocusVisibility(menu, shouldForceVisibleFocus);
      positionMenu(menu);

      if (trigger) {
        trigger.setAttribute("aria-expanded", "true");
      }

      let items = getMenuItems(menu);
      if (!items.length) {
        return;
      }

      if (focusTarget === "first") {
        focusMenuItem(menu, 0);
      } else if (focusTarget === "last") {
        focusMenuItem(menu, items.length - 1);
      } else {
        setActiveMenuItem(menu, items[0]);
      }
    };

    /**
     * Closes a popup menu, resets item tab stops, and can restore focus to its trigger.
     *
     * @param {HTMLElement} menu - The popup menu element to close.
     * @param {boolean} [returnFocus=false] - Whether focus should move back to the menu trigger after closing.
     */
    let closeMenu = function (menu, returnFocus = false) {
      if (!menu) {
        return;
      }

      menu.style.display = "none";
      setMenuFocusVisibility(menu, false);

      let items = getMenuItems(menu);
      items.forEach((item) => {
        item.setAttribute("tabindex", "-1");
        delete item.dataset.forceFocusVisible;
      });

      if (menu.dataset.triggerId) {
        let trigger = document.getElementById(menu.dataset.triggerId);
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
        }

        if (returnFocus && trigger) {
          trigger.focus();
        }
      }
    };

    /**
     * Closes every currently open menu on the page.
     *
     * @param {boolean} [returnFocus=false] - Whether closed menus should return focus to their trigger.
     */
    let closeOpenMenus = function (returnFocus = false) {
      allMenus.forEach((menu) => {
        if (menu.style.display === "flex") {
          closeMenu(menu, returnFocus);
        }
      });
    };

    popupMenuTriggers.forEach((trigger) => {
      let menuId = trigger.getAttribute("aria-controls");
      let menu = menuId ? document.getElementById(menuId) : null;

      if (!menu) {
        return;
      }

      if (!trigger.id) {
        trigger.id = menuId + "-trigger";
      }

      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-haspopup", "menu");
      menu.dataset.triggerId = trigger.id;

      if (!menu.hasAttribute("aria-labelledby") && !menu.hasAttribute("aria-label")) {
        menu.setAttribute("aria-labelledby", trigger.id);
      }
      getMenuItems(menu).forEach((item) => {
        item.setAttribute("tabindex", "-1");
      });

      trigger.addEventListener("click", function () {
        let controlledMenu = document.getElementById(this.getAttribute("aria-controls"));
        if (!controlledMenu) {
          return;
        }

        if (controlledMenu.style.display === "flex") {
          closeMenu(controlledMenu);
        } else {
          closeOpenMenus();
          openMenu(controlledMenu, "first", true);
        }
      });

      trigger.addEventListener("keydown", function (event) {
        let controlledMenu = document.getElementById(this.getAttribute("aria-controls"));
        if (!controlledMenu) {
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          closeOpenMenus();
          openMenu(controlledMenu, "first");
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          closeOpenMenus();
          openMenu(controlledMenu, "last");
        }
      });
    });

    /**
     * Recomputes the position of every currently open popup menu.
     */
    let positionOpenMenus = function () {
      allMenus.forEach((menu) => {
        if (menu.style.display === "flex") {
          positionMenu(menu);
        }
      });
    };

    allMenus.forEach((menu) => {
      menu.addEventListener("click", function (event) {
        let clickedItem = event.target.closest(menuItemSelector);
        if (clickedItem && menu.contains(clickedItem)) {
          closeMenu(menu);
        }
      });

      menu.addEventListener("keydown", function (event) {
        let items = getMenuItems(menu);
        let currentItem = event.target.closest(menuItemSelector);

        if (!items.length || !currentItem) {
          return;
        }

        let currentIndex = items.indexOf(currentItem);

        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusMenuItem(menu, currentIndex + 1);
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          focusMenuItem(menu, currentIndex - 1);
        }

        if (event.key === "Home") {
          event.preventDefault();
          focusMenuItem(menu, 0);
        }

        if (event.key === "End") {
          event.preventDefault();
          focusMenuItem(menu, items.length - 1);
        }

        if (event.key === "Enter") {
          event.preventDefault();
          currentItem.click();
        }

        if (event.key === "Escape") {
          event.preventDefault();
          closeMenu(menu, true);
        }

        if (event.key === "Tab") {
          closeMenu(menu);
        }
      });

      menu.addEventListener("focusin", function (event) {
        let currentItem = event.target.closest(menuItemSelector);
        if (currentItem) {
          setActiveMenuItem(menu, currentItem);
        }
      });
    });

    document.body.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeOpenMenus(true);
      }
    });

    document.body.addEventListener("click", function (event) {
      let clickedTrigger = event.target.closest(".mds-popup-menu-trigger");

      allMenus.forEach((menu) => {
        if (
          menu.style.display === "flex" &&
          !menu.contains(event.target) &&
          !clickedTrigger
        ) {
          closeMenu(menu, false);
        }
      });
    });

    window.addEventListener("resize", positionOpenMenus);
    window.addEventListener("scroll", positionOpenMenus, true);
  },
};
