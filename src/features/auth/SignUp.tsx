import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { signUpUser, selectAuthError, selectAuthStatus } from "./authSlice";

import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [isCheckPasswordTouched, setIsCheckPasswordTouched] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const authStatus = useSelector(selectAuthStatus);
    const authError = useSelector(selectAuthError);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if(password === checkPassword){
            dispatch(signUpUser({email, password}))
                .unwrap()
                .then(() => {
                    // サインアップ成功後、トップページにリダイレクト
                    navigate('/');
                })
                .catch ((error: any) => {
                    console.error('Signup Failed:', error);
                });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-2xl">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">アカウントを作成</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
                    {/* Emailの入力フィールド */}
                    <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                        <input 
                            id="signup-email" 
                            type="email" 
                            placeholder="email@example.com" 
                            value={email} 
                            onChange={(event) => setEmail(event.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Passwordの入力フィールド */}
                    <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">パスワード</label>
                        <input
                            id="signup-password"
                            type="password"
                            placeholder="最低6文字必要です"
                            value={password}
                            minLength={6}
                            onChange={(event) => setPassword(event.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="signup-password-check" className="block text-sm font-medium text-gray-700">もう一度パスワードを入力してください</label>
                        <input
                            id="signup-password-check"
                            type="password"
                            value={checkPassword}
                            minLength={6}
                            onFocus={() => setIsCheckPasswordTouched(false)}
                            onBlur={() => setIsCheckPasswordTouched(true)}
                            onChange={(event) => setCheckPassword(event.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* エラーメッセージ表示フィールド */}
                    {isCheckPasswordTouched && checkPassword && password !== checkPassword && (
                        <div className="flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
                            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                            <span className="font-medium">パスワードが一致しません</span>
                        </div>
                    )}
                    {authError && (
                        <div className="flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
                            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                            <span className="font-medium">アカウント作成エラー:</span>&nbsp;{authError}
                        </div>
                    )}
                    {/* 決定ボタン */}
                    <div>
                        <button
                            type="submit"
                            disabled={authStatus === 'loading' || Boolean(password && password !== checkPassword)}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-150"
                        >
                            新規登録
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;