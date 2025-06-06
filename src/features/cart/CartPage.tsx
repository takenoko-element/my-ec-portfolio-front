import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
    selectCartItems,
    selectCartTotalPrice,
    removeItemFromCartAPI,
    updateItemQuantityAPI,
    clearCartAPI,
    selectCartStatus,
    fetchCart,
    selectCartError
} from './cartSlice';
import type { CartItem } from "./cartSlice";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function CartPage() {
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector(selectCartItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const cartStatus = useSelector(selectCartStatus);
    const cartError = useSelector(selectCartError);

    useEffect(() =>{
        if(cartStatus === 'idle'){
            dispatch(fetchCart());
        }
    },[cartStatus, dispatch]);

    const handleRemoveItem = (itemId: number) => {
        console.log('[CartPage] handleRemoveItem called with itemId:', itemId);
        const actionToDispatch = removeItemFromCartAPI(itemId);
        console.log('[CartPage] Action to dispatch:', actionToDispatch);
        dispatch(actionToDispatch);
        console.log('[CartPage] Dispatched action.');
    };
    const handleUpdateItemQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity >= 0){
            dispatch(updateItemQuantityAPI({itemId: itemId, quantity: newQuantity}));
        }
    };
    const handleClearCart = () => {
        dispatch(clearCartAPI());
    };

    if(cartStatus === 'loading' && cartItems.length === 0){
        return <div>カートを読み込んでいます...</div>
    }

    if(cartStatus === 'failed'){
        return <div>カートの読み込みに失敗しました: {cartError || '不明なエラー' }</div>
    }

    if(cartItems.length === 0){
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

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">ショッピングカート</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ul>
                    {cartItems.map((item: CartItem) => (
                        <li key={item.id} 
                            data-testid={`cart-item-${item.id}`} 
                            className="flex flex-col sm:flex-row items-center p-4 border-b border-gray-200 last:border-b-0"
                        >
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded border border-gray-200 mb-4 sm:mb-0 sm:mr-6"
                            />
                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                    <Link to={`/product/${item.id}`} className="hover:text-blue-600">{item.title}</Link>
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">単価: ${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center my-2 sm:my-0 sm:mx-6">
                                <button 
                                    onClick={() => handleUpdateItemQuantity(item.id, item.quantity-1)} 
                                    disabled={item.quantity <= 1} 
                                    data-testid={`decrement-button-${item.id}`}
                                    className="px-3 py-1 border rounded-l bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                    aria-label={`商品 ${item.title} の数量を1減らす`}
                                >
                                    -
                                </button>
                                <span 
                                    data-testid={`quantity-${item.id}`} 
                                    className="px-4 py-1 border-t border-b text-center w-12"
                                    aria-live="polite"
                                >
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => handleUpdateItemQuantity(item.id, item.quantity+1)} 
                                    data-testid={`increment-button-${item.id}`}
                                    className="px-3 py-1 border rounded-r bg-gray-100 hover:bg-gray-200"
                                    aria-label={`商品 ${item.title} の数量を1増やす`}
                                >
                                    +
                                </button>
                            </div>
                            <p className="font-semibold text-gray-800 w-24 text-center sm:text-right my-2 sm:my-0">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button 
                                onClick={() => handleRemoveItem(item.id)} 
                                data-testid={`remove-button-${item.id}`}
                                className="ml-auto sm:ml-6 text-red-500 hover:text-red-700 font-medium text-sm"
                                aria-label={`商品 ${item.title} をカートから削除`}
                            >
                                削除
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">合計金額:</h3>
                    <p className="text-2xl font-bold text-green-600">{totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                    <button 
                        onClick={handleClearCart} 
                        data-testid={`clear-button`}
                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-gray-100"
                    >
                        カートを空にする
                    </button>
                    <button
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                        レジへ進む（未実装）
                    </button>
                </div>
            </div>
        </div>
    );
}