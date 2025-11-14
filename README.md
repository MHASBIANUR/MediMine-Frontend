# MediMine — Frontend

MediMine adalah aplikasi **AI Assistant di bidang kesehatan** yang membantu pengguna memperoleh informasi medis secara cepat, akurat, dan mudah dipahami. Frontend ini dibangun menggunakan **Next.js** dengan tampilan modern, ringan, dan responsif.

✨ **Live Demo:** https://medimine-frontend.vercel.app/

---

## 📸 Tampilan

![MediMine Preview](public/mediminePreview.jpg)

---

## 🚀 Fitur Utama (Frontend)

- **AI Chat Interface** — tampilan percakapan modern dan responsif.  
- **Riwayat Chat** — menampilkan percakapan yang disimpan di database.  
- **Prompt Input Cepat** — form input ringan dan tidak lag.  
- **Integrasi Backend** — komunikasi ke API backend untuk proses AI.  
- **UI Animasi** — efek animasi lembut seperti heart-beat untuk nuansa medis.

---

## 🛠 Teknologi yang Digunakan

| Teknologi | Fungsi |
|----------|--------|
| **Next.js** | Framework utama dan routing |
| **React** | UI Component |
| **Tailwind CSS** | Styling modern dan responsif |
| **Supabase** | Database & autentikasi |
| **Axios / Fetch API** | Komunikasi ke backend |
| **Vercel** | Deployment frontend |

Backend aplikasi berada pada repo terpisah: **medimine-backend**.

---

## 👤 Peran Saya

Sebagai **Frontend Developer**, saya mengerjakan:

- Pembuatan **UI chat interaktif** yang modern.  
- Integrasi frontend dengan backend API.  
- Menampilkan data riwayat chat dari Supabase.  
- Membuat komponen animasi 2D & 3D.  
- Menyusun struktur project agar scalable dan mudah dikembangkan.

---

## 🔥 Tantangan

- Menghadapi **streaming response** dari backend agar tetap stabil.  
- Menjaga UI tetap ringan meskipun ada animasi.  
- Menyeimbangkan performa antara fetch data & rendering UI.  

---

## ✅ Solusi

- Implementasi handler untuk streaming respons.  
- Rendering komponen secara efisien menggunakan React hooks.  
- Tailwind CSS untuk styling modular & minimalis.  
- Penyimpanan riwayat chat melalui Supabase untuk performa optimal.

---

## 📁 Struktur Proyek (Ringkas)

```bash
src/
├── app/
│   ├── dashboard/               # Halaman dashboard
│   ├── globals.css              # Style global
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── AnimatedHeart.tsx        # Animasi UI
│   ├── AnimatedHeart3D.tsx      # Animasi 3D
│   └── Navbar.tsx               # Navigasi
├── lib/
│   ├── api.ts                   # Komunikasi ke backend
│   ├── supabaseClient.ts        # Konfigurasi Supabase
│   └── utils.ts                 # Helper utilities
public/                          # Asset statis (gambar, dll.)

.env.local                       # Environment variables
package.json                     # Dependencies
tsconfig.json                    # TypeScript config
next.config.ts                   # Next.js config
```

---

## 🧩 Cara Menjalankan Proyek

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka di browser
http://localhost:3000
```


