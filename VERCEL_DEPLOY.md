# 🚀 Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị môi trường

1. **Tạo tài khoản Vercel** tại [vercel.com](https://vercel.com)
2. **Link GitHub account** với Vercel

## Bước 2: Deploy từ GitHub

### Option 1: Deploy qua Vercel Dashboard
1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Chọn repository `eduai-nexus` từ GitHub
4. Click **"Import"**

### Option 2: Deploy qua Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

## Bước 3: Cấu hình Environment Variables

Trong Vercel Dashboard của project:

1. Vào **Settings → Environment Variables**
2. Thêm các biến sau:

### Gemini AI API
```
GEMINI_API_KEY=your_actual_gemini_api_key
```

### Firebase Configuration
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Lưu ý:** Lấy các giá trị này từ Firebase Console: https://console.firebase.google.com/ → Project Settings → Your apps

**Lưu ý:** 
- Chọn **All Environments** (Production, Preview, Development)
- Click **Save** sau mỗi biến

## Bước 4: Deploy

Vercel sẽ tự động:
- ✅ Build project
- ✅ Deploy lên production
- ✅ Cung cấp URL: `https://eduai-nexus.vercel.app` (hoặc custom domain)

## Bước 5: Auto Deploy

Mỗi khi bạn push code mới lên GitHub:
- Vercel tự động build và deploy
- Preview deployment cho pull requests
- Production deployment cho main branch

## 📝 Lưu ý quan trọng

### Lấy Gemini API Key
1. Truy cập: https://makersuite.google.com/app/apikey
2. Tạo API key mới
3. Copy và paste vào Vercel Environment Variables

### Bảo mật
- ✅ Không commit file `.env.local` lên Git
- ✅ Chỉ commit file `.env.example` (template)
- ✅ API keys được lưu an toàn trên Vercel

### Build Settings (mặc định)
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## 🔄 Cập nhật sau khi deploy

Nếu cần thay đổi Environment Variables:
1. Vào **Settings → Environment Variables**
2. Edit hoặc thêm biến mới
3. Vào **Deployments** → Click **⋯** → **Redeploy**

## 🐛 Troubleshooting

### Lỗi: "GEMINI_API_KEY is undefined"
→ Kiểm tra lại Environment Variables trong Vercel

### Lỗi: "Firebase not configured"
→ Đảm bảo tất cả Firebase env vars đã được thêm

### Build failed
→ Kiểm tra logs trong Vercel Dashboard → Deployments

## 🔗 Custom Domain (Optional)

1. Vào **Settings → Domains**
2. Thêm domain của bạn
3. Cấu hình DNS theo hướng dẫn
