// ========== STATE ==========
let criteria = [
  { name: "Biaya Sewa / Investasi", type: "cost" },
  { name: "Aksesibilitas & Transportasi", type: "benefit" },
  { name: "Potensi Pasar / Jumlah Konsumen", type: "benefit" },
  { name: "Tingkat Persaingan", type: "cost" },
  { name: "Infrastruktur & Fasilitas", type: "benefit" }
];

let alternatives = [
  { name: "Lokasi A - Pusat Kota" },
  { name: "Lokasi B - Area Perkantoran" },
  { name: "Lokasi C - Pinggir Kota" },
  { name: "Lokasi D - Dekat Kampus" }
];

let pairwise = []; // n x n matrix
let weights = [];
let decisionMatrix = []; // alternatives x criteria
let rankChart = null;

// Random Index for AHP (Saaty)
const RI = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];