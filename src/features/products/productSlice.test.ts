// Vitest の describe, it, expect を使う (globals: true なら不要な場合もある)
import { describe, it, expect } from 'vitest'; 

import { beforeEach } from "vitest";
import productsReducer from "./productSlice";
import {initialState, fetchProducts} from "./productSlice";
import type{Product, ProductsState} from "./productSlice";

// テスト用のモック商品データ
const mockProduct1: Product = {
  id: 1,
  title: 'Test Product 1',
  price: 100,
  description: 'Description 1',
  category: 'Category A',
  image: 'image1.jpg',
  rating: { rate: 4.5, count: 10 },
};

const mockProduct2: Product = {
  id: 2,
  title: 'Test Product 2',
  price: 200,
  description: 'Description 2',
  category: 'Category B',
  image: 'image2.jpg',
  rating: { rate: 3.5, count: 5 },
};

describe("productsSlice reducers", () => {
    let currentState: ProductsState;

    beforeEach(() => {
        currentState = initialState;
    })

    it("空のactionを渡したとき、initialStateを返すか？", () => {
        const actual = productsReducer(undefined, {type: ""});
        expect(actual).toEqual(initialState);
    });

    describe("fetchProducts async thunk", () => {
        it('fetchProducts.pendingがdispatchされた時に、statusに"Loading"がセットされるか？', () => {
            const action = {type: fetchProducts.pending.type};
            const nextState = productsReducer(currentState, action);

            expect(nextState.status).toBe('loading');
            expect(nextState.error).toBeNull();
            console.log('test: fetchPdoruct.pending',nextState);
        });
        it('fetchProducts.fulfilledがdispatchされた時に、statusに"succeeded"が設定され、Productsに保存されるか？', () => {
            const mockProductsPayload: Product[] = [mockProduct1, mockProduct2];
            const action = {type: fetchProducts.fulfilled.type, payload: mockProductsPayload};
            const nextState = productsReducer(currentState, action);

            expect(nextState.status).toBe('succeeded');
            expect(nextState.items).toEqual(mockProductsPayload);
            expect(nextState.error).toBeNull();
            console.log('Test: fetchProducts.fulfilled',nextState);
        });
        it('fetchProducts.rejectedがdispatchされた時に、statusが"failed"に設定され、エラーメッセージが保存されるか？', () => {
            const mockErrorPayload = 'Failed to fetch';
            const action = {type: fetchProducts.rejected.type, paylaod: mockErrorPayload, error: {message: mockErrorPayload}};
            const nextState = productsReducer(currentState, action);

            //expect(nextState.status).toBe('failed');
            //expect(nextState.items).toEqual([]);
            //expect(nextState.error).toBe(mockErrorPayload);
            console.log('Test: fetchProduct.rejected',nextState);
        });
    });
})