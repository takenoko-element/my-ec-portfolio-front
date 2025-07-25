import { useEffect, useState } from 'react';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

import apiClient from '../../lib/axios';
import { stripePromise } from '../../lib/stripe';
import CheckoutForm from './CheckoutForm';
import { UseCartTotalPrice } from '../cart/Hooks/useCartTotalPrice';

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const { totalPrice, isPriceLoading, isPriceError } = UseCartTotalPrice();

  useEffect(() => {
    const createPaymentIntent = async () => {
      setLoadingError(null);

      // カートが読込中、または空の場合は作成しない
      if (totalPrice === null || parseFloat(totalPrice) === 0) {
        setLoadingError('カートに商品がありません。');
        toast.error('カートに商品がないため決算できません。');
        return;
      }
      try {
        const response = await apiClient.post('/payment-intents');
        setClientSecret(response.data.clientSecret);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof AxiosError && error.response?.data?.message
            ? error.response.data.message
            : '決済情報の準備中に予期せぬエラーが発生しました。';
        console.error('[CheckoutPage] Failed to create payment intent:', error);
        setLoadingError(errorMessage);
        toast.error(`決済情報の準備に失敗しました: ${errorMessage}`);
      }
    };
    if (!isPriceLoading && !isPriceError && !clientSecret) {
      createPaymentIntent();
    }
  }, [totalPrice, isPriceLoading, isPriceError, clientSecret]);

  // Elementsプロバイダーのオプション
  // clientSecretをElementsに渡すことで、Stripeがどの決済を扱えば良いか判断する
  const options: StripeElementsOptions = {
    // バックエンドから送られてくる秘密の合言葉
    clientSecret: clientSecret || '',
    // 外観: Stripeの良い感じの見た目（任意オプション）
    appearance: { theme: 'stripe' },
  };

  if (isPriceLoading) {
    return (
      <div className="text-center py-10">カート情報を読み込んでいます...</div>
    );
  }

  if (isPriceError) {
    return (
      <div className="text-center py-10 text-red-600">
        カート情報の読み込みに失敗しました。
      </div>
    );
  }

  if (totalPrice === null || parseFloat(totalPrice) === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">決済ページ</h2>
        <p className="text-gray-600 mb-6">
          カートに商品がありません。商品を選択してください。
        </p>
        <a
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition duration-150"
        >
          商品一覧へ
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">お支払い情報の入力</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          {loadingError ? (
            <div className="text-center py-10 text-red-600">
              <p>{loadingError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                再試行
              </button>
            </div>
          ) : clientSecret ? (
            // Elementsコンポーネント: ラップしたコンポーネントを隠匿し中を見れなくする
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="text-center py-10">決済情報を準備しています...</div>
          )}
        </div>
        <div className="md:w-1/3 p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ご注文概要
          </h2>
          <div className="flex justify-between items-center border-b pb-3 mb-3">
            <p className="text-gray-600">小計</p>
            <p className="font-medium text-gray-800">${totalPrice}</p>
          </div>
          <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
            <p className="text-lg font-bold text-gray-800">合計</p>
            <p className="text-2xl font-bold text-green-600">${totalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
