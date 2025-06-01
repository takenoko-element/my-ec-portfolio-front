import { http, HttpResponse } from 'msw';
import type { Product } from '../features/products/productSlice';

const mockProducts: Product[] = [
    { id: 1, title: 'MSW Product 1', price: 10, image: 'img1.jpg', category: 'cat A', description: 'Desc 1', rating: { rate: 4, count: 100 } },
    { id: 2, title: 'MSW Product 2', price: 20, image: 'img2.jpg', category: 'cat B', description: 'Desc 2', rating: { rate: 5, count: 200 } },
];

export const handlers = [
    // 商品リスト取得のモック (/api/products または http://localhost:3001/api/products)
    http.get('*/api/products', ({ request }) => {
        const url = new URL(request.url);
        const searchTerm = url.searchParams.get('search');
        const category = url.searchParams.get('category');

        let filteredProducts = [...mockProducts];
        if (searchTerm){
            filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()));
        }
        if (category){
            filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
        }

        // console.log('[MSW] GET /api/products matched, returning:', filteredProducts);
        return HttpResponse.json(filteredProducts);
    }),
]