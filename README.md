```md
# 🌐 Web CV & Portfolio – Muhammad Kasyaf

Website CV & portofolio pribadi untuk menampilkan profil, skill, pengalaman, dan project dalam satu tampilan yang modern, profesional, dan responsif.

Dibangun menggunakan **Next.js**, **Tailwind CSS**, dan **shadcn/ui** dengan fokus pada performa, UI/UX, serta kemudahan pengelolaan konten.

---

## ✨ Fitur Utama

- 📄 Profil & Tentang Saya  
- 🧠 Skill & Teknologi  
- 💼 Pengalaman & Portofolio Project  
- 📁 Penyimpanan File / Project (tampilan mirip GitHub)  
- 📱 Responsive (Desktop & Mobile)  
- 🎨 UI modern dengan Tailwind & shadcn/ui  
- 🚀 Performa optimal menggunakan Next.js App Router  

---

## 🛠️ Teknologi yang Digunakan

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Node.js (API File System)
- Git & GitHub

---

## 📂 Struktur Project

```

app/
├─ api/
│   └─ files/          # API untuk membaca folder & file
├─ me/                 # Halaman CV / Dashboard
├─ layout.tsx
└─ page.tsx

public/
└─ penyimpanan/
├─ script_ig/
├─ game/
└─ lainnya...

````

---

## 🚀 Cara Menjalankan Project

### 1️⃣ Clone Repository
```bash
git clone https://github.com/MeledakCik/web-me.git
cd web-me
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Jalankan Development Server

```bash
npm run dev
```

Buka di browser:

```
http://localhost:3000
```

---

## 📁 Sistem Penyimpanan File

* Semua file & project disimpan di:

```
public/penyimpanan
```

* Nama folder asli (contoh: `script_ig`)
* Ditampilkan otomatis di UI menjadi **Script Ig**
* Data dibaca melalui API menggunakan Node.js `fs`

---

## 🎨 UI & UX

* Desain clean & profesional
* Navigasi file mirip GitHub
* Layout berbasis Card (shadcn/ui)
* Animasi ringan dan halus

---

## 🔒 Keamanan

* API hanya dapat membaca folder `public/penyimpanan`
* Tidak memiliki akses ke file sistem lain

---

## 📌 Rencana Pengembangan

* 🔍 Search file & project
* 📄 Preview file (code viewer)
* ⬇️ Download file
* 🌙 Dark mode
* 🧭 Breadcrumb navigation

---

## 👤 Tentang Saya

**Muhammad Kasyaf Anugrah**
Web Developer

Fokus pada pengembangan web modern dengan performa tinggi dan UI yang nyaman digunakan.

📫 Kontak:

* Email: [kakangdanadam@gmail.com](mailto:ykakangdanadam@gmail.com)
* GitHub: [https://github.com/MeledakCIk](https://github.com/MeledakCIk)
* LinkedIn: [https://www.linkedin.com/in/muhammad-kasyaf-anugrah-576460314/](https://www.linkedin.com/in/muhammad-kasyaf-anugrah-576460314/)

---

## 📄 Lisensi

Project ini merupakan **portfolio pribadi** dan bebas digunakan sebagai referensi pembelajaran.

---

⭐ Jika project ini bermanfaat, silakan beri **star** di GitHub!

```

