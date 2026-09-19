// views/TreeView.js
const X_START = 1948;
const X_SCALE = 38;
function getX(yr) { return (Math.max(1948, yr) - X_START) * X_SCALE + 60; }

window.TreeView = {
  render(svg, nodes, domainConfig) {
    if (!svg) return;
    svg.innerHTML = "";
    const curYear = window.store.treeYear;

    svg.innerHTML = `
      <defs>
        <marker id="t-direct" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#10b981" /></marker>
        <marker id="t-cross" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#a855f7" /></marker>
        <marker id="t-fork" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#f59e0b" /></marker>
        <marker id="t-inspired" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#3b82f6" /></marker>
      </defs>
    `;

    for (let yr = 1950; yr <= 2026; yr += 10) {
      const x = getX(yr);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x); line.setAttribute("y1", 25); line.setAttribute("x2", x); line.setAttribute("y2", 820);
      line.setAttribute("stroke", "#141c2e"); line.setAttribute("stroke-dasharray", "4,4");
      svg.appendChild(line);

      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txt.setAttribute("x", x); txt.setAttribute("y", 20); txt.setAttribute("fill", "#64748b");
      txt.setAttribute("font-size", "11"); txt.setAttribute("font-family", "monospace"); txt.setAttribute("text-anchor", "middle");
      txt.textContent = yr;
      svg.appendChild(txt);
    }

    const coords = {};
    nodes.forEach((n, idx) => {
      const yr = n.year || (n.release_date ? parseInt(n.release_date) : 2000);
      const x = getX(yr);
      const y = 80 + ((n.track ? (typeof n.track === 'number' ? n.track * 90 : idx % 8 * 85) : ((idx % 8) * 85)));
      coords[n.id || n.engine || n.name] = { x, y, node: n };
    });

    nodes.forEach(child => {
      const cKey = child.id || child.engine || child.name;
      const cC = coords[cKey];
      const childYr = child.year || (child.release_date ? parseInt(child.release_date) : 2000);
      if (!cC || childYr > curYear) return;

      (child.parents || []).forEach(p => {
        const pKey = p.id || p.name;
        const pC = coords[pKey];
        if (!pC) return;
        const parentYr = pC.node.year || (pC.node.release_date ? parseInt(pC.node.release_date) : 2000);
        if (parentYr > curYear) return;

        let color = "#10b981"; let marker = "t-direct"; let dash = "none";
        if (p.rel === "crossbreed") { color = "#a855f7"; marker = "t-cross"; }
        else if (p.rel === "fork") { color = "#f59e0b"; marker = "t-fork"; dash = "5,4"; }
        else if (p.rel === "inspired_by") { color = "#3b82f6"; marker = "t-inspired"; dash = "3,3"; }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const dx = Math.max(35, Math.abs(cC.x - pC.x) * 0.5);
        path.setAttribute("d", `M ${pC.x + 50} ${pC.y} C ${pC.x + 50 + dx} ${pC.y}, ${cC.x - 50 - dx} ${cC.y}, ${cC.x - 50} ${cC.y}`);
        path.setAttribute("stroke", color); path.setAttribute("stroke-width", "1.8"); path.setAttribute("stroke-dasharray", dash);
        path.setAttribute("fill", "none"); path.setAttribute("marker-end", `url(#${marker})`);
        svg.appendChild(path);
      });
    });

    nodes.forEach(n => {
      const key = n.id || n.engine || n.name;
      const c = coords[key];
      if (!c) return;
      const yr = n.year || (n.release_date ? parseInt(n.release_date) : 2000);
      const isBorn = yr <= curYear;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.className = `tree-node-g ${isBorn ? '' : 'faded'}`;
      g.setAttribute("transform", `translate(${c.x - 50}, ${c.y - 14})`);

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", "100"); rect.setAttribute("height", "28"); rect.setAttribute("rx", "5"); rect.setAttribute("fill", "#12192b");

      let strokeCol = "#2e3e60";
      if (n.lineage_type === "Fresh Root") strokeCol = "var(--col-root)";
      else if (n.lineage_type === "Direct Evolution") strokeCol = "var(--col-direct)";
      else if (n.lineage_type === "Crossbreed") strokeCol = "var(--col-cross)";
      else if (n.lineage_type === "Hard Fork") strokeCol = "var(--col-fork)";
      else strokeCol = "var(--col-inspired)";

      rect.setAttribute("stroke", strokeCol); rect.setAttribute("stroke-width", "1.2");

      const tName = document.createElementNS("http://www.w3.org/2000/svg", "text");
      tName.setAttribute("x", "50"); tName.setAttribute("y", "14"); tName.setAttribute("text-anchor", "middle");
      tName.setAttribute("fill", isBorn ? "#f8fafc" : "#64748b"); tName.setAttribute("font-size", "10"); tName.setAttribute("font-weight", "700");
      const nameStr = n.name || n.engine || "";
      tName.textContent = nameStr.length > 13 ? nameStr.slice(0, 12) + "…" : nameStr;

      const tYear = document.createElementNS("http://www.w3.org/2000/svg", "text");
      tYear.setAttribute("x", "50"); tYear.setAttribute("y", "24"); tYear.setAttribute("text-anchor", "middle");
      tYear.setAttribute("fill", "#94a3b8"); tYear.setAttribute("font-size", "8.5"); tYear.setAttribute("font-family", "monospace");
      tYear.textContent = n.year_display || n.year || (n.release_date ? n.release_date.split("-")[0] : "");

      g.appendChild(rect); g.appendChild(tName); g.appendChild(tYear);
      g.onclick = () => window.store.setInspectorItem(n);
      svg.appendChild(g);
    });
  }
};
