# Anime Streaming Platform

Platform streaming anime dengan koleksi lengkap anime terbaru dan populer.

## Deskripsi Proyek

Aplikasi web anime streaming yang memungkinkan pengguna untuk:
- Menjelajahi anime populer, sedang tayang, dan terbaru
- Melihat jadwal tayang anime
- Mencari anime berdasarkan keyword
- Melihat detail anime lengkap dengan sinopsis dan episode list
- Menonton episode anime dengan kualitas dan server yang berbeda
- Menyimpan anime favorit

## Fitur Utama

- **Hero Slider Responsif**: Menampilkan top 3 anime paling relevan di setiap halaman dengan animasi auto-rotate
- **Responsive Design**: Tampilan optimal di mobile (vertikal) dan desktop (horizontal)
- **Navigasi Halaman**: 
  - Populer
  - Sedang Tayang (Ongoing)
  - Terbaru
  - Sudah Tamat
  - Jadwal Tayang
  - Pencarian
  - Genre
  - Detail Anime
  - Tonton Episode
- **Interface Modern**: Desain yang elegan dengan animasi smooth menggunakan Framer Motion

## Teknologi yang Digunakan

### Frontend
- **React** - Library UI
- **Vite** - Build tool & development server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasi
- **Wouter** - Routing
- **TanStack Query** - Data fetching & caching
- **Shadcn/ui** - UI components
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **API Proxy** - Integrasi dengan Sankavollerei API

### Development
- **TSX** - TypeScript executor
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation

## Setup & Installation

### Prasyarat
- Node.js 18+ 
- npm atau yarn

### Instalasi Lokal

1. Clone repository
```bash
git clone <repository-url>
cd anime-streaming-platform
```

2. Install dependencies
```bash
npm install
```

3. Development mode
```bash
npm run dev
```

4. Akses aplikasi di `http://localhost:5000`

## Build & Production

### Build
```bash
npm run build
```

### Production
```bash
NODE_ENV=production npm start
```

## Deployment

### Deployment ke Vercel

1. Push repository ke GitHub
2. Buka https://vercel.com
3. Klik "Import Project"
4. Pilih repository GitHub Anda
5. Vercel akan otomatis mendeteksi konfigurasi dari `vercel.json`
6. Klik "Deploy"

Aplikasi akan langsung live dengan URL yang diberikan Vercel.

## Struktur Proyek

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── index.css      # Global styles
│   └── index.html
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage
│   ├── app.ts             # Express app setup
│   ├── index-dev.ts       # Development entry
│   └── index-prod.ts      # Production entry
├── shared/                # Shared types & schemas
├── vercel.json            # Vercel deployment config
└── package.json
```

## API Endpoints

- `GET /api/anime/home` - Anime beranda
- `GET /api/anime/schedule` - Jadwal tayang
- `GET /api/anime/anime/:slug` - Detail anime
- `GET /api/anime/popular-anime` - Anime populer
- `GET /api/anime/ongoing-anime` - Anime sedang tayang
- `GET /api/anime/complete-anime/:page` - Anime sudah tamat
- `GET /api/anime/genre` - Daftar genre
- `GET /api/anime/genre/:slug` - Anime per genre
- `GET /api/anime/search/:keyword` - Pencarian anime
- `GET /api/anime/episode/:slug` - Detail episode
- `GET /api/anime/batch/:slug` - Batch download
- `POST /api/anime/server` - Streaming server

## Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file `LICENSE` untuk detail lengkap.

### MIT License Summary
- ✅ Penggunaan komersial
- ✅ Modifikasi
- ✅ Distribusi
- ✅ Penggunaan pribadi
- ⚠️ Perlu menyertakan lisensi dan notice copyright

## Pencipta & Kontributor

**Pencipta Utama**
- Nama: Farhan Kertadiwangsa
- Repository: https://github.com/farhan-kertadiwangsa/anime-streaming-platform
- Tahun: 2025

**Stack Teknologi**
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Hosting: Vercel (Recommended)

## Kontribusi

Kami terbuka terhadap kontribusi dari komunitas. Silakan fork repository ini dan buat pull request dengan improvement Anda.

### Cara Berkontribusi
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## Dukungan & Kontak

Untuk pertanyaan atau masalah, silakan buka issue di GitHub atau hubungi melalui:
- GitHub: https://github.com/farhan-kertadiwangsa
- Repository: https://github.com/farhan-kertadiwangsa/anime-streaming-platform

## Catatan Penting

### API Source
Aplikasi ini menggunakan API dari **Sankavollerei** untuk data anime. Pastikan untuk menghormati terms of service mereka.

### Disclaimer
- Aplikasi ini adalah untuk tujuan edukasi dan hiburan
- Pengguna bertanggung jawab atas penggunaan konten yang disediakan
- Developer tidak bertanggung jawab atas penggunaan yang tidak sesuai hukum

## Changelog

### v1.0.0 (2025)
- Initial release
- Hero slider component dengan auto-rotate
- Responsive design (mobile & desktop)
- Integrasi multiple anime listing pages
- Sistem pencarian anime
- Detail anime dan episode viewer

## Roadmap

- [ ] Authentication & User Accounts
- [ ] Bookmark/Favorites System
- [ ] Watch History Tracking
- [ ] User Reviews & Ratings
- [ ] Recommendations System
- [ ] Download Episode Feature
- [ ] Multi-language Support
- [ ] Dark/Light Mode Toggle

---

© 2025 Farhan Kertadiwangsa. Anime Streaming Platform. Semua hak dilindungi di bawah MIT License.

Dibuat dengan ❤️ oleh Farhan Kertadiwangsa menggunakan React, Node.js, dan Tailwind CSS
