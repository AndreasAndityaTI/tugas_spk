// ========== DECISION MATRIX ==========
function initDecisionMatrix() {
  const m = alternatives.length;
  const n = criteria.length;
  if (decisionMatrix.length !== m || (decisionMatrix[0] && decisionMatrix[0].length !== n)) {
    // Default realistic scores
    const defaults = [
      [85, 90, 95, 70, 88],  // Pusat Kota - mahal, akses bagus, pasar besar, kompetitif
      [70, 85, 80, 60, 82],  // Perkantoran
      [45, 55, 50, 30, 60],  // Pinggir Kota - murah, akses kurang
      [60, 75, 85, 45, 78]   // Dekat Kampus
    ];
    decisionMatrix = Array.from({ length: m }, (_, i) =>
      Array.from({ length: n }, (_, j) => defaults[i] ? defaults[i][j] || 70 : 70)
    );
  }
  const thead = document.getElementById("decisionHead");
  const tbody = document.getElementById("decisionBody");
  thead.innerHTML = "<tr><th>Lokasi \\ Kriteria</th>" +
    criteria.map(c => `<th class="small">${c.name.substring(0, 20)}<br><span class="badge ${c.type === 'cost' ? 'bg-danger' : 'bg-success'}">${c.type}</span></th>`).join("") + "</tr>";
  tbody.innerHTML = "";
  for (let i = 0; i < m; i++) {
    let row = `<tr><th class="small text-start">${alternatives[i].name}</th>`;
    for (let j = 0; j < n; j++) {
      row += `<td><input type="number" class="form-control form-control-sm text-center" value="${decisionMatrix[i][j]}" 
                onchange="decisionMatrix[${i}][${j}] = parseFloat(this.value) || 0" step="0.1"></td>`;
    }
    row += "</tr>";
    tbody.innerHTML += row;
  }
}

// ========== TOPSIS ==========
function runTOPSIS() {
  // Collect latest values
  const inputs = document.querySelectorAll("#decisionBody input");
  let idx = 0;
  for (let i = 0; i < alternatives.length; i++) {
    for (let j = 0; j < criteria.length; j++) {
      decisionMatrix[i][j] = parseFloat(inputs[idx++].value) || 0;
    }
  }
  if (weights.length === 0) calculateAHP();

  const m = alternatives.length;
  const n = criteria.length;

  // 1. Normalize (vector)
  const norm = Array.from({ length: m }, () => Array(n).fill(0));
  const denom = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) denom[j] += decisionMatrix[i][j] ** 2;
    denom[j] = Math.sqrt(denom[j]);
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      norm[i][j] = denom[j] === 0 ? 0 : decisionMatrix[i][j] / denom[j];
    }
  }

  // 2. Weighted normalized
  const weighted = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      weighted[i][j] = norm[i][j] * weights[j];
    }
  }

  // 3. Ideal Positive (A+) & Ideal Negative (A-)
  const idealPos = Array(n).fill(0);
  const idealNeg = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    const col = weighted.map(r => r[j]);
    if (criteria[j].type === "benefit") {
      idealPos[j] = Math.max(...col);
      idealNeg[j] = Math.min(...col);
    } else {
      idealPos[j] = Math.min(...col);
      idealNeg[j] = Math.max(...col);
    }
  }

  // 4. Distance D+ and D-
  const dPos = Array(m).fill(0);
  const dNeg = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      dPos[i] += (weighted[i][j] - idealPos[j]) ** 2;
      dNeg[i] += (weighted[i][j] - idealNeg[j]) ** 2;
    }
    dPos[i] = Math.sqrt(dPos[i]);
    dNeg[i] = Math.sqrt(dNeg[i]);
  }

  // 5. Preference value V
  const preference = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    preference[i] = dPos[i] + dNeg[i] === 0 ? 0 : dNeg[i] / (dPos[i] + dNeg[i]);
  }

  // Ranking
  const ranked = alternatives.map((a, i) => ({
    name: a.name,
    dPos: dPos[i],
    dNeg: dNeg[i],
    v: preference[i],
    idx: i
  })).sort((a, b) => b.v - a.v);

  // Display
  const tbody = document.getElementById("resultBody");
  tbody.innerHTML = "";
  ranked.forEach((r, rank) => {
    const badgeClass = rank === 0 ? "rank-1" : rank === 1 ? "rank-2" : rank === 2 ? "rank-3" : "rank-other";
    tbody.innerHTML += `
      <tr>
        <td class="text-center"><span class="rank-badge ${badgeClass}">${rank + 1}</span></td>
        <td class="fw-semibold">${r.name}</td>
        <td>${r.dPos.toFixed(4)}</td>
        <td>${r.dNeg.toFixed(4)}</td>
        <td class="fw-bold text-primary">${r.v.toFixed(4)}</td>
      </tr>`;
  });

  document.getElementById("winnerName").textContent = ranked[0].name;
  document.getElementById("winnerScore").textContent = ranked[0].v.toFixed(4);

  // Chart
  if (rankChart) rankChart.destroy();
  const ctx = document.getElementById("rankChart").getContext("2d");
  rankChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ranked.map(r => r.name),
      datasets: [{
        label: "Preference Value (V)",
        data: ranked.map(r => r.v),
        backgroundColor: ranked.map((_, i) =>
          i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "#3b82f6"
        ),
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Preference Value per Lokasi", font: { size: 14, weight: "600" } }
      },
      scales: {
        y: { beginAtZero: true, max: 1, title: { display: true, text: "V (0–1)" } }
      }
    }
  });

  goToStep(5);
}