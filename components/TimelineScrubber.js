// components/TimelineScrubber.js
window.TimelineScrubber = {
  bind(sliderId, labelId, playBtnId, onUpdate) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    const playBtn = document.getElementById(playBtnId);
    if (!slider || !label || !playBtn) return;

    slider.value = window.store.treeYear;
    label.textContent = `Year: ${window.store.treeYear}`;

    slider.oninput = (e) => {
      window.store.treeYear = parseInt(e.target.value);
      label.textContent = `Year: ${window.store.treeYear}`;
      onUpdate(window.store.treeYear);
    };

    playBtn.onclick = () => {
      if (window.store.timelapseTimer) {
        clearInterval(window.store.timelapseTimer);
        window.store.timelapseTimer = null;
        playBtn.textContent = "▶ Play";
      } else {
        playBtn.textContent = "⏸ Pause";
        if (window.store.treeYear >= 2026) window.store.treeYear = 1949;

        window.store.timelapseTimer = setInterval(() => {
          window.store.treeYear += 2;
          if (window.store.treeYear > 2026) {
            window.store.treeYear = 2026;
            clearInterval(window.store.timelapseTimer);
            window.store.timelapseTimer = null;
            playBtn.textContent = "▶ Replay";
          }
          slider.value = window.store.treeYear;
          label.textContent = `Year: ${window.store.treeYear}`;
          onUpdate(window.store.treeYear);
        }, 200);
      }
    };
  }
};
