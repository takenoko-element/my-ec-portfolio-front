import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL = 'http://localhost:3001/api';

// axios.create: 
// カスタム設定を持つaxiosのインスタンスを作成する
// アプリケーション内で使うAPIクライアントの設定を一つにまとめられる
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptors:
// リクエストやレスポンスを「傍受（intercept）」して、グローバルな共通処理を挟むための仕組み
// requestインターセプターは、リクエストがバックエンドに送信される「直前」に毎回実行さる
apiClient.interceptors.request.use( async (config) => {
        const user = auth.currentUser;
        if(user) {
            try {
                // FirebaseからIDトークン（JWT）を取得する
                const token = await user.getIdToken();
                // 全てのリクエストのヘッダーに、このトークンを付与する
                // 'Bearer 'というプレフィックスを付けるのが標準的なお作法らしい
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error: any) {
                console.error("Frontend: Failed to get ID token", error);
            }
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default apiClient;
