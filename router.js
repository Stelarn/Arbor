// router.js - URL Hash Router
window.Router = {
  init() {
    window.addEventListener("hashchange", () => this.handleHash());
    this.handleHash();
  },
  handleHash() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (!hash || hash === "home") {
      window.store.setDomain("home", "tiles");
      return;
    }
    const parts = hash.split("/");
    window.store.setDomain(parts[0], parts[1] || "tiles");
  },
  navigate(domain, view = "tiles") {
    if (domain === "home") window.location.hash = "#home";
    else window.location.hash = `#${domain}/${view}`;
  }
};
