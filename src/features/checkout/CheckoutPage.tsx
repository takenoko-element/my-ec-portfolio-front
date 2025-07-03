import { useEffect, useState } from 'react';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import apiClient from '../../lib/axios';
import { stripePromise } from '../../lib/stripe';
import CheckoutForm from './CheckoutForm';

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await apiClient.post('/payment-intents');
        setClientSecret(response.data.clientSecret);
      } catch (error: any) {
        console.error('[CheckoutPage] Failed to create payment intent:', error);
      }
    };
    createPaymentIntent();
  }, []);

  // Elementsプロバイダーのオプション
  // clientSecretをElementsに渡すことで、Stripeがどの決済を扱えば良いか判断する
  const options: StripeElementsOptions = {
    // バックエンドから送られてくる秘密の合言葉
    clientSecret: clientSecret || '',
    // 外観: Stripeの良い感じの見た目（任意オプション）
    appearance: { theme: 'stripe' },
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">お支払い情報の入力</h1>
      {clientSecret ? (
        // Elementsコンポーネント: ラップしたコンポーネントを隠匿し中を見れなくする
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div className="text-center py-10">決済情報を準備しています...</div>
      )}
    </div>
  );
};

export default CheckoutPage;
