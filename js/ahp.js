// ========== AHP ==========
// Skala Saaty: nilai dasar 1-9 dan kebalikannya (resiprokal)
const SAATY_SCALE = [
  { value: 9,       label: "9" },
  { value: 8,       label: "8" },
  { value: 7,       label: "7" },
  { value: 6,       label: "6" },
  { value: 5,       label: "5" },
  { value: 4,       label: "4" },
  { value: 3,       label: "3" },
  { value: 2,       label: "2" },
  { value: 1,       label: "1" },
  { value: 1 / 2,   label: "1/2" },
  { value: 1 / 3,   label: "1/3" },
  { value: 1 / 4,   label: "1/4" },
  { value: 1 / 5,   label: "1/5" },
  { value: 1 / 6,   label: "1/6" },
  { value: 1 / 7,   label: "1/7" },
  { value: 1 / 8,   label: "1/8" },
  { value: 1 / 9,   label: "1/9" }
];

// Cari nilai skala terdekat dengan nilai numerik tertentu (untuk memetakan default matrix)
function closestSaatyValue(v) {
  let best = SAATY_SCALE[0].value;
  let bestDiff = Infinity;
  SAATY_SCALE.forEach(s => {
    const diff = Math.abs(s.value - v);
    if (diff < bestDiff) { bestDiff = diff; best = s.value; }
  });
  return best;
}

function saatyOptionsHtml(selected) {
  const sel = closestSaatyValue(selected);
  return SAATY_SCALE.map(s =>
    `<option value="${s.value}"${s.value === sel ? " selected" : ""}>${s.label}</option>`
  ).join("");
}

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
        row += `<td><select class="form-select form-select-sm text-center saaty-select" disabled><option>1</option></select></td>`;
      } else if (i < j) {
        const val = pairwise[i][j];
        row += `<td><select class="form-select form-select-sm saaty-select"
                  onchange="updatePairwise(${i}, ${j}, this.value)">${saatyOptionsHtml(val)}</select></td>`;
      } else {
        row += `<td><select class="form-select form-select-sm text-center saaty-select" disabled id="pw_${i}_${j}">${saatyOptionsHtml(pairwise[i][j])}</select></td>`;
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
  if (el) {
    const inv = closestSaatyValue(1 / v);
    el.value = inv;
    // Jika nilai persis tidak ada di daftar, tambahkan opsi agar tetap tampil akurat
    if (Math.abs(el.value - 1 / v) > 1e-9) {
      const opt = document.createElement("option");
      opt.value = 1 / v;
      opt.textContent = (1 / v).toFixed(2);
      el.appendChild(opt);
      el.value = 1 / v;
    }
  }
  calculateAHP();
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