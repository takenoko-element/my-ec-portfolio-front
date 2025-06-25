import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { Provider } from 'react-redux'; // react-redux から Provider をインポート
// import { store } from './app/store';   // 作成した store をインポート
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './authentication/AuthContext.tsx';

async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    return;
  }
 
  const { worker } = await import('./mocks/browser');
 
  // `worker.start()` はService Workerを起動し、リクエストを傍受する準備をします。
  return worker.start({
    // onUnhandledRequest: 'bypass', // モックしていないリクエストはバイパスする(実際のAPIに流す)
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        {/* <Provider store={store}> */}
        <AuthProvider>
          <App />
        </AuthProvider>
        {/* </Provider> */}
      </BrowserRouter>
    </StrictMode>,
  )
});
