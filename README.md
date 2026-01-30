# PDF Tools Hub 🚀

view website :-https://pdfhub-gules.vercel.app/

A professional, full-stack PDF management suite built with **React**, **Node.js**, and **MongoDB**. Designed to provide a seamless and premium experience for merging, splitting, and compressing PDF documents—all in one place.

---

## ✨ Features

### 🛠️ PDF Processing Tools
- **Merge PDF**: Effortlessly combine multiple PDF files into a single, organized document.
- **Split PDF**: Extract specific pages or split entire documents with precision.
- **Compress PDF**: Optimize file sizes for sharing without compromising on quality.

### 🔐 Admin Control Center
- **Real-time Management**: Enable or disable tools instantly via the admin dashboard.
- **Global Settings**: Configure site name, maximum upload limits, and technical parameters.
- **Usage Insights**: Monitor real-time logs and track application performance.
- **Secure Access**: Robust JWT-based authentication for administrative security.

### 💎 User Experience
- **Modern UI**: Sleek, minimalist design inspired by top-tier SaaS platforms.
- **Drag & Drop**: Seamless file uploads with real-time progress indicators.
- **Privacy First**: Automated background cleanup removes processed files after 10 minutes.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, Multer (File Handling) |
| **Database** | MongoDB,  |
| **PDF Logic** | `pdf-merger-js`, `pdf-lib` |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)

### 1. Clone the Project
```bash
git clone https://github.com/your-username/pdf-tools-hub.git
cd pdf-tools-hub
```

### 2. Setup Backend 🖥️
```bash
cd server
npm install
```

Run the server:
```bash
npm run dev
```

### 3. Setup Frontend 🎨
```bash
cd ../client
npm install
```

---

## ⚡ Unified Startup
You can start both the frontend and backend with a single command from the project root:
```bash
npm run dev:all
```
This will launch the Vite development server and the Node.js backend simultaneously using `concurrently`.

## 📂 Project Structure

```text
pdf/
├── client/           # React + Vite frontend
│   ├── src/          # Source code (Components, Pages, Hooks)
│   └── public/       # Static assets
├── server/           # Node.js + Express backend
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & Upload middleware
│   └── uploads/      # Temporary PDF storage
└── README.md         # Project documentation
```

---

## 🛡️ Security & Performance
- **File Validation**: MIME type checks ensure only valid PDFs are processed.
- **Size Limits**: Configurable upload limits (default 10MB) to protect server resources.
- **Auto-Cleanup**: A cron-style background task automatically deletes processed and temporary files.

---

## 📄 License
This project is licensed under the MIT License.

author: itsme
