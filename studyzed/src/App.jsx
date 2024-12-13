import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import UserRoutes from './routes/UserRoutes';
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {

  return (
    <GoogleOAuthProvider clientId='748272012851-lg3mh81cjkah2hob3s43tkp8ltpd4ko3.apps.googleusercontent.com'>  
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<UserRoutes />} />
        </Routes>
      </ BrowserRouter>
    </GoogleOAuthProvider>

  )
}

export default App;
