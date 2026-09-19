// views/ListView.js
window.ListView = {
  render(tableHead, tableBody, items, domainConfig) {
    tableHead.innerHTML = ""; tableBody.innerHTML = "";
    const cols = domainConfig.tableColumns || [];
    const trHead = document.createElement("tr");

    cols.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col.label;
      trHead.appendChild(th);
    });
    tableHead.appendChild(trHead);

    if (!items || items.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${cols.length}" style="text-align:center; padding:2rem; color:var(--text-dim);">No entries found.</td></tr>`;
      return;
    }

    items.forEach(item => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.onclick = () => window.store.setInspectorItem(item);

      cols.forEach(col => {
        const td = document.createElement("td");
        const val = col.key.split(".").reduce((acc, part) => acc && acc[part], item);

        if (col.type === "badge") td.innerHTML = `<span class="tag-pill">${val || ""}</span>`;
        else if (col.type === "lineage-badge") td.innerHTML = `<span class="badge-lineage ${item.badge_class || 'badge-direct'}">${val || ""}</span>`;
        else if (col.type === "net-status") td.innerHTML = `<span class="badge-status b-net-aaa">${val || ""}</span>`;
        else if (col.type === "console-status") td.innerHTML = `<span class="badge-status b-con-t1">${val || ""}</span>`;
        else if (col.type === "array-first") td.textContent = Array.isArray(val) ? val[0] : val;
        else td.textContent = val !== undefined ? val : "";

        if (col.sticky) { td.style.fontWeight = "700"; td.style.color = "var(--accent)"; }
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }
};
