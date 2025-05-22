import React from 'react';
import type { JSX, PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import type { Reducer, UnknownAction } from '@reduxjs/toolkit';
// import type { PreloadedState } from "@reduxjs/toolkit"; // ← PreloadedState のインポートは不要になります
import { Provider } from 'react-redux';

import type { AppStore, RootState } from '../app/store'; // RootState は引き続き利用します
import productsReducer, {type ProductsState} from '../features/products/productSlice';

// テスト用のレンダーオプションに preloadedState を追加するためのインターフェース
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>; // ← ここを Partial<RootState> に変更
    store?: AppStore;
}

export function RenderWithProviders(
    ui: React.ReactElement,
    {
        preloadedState = {}, // {} は Partial<RootState> と互換性があります
        store = configureStore({
            reducer: {
                products: productsReducer as Reducer<ProductsState, UnknownAction, ProductsState | undefined>,
            },
            preloadedState // ここに渡される preloadedState の型が Partial<RootState> になります
        }),
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return <Provider store={store}>{children}</Provider>;
    }
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}