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
  const [isTestCardModalOpen, setIsTestCardModalOpen] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTestCardModalOpen(true);
    }, 1000);
    const bubbleTimer = setTimeout(() => {
      setIsBubbleVisible(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(bubbleTimer);
    };
  }, []);

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
      <h1 className="text-2xl font-bold mb-6 inline-block relative">
        お支払い情報の入力
        {isBubbleVisible && (
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 ml-4 p-2 bg-pink-400 text-white text-xs rounded-lg shadow-lg z-10 hidden md:flex items-center whitespace-nowrap max-w-md">
            <div className="absolute left-0 top-1/2 w-0 h-0 -ml-3 border-t-5 border-b-5 border-r-5 border-t-transparent border-b-transparent border-r-pink-400 transform -translate-y-1/2"></div>
            <span>テスト環境です！</span>{' '}
            <button
              type="button"
              onClick={() => setIsTestCardModalOpen(true)}
              className="underline text-white font-semibold hover:text-blue-100 p-0 m-0 border-none bg-transparent ml-2"
            >
              テスト用カード情報を見る
            </button>
            <button
              type="button"
              onClick={() => setIsBubbleVisible(false)}
              className="ml-2 text-white hover:text-blue-100 text-lg font-bold p-0 m-0 border-none bg-transparent"
              aria-label="閉じる"
            >
              &times;
            </button>
          </div>
        )}
      </h1>
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
      {isTestCardModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              テスト用カード情報
            </h2>
            <p className="text-red-600 font-semibold mb-4">
              これはテスト環境です。実際のカード番号は入力しないでください。
            </p>
            <p className="text-gray-700 mb-2">
              以下のテスト用カード番号をご利用ください。
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4 border border-gray-200">
              <p className="font-bold text-lg text-gray-900 mb-2">
                成功するカード番号:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>**Visa:** 4242 4242 4242 4242</li>
                <li>**Mastercard:** 5454 5454 5454 5454</li>
                <li>**有効期限:** 任意の将来の月/年（例: 12/25）</li>
                <li>**CVC:** 123</li>
              </ul>
              <p className="font-bold text-lg text-gray-900 mt-4 mb-2">
                失敗するカード番号:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>**残高不足:** 4000 0000 0000 0001</li>
                <li>**カード拒否:** 4000 0000 0000 0002</li>
                <li>その他Stripeドキュメントを参照</li>
              </ul>
            </div>
            <button
              onClick={() => setIsTestCardModalOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
