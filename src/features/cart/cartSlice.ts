import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product } from '../products/productSlice';

import apiClient from '../../lib/axios';

// バックエンドAPIから返ってくるカートアイテムの型
// DBの`include: { product: true }`のおかげで、商品情報も含まれています。
export interface CartItem {
    id: number;
    quantity: number;
    userId: string;
    productId: number;
    product: Product;
}

export interface CartState {
    items: CartItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
};

const initialState: CartState = {
    items: [],
    status: 'idle',
    error: null,
};

// 【createAsyncThunk解説】
// 非同期処理を扱うためのRedux Toolkitの機能です。
// <戻り値の型, 引数の型, 設定オブジェクトの型> という3つの型引数を取ります。

// GET
export const fetchCart = createAsyncThunk<
    CartItem[],
    void,
    {rejectValue: string}
> (
    'cart/fetchCart',
    async(_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<CartItem[]>('/cart');
            return response.data;
        } catch(error: any){
            return rejectWithValue(error.response?.data?.error || 'カートの取得に失敗しました');
        }
    }
);

// POST
export const addItemToCartAPI = createAsyncThunk<
    CartItem, // fulfilledで返る型 (更新後のカート)
    { productId: number; quantity?: number },
    { rejectValue: string }
>(
    'cart/addItemToCart',
    async({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            console.log(`addItemToCart(productId): ${productId}`);
            const response = await apiClient.post<CartItem>('/cart', {productId, quantity});
            return response.data;
        }catch(error: any){
            return rejectWithValue(error.response?.data?.error || 'アイテムの追加に失敗しました');
        }
    }
);

// PUT
export const updateItemQuantityAPI = createAsyncThunk<
    CartItem,
    {itemId: number; quantity: number },
    {rejectValue: string}
>(
    'cart/updateItemQuantity',
    async({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put<CartItem>(`/cart/${itemId}`, {quantity});
            return response.data;
        } catch(error: any){
            return rejectWithValue(error.response?.data?.error || '数量の更新に失敗しました');
        }
    }
);

// DELETE
export const removeItemFromCartAPI = createAsyncThunk<
    number,
    number,
    {rejectValue: string}
>(
    'cart/removeItemFromCart',
    async(itemId, {rejectWithValue}) => {
        try {
            await apiClient.delete<number>(`/cart/${itemId}`);
            return itemId;
        } catch(error: any){
            return rejectWithValue(error.response?.data?.error || 'アイテムの削除に失敗しました');
        }
    }
);

// DELETE
export const clearCartAPI = createAsyncThunk<
    void,
    void,
    {rejectValue: string}
>(
    'cart/clearCart',
    async(_, {rejectWithValue}) => {
        try {
            await apiClient.delete('/cart');
            return;
        } catch(error: any){
            return rejectWithValue(error.response?.data?.error || 'カートの削除に失敗しました');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // ログアウト時にローカルのカート情報をクリアするためのReducer
        clearCartLocally: (state) => {
            state.items = [];
            state.status = 'idle';
        },
        // バックエンドサーバー実装時に削除
        // addItemToCart: (state, action: PayloadAction<Product>) => {
        //     const newItem = action.payload;
        //     const existingItem = state.items.find(item => item.id === newItem.id);

        //     if (existingItem){
        //         existingItem.quantity++;
        //     }else{
        //         state.items.push({...newItem, quantity: 1});
        //     }
        // },
        // removeItemFromCart:(state, action: PayloadAction<Product['id']>) => {
        //     const itemIdToRemove = action.payload;
        //     state.items = state.items.filter(item => item.id !== itemIdToRemove);
        // },
        // updateItemQuantity:(state, action: PayloadAction<{id: Product['id'], quantity: number}>) => {
        //     const {id, quantity} = action.payload;
        //     const ItemToUpdate = state.items.find(item => item.id === id);

        //     if (ItemToUpdate){
        //         if (quantity > 0){
        //             ItemToUpdate.quantity = quantity;
        //         }else{
        //             state.items = state.items.filter(item => item.id !== id);
        //         }
        //     }
        // },
        // clearCart:(state) => {
        //     state.items = [];
        // },
    },
    extraReducers: (builder) => {
        // 各AsyncThunkの pending, fulfilled, rejected を処理
        // fetchCart
        builder
            .addCase(fetchCart.pending, (state) => {state.status = 'loading'; state.error = null;})
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {state.status = 'failed'; state.error = action.payload || 'Error'});
        
        // addItemToCartAPI
        builder
            .addCase(addItemToCartAPI.pending, (state) => { state.status = 'loading'; /* 他のpending処理 */ })
            .addCase(addItemToCartAPI.fulfilled, (state, action: PayloadAction<CartItem>) => {
                state.status = 'succeeded';
                const updatedItem = action.payload;
                const index = state.items.findIndex(item => item.id === updatedItem.id);
                if (index !== -1) {
                    state.items[index] = updatedItem;
                } else {
                    state.items.push(updatedItem);
                }
            })
            .addCase(addItemToCartAPI.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Error'; });
            
        // updateItemQuantityAPI
        builder
            .addCase(updateItemQuantityAPI.pending, (state) => { state.status = 'loading'; /* ... */ })
            .addCase(updateItemQuantityAPI.fulfilled, (state, action: PayloadAction<CartItem>) => {
                state.status = 'succeeded';
                const updatedItem = action.payload;
                const index = state.items.findIndex(item => item.id === updatedItem.id);
                if (index !== -1) {
                    state.items[index] = updatedItem;
                }
            })
            .addCase(updateItemQuantityAPI.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Error'; });

        // removeItemFromCartAPI
        builder
            .addCase(removeItemFromCartAPI.pending, (state) => { state.status = 'loading'; /* ... */ })
            .addCase(removeItemFromCartAPI.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                const itemIdToRemove = action.payload;
                state.items = state.items.filter(item => item.id !== itemIdToRemove);
            })
            .addCase(removeItemFromCartAPI.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Error'; });

        // clearCartAPI
        builder
            .addCase(clearCartAPI.pending, (state) => { state.status = 'loading'; /* ... */ })
            .addCase(clearCartAPI.fulfilled, (state) => {
                state.status = 'succeeded';
                state.items = [];
            })
            .addCase(clearCartAPI.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Error'; });
    }
});

// export const {addItemToCart, removeItemFromCart, updateItemQuantity, clearCart} = cartSlice.actions;


export const selectCartTotalQuantity = (state: RootState): number => {
    return state.cart.items.reduce((totalQuantity, currentItem) => {
        return totalQuantity + currentItem.quantity;
    },0);
};

export const selectCartTotalPrice = (state: RootState): number => {
    return state.cart.items.reduce((totalPrice, currentItem) => {
        return totalPrice + (currentItem.product.price * currentItem.quantity);
    },0)
};

export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartError = (state: RootState) => state.cart.error;

export const { clearCartLocally } = cartSlice.actions;
export default cartSlice.reducer;