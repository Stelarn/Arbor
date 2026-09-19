// components/Inspector.js
window.Inspector = {
  render(item, domainConfig) {
    const drawer = document.getElementById("masterInspectorDrawer");
    const inspTitle = document.getElementById("inspTitle");
    const inspBadge = document.getElementById("inspBadge");
    const inspMeta = document.getElementById("inspMeta");
    const inspActionBtn = document.getElementById("inspActionBtn");
    const drawerSpecPane = document.getElementById("drawerSpecPane");
    const tunedSubtreeTitle = document.getElementById("tunedSubtreeTitle");

    if (!item) {
      drawer.classList.remove("open");
      return;
    }
    drawer.classList.add("open");

    const title = item[domainConfig.primaryKey] || item.name || item.engine;
    inspTitle.textContent = title;
    inspBadge.textContent = item.lineage_type || (item.console_model && item.console_model.badge) || "Verified";
    inspMeta.textContent = `${item.year_display || item.year || item.release_date || ""} • ${item.creator || item.family || item.license || ""}`;

    if (item.url) {
      inspActionBtn.textContent = "Visit Website ↗";
      inspActionBtn.onclick = () => window.open(item.url, "_blank");
    } else {
      inspActionBtn.textContent = "Copy Specs 📋";
      inspActionBtn.onclick = () => {
        navigator.clipboard.writeText(JSON.stringify(item, null, 2));
        inspActionBtn.textContent = "✓ Copied!";
        setTimeout(() => inspActionBtn.textContent = "Copy Specs 📋", 1500);
      };
    }

    let attrHtml = "";
    if (domainConfig.id === "engines") {
      attrHtml = `
        <div style="font-size:0.8rem; line-height:1.45; color:#cbd5e1; background:var(--bg-deep); padding:0.75rem; border-radius:6px; border:1px solid var(--border-subtle);">
          <strong style="color:var(--accent); font-size:0.7rem; text-transform:uppercase; display:block;">Engine Focus:</strong>
          ${item.focus}
        </div>
        <div style="font-size:0.78rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:var(--bg-deep); padding:0.75rem; border-radius:6px; border:1px solid var(--border-subtle);">
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">LANGUAGE:</strong>${item.language}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">MEMORY MODEL:</strong>${item.memory_model}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">THREADING:</strong>${item.threading_model}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">NETWORK:</strong>${item.network_model?.badge}</div>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted);">
          <strong>Example Games:</strong> ${item.games}
        </div>
      `;
    } else if (domainConfig.id === "coding_languages") {
      attrHtml = `
        <div style="font-size:0.8rem; line-height:1.45; color:#cbd5e1; background:var(--bg-deep); padding:0.75rem; border-radius:6px; border:1px solid var(--border-subtle);">
          <strong style="color:var(--accent); font-size:0.7rem; text-transform:uppercase; display:block;">Game Architecture Role:</strong>
          ${item.game_relevance}
        </div>
        <div style="font-size:0.78rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:var(--bg-deep); padding:0.75rem; border-radius:6px; border:1px solid var(--border-subtle);">
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">TYPE SYSTEM:</strong>${item.type_system}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">MEMORY ARCHITECTURE:</strong>${item.memory_model}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">RUNTIME PROFILE:</strong>${item.runtime_profile}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">C FFI:</strong>${item.ffi_status}</div>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted);">
          <strong>Notable Projects:</strong> ${(item.notable_projects || []).join(", ")}
        </div>
      `;
    } else {
      attrHtml = `
        <div style="font-size:0.8rem; line-height:1.45; color:#cbd5e1; background:var(--bg-deep); padding:0.75rem; border-radius:6px; border:1px solid var(--border-subtle);">
          <strong style="color:var(--accent); font-size:0.7rem; text-transform:uppercase; display:block;">Historical Context:</strong>
          ${item.desc}
        </div>
        <div style="font-size:0.78rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:var(--bg-deep); padding:0.75rem; border-radius:6px; border:1px solid var(--border-subtle);">
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">PHYLUM / FAMILY:</strong>${item.family}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">WRITING SYSTEM:</strong>${item.script}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">SPEAKERS:</strong>${item.speakers}</div>
          <div><strong style="color:var(--text-dim); font-size:0.68rem; display:block;">ATTESTED ERA:</strong>${item.year_display || item.year}</div>
        </div>
      `;
    }

    drawerSpecPane.innerHTML = attrHtml;
    tunedSubtreeTitle.textContent = title;
    window.TunedSubtree.render(item, document.getElementById("tunedSubtreeSvg"));
  }
};
