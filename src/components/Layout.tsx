import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-6 py-8 pt-16 sm:pt-20 lg:pt-24">
        <Outlet />
      </main>

      {/* <Footer />
            <footer className="bg-gray-800 text-white p-4 text-center mt-auto"> // mt-autoでフッターを押し下げる
                © 2025 My EC Site
            </footer>
            */}
    </div>
  );
};
export default Layout;
