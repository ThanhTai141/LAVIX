# MindX - Nền tảng giáo dục gamified với AI Chatbot
 
Dự án gồm 2 phần:
- **Frontend:** Next.js (React), giao diện hiện đại, UX tốt, hỗ trợ chat AI, upload file, quản lý bạn bè, profile, portal học tập.
- **Backend:** Express.js (TypeScript), API bảo mật JWT, lưu lịch sử chat, xác thực, upload file, tích hợp Google Gemini.

---

## 1. Cấu trúc thư mục

```
mindx/
├── backend/           # Backend Express.js + TypeScript
│   ├── controllers/   # Controllers (auth, chat)
│   ├── dist/          # File build
│   ├── middlewares/   # Middleware (auth, upload file)
│   ├── models/        # Mongoose models (User, ChatHistory)
│   ├── routes/        # API routes (auth, gemini)
│   ├── services/      # Chat service (Google Gemini)
│   ├── utils/         # Tiện ích (logger, sendEmail)
│   ├── server.ts      # Khởi tạo server Express
│   ├── package.json   # Thư viện backend
│   └── ...            
├── src/               # Frontend Next.js (React)
│   ├── app/           # App directory (Next.js 13+)
│   │   ├── AIChatbox/ # Trang chat AI
│   │   ├── portal/    # Portal học tập
│   │   ├── profile/   # Trang cá nhân
│   │   ├── landing/   # Trang landing
│   │   ├── contexts/  # React context (Auth)
│   │   ├── store/     # Redux store
│   │   ├── components/# UI components
│   │   └── ...
│   ├── components/    # Component chung
│   ├── utils/         # Tiện ích frontend
│   ├── package.json   # Thư viện frontend
│   └── ...
├── README.md
└── ...
```

---

## 2. Tính năng chính

### Frontend (Next.js)
- Đăng ký, đăng nhập, xác thực JWT
- Chat AI với Google Gemini (text, upload file PDF/JPG/PNG/TXT ≤ 5MB)
- Lưu và hiển thị lịch sử chat
- Giao diện đẹp, responsive, UX tốt
- Quản lý bạn bè, profile, portal học tập
- Button "Chat mới" để reset session AI

### Backend (Express.js)
- API xác thực (JWT), quản lý user
- API chat với Google Gemini (text + file)
- Lưu lịch sử chat vào MongoDB
- Middleware upload file (multer), validate định dạng/kích thước
- Logging (winston)
- Gửi email (nodemailer)
- Bảo mật CORS, rate-limit

---

## 3. Cài đặt & chạy dự án

### Yêu cầu:
- Node.js >= 18
- MongoDB

### Cài đặt

```bash
# Cài frontend
cd mindx
npm install

# Cài backend
cd backend
npm install
```

### Chạy development

```bash
# Chạy backend (dev mode)
cd backend
npm run dev

# Chạy frontend
cd ..
npm run dev
```

### Build production

```bash
# Build backend
cd backend
npm run build

# Start backend
npm start

# Build frontend
cd ..
npm run build
npm start
```

---

## 4. API chính

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/gemini/chat` - Chat AI (text)
- `POST /api/gemini/chat-with-file` - Chat AI (kèm file)
- `POST /api/gemini/new-chat` - Tạo đoạn chat mới (reset session)
- `GET /api/gemini/history` - Lấy lịch sử chat

---

## 5. Công nghệ sử dụng

- **Frontend:** Next.js, React, Redux Toolkit, TailwindCSS, Heroicons, Axios
- **Backend:** Express.js, TypeScript, Mongoose, Multer, Winston, Nodemailer, Google Gemini API

---

## 6. Đóng góp & phát triển

- Fork, tạo branch mới, PR
- Đóng góp UI/UX, tính năng mới, tối ưu code
- Báo lỗi qua Issues

---

## 7. Liên hệ

- Email: [your-email@example.com]
- MindX Team