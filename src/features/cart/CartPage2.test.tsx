import { screen, waitFor, within } from "@testing-library/react";
import { RenderWithProviders } from "../../utils/test-utils";
import { BrowserRouter } from "react-router-dom";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import CartPage from "./CartPage";
import type { CartItem } from "./cartSlice";
import userEvent from "@testing-library/user-event";

const renderWithRouterAndProviders = (
  ui: React.ReactElement,
  options?: Parameters<typeof RenderWithProviders>[1]
) => {
  return RenderWithProviders(<BrowserRouter>{ui}</BrowserRouter>, options);
};

const mockProductBase: Omit<CartItem, 'id' | 'title' | 'price' | 'quantity' > = {
    description: 'mock description',
    category: 'mock category',
    image: 'mock.jpg',
    rating: {rate: 0, count: 0},
};

describe('CartPage Component (with MSW and API integration)', () => {
    afterEach(() => {
        server.resetHandlers();
    });

    it('1.カートが空の場合、APIから空のカートを取得して表示する', async () => {
        server.use(http.get('*/api/cart', () => HttpResponse.json([])));

        renderWithRouterAndProviders(<CartPage />);
        expect(await screen.findByText('カートに商品がありません')).toBeInTheDocument();
    });
    it('2.商品追加ボタンクリック後、カートに商品が追加され表示が更新されること', async () => {
        const productToAdd = { ...mockProductBase, id: 1, title: "Test Product", price: 100, quantity: 1 } as CartItem;
        server.use(
            http.post('*/api/cart/items',async () => {
                return HttpResponse.json([productToAdd]);
            }),
            http.get('*/api/cart', async () => {
                return HttpResponse.json([productToAdd]);
            })
        );
        renderWithRouterAndProviders(<CartPage />);
        expect(await screen.findByText(productToAdd.title)).toBeInTheDocument();

        const productAItem = screen.getByText('Test Product').closest('li');

        if (productAItem) {
            const { getByText: getByTextInProductA, getByTestId: getByTestIdInProductA } = within(productAItem); // getByTestIdもwithinから取得
            expect(getByTextInProductA(/単価: \$100\.00/i)).toBeInTheDocument();

            // 「数量:」ラベルの確認 (任意)
            expect(getByTextInProductA(/数量:/i)).toBeInTheDocument();
            // data-testid を使って数量の要素を取得し、テキスト内容を検証
            const quantitySpan = getByTestIdInProductA(`quantity-${productToAdd.id}`); // 商品AのID (例: 1)
            expect(quantitySpan).toBeInTheDocument();
            expect(quantitySpan).toHaveTextContent('1');
            expect(getByTextInProductA(/小計: \$100\.00/i)).toBeInTheDocument();
        }
    });
    it('3. 商品の「削除」ボタンをクリックすると、removeItemFromCart アクションがディスパッチされること', async () => {
        const user = userEvent.setup();
        const initialCartItem: CartItem[] = [
            { ...mockProductBase, id: 1, title: "Test Product", price: 100, quantity: 3},
            { ...mockProductBase, id: 2, title: "Product B", price: 200, quantity: 4},
            { ...mockProductBase, id: 3, title: "Product G", price: 450, quantity: 7},
        ];
        const itemToDelete = initialCartItem[0];

        server.use(
            http.get('*/api/cart', async () => {
                return HttpResponse.json(initialCartItem);
            }),
            http.delete(`*/api/cart/items/${itemToDelete.id}`, async () => {
                return HttpResponse.json(initialCartItem.filter(item => item.id !== itemToDelete.id), {status: 200});
            })
        );

        // 3. storeを渡してレンダリング
        renderWithRouterAndProviders(<CartPage />);
        expect(await screen.findByText(itemToDelete.title)).toBeInTheDocument();
        // 4. クリック操作

        const deleteButtonForProductA = screen.getByTestId(`remove-button-${itemToDelete.id}`);
        await user.click(deleteButtonForProductA);
        // 5. 検証
        expect(await screen.queryByText(itemToDelete.title)).not.toBeInTheDocument();
        expect(screen.getByText(initialCartItem[2].title)).toBeInTheDocument();
    });
    it('4. 商品の数量変更のボタンをクリックすると、ボタンの効果と回数が正しく反映されるか', async () => {
        const user = userEvent.setup();
        let currentServerCart: CartItem[] = [
            { ...mockProductBase, id: 1, title: "Test Product", price: 100, quantity: 3},
            { ...mockProductBase, id: 2, title: "Product B", price: 200, quantity: 4},
            { ...mockProductBase, id: 3, title: "Product G", price: 450, quantity: 7},
        ];
        const testItem = currentServerCart[0];

        server.use(
            http.get('*/api/cart', async () => {
                return HttpResponse.json(currentServerCart);
            }),
            http.put(`*/api/cart/items/${testItem.id}`, async ({request}) => {
                const { quantity: newQuantity } = await request.json() as { quantity: number };

                const itemIndex = currentServerCart.findIndex(item => item.id === testItem.id);
                if (itemIndex > -1) {
                    if (newQuantity > 0) {
                        currentServerCart[itemIndex] = { ...currentServerCart[itemIndex], quantity: newQuantity };
                    } else { // 数量0なら削除
                        console.log("Impossible case");
                        currentServerCart = currentServerCart.filter(item => item.id !== testItem.id);
                    }
                }
                return HttpResponse.json([...currentServerCart], { status: 200 });
            })
        );

        renderWithRouterAndProviders(<CartPage />);
        expect(await screen.findByText(testItem.title)).toBeInTheDocument();
        const quantitySpan = await screen.findByTestId(`quantity-${testItem.id}`);
        expect(quantitySpan).toHaveTextContent('3');
        // 4. クリック操作
        const plusButtonForTestItem = screen.getByTestId(`increment-button-${testItem.id}`);
        const minusButtonForTestItem = screen.getByTestId(`decrement-button-${testItem.id}`);
        await user.click(plusButtonForTestItem);
        // 5. 検証
        // 5.1 増加と減少の検証
        await waitFor(() => {
            expect(quantitySpan).toHaveTextContent('4');
        });
        await user.click(minusButtonForTestItem);
        await waitFor(() => {
            expect(quantitySpan).toHaveTextContent('3');
        });
        await user.click(minusButtonForTestItem);
        await user.click(minusButtonForTestItem);
        await waitFor(() => {
            expect(quantitySpan).toHaveTextContent('1');
        });
        // 5.2 -ボタンでは0以下にはならないことの検証
        await user.click(minusButtonForTestItem);
        await waitFor(() => {
            expect(quantitySpan).toHaveTextContent('1');
        });
    });
})