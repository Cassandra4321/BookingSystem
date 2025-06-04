import { useEffect, useState } from 'react';
import { fetchAdminStatistics } from '../../../services/Api';
import { AppNavbar } from '../../../components/Navbar/Navbar';
import { WorkoutClassStats } from '../../../domain/client';

interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalWorkoutClasses: number;
  mostPopularClasses: WorkoutClassStats[];
}

export function AdminStatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchAdminStatistics();
        setStats(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    loadStats();
  }, []);

  if (error) {
    return (
      <div>
        <AppNavbar />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <AppNavbar />
        <div className="container mt-5">
          <p>Laddar statistik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-page">
      <AppNavbar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Statistik</h2>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Totalt antal användare</h5>
                <p className="card-text fs-3">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Totalt antal bokningar</h5>
                <p className="card-text fs-3">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-info mb-3">
              <div className="card-body">
                <h5 className="card-title">Totalt antal träningspass</h5>
                <p className="card-text fs-3">{stats.totalWorkoutClasses}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="mb-3 text-center">Det mest populära passet</h2>
        <div className="col-md-4 col-sm-8 mx-auto">
          {stats.mostPopularClasses.length === 0 ? (
            <h4>Inga populära pass ännu.</h4>
          ) : (
            <ul className="list-group fs-4">
              {stats.mostPopularClasses.map((workout, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center">
                  {workout.workoutName}
                  <span className="badge custom-badge rounded-pill">
                    {workout.bookingCount} bokningar
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
