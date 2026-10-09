# SPK Pemilihan Lokasi Usaha / Cabang Baru
### Metode AHP + TOPSIS

Sistem Pendukung Keputusan berbasis web untuk membantu pemilihan lokasi usaha atau cabang baru secara objektif dan terstruktur.

---

## 📁 Struktur Proyek

```
├── index.html                                          ← Aplikasi Web SPK (buka di browser)
├── Presentasi_SPK_Pemilihan_Lokasi_Cabang_Baru.pptx   ← Slide Presentasi (12 slide)
└── README.md                                           ← Dokumentasi ini
```

---

## 🚀 Cara Menjalankan Aplikasi

1. Buka file **`index.html`** dengan browser modern (Chrome, Edge, Firefox, Safari).
2. Tidak perlu instalasi, server, atau koneksi internet (kecuali untuk CDN Bootstrap & Chart.js saat pertama kali).
3. Ikuti wizard 5 langkah yang tersedia.

---

## 📋 Fitur Aplikasi

| Langkah | Fitur |
|---------|-------|
| **1. Kriteria** | Tambah / hapus kriteria, tentukan tipe **Benefit** atau **Cost** |
| **2. AHP** | Pairwise Comparison interaktif, hitung bobot, CI, CR, status konsistensi |
| **3. Alternatif** | Input daftar lokasi yang akan dibandingkan |
| **4. Matriks Keputusan** | Isi nilai setiap lokasi terhadap setiap kriteria |
| **5. Hasil** | Ranking TOPSIS + kartu pemenang + grafik batang Preference Value |

### Fitur Tambahan
- Validasi konsistensi AHP (CR ≤ 0.1)
- Visualisasi ranking dengan badge juara (emas, perak, perunggu)
- Tombol Cetak hasil
- Tombol Mulai Ulang
- Desain responsif (desktop & tablet)

---

## 📊 Data Default (Contoh)

### Kriteria
| No | Kriteria | Tipe |
|----|----------|------|
| 1 | Biaya Sewa / Investasi | Cost |
| 2 | Aksesibilitas & Transportasi | Benefit |
| 3 | Potensi Pasar / Jumlah Konsumen | Benefit |
| 4 | Tingkat Persaingan | Cost |
| 5 | Infrastruktur & Fasilitas | Benefit |

### Alternatif Lokasi
1. Lokasi A – Pusat Kota
2. Lokasi B – Area Perkantoran
3. Lokasi C – Pinggir Kota
4. Lokasi D – Dekat Kampus

---

## 🧠 Metode yang Digunakan

### 1. Analytic Hierarchy Process (AHP)
- Digunakan untuk **menentukan bobot kriteria**
- Pairwise comparison dengan skala Saaty (1–9)
- Validasi konsistensi melalui Consistency Ratio (CR)
- CR ≤ 0.1 → penilaian dianggap konsisten

### 2. Technique for Order Preference by Similarity to Ideal Solution (TOPSIS)
- Digunakan untuk **meranking alternatif lokasi**
- Langkah: Normalisasi → Pembobotan → Ideal Solution (A+/A−) → Jarak Euclidean → Preference Value
- Ranking berdasarkan nilai Preference Value tertinggi (paling dekat ke solusi ideal)

---

## 🖥️ Teknologi

- HTML5 + CSS3
- Bootstrap 5.3
- JavaScript (Vanilla)
- Chart.js 4
- Google Fonts (Inter)

---

