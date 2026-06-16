let popupMenu = {
  init: function () {
    let popupMenuTriggers = document.querySelectorAll(".mds-popup-menu-trigger");
    popupMenuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", function () {
        let popupMenu = this.nextElementSibling;
        if (popupMenu.style.display === "flex") {
          popupMenu.style.display = "none";
        } else {
          popupMenu.style.display = "flex";
        }
      });
    });

    document.body.addEventListener("keydown", function(event) {
      if (event.key === "Escape") {
        let openPopupMenus = document.querySelectorAll(".mds-popup-menu[style='display: flex;']");
        openPopupMenus.forEach((menu) => {
          menu.style.display = "none";
        });
      }
    });
  },
};
