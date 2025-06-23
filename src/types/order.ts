import type { Product } from ".";

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    productId: number;
    product: Product;
}

export interface Order {
    id: number;
    userId: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
}