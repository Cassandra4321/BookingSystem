import './App.css'
import { Route, Routes} from 'react-router-dom';
import { RegisterPage } from './pages/Register/RegisterPage'
import { HomePage } from './pages/Home/HomePage'
import { AuthProvider } from './context/AuthProvider';
import { AdminRoute } from './components/ProtectedRoute/AdminRoute';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage/>
            </AdminRoute>
          }
        />
        </Routes>
    </AuthProvider>
  )
}

export default App
