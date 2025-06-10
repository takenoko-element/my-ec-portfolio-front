import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAJas-1GaPnPs0Z_4Qa2q5wNBZowcmKqd0",
  authDomain: "my-portfolio-ec-site.firebaseapp.com",
  projectId: "my-portfolio-ec-site",
  storageBucket: "my-portfolio-ec-site.firebasestorage.app",
  messagingSenderId: "717724954045",
  appId: "1:717724954045:web:601a6d7eba37571966f6d4"
};

// Firebaseアプリを初期化
const app: FirebaseApp = initializeApp(firebaseConfig);

// Firebase Authenticationのインスタンスを取得してエクスポート
export const auth: Auth = getAuth(app);