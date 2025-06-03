import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product } from '../products/productSlice';

const API_BASE_PORT = 'http://localhost:3001/api';

// 仮のAPIクライアント (実際にはエラーハンドリングなどをより丁寧に行う)
const apiClient = {
  get: async <T>(url: string): Promise<T> => 
    fetch(url).then(async res => res.ok ? res.json() : Promise.reject(await res.text())),
  post: async <T>(url: string, data: any): Promise<T> => 
    fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }).then(async res => res.ok ? res.json() : Promise.reject(await res.text())),
  put: async <T>(url: string, data: any): Promise<T> => 
    fetch(url, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }).then(async res => res.ok ? res.json() : Promise.reject(await res.text())),
  delete: async <T>(url: string): Promise<T> => 
    fetch(url, { method: 'DELETE' }).then(async res => res.ok ? res.json() : Promise.reject(await res.text())),
};

export interface CartItem extends Product {
    quantity: number;
};

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

// GET
export const fetchCart = createAsyncThunk<
    CartItem[],
    void,
    {rejectValue: string}
> (
    'cart/fetch',
    async(_, { rejectWithValue }) => {
        try {
            const data = await apiClient.get<CartItem[]>(`${API_BASE_PORT}/cart`);
            return data;
        } catch(error: any){
            return rejectWithValue(error.message || String(error) || 'Fail to fetch cart');
        }
    }
);

// POST
export const addItemToCartAPI = createAsyncThunk<
    CartItem[], // fulfilledで返る型 (更新後のカート)
    { productId: number; quantity?: number },
    { rejectValue: string }
>(
    'cart/addItemToCartAPI',
    async({ productId, quantity = 1 }, { rejectWithValue }) => {
        try {
            console.log(`addItemToCart(productId): ${productId}`);
            const data = await apiClient.post<CartItem[]>(`${API_BASE_PORT}/cart/items`, {productId, quantity});
            return data;
        }catch(error: any){
            return rejectWithValue(error.message || String(error) || 'Failed to add item');
        }
    }
);

// PUT
export const updateItemQuantityAPI = createAsyncThunk<
    CartItem[],
    {itemId: number; quantity: number },
    {rejectValue: string}
>(
    'cart/updateItemQuantityAPI',
    async({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const data = await apiClient.put<CartItem[]>(`${API_BASE_PORT}/cart/items/${itemId}`, {quantity});
            return data;
        } catch(error: any){
            return rejectWithValue(error.message || String(error) || 'Failed to update quantity');
        }
    }
);

// DELETE
export const removeItemFromCartAPI = createAsyncThunk<
    CartItem[],
    number,
    {rejectValue: string}
>(
    'cart/removeItemFromCartAPI',
    async(itemId, {rejectWithValue}) => {
        try {
            const data = await apiClient.delete<CartItem[]>(`${API_BASE_PORT}/cart/items/${itemId}`);
            return data;
        } catch(error: any){
            return rejectWithValue(error.message || String(error) || 'Failed to remove item');
        }
    }
);

// DELETE
export const clearCartAPI = createAsyncThunk<
    CartItem[],
    void,
    {rejectValue: string}
>(
    'cart/clearCartAPI',
    async(_, {rejectWithValue}) => {
        try {
            const data = await apiClient.delete<CartItem[]>(`${API_BASE_PORT}/cart/`);
            return data;
        } catch(error: any){
            return rejectWithValue(error.message || String(error) || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
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
            .addCase(addItemToCartAPI.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload; // APIが返したカート全体で更新
            })
            .addCase(addItemToCartAPI.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Error'; });
            
        // updateItemQuantityAPI
        builder
            .addCase(updateItemQuantityAPI.pending, (state) => { state.status = 'loading'; /* ... */ })
            .addCase(updateItemQuantityAPI.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(updateItemQuantityAPI.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Error'; });

        // removeItemFromCartAPI
        builder
            .addCase(removeItemFromCartAPI.pending, (state) => { state.status = 'loading'; /* ... */ })
            .addCase(removeItemFromCartAPI.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(removeItemFromCartAPI.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Error'; });

        // clearCartAPI
        builder
            .addCase(clearCartAPI.pending, (state) => { state.status = 'loading'; /* ... */ })
            .addCase(clearCartAPI.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload; // APIから返される空のカート
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
        return totalPrice + (currentItem.price * currentItem.quantity);
    },0)
};

export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartError = (state: RootState) => state.cart.error;

export default cartSlice.reducer;