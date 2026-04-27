const DESKTOP_MEDIA_QUERY = "(min-width: 992px)";

export function initSidebar({
  sidebarSelector = "[data-sidebar]",
  toggleSelector = "[data-sidebar-toggle]",
  overlaySelector = "[data-sidebar-overlay]"
} = {}) {
  const sidebar = document.querySelector(sidebarSelector);
  const overlay = document.querySelector(overlaySelector);
  const toggles = Array.from(document.querySelectorAll(toggleSelector));
  const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

  if (!sidebar || !toggles.length || !overlay) {
    return {
      open() {},
      close() {},
      toggle() {}
    };
  }

  function syncToggleState(isOpen) {
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function isDesktop() {
    return desktopQuery.matches;
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("show");
    document.body.classList.remove("sidebar-open");
    syncToggleState(false);
  }

  function openSidebar() {
    if (isDesktop()) {
      closeSidebar();
      return;
    }

    sidebar.classList.add("active");
    overlay.classList.add("show");
    document.body.classList.add("sidebar-open");
    syncToggleState(true);
  }

  function toggleSidebar() {
    if (sidebar.classList.contains("active")) {
      closeSidebar();
      return;
    }

    openSidebar();
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggleSidebar();
    });
  });

  overlay.addEventListener("click", () => {
    closeSidebar();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });

  sidebar.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!isDesktop()) {
        closeSidebar();
      }
    });
  });

  const handleViewportChange = () => {
    if (isDesktop()) {
      closeSidebar();
    }
  };

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleViewportChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(handleViewportChange);
  }

  handleViewportChange();

  return {
    open: openSidebar,
    close: closeSidebar,
    toggle: toggleSidebar
  };
}
