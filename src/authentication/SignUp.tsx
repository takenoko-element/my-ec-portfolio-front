// 新規登録フォームのコンポーネント
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('アカウント作成しました');
        }catch (error) {
            console.log('アカウント作成エラー', error);
            setError('アカウントの作成に失敗しました。メールアドレスが既に使用されているか、パスワードが短すぎます。');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5 text-center">新規登録</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="signup-email" className="block text-gray-700 text-sm font-bold mb-2">メールアドレス</label>
                    <input 
                        id="signup-email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">パスワード (6文字以上)</label>
                    <input
                        id="signup-password"
                        type="password"
                        placeholder="************"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        登録する
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;