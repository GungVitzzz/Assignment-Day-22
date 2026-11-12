# Building Interactivity Website with JavaScript

Halaman detail produk parfum **Molecule 01 + Champaca** menggunakan data produk hardcoded serta HTML, CSS, dan JavaScript tanpa dependensi tambahan.

## Fitur interaktif

- Banner pengumuman bergerak dan berhenti saat pointer berada di atasnya; header memakai efek transparan dan blur.
- Galeri dapat diganti melalui thumbnail atau tombol panah. Klik foto untuk zoom, gerakkan pointer untuk menggeser, dan keluar dari area foto untuk mereset zoom.
- Tombol quantity `+`/`−` memperbarui subtotal dan harga pada tombol **Add to bag**. Quantity juga merespons tombol panah atas/bawah pada keyboard.
- **Add to bag** memperbarui cart count, subtotal, dan feedback. Mini-cart memiliki empty state dan kontrol `+`/`−`.
- Keranjang dibatasi maksimal 10 item. Saat penuh, kontrol tambah dinonaktifkan dan pesan peringatan tampil; mengurangi item memulihkan kondisi normal.
- Tombol wishlist produk dan header menyinkronkan status.
- Menu burger, mini-cart, accordion Description/Notes/Ingredients/Delivery & Returns, dan kartu rekomendasi dapat digunakan. `Escape` menutup menu atau mini-cart.
- Footer memuat navigasi dan ikon Instagram/TikTok. Form newsletter memvalidasi email dan menampilkan status demo, tetapi tidak mengirim pendaftaran.

## Menjalankan

Buka `Halaman Detail Produk_Page_1/index.html` di browser atau jalankan folder tersebut dengan Live Server di Visual Studio Code. Tidak perlu memasang paket. Pastikan folder `assets` tetap berada bersama `index.html`, `styles.css`, dan `script.js`.

## Hasil pengujian

| Skenario                       | Hasil                                                                                                                                                                                                                     | Status   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Data hardcoded dan aset gambar | Nama produk dan harga GBP 135 tampil; tiga gambar galeri tersedia.                                                                                                                                                        | Lulus    |
| Quantity dan subtotal          | Quantity 1 menjadi 3; subtotal berubah dari GBP 135 menjadi GBP 405.                                                                                                                                                      | Lulus    |
| Batas quantity                 | Kontrol menghasilkan bilangan bulat 1–10 dan menonaktifkan tombol pada batas. Tidak ada input bebas untuk mencoba 0, pecahan, atau nilai negatif; batas 10 berasal dari konfigurasi kapasitas, bukan field stok terpisah. | Sebagian |
| Add to bag                     | Menambahkan 3 item, cart count menjadi 3, subtotal GBP 405, dan feedback sukses tampil.                                                                                                                                   | Lulus    |
| Empty state keranjang          | Saat cart count 0, empty state tampil dan detail item tersembunyi.                                                                                                                                                        | Lulus    |
| Keranjang penuh dan pemulihan  | Pada 10 item, subtotal GBP 1.350; tombol tambah nonaktif dan peringatan tampil. Mengurangi item mengaktifkan kembali kontrol tambah.                                                                                      | Lulus    |
| Mengurangi item                | Dari 4 item, tombol `−` menurunkan jumlah menjadi 3 dan menampilkan feedback penghapusan.                                                                                                                                 | Lulus    |
| Galeri                         | Thumbnail/panah mengganti foto; zoom, geser pointer, dan reset saat pointer keluar berfungsi pada simulasi.                                                                                                               | Lulus    |
| Wishlist                       | Status awal, feedback setelah klik, dan sinkronisasi tombol produk/header diperiksa.                                                                                                                                      | Lulus    |
| Menu dan mini-cart             | Menu dapat dibuka dan ditutup melalui tautan atau `Escape`; mini-cart juga dapat ditutup dengan `Escape`.                                                                                                                 | Lulus    |
| Accordion                      | Empat bagian ditemukan; screenshot menunjukkan Notes terbuka. Toggle tidak diuji ulang di browser.                                                                                                                        | Sebagian |
| Newsletter                     | Submit simulasi menampilkan bahwa layanan belum tersedia. Form memiliki `type="email"` dan `required`, tetapi validasi email belum diuji langsung di browser.                                                             | Sebagian |
| Event dan status               | Source memakai `addEventListener`; nilai dan status antarmuka diperbarui dengan `textContent`.                                                                                                                            | Lulus    |

Pemeriksaan tambahan: 8 kelompok simulasi DOM fungsional, 7 pemeriksaan yang dicocokkan dengan screenshot, `node --check` pada `script.js`, dan `git diff --check` berhasil.

## Bukti screenshot

Semua gambar berada di `screenshots/`. Gambar mendukung hasil visual, tetapi tidak dengan sendirinya membuktikan seluruh alur interaksi.

| File                                  | Skenario yang ditunjukkan                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `burger-menu.png`                     | Panel navigasi burger terbuka.                                                                                      |
| `komponen-accordion.png`              | Notes terbuka; bagian accordion lain tampak.                                                                        |
| `tanda-arrow-pada-galeri.png`         | Tombol panah berikutnya; aksi panah juga diperiksa lewat simulasi DOM.                                              |
| `teks-keranjang-kosong.png`           | Ikon, pesan, dan tombol empty state.                                                                                |
| `teks-keranjang-penuh.png`            | Keranjang berisi 10 item, subtotal GBP 1.350, dan peringatan kapasitas.                                             |
| `teks-saat-barang-dikurangi.png`      | Feedback penghapusan; jumlah menjadi 3.                                                                             |
| `teks-saat-barang-ditambah.png`       | Feedback wishlist berhasil. Nama file menyebut barang ditambah, tetapi screenshot menunjukkan wishlist, bukan cart. |
| `tombol-disabled-saat-item-penuh.png` | Tombol Add to bag nonaktif dengan label “Keranjang Penuh”.                                                          |
| `wishlist-click.png`                  | Wishlist aktif pada produk/header.                                                                                  |
| `wishlist-idle.png`                   | Wishlist belum aktif.                                                                                               |
| `zoom-galeri.png`                     | Foto produk dalam keadaan diperbesar.                                                                               |

## Batasan pengujian

- Keranjang hanya disimpan selama halaman terbuka dan kembali kosong setelah halaman dimuat ulang.
- Newsletter belum terhubung ke layanan pendaftaran.
- Quantity dibatasi oleh kontrol antarmuka; input bebas dan validasi terhadap stok terpisah belum tersedia.
- Belum dilakukan pengujian browser end-to-end atau screenshot baru khusus untuk sesi pengujian ini.
