import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-lg p-4 animate-pulse">
      {/* 画像のスケルトン */}
      <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
      {/* テキストのスケルトン */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
      {/* ボタンのスケルトン */}
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  );
};

export default ProductCardSkeleton;
