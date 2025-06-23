import type { Product } from ".";

export interface CartItem {
    id: number;
    quantity: number;
    userId: string;
    productId: number;
    product: Product;
}