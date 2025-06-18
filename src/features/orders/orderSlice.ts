import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";
import type { Product } from "../products/productSlice";

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    productId: number;
    product: Product;
}

export interface Order {
    id: number;
    userId: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
}

export interface OrderState {
    orders: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    status: 'idle',
    error: null,
}

export const fetchOrderAPI = createAsyncThunk<Order[]>(
    'orders/fetchOrder',
    async(_,{rejectWithValue}) => {
        try {
            const response = await apiClient.get('/orders');
            return response.data;
        } catch (error: any) {
            console.log('[orderSlice] Failed to fetchOrderAPI', error);
            return rejectWithValue(error.response?.data?.error || '注文履歴の取得に失敗しました');
        }
    }
)
export const createOrderAPI = createAsyncThunk<Order>(
    'orders/createOrder',
    async(_, {rejectWithValue}) => {
        try {
            const response = await apiClient.post('/orders');
            return response.data;
        }catch (error: any) {
            console.log('[orderSlice] Failed to createOrderAPI', error);
            return rejectWithValue(error.response?.data?.error || '注文の作成に失敗しました');
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderAPI.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrderAPI.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrderAPI.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error as string;
            });
        builder
            .addCase(createOrderAPI.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrderAPI.fulfilled, (state, action: PayloadAction<Order>) => {
                state.status = 'succeeded';
                // 新しく作成された注文を注文リストの先頭に追加
                state.orders.unshift(action.payload);
            })
            .addCase(createOrderAPI.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

import type { RootState } from "../../app/store";
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderStatus = (state: RootState) => state.orders.status;

export default orderSlice.reducer;