import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../app/store"
import { fetchOrderAPI, selectOrders, selectOrderStatus } from "./orderSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const OrderHistoryPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const orders = useSelector(selectOrders);
    const status = useSelector(selectOrderStatus);

    useEffect(() => {
        console.log('[OrderHistoryPage] useEffect status check');
        if (status === 'idle') {
            dispatch(fetchOrderAPI());
        }
    }, [status, dispatch]);

    if(status === 'loading') {
        return <div className="text-center py-10">注文履歴を読み込んでいます...</div>
    }
    if(status === 'failed') {
        return <div className="text-center py-10 text-red-600">注文履歴の読み込みに失敗しました。</div>
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">注文履歴</h1>

            {orders.length === 0? (
                <p className="text-center text-gray-500">注文はありません</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">注文日</p>
                                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">合計金額</p>
                                    <p className="font-bold text-xl text-gray-800">{order.totalPrice.toLocaleString()}</p>
                                </div>
                                <div className="text-sm text-gray-500">注文番号: #{order.id}</div>
                            </div>
                            <ul className="space-y-4">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex items-center">
                                        <img src={item.product.image || ''} alt={item.product.title} className="w-16 h-16 object-contain rounded mr-4" />
                                        <div className="flex-grow">
                                            <Link to={`/product/${item.productId}`} className="font-semibold hover:underline">
                                                {item.product.title}
                                            </Link>
                                            <p className="text-sm text-gray-600">
                                                ¥{item.price.toLocaleString()} x {item.quantity}点
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;