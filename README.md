# PU Salon & Barbershop - Enterprise ERP SIM

Sistem Informasi Manajemen Enterprise Resource Planning (ERP) modern, responsif, dan terintegrasi untuk **PU Salon & Barbershop**. Dirancang khusus untuk mengelola operasional harian salon kecantikan dan barbershop secara menyeluruh, mulai dari reservasi pelanggan, kasir Point of Sales (POS), pelacakan inventaris berstandar FIFO, loyalitas CRM, manajemen keuangan & laba rugi, hingga pengadaan supplier dan pembagian hak akses (RBAC).

---

## 💈 Profil Bisnis & Jam Operasional

- **Nama Usaha**: PU Salon & Barbershop
- **Jenis Usaha**: Salon Kecantikan & Barbershop Premium
- **Lokasi**: Jl. Boulevard Raya Blok PU No. 12, Kelapa Gading, Jakarta
- **Tim Staf (3 Orang)**:
  1. **Budi Santoso** - Senior Barber (Gentlemen Cut, Fade, Beard Sculpting & Hot Towel)
  2. **Siti Rahmawati** - Senior Hair Stylist & Colorist (Balayage, Creambath Tradisional, Hair Spa & Blow)
  3. **Rian Pratama** - All-Round Stylist & Barber (Modern Cuts, Scalp Therapy & Reflexology)
- **Jam Operasional**:
  - **Senin**: 11:00 – 16:00 WIB (Last Order: 15:00)
  - **Selasa – Minggu**: 11:00 – 21:00 WIB (Last Order: 20:00)
- **Metode Pembayaran**: Tunai (Cash) & QRIS Statis/Dinamis
- **Target Pengunjung**: ~30 Pelanggan / Hari

---

## 🚀 8 Modul Utama ERP

### 1. Dashboard Utama & Real-Time Analytics
- Kartu KPI Pendapatan Harian, Mingguan, dan Bulanan.
- Target meter pengunjung harian (real-time progress terhadap target 30 pelanggan/hari).
- Grafik batang interaktif tren pendapatan 7 hari terakhir.
- Ringkasan janji temu hari ini, performa 3 staf utama, dan indikator peringatan stok menipis (*low-stock alerts*).

### 2. Booking & Appointment Management
- Pencatatan reservasi pelanggan baik secara **Online Booking** maupun **Walk-in**.
- Tampilan ganda: **Daftar Tabel (List View)** dan **Jadwal Kalender Multi-Kolom per Staf (Calendar View)**.
- Validasi ketat anti-*double booking* / anti-bentrok jam pada staf yang sama.
- Penegakan jam operasional otomatis (Senin max 16:00, Sel-Min max 21:00, batas last order 20:00).
- Siklus status: `Pending` $\rightarrow$ `Confirmed` $\rightarrow$ `In Progress` $\rightarrow$ `Completed` $\rightarrow$ `Cancelled`.
- **Integrasi 1-Klik**: Konversi langsung janji temu yang selesai/sedang berlangsung ke keranjang Kasir POS.

### 3. Point of Sales (POS) Kasir
- Katalog interaktif jasa salon & produk ritel dengan pencarian cepat dan tab kategori.
- Kalkulasi otomatis subtotal, diskon kustom, dan total bayar.
- **Deteksi Otomatis Promo Ulang Tahun**: Jika pelanggan yang dipilih berulang tahun bulan/hari ini, sistem otomatis memberikan opsi diskon 15%.
- Diskon otomatis membership tier (Gold 10%, Silver 5%).
- **Pembayaran Tunai**: Input nominal bayar, tombol uang pas/pecahan cepat, dan hitung kembalian otomatis.
- **Pembayaran QRIS**: Tampilan kode QR interaktif standar nasional dengan simulasi verifikasi instan.
- **Struk Digital Elegan**: Desain thermal 80mm siap cetak (*Print/PDF*) atau salin teks nota siap kirim ke WhatsApp pelanggan.

