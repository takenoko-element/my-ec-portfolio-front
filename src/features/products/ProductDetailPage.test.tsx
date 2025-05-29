import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, type MockInstance, beforeEach, afterEach } from 'vitest';
import { RenderWithProviders } from '../../utils/test-utils';

import ProductDetailPage from './productDetailPage';
import * as productSliceModule from './productSlice';
import * as cartSlicerModule from '../cart/cartSlice';
import type { Product } from './productSlice';
import type { RootState } from '../../app/store';

import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockProductBase: Omit<Product, 'id' | 'title' | 'price' | 'category' | 'description' | 'image' | 'rating'> = {
    description: 'mock description',
    category: 'mock category',
    image: 'mock.jpg',
    rating: {rate: 0, count: 0},
};
const mockProduct1: Product = {
    ...mockProductBase,
    id: 1,
    title: 'Test Product 1',
    price: 100,
    category: 'Electronics',
    description: 'This is a detailed description for product 1.',
    image: 'product1.jpg',
    rating: {rate: 4.5, count: 120},
};
const mockProduct2: Product = {
    ...mockProductBase,
    id: 2,
    title: 'Test Product 2',
    price: 200,
    category: 'Books',
    description: 'Amazing description for product 2.',
    image: 'product2.jpg',
    rating: {rate: 3.8, count: 80},
};

const renderProductDetailPage = (
  productId: string,
  initialState?: Partial<RootState>
) => {
  // MemoryRouterを使うことで、テスト内でURLとルーティングを制御できる
  // initialEntriesで初期URLパスを指定
  return RenderWithProviders(
    <MemoryRouter initialEntries={[`/products/${productId}`]}>
      <Routes>
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        {/* 必要であれば他のダミールートも定義 */}
        <Route path="/" element={<div>商品一覧ページモック</div>} />
      </Routes>
    </MemoryRouter>,
    initialState ? { preloadedState: initialState } : undefined
  );
};

describe('ProductDetailPage Component', () => {
    let fetchProductsSpy: MockInstance;
    let addItemToCartSpy: MockInstance;
    beforeEach(() => {
        fetchProductsSpy = vi.spyOn(productSliceModule, 'fetchProducts');
        addItemToCartSpy = vi.spyOn(cartSlicerModule, 'addItemToCart');
        fetchProductsSpy.mockImplementation(() => (
            (_dispatch: any, _getState: any) => 
                Promise.resolve({meta:{}, payload: [mockProduct1, mockProduct2], type: 'products/fetchProducts/fulfelled'})
        ) as any);
        addItemToCartSpy.mockImplementation((productPayload) => ({
            type: 'cart/addItemToCart', // アクションタイプを直接指定
            payload: productPayload,
        }));
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('1. URLパラメータに対応する商品情報が正しく表示されること', () => {
        renderProductDetailPage('1', {
            products: {
                items: [mockProduct1, mockProduct2],
                status: 'succeeded',
                error: null,
            },
            cart: { items: []},
         });
         
         expect(screen.getByRole('heading', { name: /Test Product 1/i})).toBeInTheDocument();
         expect(screen.getByText(`カテゴリー: ${mockProduct1.category}`)).toBeInTheDocument();
         expect(screen.getByText(`価格: ${mockProduct1.price.toFixed(2)}`)).toBeInTheDocument();
         expect(screen.getByText(mockProduct1.description)).toBeInTheDocument();
         expect(screen.getByAltText(mockProduct1.title)).toHaveAttribute('src', mockProduct1.image);
         expect(screen.getByText((content) => content.includes('評価') && content.includes(String(mockProduct1.rating.rate)) && content.includes(String(mockProduct1.rating.count)))).toBeInTheDocument();
         expect(fetchProductsSpy).not.toHaveBeenCalled();
    });
    it('2. ローディング中に「ローディング中...」が表示されること', () => {
        renderProductDetailPage('1', {
            products: {
                items: [],
                status: 'loading',
                error: null,
            },
        });
        expect(screen.getByText('ローディング中...')).toBeInTheDocument();
    });
    it('3. 商品が見つからない場合に「商品が見つかりませんでした」と表示されること', () => {
        renderProductDetailPage('999', {
            products: {
                items: [mockProduct1],
                status: 'succeeded',
                error: null,
            },
        });
        expect(screen.getByText('商品が見つかりませんでした。')).toBeInTheDocument();
    });
    it('4. エラー発生時にエラーメッセージが表示されること', () => {
        const errorMessage = 'Failed to load';
        renderProductDetailPage('1', {
            products: {
                items: [],
                status: 'failed',
                error: errorMessage,
            },
        });
        expect(screen.getByText(new RegExp(`エラー: ${errorMessage}`))).toBeInTheDocument();
    });
    it('5. 「カートに追加」ボタンをクリックすると addItemToCart アクションがディスパッチされること', async () => {
        const user = userEvent.setup();
        renderProductDetailPage('1', {
            products: {
                items: [mockProduct1, mockProduct2],
                status: 'succeeded',
                error: null,
            },
            cart: { items: [] }
        });
        const addToCartButton = screen.getByRole('button', {name: /カートに追加/i});
        await user.click(addToCartButton);

        expect(addItemToCartSpy).toHaveBeenCalledTimes(1);
        expect(addItemToCartSpy).toHaveBeenCalledWith(mockProduct1);
    });
    it('6. ストアに商品データがない場合、fetchProductsがディスパッチされること', () => {
        renderProductDetailPage('1', {
            products: {
                items: [],
                status: 'idle',
                error: null,
            },
        });
        expect(fetchProductsSpy).toHaveBeenCalledTimes(1);
    });
    it('7. データフェッチ失敗後(failed, items空)に商品詳細ページを開いた場合、fetchProductsがディスパッチされること', () => {
        const errorMessage = 'Previous fetch failed';
        renderProductDetailPage('1', {
            products: {
                items: [],
                status: 'failed',
                error: errorMessage,
            },
        });
        expect(fetchProductsSpy).toHaveBeenCalledTimes(1);
    });
    it('8. ストアにデータはあるが指定IDの商品がない場合、fetchProductsはディスパッチされないこと (全件取得済みのため)', () => {
    renderProductDetailPage('999', { // 存在しない商品ID
      products: {
        items: [mockProduct1, mockProduct2], // 他の商品は存在する
        status: 'succeeded',
        error: null,
      },
      cart: { items: [] }
    });
    // condition1: !product (true) && (productStatus === 'idle' (false) || productStatus === 'failed' (false)) -> false
    // condition2: productStatus === 'idle' (false) && productListFromStore.length === 0 (false) -> false
    expect(fetchProductsSpy).not.toHaveBeenCalled();
    // そして「商品が見つかりませんでした」が表示されるはず
    expect(screen.getByText(/商品が見つかりませんでした。/i)).toBeInTheDocument();
  });
})