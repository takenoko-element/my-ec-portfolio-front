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
            <div style={{paddingTop: "100px"}}>
                <h2>ショッピングカート</h2>
                <p>カートに商品がありません</p>
                <Link to="/">お買い物を続ける</Link>
            </div>
        );
    }

    return (
        <div>
            <h2>ショッピングカート</h2>
            <ul>
                {cartItems.map((item: CartItem) => (
                    <li key={item.id} data-testid={`cart-item-${item.id}`} style={{borderBottom: '1px solid #ccc', marginBottom: '1rem', paddingBottom: '1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src={item.image} alt={item.title} style={{width:'80px', height:'80px', objectFit: 'contain', marginRight: '1rem'}}/>
                            <div>
                                <h3>{item.title}</h3>
                                <p>単価: ${item.price.toFixed(2)}</p>
                                <div>
                                    数量:
                                    <button onClick={() => handleUpdateItemQuantity(item.id, item.quantity-1)} disabled={item.quantity <= 1} data-testid={`decrement-button-${item.id}`}>
                                        -
                                    </button>
                                    <span data-testid={`quantity-${item.id}`} style={{margin: '0 0.5rem' }}>{item.quantity}</span>
                                    <button onClick={() => handleUpdateItemQuantity(item.id, item.quantity+1)} data-testid={`increment-button-${item.id}`}>
                                        +
                                    </button>
                                </div>
                                <p>小計: ${(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => handleRemoveItem(item.id)} data-testid={`remove-button-${item.id}`}>削除</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div style={{marginTop: '2rem', textAlign: 'right'}}>
                <h3>合計金額: ${totalPrice.toFixed(2)}</h3>
                <button onClick={handleClearCart} style={{marginRight: '1rem'}} data-testid={`clear-button`}>カートを空にする</button>
            </div>
        </div>
    );
}