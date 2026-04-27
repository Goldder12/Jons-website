export function initResponsiveNav({ profileTriggerSelector = null } = {}) {
  const body = document.body;
  const params = new URLSearchParams(window.location.search);
  const currentKey = params.get("panel") === "profile"
    ? "profile"
    : (body.dataset.navCurrent || "dashboard");

  document.querySelectorAll("[data-nav-item]").forEach((item) => {
    const itemKey = item.getAttribute("data-nav-item");
    const isActive = itemKey === currentKey;

    item.classList.toggle("is-active", isActive);
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-current", isActive ? "page" : "false");
  });

  if (currentKey === "profile" && profileTriggerSelector) {
    const trigger = document.querySelector(profileTriggerSelector);
    if (trigger instanceof HTMLElement) {
      window.setTimeout(() => {
        trigger.click();
      }, 0);
    }
  }
}
