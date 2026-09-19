// state.js - Centralized Reactive State & LocalStorage Persistence
class Store {
  constructor() {
    this.domain = "home";
    this.view = "tiles";
    this.homeView = "tiles";
    this.search = "";
    this.filters = {};
    this.sortCol = "default";
    this.sortAsc = false;
    this.treeYear = 2026;
    this.timelapseTimer = null;
    this.activeInspectorItem = null;
    this.starred = new Set(JSON.parse(localStorage.getItem("dev_bench_starred") || "[]"));
    this.notes = JSON.parse(localStorage.getItem("dev_bench_notes") || "{}");
    this.listeners = [];
  }
  subscribe(listener) { this.listeners.push(listener); }
  notify() { this.listeners.forEach(fn => fn(this)); }
  setDomain(domainId, view = "tiles") {
    this.domain = domainId;
    this.view = view;
    this.search = "";
    this.filters = {};
    this.sortCol = "default";
    this.sortAsc = false;
    this.activeInspectorItem = null;
    this.notify();
  }
  setView(view) { this.view = view; this.notify(); }
  setHomeView(mode) { this.homeView = mode; this.notify(); }
  setSearch(q) { this.search = q; this.notify(); }
  setFilter(category, val) {
    if (this.filters[category] === val) delete this.filters[category];
    else this.filters[category] = val;
    this.notify();
  }
  resetFilters() { this.filters = {}; this.search = ""; this.notify(); }
  toggleStar(id) {
    if (this.starred.has(id)) this.starred.delete(id);
    else this.starred.add(id);
    localStorage.setItem("dev_bench_starred", JSON.stringify(Array.from(this.starred)));
    this.notify();
  }
  saveNote(id, text) {
    this.notes[id] = text;
    localStorage.setItem("dev_bench_notes", JSON.stringify(this.notes));
  }
  setInspectorItem(item) { this.activeInspectorItem = item; this.notify(); }
  closeInspector() { this.activeInspectorItem = null; this.notify(); }
}
window.store = new Store();
