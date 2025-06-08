import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addItemToCartAPI } from "./cartSlice";
import type{ AppDispatch } from '../../app/store'
import type { Product  } from '../products/productSlice'

interface UseAddToCartReturn {
    isAdding: boolean;
    handleAddToCart: (product: Product) => Promise<void>;
}

export const useAddToCart = (): UseAddToCartReturn => {
    const [isAdding, setIsAdding] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleAddToCart = async (product: Product) => {
        if (!product || isAdding) {
            return;
        }
        setIsAdding(true);
        const promise = dispatch(addItemToCartAPI({productId: product.id})).unwrap();
        try {
            await toast.promise(promise, {
                loading: 'カートに追加中...',
                success: <b>{`${product.title}をカートに追加しました！`}</b>,
                error: <b>カートへの追加に失敗しました。</b>,
            });
        } catch (error) {
            console.error("カート追加処理でエラー:", error);
        } finally {
            setIsAdding(false);
        }
    };
    return {isAdding, handleAddToCart}
}
