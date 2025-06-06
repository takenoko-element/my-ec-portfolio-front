import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { selectCartTotalQuantity } from "../features/cart/cartSlice";

const Header: React.FC = () => {
    const totalQuantity = useSelector(selectCartTotalQuantity);

    return (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* サイトロゴ/タイトル */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                            ミニECサイト
                        </Link>
                    </div>

                    {/* ナビゲーションリンク */}
                    <nav className="space-x-4">
                        <Link to="/"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                        >
                            商品一覧
                        </Link>
                        <Link to="/cart"
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 relative"
                        >
                            カート
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;