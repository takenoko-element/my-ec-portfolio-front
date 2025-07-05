import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRemoveItemFromCart, useUpdateItemQuantity } from './Hooks/useCart';
import type { CartItem } from '../../types';

interface CartItemProps {
  item: CartItem;
}

// 個々のカートアイテムの処理はこちらに分離
const CartItemRow = ({ item }: CartItemProps) => {
  const { mutate: updateQuantity, isPending: isUpdating } =
    useUpdateItemQuantity();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveItemFromCart();

  const isProcessing = isUpdating || isRemoving;

  const handleIncrement = () => {
    updateQuantity(
      { cartItemId: item.id, quantity: item.quantity + 1 },
      {
        onError: (error) => {
          console.error('数量の増加更新に失敗しました。', error);
          const errorMessage = error.response?.data?.message
            ? error.response.data.message
            : '数量の増加更新に失敗しました。';
          toast.error(errorMessage);
        },
      },
    );
  };
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(
        { cartItemId: item.id, quantity: item.quantity - 1 },
        {
          onError: (error) => {
            console.error('数量の減少更新に失敗しました。', error);
            const errorMessage = error.response?.data?.message
              ? error.response.data.message
              : '数量の減少更新に失敗しました。';
            toast.error(errorMessage);
          },
        },
      );
    } else {
      handleRemoveItem();
    }
  };
  const handleRemoveItem = () => {
    removeItem(item.id, {
      onSuccess: () =>
        toast.success(`「${item.product.title}」をカートから削除しました。`),
      onError: (error: Error) =>
        toast.error(error.message || 'アイテムの削除に失敗しました。'),
    });
  };

  return (
    <li
      key={item.id}
      data-testid={`cart-item-${item.id}`}
      className={`flex flex-col sm:flex-row items-center p-4 border-b border-gray-200 last:border-b-0 ${isProcessing ? 'opacity-50' : ''}`}
    >
      <img
        src={item.product.image}
        alt={item.product.title}
        className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded border border-gray-200 mb-4 sm:mb-0 sm:mr-6"
      />
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          <Link
            to={`/product/${item.productId}`}
            className="hover:text-blue-600 hover:underline"
          >
            {item.product.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          単価: ${item.product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center my-2 sm:my-0 sm:mx-6">
        <button
          onClick={() => handleDecrement()}
          disabled={isProcessing}
          data-testid={`decrement-button-${item.id}`}
          className="px-3 py-1 border rounded-l bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          aria-label={`商品 ${item.product.title} の数量を1減らす`}
        >
          {item.quantity > 1 ? '-' : '削除'}
        </button>
        <span
          data-testid={`quantity-${item.id}`}
          className="px-4 py-1 border-t border-b text-center w-12"
          aria-live="polite"
        >
          {item.quantity}
        </span>
        <button
          onClick={() => handleIncrement()}
          disabled={isProcessing}
          data-testid={`increment-button-${item.id}`}
          className="px-3 py-1 border rounded-r bg-gray-100 hover:bg-gray-200"
          aria-label={`商品 ${item.product.title} の数量を1増やす`}
        >
          +
        </button>
      </div>
      <p className="font-semibold text-gray-800 w-24 text-center sm:text-right my-2 sm:my-0">
        ${(item.product.price * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => handleRemoveItem()}
        disabled={isProcessing}
        data-testid={`remove-button-${item.id}`}
        className="ml-auto sm:ml-6 text-red-500 hover:text-red-700 font-medium text-sm"
        aria-label={`商品 ${item.product.title} をカートから削除`}
      >
        削除
      </button>
    </li>
  );
};

export default CartItemRow;
