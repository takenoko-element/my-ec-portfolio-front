import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export interface ProductsState {
    items: Product[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    status: "idle",
    error: null
};

const ProductsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            state.status = "succeeded";
            state.error = null;
        }, 
        startLoadingProducts: (state) => {
            state.status = "loading";
            state.error = null;
        },
        productReceived: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            state.status = "succeeded";
        },
        productsLoadingFailed: (state, action: PayloadAction<string>) => {
            state.status = "failed";
            state.error = action.payload;
        }
    },
});

export const { setProducts, startLoadingProducts, productReceived, productsLoadingFailed} = ProductsSlice.actions;

export default ProductsSlice.reducer;
