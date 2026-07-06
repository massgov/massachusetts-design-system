let popupMenu = {
  init: function () {
    let popupMenuTriggers = document.querySelectorAll(".mds-popup-menu-trigger");
    let allMenus = document.querySelectorAll(".mds-popup-menu");
    let menuItemSelector = "[role='menuitem']";

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

    let getMenuItems = function (menu) {
      return Array.from(menu.querySelectorAll(menuItemSelector)).filter((item) => {
        return !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true";
      });
    };

    let setActiveMenuItem = function (menu, nextItem) {
      let items = getMenuItems(menu);
      items.forEach((item) => {
        item.setAttribute("tabindex", item === nextItem ? "0" : "-1");
      });
    };

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

    let openMenu = function (menu, focusTarget = "none") {
      if (!menu) {
        return;
      }

      let trigger = menu.dataset.triggerId
        ? document.getElementById(menu.dataset.triggerId)
        : null;

      menu.style.display = "flex";
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

    let closeMenu = function (menu, returnFocus = false) {
      if (!menu) {
        return;
      }

      menu.style.display = "none";

      let items = getMenuItems(menu);
      items.forEach((item) => {
        item.setAttribute("tabindex", "-1");
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
      menu.dataset.triggerId = trigger.id;

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
          openMenu(controlledMenu, "first");
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
          closeMenu(menu, true);
        }
      });
    });

    window.addEventListener("resize", positionOpenMenus);
    window.addEventListener("scroll", positionOpenMenus, true);
  },
};
