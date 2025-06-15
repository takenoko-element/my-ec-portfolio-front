import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addItemToCartAPI } from "./cartSlice";
import type{ AppDispatch } from '../../app/store'
import type { Product  } from '../products/productSlice'
import { useNavigate } from "react-router-dom";
import { selectUser } from "../auth/authSlice";

interface UseAddToCartReturn {
    isAdding: boolean;
    handleAddToCart: (product: Product) => Promise<void>;
}

export const useAddToCart = (): UseAddToCartReturn => {
    const [isAdding, setIsAdding] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const user = useSelector(selectUser);

    const handleAddToCart = async (product: Product) => {
        if (!product || isAdding) {
            return;
        }
        // ログインチェック
        if(!user) {
            toast.error(
                (t) => (
                    <span>
                        カートへ追加するには<b>ログイン</b>が必要です。
                        <button
                            onClick={() => {
                                navigate('/login'); // ログインページへ遷移
                                toast.dismiss(t.id); // Toastを閉じる
                            }}
                            className="ml-2 font-bold text-blue-600 underline"
                        >
                            ログインページへ
                        </button>
                    </span>
                )
            );
            return;
        }

        // ログイン済み処理
        setIsAdding(true);
        const promise = dispatch(addItemToCartAPI({productId: product.id})).unwrap();
        try {
            await toast.promise(promise, {
                loading: 'カートに追加中...',
                success: <b>{`${product.title}をカートに追加しました！`}</b>,
                error: (err) => <b>{err || 'カートへの追加に失敗しました。'}</b>,
            });
        } catch (error) {
            console.error("[useAddToCart] カート追加処理で予期しないエラー:", error);
        } finally {
            setIsAdding(false);
        }
    };
    return {isAdding, handleAddToCart}
}
