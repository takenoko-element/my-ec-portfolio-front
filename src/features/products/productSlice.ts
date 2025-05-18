import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
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

export const fetchProducts = createAsyncThunk<Product[]>(
    "products/fetchProducts",
    async(_, thunkAPI) => {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            if (!response.ok) {
                return thunkAPI.rejectWithValue('Failed to fetch products. Status: ' + response.status);
            }
            const data: Product[] = await response.json();
            return data;
        }catch (error:any) {
            return thunkAPI.rejectWithValue(error.message || 'An unknown error occurred');
        }
    }
);

const ProductsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        /*
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
        */
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
                state.error = null;
                console.log('fetchProducts.pending: status set to loading');
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
                console.log('fetchProducts.fulfilled: items set, status set to succeeded', action.payload);
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || action.error.message || 'Fetch failed';
                console.log('fetchProducts.rejected: error set, status set to failed', action);
            })
    }
});

// export const { setProducts, startLoadingProducts, productReceived, productsLoadingFailed} = ProductsSlice.actions;

export default ProductsSlice.reducer;
