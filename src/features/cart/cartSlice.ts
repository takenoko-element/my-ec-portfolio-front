import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Product } from '../products/productSlice';

export interface CartItem extends Product {
    quantity: number;
};

export interface CartState {
    items: CartItem[];
};

const initialState: CartState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action: PayloadAction<Product>) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem){
                existingItem.quantity++;
            }else{
                state.items.push({...newItem, quantity: 1});
            }
        },
        removeItemFromCart:(state, action: PayloadAction<Product['id']>) => {
            const itemIdToRemove = action.payload;
            state.items = state.items.filter(item => item.id !== itemIdToRemove);
        },
        updateItemQuantity:(state, action: PayloadAction<{id: Product['id'], quantity: number}>) => {
            const {id, quantity} = action.payload;
            const ItemToUpdate = state.items.find(item => item.id === id);

            if (ItemToUpdate){
                if (quantity > 0){
                    ItemToUpdate.quantity = quantity;
                }else{
                    state.items = state.items.filter(item => item.id !== id);
                }
            }
        },
        clearCart:(state) => {
            state.items = [];
        },
    },
});

export const {addItemToCart, removeItemFromCart, updateItemQuantity, clearCart} = cartSlice.actions;

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

export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;