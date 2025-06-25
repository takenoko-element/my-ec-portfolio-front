import React from "react";
import { motion } from 'framer-motion';
import { useAddToCartHandler } from "./Hooks/useAddToCartToast";
import type { Product } from "../../types";

interface AddToCartButtonProps {
    product: Product;
    className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({product, className = ''}) => {
    const { isAdding, handleAddToCart } = useAddToCartHandler();

    return (
        <motion.button
            whileHover={{ scale: isAdding ? 1 : 1.05 }} // ローディング中はアニメーションしない
            whileTap={{ scale: isAdding ? 1 : 0.95 }}
            onClick={() => handleAddToCart(product)} // 商品情報を渡して実行
            disabled={isAdding}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed ${className}`}
        >
            {isAdding? (
                <>
                    {/* ★SVGスピナー */}
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    処理中...
                </>
            ): (
                'カートに追加'
            )}
        </motion.button>
    );
};

export default AddToCartButton;
