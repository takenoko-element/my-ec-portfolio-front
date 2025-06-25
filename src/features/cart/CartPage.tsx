// import { useSelector, useDispatch } from "react-redux";
// import type { AppDispatch } from "../../app/store";
// import {
//     selectCartItems,
//     selectCartTotalPrice,
//     removeItemFromCartAPI,
//     updateItemQuantityAPI,
//     clearCartAPI,
//     selectCartStatus,
//     selectCartError
// } from './cartSlice';
// import type { CartItem } from "./cartSlice";
// import { createOrderAPI } from "../orders/orderSlice";
import { Link } from "react-router-dom";
import { useCart, useClearCart } from "./Hooks/useCart";
import type { CartItem } from "../../types";
import toast from "react-hot-toast";
import CartItemRow from "./CartItemRow";
// import toast from "react-hot-toast";
// import { useState } from "react";

export const CartPage = () => {
    // const dispatch = useDispatch<AppDispatch>();
    // // const navigate = useNavigate();
    // // // 注文処理中のローカルなローディング状態
    // // const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // const cartItems = useSelector(selectCartItems);
    // const totalPrice = useSelector(selectCartTotalPrice);
    // const cartStatus = useSelector(selectCartStatus);
    // const cartError = useSelector(selectCartError);
    const {data: cartItems, isLoading, isError, error: cartError} = useCart();
    const {mutate: clearCart, isPending: isClearing} = useClearCart();

    // const handleUpdateItemQuantity = (cartItemId: number, newQuantity: number) => {
    //     if (newQuantity > 0){
    //         dispatch(updateItemQuantityAPI({itemId: itemId, quantity: newQuantity}));
    //         updateMutate({cartItemId, quantity: newQuantity})
    //     }
    // };
    // const handleRemoveItem = (itemId: number) => {
    //     console.log('[CartPage] handleRemoveItem called with itemId:', itemId);
    //     dispatch(removeItemFromCartAPI(itemId));

    // };
    const handleClearCart = () => {
        // dispatch(clearCartAPI());
        clearCart(
            undefined, {
                onSuccess: () => toast.success('カートを空にしました。'),
                onError: (error: Error) => toast.error(error.message),
            }
        )
    };

    if(isLoading){
        return <div className="text-center py-10">カートを読み込んでいます...</div>
    }

    if(isError){
        const errorMessage = cartError instanceof Error? cartError.message : '不明なエラーが発生しました。';
        return <div className="text-center py-10 text-red-600">カートの読み込みに失敗しました: {errorMessage}</div>
    }

    if(!cartItems || cartItems.length === 0){
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold mb-4">ショッピングカート</h2>
                <p className="text-gray-600 mb-6">カートに商品がありません</p>
                <Link
                    to="/"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition duration-150"
                >
                    お買い物を続ける
                </Link>
            </div>
        );
    }

    const totalPrice = cartItems.reduce((sum, cartItem) => sum + cartItem.product.price * cartItem.quantity, 0);

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">ショッピングカート</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul>
                    {cartItems.map((item: CartItem) => (
                        <CartItemRow key={item.id} item={item} />
                    ))}
                </ul>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">合計金額:</h3>
                    <p className="text-2xl font-bold text-green-600">{`$ ${totalPrice.toFixed(2)}`}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button 
                        onClick={handleClearCart} 
                        data-testid={`clear-button`}
                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        {isClearing? '処理中...' : 'カートを空にする'}
                    </button>
                    <Link
                        to={'/checkout'}
                        className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white text-center bg-green-600 hover:bg-green-700 ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => {if (cartItems.length === 0) e.preventDefault();}}
                    >
                        レジへ進む
                    </Link>
                    {/* <button
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder || cartItems.length === 0}
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {isPlacingOrder? '注文処理中...' : '注文確定'}
                    </button> */}
                </div>
            </div>
        </div>
    );
}

export default CartPage;