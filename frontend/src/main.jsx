import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { Provider } from 'react-redux'
import store from './store/index.js'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import ErrorBoundary from './Components/ErrorBoundary.jsx'
import Loader from './Components/common/Loader.jsx'

import axios from "axios";

axios.defaults.withCredentials = true;
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
