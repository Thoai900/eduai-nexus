import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ==========================================================================
// CẤU HÌNH FIREBASE
// ==========================================================================

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "eduai-nexus.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "eduai-nexus",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "eduai-nexus.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || ""
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các dịch vụ để sử dụng trong app
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Hàm kiểm tra cấu hình
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "" && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
};