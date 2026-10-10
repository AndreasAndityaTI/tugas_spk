// ========== AHP ==========
function initPairwise() {
  const n = criteria.length;
  // Default pairwise yang cukup realistis & konsisten (untuk 5 kriteria)
  // Urutan: Biaya, Akses, Pasar, Persaingan, Infrastruktur
  const defaultPair = [
    [1,   1/3, 1/2, 2,   1  ],
    [3,   1,   2,   4,   3  ],
    [2,   1/2, 1,   3,   2  ],
    [1/2, 1/4, 1/3, 1,   1/2],
    [1,   1/3, 1/2, 2,   1  ]
  ];
  if (n === 5) {
    pairwise = defaultPair.map(row => row.slice());
  } else {
    pairwise = Array.from({ length: n }, () => Array(n).fill(1));
  }
  const thead = document.getElementById("pairwiseHead");
  const tbody = document.getElementById("pairwiseBody");
  thead.innerHTML = "<tr><th></th>" + criteria.map(c => `<th class="small">${c.name.substring(0, 18)}</th>`).join("") + "</tr>";
  tbody.innerHTML = "";
  for (let i = 0; i < n; i++) {
    let row = `<tr><th class="small text-start">${criteria[i].name.substring(0, 18)}</th>`;
    for (let j = 0; j < n; j++) {
      if (i === j) {
        row += `<td><input type="number" class="form-control form-control-sm text-center" value="1" disabled></td>`;
      } else if (i < j) {
        const val = pairwise[i][j];
        row += `<td><input type="number" class="form-control form-control-sm text-center" min="0.11" max="9" step="0.01" value="${val}" 
                  onchange="updatePairwise(${i}, ${j}, this.value)"></td>`;
      } else {
        row += `<td><input type="number" class="form-control form-control-sm text-center" value="${pairwise[i][j].toFixed(4)}" disabled id="pw_${i}_${j}"></td>`;
      }
    }
    row += "</tr>";
    tbody.innerHTML += row;
  }
}

function updatePairwise(i, j, val) {
  const v = parseFloat(val) || 1;
  pairwise[i][j] = v;
  pairwise[j][i] = 1 / v;
  const el = document.getElementById(`pw_${j}_${i}`);
  if (el) el.value = (1 / v).toFixed(4);
}

function calculateAHP() {
  const n = criteria.length;
  // Column sum
  const colSum = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) colSum[j] += pairwise[i][j];
  }
  // Normalized matrix & priority vector
  const norm = Array.from({ length: n }, () => Array(n).fill(0));
  weights = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      norm[i][j] = pairwise[i][j] / colSum[j];
      weights[i] += norm[i][j];
    }
    weights[i] /= n;
  }
  // Consistency
  const lambda = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) lambda[i] += pairwise[i][j] * weights[j];
    lambda[i] /= weights[i];
  }
  const lambdaMax = lambda.reduce((a, b) => a + b, 0) / n;
  const CI = (lambdaMax - n) / (n - 1);
  const cr = n > 2 ? CI / RI[n - 1] : 0;

  document.getElementById("ciValue").textContent = CI.toFixed(4);
  document.getElementById("crValue").textContent = cr.toFixed(4);
  const statusEl = document.getElementById("crStatus");
  if (cr <= 0.1) {
    statusEl.innerHTML = `<span class="consistency-ok"><i class="bi bi-check-circle-fill"></i> Konsisten</span>`;
  } else {
    statusEl.innerHTML = `<span class="consistency-bad"><i class="bi bi-exclamation-triangle-fill"></i> Tidak Konsisten</span>`;
  }

  // Weight table
  const wBody = document.getElementById("weightBody");
  wBody.innerHTML = "";
  criteria.forEach((c, i) => {
    wBody.innerHTML += `<tr>
      <td>${c.name}</td>
      <td>${weights[i].toFixed(4)}</td>
      <td>${(weights[i] * 100).toFixed(2)}%</td>
    </tr>`;
  });
}