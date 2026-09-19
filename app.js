// app.js - Orchestrator (zero-CORS file:// compatible)
class App {
  constructor() {
    this.datasets = {};
    this.init();
  }

  async init() {
    this.cacheDom();
    this.bindEvents();

    await this.loadAllDatasets();
    window.store.subscribe(() => this.render());
    window.Router.init();
  }

  cacheDom() {
    this.appContent = document.getElementById("appContent");
    this.breadcrumbs = document.getElementById("breadcrumbs");
    this.headerSearchInput = document.getElementById("headerSearchInput");
    this.viewModeGroup = document.getElementById("viewModeGroup");
    this.exportCsvBtn = document.getElementById("exportCsvBtn");
    this.inspCloseBtn = document.getElementById("inspCloseBtn");
  }

  bindEvents() {
    this.inspCloseBtn.onclick = () => window.store.closeInspector();
    this.headerSearchInput.oninput = (e) => window.store.setSearch(e.target.value.trim());

    this.viewModeGroup.querySelectorAll(".view-btn").forEach(btn => {
      btn.onclick = () => window.Router.navigate(window.store.domain, btn.dataset.view);
    });

    this.exportCsvBtn.onclick = () => this.exportCsv();

    window.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== this.headerSearchInput) {
        e.preventDefault();
        this.headerSearchInput.focus();
      }
      if (e.key === "Escape") window.store.closeInspector();
    });
  }

  async loadAllDatasets() {
    for (const [id, config] of Object.entries(window.DOMAINS)) {
      try {
        const res = await fetch(config.dataFile);
        this.datasets[id] = await res.json();
      } catch (err) {
        if (window[`DATA_${id}`]) this.datasets[id] = window[`DATA_${id}`];
      }
    }
  }

  render() {
    this.updateHeader();

    if (window.store.domain === "home") {
      this.renderHomepage();
    } else {
      this.renderWorkbench();
    }

    if (window.store.activeInspectorItem) {
      const config = window.DOMAINS[window.store.domain] || window.DOMAINS.engines;
      window.Inspector.render(window.store.activeInspectorItem, config);
    } else {
      document.getElementById("masterInspectorDrawer").classList.remove("open");
    }
  }

  updateHeader() {
    if (window.store.domain === "home") {
      this.breadcrumbs.innerHTML = `<span class="crumb-active">⚡ Topic Hub</span>`;
      this.headerSearchInput.placeholder = "Search topics...";
      this.viewModeGroup.style.display = "none";
      this.exportCsvBtn.style.display = "none";
    } else {
      const config = window.DOMAINS[window.store.domain];
      const viewMap = { tiles: "🗂️ Tiles", list: "☰ List", tree: "🌳 Lineage & Evolution Tree" };

      this.breadcrumbs.innerHTML = `
        <span class="crumb-link" onclick="window.Router.navigate('home')">⚡ Hub</span>
        <span class="crumb-sep">/</span>
        <span class="crumb-link" onclick="window.Router.navigate('${config.id}', '${window.store.view}')">${config.icon} ${config.label}</span>
        <span class="crumb-sep">/</span>
        <span class="crumb-active">${viewMap[window.store.view] || window.store.view}</span>
      `;

      this.headerSearchInput.placeholder = `Search in ${config.label}... (Press '/')`;
      this.viewModeGroup.style.display = "flex";
      this.exportCsvBtn.style.display = "inline-flex";

      this.viewModeGroup.querySelectorAll(".view-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === window.store.view);
      });
    }
  }

  renderHomepage() {
    const domainsList = Object.values(window.DOMAINS);
    const q = window.store.search.toLowerCase();
    const filtered = domainsList.filter(d => !q || d.label.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q));

    this.appContent.innerHTML = `
      <div class="home-hub-screen">
        <div class="home-hero">
          <div>
            <h1>Developer Knowledge Hub</h1>
            <p>Select a topic to explore in <strong>Tiles</strong>, <strong>List</strong>, or <strong>Lineage & Evolution Tree</strong>.</p>
          </div>
          <div class="btn-group">
            <button id="hubTilesToggle" class="btn ${window.store.homeView === 'tiles' ? 'active' : ''}">🗂️ Topic Tiles</button>
            <button id="hubListToggle" class="btn ${window.store.homeView === 'list' ? 'active' : ''}">☰ Topic List</button>
          </div>
        </div>
        <div id="hubTilesContainer" class="topic-tiles-grid" style="display:${window.store.homeView === 'tiles' ? 'grid' : 'none'};"></div>
        <div id="hubListContainer" class="topic-list-view" style="display:${window.store.homeView === 'list' ? 'flex' : 'none'};"></div>
      </div>
    `;

    const tilesCont = document.getElementById("hubTilesContainer");
    const listCont = document.getElementById("hubListContainer");

    filtered.forEach(d => {
      const dataObj = this.datasets[d.id] || { items: [] };
      const count = (dataObj.items || []).length || (d.id === "engines" ? 75 : (d.id === "coding_languages" ? 43 : 15));

      const card = document.createElement("div");
      card.className = "topic-card";
      card.innerHTML = `
        <div class="topic-card-top">
          <span class="topic-icon-badge">${d.icon}</span>
          <span class="topic-count-pill">${count} Entries</span>
        </div>
        <div>
          <h3>${d.label}</h3>
          <p class="topic-tagline">${d.tagline}</p>
        </div>
        <div style="font-size:0.75rem; color:var(--text-dim); font-family:monospace;">Era: ${d.era}</div>
        <div class="topic-card-actions">
          <button class="btn btn-primary" onclick="event.stopPropagation(); window.Router.navigate('${d.id}', 'tiles')">🗂️ Tiles</button>
          <button class="btn" onclick="event.stopPropagation(); window.Router.navigate('${d.id}', 'list')">☰ List</button>
          <button class="btn" onclick="event.stopPropagation(); window.Router.navigate('${d.id}', 'tree')">🌳 Tree</button>
        </div>
      `;
      card.onclick = () => window.Router.navigate(d.id, "tiles");
      tilesCont.appendChild(card);

      const row = document.createElement("div");
      row.className = "topic-list-row";
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:1rem;">
          <span style="font-size:1.6rem;">${d.icon}</span>
          <div>
            <strong style="color:var(--text-main); font-size:1.05rem;">${d.label}</strong>
            <div style="font-size:0.78rem; color:var(--text-muted);">${d.tagline}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:1.25rem;">
          <span class="topic-count-pill">${count} Entries</span>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-primary" onclick="event.stopPropagation(); window.Router.navigate('${d.id}', 'tiles')">🗂️ Tiles</button>
            <button class="btn" onclick="event.stopPropagation(); window.Router.navigate('${d.id}', 'list')">☰ List</button>
            <button class="btn" onclick="event.stopPropagation(); window.Router.navigate('${d.id}', 'tree')">🌳 Tree</button>
          </div>
        </div>
      `;
      row.onclick = () => window.Router.navigate(d.id, "tiles");
      listCont.appendChild(row);
    });

    document.getElementById("hubTilesToggle").onclick = () => window.store.setHomeView("tiles");
    document.getElementById("hubListToggle").onclick = () => window.store.setHomeView("list");
  }

  renderWorkbench() {
    const config = window.DOMAINS[window.store.domain];
    const dataObj = this.datasets[window.store.domain] || { items: [], tree: [] };
    const items = dataObj.items || [];
    const treeNodes = dataObj.tree || items;

    this.appContent.innerHTML = `
      <div class="topic-workbench" style="display:flex;">
        <aside id="wbSidebar" class="workbench-sidebar" style="display:${window.store.view === 'tree' ? 'none' : 'flex'};">
          <div id="wbFilterContainer"></div>
          <button id="wbResetBtn" class="btn" style="width:100%; justify-content:center; margin-top:auto;">🔄 Reset Filters</button>
        </aside>
        <main class="workbench-viewport">
          <div id="wbTilesView" class="items-tiles-grid" style="display:${window.store.view === 'tiles' ? 'grid' : 'none'};"></div>
          <div id="wbTableView" class="items-table-wrap" style="display:${window.store.view === 'list' ? 'block' : 'none'};">
            <table>
              <thead id="wbTableHead"></thead>
              <tbody id="wbTableBody"></tbody>
            </table>
          </div>
          <div id="wbTreeView" class="items-tree-wrap" style="display:${window.store.view === 'tree' ? 'flex' : 'none'};">
            <div class="tree-scrubber-bar">
              <button id="wbPlayBtn" class="btn btn-primary" style="padding:0.35rem 0.8rem;">▶ Play</button>
              <div style="font-weight:700; font-family:monospace; font-size:1.05rem; color:var(--accent); min-width:85px;" id="wbYearLabel">Year: ${window.store.treeYear}</div>
              <div class="scrub-wrap">
                <input type="range" id="wbSlider" class="scrub-slider" min="1949" max="2026" value="${window.store.treeYear}">
                <div class="scrub-ticks">
                  <span>1949</span><span>1960</span><span>1970</span><span>1980</span><span>1990</span><span>2000</span><span>2010</span><span>2020</span><span>2026</span>
                </div>
              </div>
              <div class="tree-legend">
                <div class="legend-item"><span class="legend-dot" style="background:var(--col-root);"></span> Root</div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--col-direct);"></span> Direct</div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--col-cross);"></span> Crossbreed</div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--col-fork);"></span> Fork</div>
                <div class="legend-item"><span class="legend-dot" style="background:var(--col-inspired);"></span> Inspired</div>
              </div>
            </div>
            <div class="tree-canvas-scroll">
              <svg id="wbTreeSvg" class="tree-svg-interactive" width="3100" height="850"></svg>
            </div>
          </div>
        </main>
      </div>
    `;

    this.renderSidebarFilters(config);
    const filtered = this.getFilteredItems(items, config);

    if (window.store.view === "tiles") {
      window.TilesView.render(document.getElementById("wbTilesView"), filtered, config);
    } else if (window.store.view === "list") {
      window.ListView.render(document.getElementById("wbTableHead"), document.getElementById("wbTableBody"), filtered, config);
    } else if (window.store.view === "tree") {
      window.TreeView.render(document.getElementById("wbTreeSvg"), treeNodes, config);
      window.TimelineScrubber.bind("wbSlider", "wbYearLabel", "wbPlayBtn", () => {
        window.TreeView.render(document.getElementById("wbTreeSvg"), treeNodes, config);
      });
    }
  }

  renderSidebarFilters(config) {
    const container = document.getElementById("wbFilterContainer");
    if (!container) return;
    container.innerHTML = "";

    const quickDiv = document.createElement("div");
    quickDiv.className = "filter-section";
    quickDiv.innerHTML = `
      <div class="filter-title">Quick Views</div>
      <div class="chips-group">
        <span class="chip ${window.store.filters.quick === 'starred' ? 'active' : ''}" data-type="quick" data-val="starred">★ Starred (${window.store.starred.size})</span>
        <span class="chip ${!window.store.filters.quick ? 'active' : ''}" data-type="quick" data-val="all">All Entries</span>
      </div>
    `;
    container.appendChild(quickDiv);

    (config.filterFacets || []).forEach(facet => {
      const div = document.createElement("div");
      div.className = "filter-section";
      div.innerHTML = `
        <div class="filter-title">${facet.label}</div>
        <div class="chips-group">
          ${facet.options.map(opt => `
            <span class="chip ${window.store.filters[facet.id] === opt ? 'active' : ''}" data-type="${facet.id}" data-val="${opt}">${opt}</span>
          `).join("")}
        </div>
      `;
      container.appendChild(div);
    });

    container.querySelectorAll(".chip").forEach(chip => {
      chip.onclick = () => {
        const type = chip.dataset.type;
        const val = chip.dataset.val;
        if (type === "quick") window.store.setFilter("quick", val === "all" ? null : "starred");
        else window.store.setFilter(type, val);
      };
    });

    document.getElementById("wbResetBtn").onclick = () => window.store.resetFilters();
  }

  getFilteredItems(items, config) {
    const q = window.store.search.toLowerCase();
    return items.filter(item => {
      const title = (item[config.primaryKey] || item.name || item.engine || "").toLowerCase();
      if (window.store.filters.quick === "starred" && !window.store.starred.has(title)) return false;

      for (const [key, val] of Object.entries(window.store.filters)) {
        if (key === "quick" || !val) continue;
        if (!JSON.stringify(item).toLowerCase().includes(val.toLowerCase())) return false;
      }

      if (q && !title.includes(q) && !JSON.stringify(item).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  exportCsv() {
    const config = window.DOMAINS[window.store.domain];
    const dataObj = this.datasets[window.store.domain] || { items: [] };
    const items = this.getFilteredItems(dataObj.items, config);
    if (items.length === 0) return alert("No items to export.");

    const cols = config.tableColumns || [];
    const headers = cols.map(c => c.label);
    const rows = items.map(item => cols.map(c => `"${(item[c.key] || '').toString().replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${config.id}_export.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

new App();
