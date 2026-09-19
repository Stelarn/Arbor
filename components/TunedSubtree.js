// components/TunedSubtree.js
window.TunedSubtree = {
  render(node, svg) {
    if (!svg || !node) return;
    svg.innerHTML = "";

    const parents = node.parents || [];
    const children = node.children || [];

    const width = Math.max(680, Math.max(parents.length, children.length, 1) * 160);
    const height = 260;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    const focusX = width / 2;
    const focusY = height / 2;

    svg.innerHTML = `
      <defs>
        <marker id="sub-direct" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#10b981" /></marker>
        <marker id="sub-cross" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#a855f7" /></marker>
        <marker id="sub-fork" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#f59e0b" /></marker>
        <marker id="sub-inspired" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><polygon points="0 0, 7 3.5, 0 7" fill="#3b82f6" /></marker>
      </defs>
    `;

    parents.forEach((p, idx) => {
      const x = parents.length === 1 ? focusX : (focusX - 180 + (idx * (360 / Math.max(1, parents.length - 1))));
      const y = 45;
      let col = "#10b981"; let mk = "sub-direct";
      if (p.rel === "crossbreed") { col = "#a855f7"; mk = "sub-cross"; }
      else if (p.rel === "fork") { col = "#f59e0b"; mk = "sub-fork"; }
      else if (p.rel === "inspired_by") { col = "#3b82f6"; mk = "sub-inspired"; }

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x} ${y + 18} C ${x} ${focusY - 35}, ${focusX} ${focusY - 35}, ${focusX} ${focusY - 20}`);
      path.setAttribute("stroke", col); path.setAttribute("stroke-width", "2"); path.setAttribute("fill", "none");
      path.setAttribute("marker-end", `url(#${mk})`);
      svg.appendChild(path);
      svg.appendChild(this.createPill(p.name || p.id, "", x, y, false));
    });

    svg.appendChild(this.createPill(node.name || node.engine, node.year_display || node.year || "", focusX, focusY, true));

    children.forEach((c, idx) => {
      const x = children.length === 1 ? focusX : (focusX - 220 + (idx * (440 / Math.max(1, children.length - 1))));
      const y = 215;
      let col = "#10b981"; let mk = "sub-direct";
      if (c.rel === "crossbreed") { col = "#a855f7"; mk = "sub-cross"; }
      else if (c.rel === "fork") { col = "#f59e0b"; mk = "sub-fork"; }
      else if (c.rel === "inspired_by") { col = "#3b82f6"; mk = "sub-inspired"; }

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${focusX} ${focusY + 20} C ${focusX} ${focusY + 35}, ${x} ${focusY + 35}, ${x} ${y - 18}`);
      path.setAttribute("stroke", col); path.setAttribute("stroke-width", "2"); path.setAttribute("fill", "none");
      path.setAttribute("marker-end", `url(#${mk})`);
      svg.appendChild(path);
      svg.appendChild(this.createPill(c.name || c.id, "", x, y, false));
    });
  },

  createPill(name, year, x, y, isFocus) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.style.cursor = "pointer";
    g.setAttribute("transform", `translate(${x - 60}, ${y - 16})`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "120"); rect.setAttribute("height", "32"); rect.setAttribute("rx", "5");
    rect.setAttribute("fill", isFocus ? "#1e2e4d" : "#111827");
    rect.setAttribute("stroke", isFocus ? "#38bdf8" : "#2e3e60"); rect.setAttribute("stroke-width", isFocus ? "2" : "1");

    const tName = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tName.setAttribute("x", "60"); tName.setAttribute("y", "16"); tName.setAttribute("text-anchor", "middle");
    tName.setAttribute("fill", isFocus ? "#38bdf8" : "#f8fafc"); tName.setAttribute("font-size", "10.5"); tName.setAttribute("font-weight", "700");
    tName.textContent = name.length > 14 ? name.slice(0, 13) + "…" : name;

    const tYear = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tYear.setAttribute("x", "60"); tYear.setAttribute("y", "26"); tYear.setAttribute("text-anchor", "middle");
    tYear.setAttribute("fill", "#94a3b8"); tYear.setAttribute("font-size", "8.5"); tYear.setAttribute("font-family", "monospace");
    tYear.textContent = year;

    g.appendChild(rect); g.appendChild(tName); g.appendChild(tYear);
    return g;
  }
};
