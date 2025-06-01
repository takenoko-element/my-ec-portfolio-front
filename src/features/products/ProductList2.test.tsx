import { screen } from "@testing-library/react";
import { RenderWithProviders } from "../../utils/test-utils";
import { BrowserRouter } from "react-router-dom";
import ProductList from "./ProductList";
import userEvent from "@testing-library/user-event";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";


const renderWithRouterAndProviders = (
  ui: React.ReactElement,
  options?: Parameters<typeof RenderWithProviders>[1]
) => {
  return RenderWithProviders(<BrowserRouter>{ui}</BrowserRouter>, options);
};

describe('ProductList Component 2 (with MSW)', () => {
    it('1. APIから取得した商品が正しく表示されること', async () => {
        renderWithRouterAndProviders(<ProductList />, {
            preloadedState: {
                products: {items:[], status: 'idle', error: null},
            },
        });
        expect(await screen.findByText('MSW Product 1')).toBeInTheDocument();
        expect(screen.getByText('MSW Product 2')).toBeInTheDocument();
    });
    it('2. 検索を行うと、MSWがフィルタリングした結果が表示されること', async () => {
        const user = userEvent.setup();
        renderWithRouterAndProviders(<ProductList />, {
            preloadedState: {
                products: {items:[], status: 'idle', error: null},
            },
        });
        expect(await screen.findByText('MSW Product 1')).toBeInTheDocument();

        const searchInput = screen.getByPlaceholderText(/商品名を検索.../i);
        const searchButton = screen.getByRole('button', {name: /検索/i});
        await user.type(searchInput, 'Product 1');
        await user.click(searchButton);

        expect(await screen.findByText('MSW Product 1')).toBeInTheDocument();
        expect(screen.queryByText('MSW Product 2')).not.toBeInTheDocument();
    });
    it('3. APIエラー時にエラーメッセージが表示されること', async () => {
        const apiErrorMessage = 'Internal Server Error from MSW';
        server.use(
            http.get('*/api/products', () => {
                // console.log('[MSW Test Override] GET /api/products returning 500 error');
                return HttpResponse.json(
                    { message: apiErrorMessage },
                    {status: 500},
                );
            })
        );
        renderWithRouterAndProviders(<ProductList />, {
            preloadedState: {
                products: { items: [], status: 'idle', error: null },
                cart: { items: [] },
            },
        });

        expect(screen.getByText(/ローディング中.../i)).toBeInTheDocument();
        expect(await screen.findByText(new RegExp(`エラー: ${apiErrorMessage}`, 'i'))).toBeInTheDocument();
        expect(screen.queryByText(/ローディング中.../i)).not.toBeInTheDocument();
    });
})