import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useState } from "react";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!stripe || !elements) {
            return;
        }
        setIsLoading(true);

        const {error} = await stripe.confirmPayment({
            // stripeライブラリからしかアクセスできない秘密箱のようなもの
            // この箱にユーザーの情報を詰めてstripeサーバーへ送信する
            elements,
            confirmParams: {
                // 決済完了後にユーザーがリダイレクトされるURL
                return_url: `${window.location.origin}/order-confirmation`,
            }
        });

        // この下のコードは、リダイレクトに失敗した場合や即時エラーが出た場合にのみ実行されます。
        if(error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message || '決済情報の入力に誤りがあります。');
        } else {
            setMessage('予期せぬエラーが発生しました。');
        }

        setIsLoading(false);
    }

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs'
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            {/* 【Stripe解説】PaymentElement:
                カード番号、有効期限、CVC、国、郵便番号などの入力を、
                一つのコンポーネントで安全に提供してくれます。
                カード情報はStripeのサーバーに直接送信され、私たちのアプリには一切触れません。*/}
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            
            <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "支払う"}
                </span>
            </button>

            {/* エラーメッセージの表示 */}
            {message && <div id="payment-message" className="mt-4 text-red-600">{message}</div>}
        </form>
    );
}

export default CheckoutForm;