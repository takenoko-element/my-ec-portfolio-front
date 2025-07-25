import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

import { useSignUp } from './Hooks/useAuthActions';

const signUpSchema = z
  .object({
    email: z.string().email({
      message:
        '正しいメールアドレスの形式で入力してください。(xxxxx@example.com)',
    }),
    password: z
      .string()
      .min(6, { message: 'パスワードは最低6文字以上で入力してください。' }),
    checkPassword: z
      .string()
      .min(6, { message: 'パスワードは最低6文字以上で入力してください。' }),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: 'パスワードが一致しません。',
    path: ['checkPassword'], // エラーメッセージをcheckPasswordフィールドに関連付ける
  });

type SignUpFormInputs = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, isLoading: isSignUp, error: signUpError } = useSignUp();

  const {
    register, // 入力欄をフォームに「登録」するための関数
    handleSubmit, // フォーム送信時のラッパー関数
    formState: { errors, isSubmitting }, // フォームの状態（エラーや送信中かなど）
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema), // Zodスキーマをバリデーションに使うための設定
    mode: 'onBlur', // 入力が変更されるたびにバリデーションを実行
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      await signUp({ email: data.email, password: data.password });
      navigate('/');
    } catch (error) {
      console.error('新規登録に失敗しました：', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          アカウントを作成
        </h2>
        {/* handleSubmitでonSubmitをラップする */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          {/* Emailの入力フィールド */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="email@example.com"
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2
                                ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Passwordの入力フィールド */}
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="最低6文字必要です"
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2
                                ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-password-check"
              className="block text-sm font-medium text-gray-700"
            >
              もう一度パスワードを入力してください
            </label>
            <input
              id="signup-password-check"
              type="password"
              className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2
                                ${errors.checkPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              {...register('checkPassword')}
            />
            {errors.checkPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.checkPassword.message}
              </p>
            )}
          </div>
          {/* エラーメッセージ表示フィールド */}
          {signUpError && (
            <div
              className="flex items-center p-3 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
              role="alert"
            >
              <ExclamationCircleIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">アカウント作成エラー:</span>&nbsp;
              {signUpError.message}
            </div>
          )}
          {/* 決定ボタン */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || isSignUp}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-150"
            >
              {/* 新規登録 */}
              {isSubmitting || isSignUp ? '作成中...' : '新規登録'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
