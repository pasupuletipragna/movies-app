import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginRoute from './components/LoginRoute'
import HomeRoute from './components/HomeRoute'
import PopularRoute from './components/PopularRoute'
import MovieItemDetails from './components/MovieItemDetails'
import SearchRoute from './components/SearchRoute'
import AccountRoute from './components/AccountRoute'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/" element={<ProtectedRoute><HomeRoute /></ProtectedRoute>} />
        <Route path="/popular" element={<ProtectedRoute><PopularRoute /></ProtectedRoute>} />
        <Route path="/movies/:id" element={<ProtectedRoute><MovieItemDetails /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchRoute /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountRoute /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
