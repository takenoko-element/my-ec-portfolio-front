import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, selectAuthError, selectAuthStatus } from "./authSlice";

import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email({message: '正しいメールアドレスの形式で入力してください。(xxxxx@example.com)'}),
    password: z.string().min(1, {message: 'パスワードを入力してください。'}),
});

type loginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const authStatus = useSelector(selectAuthStatus);
    const authError = useSelector(selectAuthError);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<loginFormInputs>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur'
    })

    const onSubmit: SubmitHandler<loginFormInputs> = (data) => {
        dispatch(loginUser({email: data.email, password: data.password}))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((error: any) => console.error('Signup Failed:', error));
    };

    // const handleSubmit = (event: React.FormEvent) => {
    //     event.preventDefault();
    //     dispatch(loginUser({email, password}))
    //         .unwrap()
    //         .then(() => {
    //             // ログイン成功後、トップページにリダイレクト
    //             navigate('/');
    //         })
    //         .catch ((error: any) => {
    //             console.error('Login Failed:', error);
    //         });
    // };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col w-full max-w-md gap-y-8">
                <div className="bg-white p-8 shadow-xl rounded-2xl">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">ログイン</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                        {/* Emailの入力フィールド */}
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                            <input 
                                id="login-email" 
                                type="email" 
                                placeholder="email@example.com" 
                                // value={email} 
                                // onChange={(event) => setEmail(event.target.value)}
                                className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                                // required
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                        {/* Passwordの入力フィールド */}
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">パスワード</label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="**********"
                                // value={password}
                                // onChange={(event) => setPassword(event.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                // required
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                        {/* エラーメッセージ表示フィールド */}
                        {authError && (
                            <div className="flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
                                <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                                <span className="font-medium">ログインエラー:</span>&nbsp;{authError}
                            </div>
                        )}
                        {/* ログインボタン */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting || authStatus === 'loading'}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-150"
                            >
                                {isSubmitting || authStatus === 'loading'? 'ログイン中...' : 'ログイン'}
                            </button>
                        </div>
                    </form>
                </div>
                {/* 新規登録 */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        初めてのご利用ですか？{' '}
                        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                            新規登録はこちら
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;