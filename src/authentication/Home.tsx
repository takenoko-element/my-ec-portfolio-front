// ログイン後に表示されるホームページのコンポーネント
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from './AuthContext';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('ログアウトしました');
    } catch (error) {
      console.error('ログアウトエラー', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">ようこそ！</h1>
      {currentUser && <p className="mb-6 text-gray-600">ログイン中: {currentUser.email}</p>}
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
      >
        ログアウト
      </button>
    </div>
  );
};

export default Home;
