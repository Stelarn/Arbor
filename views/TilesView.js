// views/TilesView.js
window.TilesView = {
  render(container, items, domainConfig) {
    container.innerHTML = "";
    if (!items || items.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-dim);">No items match your filters.</div>`;
      return;
    }

    items.forEach(item => {
      const title = item[domainConfig.primaryKey] || item.name || item.engine;
      const isStarred = window.store.starred.has(title);
      const card = document.createElement("div");
      card.className = "item-card";

      if (domainConfig.id === "engines") {
        card.innerHTML = `
          <div class="item-title-row">
            <span class="item-title">${item.engine}</span>
            <button class="star-btn ${isStarred ? 'starred' : ''}">★</button>
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted); line-height:1.35;">${item.focus}</div>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            <span class="badge-status b-net-aaa">${item.network_model?.badge}</span>
            <span class="badge-status b-con-t1">${item.console_model?.badge}</span>
            <span class="tag-pill">${item.language}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-dim); margin-top:auto; padding-top:0.4rem; border-top:1px solid var(--border-subtle);">
            <span><strong>Share:</strong> ${item.share.split(' ')[0]}</span>
            <span><strong>Update:</strong> ${item.last_update.split(' ')[0]}</span>
          </div>
        `;
      } else if (domainConfig.id === "coding_languages") {
        card.innerHTML = `
          <div class="item-title-row">
            <span class="item-title">${item.name}</span>
            <span style="font-family:monospace; color:var(--accent); font-size:0.75rem;">${item.year}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${item.creator}</div>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            <span class="badge-lineage ${item.badge_class}">${item.lineage_type}</span>
            <span class="tag-pill">${item.paradigms[0]}</span>
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted); line-height:1.35;">${item.game_relevance}</div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-dim); margin-top:auto; padding-top:0.4rem; border-top:1px solid var(--border-subtle);">
            <span>${item.memory_model.split(' ')[0]}</span>
            <span style="color:var(--accent);">Inspect ↗</span>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="item-title-row">
            <span class="item-title">${item.name}</span>
            <span style="font-family:monospace; color:var(--accent); font-size:0.75rem;">${item.year_display || item.year}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${item.family}</div>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            <span class="badge-lineage ${item.badge_class}">${item.lineage_type}</span>
            <span class="tag-pill">${item.script}</span>
          </div>
          <div style="font-size:0.78rem; color:var(--text-muted); line-height:1.35;">${item.desc}</div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-dim); margin-top:auto; padding-top:0.4rem; border-top:1px solid var(--border-subtle);">
            <span>${item.speakers}</span>
            <span style="color:var(--accent);">Inspect ↗</span>
          </div>
        `;
      }

      card.onclick = (e) => {
        if (e.target.classList.contains("star-btn")) return;
        window.store.setInspectorItem(item);
      };

      const starBtn = card.querySelector(".star-btn");
      if (starBtn) {
        starBtn.onclick = (e) => {
          e.stopPropagation();
          window.store.toggleStar(title);
        };
      }
      container.appendChild(card);
    });
  }
};
