import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { RegisterPage } from './pages/Register/RegisterPage'
import { HomePage } from './pages/Home/HomePage'


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App
