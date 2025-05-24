import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RenderWithProviders } from '../utils/test-utils';
import Header from './Header';
import type { CartItem } from '../features/cart/cartSlice';
import type { Product } from '../features/products/productSlice';

import { BrowserRouter } from 'react-router-dom';

const renderWithProviders = (
    ui: React.ReactElement,
    options?: Parameters<typeof RenderWithProviders>[1]
) => {
    return RenderWithProviders(<BrowserRouter>{ui}</BrowserRouter>,options);
};

describe('Header Component', () => {
    it('1. サイトタイトルが正しく表示されること', () => {
        renderWithProviders(<Header />);
        expect(screen.getByRole('heading',{ name: /my ec site/i})).toBeInTheDocument();
    });
    it('2. ナビゲーションリンクが正しく表示され、正しいパスを持っていること', () => {
        renderWithProviders(<Header />);

        const homelink = screen.getByRole('link', {name: /ホーム/i});
        expect(homelink).toBeInTheDocument();
        expect(homelink).toHaveAttribute('href', '/');

        const cartlink = screen.getByRole('link', {name: /カート/i});
        expect(cartlink).toBeInTheDocument();
        expect(cartlink).toHaveAttribute('href', '/cart');
    });
    it('3. カートが空の場合、カート内の合計商品数が (0) と表示されること', () => {
        renderWithProviders(<Header />, {
            preloadedState: {
                cart: {items: []},
            },
        });
        expect(screen.getByRole('link', {name: /カート（0）/i})).toBeInTheDocument();
    });
    it('4. カートに商品がある場合、正しい合計商品数が表示されること', () => {
        const mockProductBase: Omit<Product, 'id'|'title'|'price'> ={
            description: 'mock description',
            category: 'mock category',
            image: 'mock.jpg',
            rating: {rate: 0, count: 0},
        };
        const mockCartItem: CartItem[] = [
            {...mockProductBase, id: 1, title: 'Product 1', price: 100, quantity: 2},
            {...mockProductBase, id: 2, title: 'Product 2', price: 200, quantity: 3},
        ];

        renderWithProviders(<Header />, {
            preloadedState: {
                cart: {items: mockCartItem},
            },
        });

        expect(screen.getByRole('link', { name: /カート（5）/i })).toBeInTheDocument();
    });
    it('5. カート内の商品数が変更されたら、表示も更新されること', () => {
        const initialCartItems: CartItem[] = [
            {id: 1, title: 'Initial Product', price: 50, quantity: 1, description: 'desc', category: 'cat', image: 'img.jpg', rating: {rate: 1, count: 1}},
        ];
        const { store } = renderWithProviders(<Header />, {
            preloadedState: {
                cart: { items: initialCartItems},
            },
        });
        expect(screen.getByRole('link', {name: /カート（1）/i})).toBeInTheDocument();

        const productToAdd: Product = {
            id: 2, title: 'New Product', price: 100, description: 'new desc', category: 'new cat', image: 'new.jpg', rating: { rate: 1, count: 1 }
        };
        store.dispatch({
            type: 'cart/addItemToCart',
            payload: productToAdd
        });
        return waitFor(() => {
            expect(screen.getByRole('link', {name: /カート（2）/i})).toBeInTheDocument();
        });
    });
})