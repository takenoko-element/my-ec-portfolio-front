import { useCallback, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { auth } from '../../../lib/firebase';
import toast from 'react-hot-toast';
import { FirebaseError } from 'firebase/app';

interface SignUpCredentials {
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Firebaseエラーコードをユーザーフレンドリーなメッセージに変換するヘルパー関数
const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に使用されています。';
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません。';
      case 'auth/operation-not-allowed':
        return '認証方法が有効になっていません。';
      case 'auth/weak-password':
        return 'パスワードが弱すぎます。（最低6文字以上）';
      case 'auth/user-disabled':
        return 'このユーザーアカウントは無効化されています。';
      case 'auth/user-not-found':
        return 'ユーザーが見つかりません。メールアドレスを確認してください。';
      case 'auth/wrong-password':
        return 'パスワードが間違っています。';
      case 'auth/invalid-credential':
        return '認証情報が無効です。メールアドレスとパスワードを確認してください。';
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
      default:
        console.error('未ハンドリングのFirebaseエラー:', error);
        return '認証中に予期せぬエラーが発生しました。';
    }
  } else if (error instanceof Error) {
    // FirebaseError以外の標準的なJavaScriptエラーの場合
    console.error('標準JavaScriptエラー:', error.message);
    return `エラーが発生しました: ${error.message}`;
  } else {
    // その他の予期しない型のエラーの場合
    console.error('予期しない形式のエラー:', error);
    return '認証中に不明なエラーが発生しました。';
  }
};

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signUp = useCallback(async ({ email, password }: SignUpCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('新規登録に成功しました。');
    } catch (error: unknown) {
      const errorMessage = getFirebaseErrorMessage(error);
      const signUpError = new Error(errorMessage);
      setError(signUpError);
      toast.error(`新規登録に失敗しました： ${errorMessage}`);
      throw signUpError;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { signUp, isLoading, error };
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('ログインしました。');
    } catch (error: unknown) {
      const errorMessage = getFirebaseErrorMessage(error);
      const loginError = new Error(errorMessage);
      setError(loginError);
      toast.error(`ログインに失敗しました：${errorMessage}`);
      throw loginError;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { login, isLoading, error };
};

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // 「カート」情報や「購入履歴」情報のキャッシュを削除する
      queryClient.clear();
      toast.success('ログアウトしました。');
    } catch (error: unknown) {
      const errorMessage = getFirebaseErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  return { logout, isLoading };
};
