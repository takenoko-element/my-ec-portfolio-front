import { useParams, Link } from 'react-router-dom';
import AddToCartButton from '../cart/AddToCartButton';
import { useProduct } from './Hooks/useProducts';
import { AxiosError } from 'axios';
import { formatPriceJpy } from '../../utils/formatters';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading, isError, error } = useProduct(productId);

  if (isLoading) {
    return <div className="text-2xl text-center">ローディング中...</div>;
  }
  if (isError) {
    const errorMessage =
      error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : '商品情報の読み込みに失敗しました。';
    return (
      <div className="text-2xl text-center text-red-700">
        <p>エラー: {errorMessage}</p>
        <Link to="/">商品一覧へ戻る</Link>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="text-2xl text-center">
        <p>商品が見つかりませんでした。</p>
        <Link to="/">商品一覧へ戻る</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p4 md:p-8 sm:p-2">
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 hover:underline"
        >
          &larr; 商品一覧へ戻る
        </Link>
      </div>
      <div className="bg-white shadow-x1 rounded-lg overflow-hidden md:flex">
        {/* 画像エリア */}
        <div className="md:w-1/2 p-4 flex justify-center items-center bg-gray-50">
          <img
            src={product.image}
            alt={product.title}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
        {/* 情報エリア */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              カテゴリー: {product.category}
            </p>
            <div className="flex items-center mb-4">
              {/* 星評価の表示 (例: ★★★★☆) */}
              <span className="text-yellow-500">
                {'★'.repeat(Math.round(product.rating.rate))}
                {'☆'.repeat(5 - Math.round(product.rating.rate))}
              </span>
              <span className="ml-2 text-sm text-gray-600">
                ({product.rating.count} 件のレビュー)
              </span>
            </div>
            <p className="text-3xl font-semibold text-green-600 mb-6">
              価格: ¥ {formatPriceJpy(product.price)}
            </p>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              商品説明
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
