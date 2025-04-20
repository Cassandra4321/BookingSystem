import './App.css'
import { Route, Routes} from 'react-router-dom';
import { RegisterPage } from './pages/Register/RegisterPage'
import { HomePage } from './pages/Home/HomePage'
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <AuthProvider>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

    </AuthProvider>
  )
}

export default App
