import { useEffect, useState } from 'react'
import { fetchAdminStatistics } from '../../../services/Api'
import { AppNavbar } from '../../../components/Navbar/Navbar'
import { WorkoutClassStats } from '../../../domain/client'

interface AdminStats {
	totalUsers: number
	totalBookings: number
	totalWorkoutClasses: number
	mostPopularClasses: WorkoutClassStats[]
}

export function AdminStatsPage() {
	const [stats, setStats] = useState<AdminStats | null>(null)

	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function loadStats() {
			try {
				const data = await fetchAdminStatistics()
				setStats(data)
			} catch (err) {
				setError((err as Error).message)
			}
		}
		loadStats()
	}, [])

	if (error) return <p style={{ color: 'red' }}>{error}</p>

	return (
		<div className="custom-page">
			<AppNavbar />
			<div className="container mt-5">
				<h2>Statistik</h2>
				<h5>
					<strong>Totalt antal användare:</strong> {stats?.totalUsers}
				</h5>
				<h5>
					<strong>Totalt antal bokningar:</strong>{' '}
					{stats?.totalBookings}
				</h5>
				<h5>
					<strong>Totalt antal träningspass:</strong>{' '}
					{stats?.totalWorkoutClasses}
				</h5>
				<br />

				<h2>Mest populära pass</h2>
				{stats?.mostPopularClasses.length === 0 ? (
					<p>Inga populära pass ännu.</p>
				) : (
					<ul>
						{stats?.mostPopularClasses.map((workout, index) => (
							<h5>
								<li key={index}>
									{workout.workoutName} (
									{workout.bookingCount} bokningar)
								</li>
							</h5>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
