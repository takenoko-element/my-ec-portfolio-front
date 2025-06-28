import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  const queryClient = new QueryClient();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>,
  )
});
