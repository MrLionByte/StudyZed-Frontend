import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserRoutes from './routes/userRoutes.jsx';
import AdminRoutes from './routes/adminRoutes.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NotFound from './components/Errors/NotFound.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import 'react-toastify/ReactToastify.css';

function App() {

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/*" element={<UserRoutes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