### 4. Manajemen Inventaris & Pelacakan FIFO
- Pengelolaan barang terpisah antara **Produk Ritel** (dijual ke konsumen) dan **Bahan Treatment** (dipakai saat perawatan).
- **Pengurangan Stok Otomatis**: Penjualan produk ritel dan pemakaian formula material saat treatment otomatis memotong stok gudang.
- **Sistem Antrean Batch FIFO**: Menggunakan stok dari batch terlama terlebih dahulu (First-In, First-Out) lengkap dengan tanggal kedaluwarsa dan nomor batch.
- Indikator peringatan jika stok berada di bawah batas minimum (*Min Stock*).
- Riwayat pergerakan stok lengkap (*Audit Trail*) untuk setiap stok masuk dan keluar.

### 5. Customer Relationship Management (CRM)
- Database pelanggan lengkap: Nama, No. WhatsApp, Alamat, Tanggal Lahir, Tier Member, Catatan Gaya Rambut/Alergi.
- Histori treatment & total pengeluaran kumulatif pelanggan.
- Pelacak frekuensi kunjungan.
- Notifikasi pelanggan yang berulang tahun pada bulan berjalan.

### 6. Manajemen Keuangan & Laba Rugi (P&L)
- Jurnal kas otomatis terhubung dari transaksi POS (pemasukan) dan penerimaan PO (pengeluaran).
- Pencatatan manual beban operasional (Listrik PLN, Air, Wi-Fi Biznet, Sewa Tempat, Gaji Staf).
- Rangkuman Laba Bersih (*Net Profit*) dan Margin Keuntungan.
- Grafik rincian beban pengeluaran berdasarkan kategori.
- Fitur **Ekspor Laporan ke Format CSV** siap olah di Excel/Spreadsheet.

### 7. Supplier & Pengadaan Barang (Procurement)
- Direktori pemasok resmi perlengkapan salon kecantikan & barbershop.
- Penerbitan formulir **Purchase Order (PO)** multi-item.
- Siklus PO: `Draft` $\rightarrow$ `Ordered` $\rightarrow$ `Received`.
- **Otomasi Terintegrasi**: Begitu barang PO ditandai "Diterima", sistem secara otomatis menambah stok produk, membuat batch FIFO baru, mencatat mutasi stok masuk, dan membukukan pengeluaran di jurnal keuangan.

### 8. Manajemen Tim & Hak Akses (RBAC)
- Pengaturan profil dan jadwal 3 staf salon.
- Status kehadiran real-time (`Tersedia`, `Melayani`, `Libur`).
- Pengaturan persentase komisi pengerjaan dan pelacak tamu harian.
- Role Switcher interaktif untuk simulasi peran:
  - **Owner**: Akses penuh ke seluruh fitur dan pembukuan laba rugi.
  - **Admin**: Operasional harian kasir, booking, pelanggan, dan stok.
  - **Staff**: Tampilan jadwal pengerjaan dan pembaruan status layanan.

---

## 🛠️ Arsitektur Teknologi

- **Frontend & Fullstack**: React 18, Vite 5, Tailwind CSS 3
- **Iconography**: Lucide React
- **Palet Desain**: Warm Ivory (`#FAF8F5`), Champagne Beige/Gold (`#C5A880`, `#D4AF37`), Dark Charcoal (`#1C1B1F`), White
- **Penyimpanan State**: Engine Relasional Reaktif dengan sinkronisasi `localStorage` (Persisten & Offline-First)
- **Bahasa & Lokalisasi**: 100% Bahasa Indonesia, Format Rupiah (`Rp`), Zona Waktu WIB

---

## 💻 Panduan Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Node.js versi 18+ atau 20+ / LTS
- npm versi 9+

### Langkah Instalasi
```bash
# 1. Clone repositori
git clone https://github.com/lucrra/PU-Salon-SIM.git

# 2. Masuk ke direktori proyek
cd PU-Salon-SIM

# 3. Instal dependensi
npm install

# 4. Jalankan server pengembangan
npm run dev

# 5. Build untuk produksi
npm run build

# 6. Preview build produksi
npm run preview
```

---

*Hak Cipta © 2026 PU Salon & Barbershop. Seluruh hak cipta dilindungi undang-undang.*
