import { useCallback, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "../../../lib/firebase";

interface SignUpCredentials {
    email: string;
    password: string;
};

interface LoginCredentials {
    email: string;
    password: string;
};

export const useSignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const signUp = useCallback(async ({email, password}: SignUpCredentials) => {
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            const signUpError = error instanceof Error? error : new Error('予期せぬエラーが発生しました。');
            setError(signUpError);
            throw signUpError;
        } finally {
            setIsLoading(false);
        }
    },[auth]);
    return {signUp, isLoading, error};
}

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const login = useCallback(async ({email, password}: LoginCredentials) => {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            const loginError = error instanceof Error? error : new Error('予期せぬエラーが発生しました。');
            setError(loginError);
            throw loginError;
        } finally {
            setIsLoading(false);
        }
    },[auth]);
    return {login, isLoading, error};
}

export const useLogout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const logout = useCallback(async () =>{
        setIsLoading(true);
        try {
            await signOut(auth);
            // 「カート」情報や「購入履歴」情報のキャッシュを削除する
            queryClient.clear();
        } catch (error: any) {
            console.error("ログアウトに失敗しました。", error);
        } finally {
            setIsLoading(false);
        }
    },[queryClient]);

    return {logout, isLoading};
}
