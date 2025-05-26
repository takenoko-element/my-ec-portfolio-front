import React from "react";
import userEvent from '@testing-library/user-event'
import { screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RenderWithProviders } from "../../utils/test-utils";
import CartPage from "./CartPage";
import cartReducer from "./cartSlice";
import * as cartSliceModule from './cartSlice';
import type { CartItem } from "./cartSlice";
import productsReducer from "../products/productSlice";
import type { Product } from "../products/productSlice";

import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

const renderWithRouterAndProviders = (
    ui: React.ReactElement,
    options?: Parameters<typeof RenderWithProviders>[1]
) => {
    return RenderWithProviders(<BrowserRouter>{ ui }</BrowserRouter>,options);
};
const mockProductBase: Omit<Product, 'id' | 'title' | 'price'> = {
    description: 'mock description',
    category: 'mock category',
    image: 'mock.jpg',
    rating: {rate: 0, count: 0},
};

describe('CartPage Componnent', () => {
    beforeEach(() => {

    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('1. カートが空の場合、「カートに商品がありません」と表示されること', () => {
        renderWithRouterAndProviders(<CartPage />, {
            preloadedState: {
                cart: { items: [] },
            },
        });

        expect(screen.getByRole('heading', {name: /ショッピングカート/i})).toBeInTheDocument();
        expect(screen.getByText('カートに商品がありません')).toBeInTheDocument();
        expect(screen.getByRole('link', {name: /お買い物を続ける/i})).toBeInTheDocument();
    });

    describe('カートに商品がある場合', () => {
        const mockCartItems: CartItem[] = [
            {...mockProductBase, id: 1, title: '商品A', price: 100, quantity: 2},
            {...mockProductBase, id: 2, title: '商品B', price: 200, quantity: 1},
        ];

        it('2. 商品情報（タイトル、価格、数量、小計）が正しく表示されること', () => {
            renderWithRouterAndProviders(<CartPage />, {
                preloadedState: {
                    cart: {items: mockCartItems},
                },
            });
            const productAItem = screen.getByText('商品A').closest('li');

            if (productAItem) {
                const { getByText: getByTextInProductA, getByTestId: getByTestIdInProductA } = within(productAItem); // getByTestIdもwithinから取得
                expect(getByTextInProductA(/単価: \$100\.00/i)).toBeInTheDocument();

                // 「数量:」ラベルの確認 (任意)
                expect(getByTextInProductA(/数量:/i)).toBeInTheDocument();
                // data-testid を使って数量の要素を取得し、テキスト内容を検証
                const quantitySpan = getByTestIdInProductA(`quantity-${mockCartItems[0].id}`); // 商品AのID (例: 1)
                expect(quantitySpan).toBeInTheDocument();
                expect(quantitySpan).toHaveTextContent('2'); // テキスト内容が '2' であることを確認

                expect(getByTextInProductA(/小計: \$200\.00/i)).toBeInTheDocument();
            }

            // expect(screen.getByText('商品A')).toBeInTheDocument();
            // expect(screen.getByText((content, element) => !!(content.includes('単価: $100.00') && element?.textContent?.includes('商品A')))).toBeInTheDocument();
            // expect(screen.getByText((content, element) => !!(content.includes('数量:') && element?.innerHTML.includes('<span>2</span>') && element?.textContent?.includes('商品A')))).toBeInTheDocument();
            // expect(screen.getByText((content, element) => !!(content.includes('小計: $200.00') && element?.textContent?.includes('商品A')))).toBeInTheDocument();

            expect(screen.getByText('商品B')).toBeInTheDocument();
        });
        it('3. 合計金額が正しく表示されること', () => {
            renderWithRouterAndProviders(<CartPage />, {
                preloadedState: {
                    cart: { items: mockCartItems },
                },
            });
            expect(screen.getByText(/合計金額: \$400\.00/i)).toBeInTheDocument();
        });
        it('4. 商品の「削除」ボタンをクリックすると、removeItemFromCart アクションがディスパッチされること', async () => {
            const user = userEvent.setup();

            // 1. storeを事前に作成
            const customStore = configureStore({
                reducer: {
                cart: cartReducer,
                products: productsReducer,
                },
                preloadedState: {
                cart: { items: mockCartItems },
                },
            });
            // 2. store.dispatch を監視
            const dispatchSpy = vi.spyOn(customStore, 'dispatch');
            // 3. storeを渡してレンダリング
            renderWithRouterAndProviders(<CartPage />, {
                store: customStore,
            });
            // 4. クリック操作
            const deleteButtonForProductA = screen.getByTestId('remove-button-1');
            await user.click(deleteButtonForProductA);
            // 5. 検証
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(cartSliceModule.removeItemFromCart(1));
        });
        it('5. 商品の数量変更ボタン（＋）をクリックすると、updateItemQuantity アクションがディスパッチされること', async () => {
            const user = userEvent.setup();

            const customStore = configureStore({
                reducer: {
                    cart: cartReducer,
                    products: productsReducer,
                },
                preloadedState: {
                    cart: {items: mockCartItems},
                },
            });
            const dispatchSpy = vi.spyOn(customStore, 'dispatch');
            renderWithRouterAndProviders(<CartPage />, {
                store: customStore,
            });
            const incrementButtonForProductA = screen.getByTestId('increment-button-1');
            await user.click(incrementButtonForProductA);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(cartSliceModule.updateItemQuantity({id: 1, quantity: 3}));
        });
        it('6. 商品の数量変更ボタン（ー）をクリックすると、updateItemQuantity アクションがディスパッチされること (数量が1より大きい場合)', async () => {
            const user = userEvent.setup();

            const customStore = configureStore({
                reducer: {
                    cart: cartReducer,
                    products: productsReducer,
                },
                preloadedState: {
                    cart: {items: mockCartItems},
                },
            });
            const dispatchSpy = vi.spyOn(customStore, 'dispatch');
            renderWithRouterAndProviders(<CartPage />, {
                store: customStore,
            });
            const incrementButtonForProductA = screen.getByTestId('decrement-button-1');
            await user.click(incrementButtonForProductA);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(cartSliceModule.updateItemQuantity({id: 1, quantity: 1}));
        });
        it('7. 「カートを空にする」ボタンをクリックすると、clearCart アクションがディスパッチされること', async () => {
            const user = userEvent.setup();

            const customStore = configureStore({
                reducer: {
                    cart: cartReducer,
                    products: productsReducer,
                },
                preloadedState: {
                    cart: {items: mockCartItems},
                },
            });
            const dispatchSpy = vi.spyOn(customStore, 'dispatch');
            renderWithRouterAndProviders(<CartPage />, {
                store: customStore,
            });
            const incrementButtonForProductA = screen.getByTestId('clear-button');
            await user.click(incrementButtonForProductA);

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith(cartSliceModule.clearCart());
        });
    });
});