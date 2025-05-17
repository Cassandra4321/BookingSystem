import './App.css'
import { Route, Routes } from 'react-router-dom'
import { RegisterPage } from './pages/Register/RegisterPage'
import { HomePage } from './pages/Home/HomePage'
import { AdminRoute } from './components/ProtectedRoute/AdminRoute'
import { UserRoute } from './components/ProtectedRoute/UserRoute'
import { AdminStatsPage } from './pages/Admin/AdminStatistics/AdminStatisticsPage'
import { WorkoutClassesPage } from './pages/WorkoutClasses/WorkoutClassesPage'
import { UserPage } from './pages/User/UserPage'
import { useAuth } from './hooks/useAuth'
import { AppLoading } from './components/Loading/Loading.component'
import { Layout } from './components/Layout/Layout.component'
import { AdminCRUDPage } from './pages/Admin/AdminWorkoutClasses/AdminWorkoutClassesPage'

function App() {
	const { isLoading } = useAuth()

	if (isLoading) {
		return <AppLoading />
	}

	return (
		<Routes>
			<Route element={<Layout />}>
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
					path="/admin-stats"
					element={
						<AdminRoute>
							<AdminStatsPage />
						</AdminRoute>
					}
				/>
				<Route
					path="/admin-crud"
					element={
						<AdminRoute>
							<AdminCRUDPage />
						</AdminRoute>
					}
				/>
			</Route>
		</Routes>
	)
}

export default App
