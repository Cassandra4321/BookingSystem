import './App.css'
import { Route, Routes } from 'react-router-dom'
import { RegisterPage } from './pages/Register/RegisterPage'
import { HomePage } from './pages/Home/HomePage'
import { AdminRoute } from './components/ProtectedRoute/AdminRoute'
import { UserRoute } from './components/ProtectedRoute/UserRoute'
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage'
import { WorkoutClassesPage } from './pages/WorkoutClasses/WorkoutClassesPage'
import { UserPage } from './pages/User/UserPage'
import { useAuth } from './hooks/useAuth'
import { AppLoading } from './components/Loading/Loading.component'

function App() {
	const { isLoading } = useAuth()

	if (isLoading) {
		return <AppLoading />
	}

	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/register" element={<RegisterPage />} />

			<Route
				path="/classes"
				element={
					<UserRoute>
						<WorkoutClassesPage />
					</UserRoute>
				}
			/>

			<Route
				path="/user"
				element={
					<UserRoute>
						<UserPage />
					</UserRoute>
				}
			/>

			<Route
				path="/admin-dashboard"
				element={
					<AdminRoute>
						<AdminDashboardPage />
					</AdminRoute>
				}
			/>
		</Routes>
	)
}

export default App
