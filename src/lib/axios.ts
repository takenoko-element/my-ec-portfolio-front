import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL = 'http://localhost:3001/api';

// 【axios解説】 axios.create: 
// カスタム設定を持つaxiosのインスタンスを作成します。
// これにより、アプリケーション内で使うAPIクライアントの設定を一つにまとめられます。
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 【axios解説】 Interceptors（インターセプター）:
// これは、リクエストやレスポンスを「傍受（intercept）」して、グローバルな共通処理を挟むための非常に強力な仕組みです。
// requestインターセプターは、リクエストがバックエンドに送信される「直前」に毎回実行されます。
apiClient.interceptors.request.use( async (config) => {
        const user = auth.currentUser;
        if(user) {
            try {
                // FirebaseからIDトークン（JWT）を取得します。
                // このトークンは、ユーザーが誰であるかを証明する「身分証明書」です。
                const token = await user.getIdToken();
                // 全てのリクエストのヘッダーに、このトークンを付与します。
                // 'Bearer 'というプレフィックスを付けるのが標準的なお作法です。
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
