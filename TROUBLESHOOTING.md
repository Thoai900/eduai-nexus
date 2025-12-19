# 🔧 Hướng dẫn Fix trang trắng trên Vercel

## ⚠️ Nguyên nhân phổ biến:

### 1. **Thiếu Environment Variables** (Phổ biến nhất)

Vercel yêu cầu các biến môi trường phải có prefix `VITE_` để Vite có thể truy cập.

#### ✅ Giải pháp:

Vào **Vercel Dashboard** → **Settings** → **Environment Variables**, thêm các biến sau:

```bash
# Gemini AI (REQUIRED)
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_API_KEY=your_actual_gemini_api_key

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Legacy (không bắt buộc nhưng nên thêm)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Lưu ý:** Lấy giá trị thật từ file `.env` (không commit lên Git)

**Quan trọng:** Chọn **All Environments** khi thêm từng biến!

### 2. **Build Error**

Kiểm tra build logs trong Vercel:
- Vào **Deployments** → Click vào deployment mới nhất
- Xem **Build Logs** để tìm lỗi

### 3. **Console Errors**

Mở trang web → **F12** → **Console tab** để xem lỗi JavaScript.

## 🔄 Sau khi thêm Environment Variables:

1. Vào **Deployments**
2. Click **⋯** (ba chấm) bên cạnh deployment mới nhất
3. Chọn **Redeploy**
4. Đợi khoảng 1-2 phút

## 🧪 Test Local trước khi deploy:

```bash
# Cập nhật .env.local với prefix VITE_
npm run build
npm run preview
```

Nếu chạy OK local, vấn đề chắc chắn là thiếu env vars trên Vercel.

## 📸 Screenshot cần kiểm tra:

1. Vercel Environment Variables (Settings → Environment Variables)
2. Build Logs (Deployments → Latest deployment → Logs)
3. Browser Console (F12 → Console)

Hãy gửi cho tôi thông tin này để debug chính xác hơn!
