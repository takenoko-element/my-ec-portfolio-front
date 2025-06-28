// import { delay, http, HttpResponse } from 'msw';
// import type { Product } from '../features/products/productSlice';
// import type { CartItem } from '../features/cart/cartSlice';

// const mockProducts: Product[] = [
//     { id: 1, title: 'MSW Product 1', price: 10, image: 'img1.jpg', category: 'cat A', description: 'Desc 1', rating: { rate: 4, count: 100 } },
//     { id: 2, title: 'MSW Product 2', price: 20, image: 'img2.jpg', category: 'cat B', description: 'Desc 2', rating: { rate: 5, count: 200 } },
// ];
// let mockServerCart: CartItem[] = [];

// export const handlers = [
//     // 商品リスト取得のモック (/api/products または http://localhost:3001/api/products)
//     http.get('*/api/products', async ({ request }) => {
//         const url = new URL(request.url);
//         const searchTerm = url.searchParams.get('search');
//         const category = url.searchParams.get('category');

//         /* --- ローディング確認用 --- */
//         // await delay(1500); 

//         /* --- エラーメッセージ確認用 --- */
//         // return new HttpResponse(null, {
//         //     status: 500,
//         //     statusText: 'Internal Server Error',
//         // });

//         let filteredProducts = [...mockProducts];
//         if (searchTerm){
//             filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
//         }
//         if (category){
//             filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
//         }

//         // console.log('[MSW] GET /api/products matched, returning:', filteredProducts);
//         return HttpResponse.json(filteredProducts);
//     }),

//     // cart
//     // GET /api/cart
//     http.get('*/api/cart', async () => {
//         await delay(1500); 
//         return HttpResponse.json(mockServerCart);
//     }),

//     // POST /api/cart/items
//     http.post('*/api/cart/items', async ({ request }) => {
//         const { productId, quantity = 1} = await request.json() as {productId: number, quantity?: number};
//         const product = mockProducts.find(product => product.id === productId);
//         if(!product) return new HttpResponse(null, { status: 404 });

//         const existingItemIndex = mockServerCart.findIndex(item => item.id === productId);
//         if(existingItemIndex > -1){
//             mockServerCart[existingItemIndex].quantity += quantity;
//         }else{
//             mockServerCart.push({...product, quantity});
//         }
//         return HttpResponse.json(mockServerCart, {status: 200});
//     }),

//     // PUT /api/cart/items/:productId
//     http.put('*/api/cart/items/:productId', async ({ params, request }) => {
//         const productId = Number(params.productId);
//         const {quantity} = await request.json() as {quantity: number};
//         const itemIndex = mockServerCart.findIndex(item => item.id === productId);

//         if(itemIndex === -1) return new HttpResponse(null, {status: 404});
//         if(quantity === 0){
//             mockServerCart = mockServerCart.filter(item => item.id !== productId);
//         }else{
//             mockServerCart[itemIndex].quantity = quantity;
//         }
//         return HttpResponse.json(mockServerCart);
//     }),

//     // DELETE /api/cart/items/:productId
//     http.delete('*/api/cart/items/:productId', ({ params }) => {
//         const productId = Number(params.productId);
//         const itemIndex = mockServerCart.findIndex(item => item.id === productId);

//         if(itemIndex === -1) return new HttpResponse(null, {status: 404});
//         mockServerCart = mockServerCart.filter(item => item.id !== productId);
//         return HttpResponse.json(mockServerCart);
//     }),

//     // DELETE /api/cart
//     http.delete('*/api/cart', () => {
//         mockServerCart = [];
//         return HttpResponse.json(mockServerCart);
//     }),
// ];

// export const resetMockServerCart = () => {
//     mockServerCart = [];
// }