// ProductList.test.tsx
import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { RenderWithProviders } from '../../utils/test-utils';
import ProductList from './ProductList';
import * as productSliceModule from './productSlice';
import type { Product } from './productSlice';

// 元の関数の型を OriginalFetchProductsType として定義
type OriginalFetchProductsType = typeof productSliceModule.fetchProducts;

describe('ProductList Component', () => {
    const mockProducts: Product[] = [
        { id: 1, title: 'Product 1', price: 10, image: 'img1.jpg', category: 'cat A', description: 'Desc 1', rating: { rate: 4, count: 100 } },
        { id: 2, title: 'Product 2', price: 20, image: 'img2.jpg', category: 'cat B', description: 'Desc 2', rating: { rate: 5, count: 200 } },
    ];

    // MockInstance の型引数を1つにし、元の関数の型を渡す
    let spiedFetchProducts: MockInstance<OriginalFetchProductsType>;

    beforeEach(() => {
        // productSliceModule.fetchProducts は関数なので、その型 (OriginalFetchProductsType) を持つスパイを作成
        spiedFetchProducts = vi.spyOn(productSliceModule, 'fetchProducts');
        
        spiedFetchProducts.mockImplementation(() => {
            const mockThunk = (_dispatch: any, _getState: any): Promise<any> => {
                return Promise.resolve({ meta: { requestId: 'mocked' }, payload: [] as Product[], type: 'mock/fulfilled' });
            };
            // mockImplementation は元の関数と同じシグネチャの関数を期待する。
            // OriginalFetchProductsType は () => AsyncThunkAction<...> なので、
            // この mockImplementation は () => AsyncThunkAction<...> を返す必要がある。
            // mockThunk は AsyncThunkAction に相当する関数。
            return mockThunk as unknown as ReturnType<OriginalFetchProductsType>;
        });
    });

    afterEach(() => {
        spiedFetchProducts.mockRestore();
    });

    // ... テスト1〜4 (変更なし) ...
    it('1. ローディング状態が正しく表示されること', () => {
        RenderWithProviders(<ProductList />, {
          preloadedState: {
            products: {
              items: [],
              status: 'loading',
              error: null,
            },
          },
        });
        expect(screen.getByText(/ローディング中.../i)).toBeInTheDocument();
      });
    
      it('2. エラー発生時にエラーメッセージが正しく表示されること', () => {
        const errorMessage = 'APIエラーが発生しました';
        RenderWithProviders(<ProductList />, {
          preloadedState: {
            products: {
              items: [],
              status: 'failed',
              error: errorMessage,
            },
          },
        });
        expect(screen.getByText(`エラー: ${errorMessage}`)).toBeInTheDocument();
      });
    
      it('3. 商品データ取得成功時に商品リストが正しく表示されること', () => {
        RenderWithProviders(<ProductList />, {
          preloadedState: {
            products: {
              items: mockProducts,
              status: 'succeeded',
              error: null,
            },
          },
        });
    
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByAltText('Product 1')).toBeInTheDocument();
        expect(screen.getByText(/\$10/)).toBeInTheDocument();
      });
    
      it('4. 商品データ取得成功時でも商品が0件の場合に「商品がありません」と表示されること', () => {
        RenderWithProviders(<ProductList />, {
          preloadedState: {
            products: {
              items: [],
              status: 'succeeded',
              error: null,
            },
          },
        });
        expect(screen.getByText(/商品がありません。/i)).toBeInTheDocument();
      });


    it('5. 初期表示時(status: idle)にfetchProductsアクションがディスパッチされること', async () => {
        RenderWithProviders(<ProductList />, {
            preloadedState: {
                products: {
                    items: [],
                    status: 'idle',
                    error: null,
                },
            },
        });

        await waitFor(() => {
            expect(spiedFetchProducts).toHaveBeenCalled();
        });
    });
});