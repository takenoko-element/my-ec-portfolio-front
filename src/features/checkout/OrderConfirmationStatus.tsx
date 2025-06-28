import { useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCreateOrder } from "../orders/Hooks/useOrder";

const OrderConfirmationStatus = () => {
    const stripe = useStripe();
    const {mutate: createOrder} = useCreateOrder();
    
    const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed' | 'processing'>('loading');
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if(!stripe){
            console.log('[OrderConfirmationStatus] useEffect: stripe not found');
            return;
        }

        // URLSearchParams:
        // ブラウザ標準の機能で、現在のURLのクエリパラメータ(?以降)を簡単に操作できる
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if(!clientSecret) {
            console.error("client_secretが見つかりません。");
            setStatus('failed');
            setMessage('決済情報が正しくありません。');
            return;
        }

        // tripe.retrievePaymentIntent:
        // client_secretを使って、Stripeサーバーに「この決済、最終的にどうなりました？」と問い合わせる
        // これで、決済の最終的なステータス（成功、失敗、処理中など）を取得する
        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
            switch(paymentIntent?.status) {
                case 'succeeded':
                    setMessage('ご注文ありがとうございました！');
                    setStatus('succeeded');
                    createOrder();
                    break;
                case 'processing':
                    setMessage('お支払いを処理中です。完了までしばらくお待ちください。');
                    setStatus('processing');
                    break;
                default:
                    setMessage('お支払いに失敗しました。再度お試しください。');
                    setStatus('failed');
                    break;
            }
        });
    }, [stripe]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <p>決済結果を確認しています...</p>;
            case 'succeeded':
                return (
                    <div className='text-center'>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">決済完了</h2>
                        <p>{message}</p>
                        <Link to="/order-history" className="mt-6 inline-block text-blue-600 hover:underline">注文履歴を見る</Link>
                    </div>
                );
            case 'failed':
                return (
                    <div className='text-center'>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">決済失敗</h2>
                        <p>{message}</p>
                        <Link to="/checkout" className="mt-6 inline-block text-blue-600 hover:underline">もう一度試す</Link>
                    </div>
                );
            default:
                return <p>{message}</p>
        }
    };

    return (
        <div className="bg-white p-10 rounded-lg shadow-xl">
            {renderContent()}
        </div>
    );
}

export default OrderConfirmationStatus;