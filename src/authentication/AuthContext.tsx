// ログイン状態をグローバルに管理するためのContext
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "./firebase";

// Contextに渡す値の型を定義
interface AuthContextType {
    currentUser: User | null;
}

// Contextを作成。型を適用する
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// カスタムフック。Contextがundefinedでないことを保証する
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Providerコンポーネントのpropsの型を定義
interface AuthProviderProps {
    children: ReactNode;
}

// ContextのProviderコンポーネント。これでラップされたコンポーネントは認証状態を共有できる
export const AuthProvider = ({children}: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    },[]);

    const value: AuthContextType = {
        currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    );
}