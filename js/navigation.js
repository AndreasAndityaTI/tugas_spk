// ========== NAVIGATION ==========
function goToStep(n) {
  if (n === 2) {
    if (criteria.length < 2) { alert("Minimal 2 kriteria!"); return; }
    initPairwise();
    calculateAHP();
  }
  if (n === 3) {
    if (weights.length === 0) calculateAHP();
  }
  if (n === 4) {
    if (alternatives.length < 2) { alert("Minimal 2 alternatif lokasi!"); return; }
    initDecisionMatrix();
  }
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById("step" + n).classList.add("active");
  document.querySelectorAll(".step-dot").forEach(d => {
    const s = parseInt(d.dataset.step);
    d.classList.remove("active", "done");
    if (s === n) d.classList.add("active");
    else if (s < n) d.classList.add("done");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}