import { useEffect, useState } from 'react';
import { WorkoutClass } from '../../interfaces/WorkoutClass';
import { Navbar } from '../../components/Navbar/Navbar';

export function WorkoutClassesPage() {
    const [workoutClasses, setWorkoutClasses] = useState<WorkoutClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookedClasses, setBookedClasses] = useState<number[]>([]);

    useEffect(() => {
        const fetchWorkoutClasses = async () => {
            try {
                const response = await fetch('https://localhost:7193/api/WorkoutClass');
                if (!response.ok) {
                    throw new Error('Kunde inte hämta träningspassen.');
                }
                const data = await response.json();
                setWorkoutClasses(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Ett okänt fel inträffade.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchWorkoutClasses();
    }, []);

    const toggleBooking = (id: number) => {
        setBookedClasses((prev) =>
            prev.includes(id)
            ? prev.filter((bookedId) => bookedId !== id)
            : [...prev, id]
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h2 className="mb-4 text-center">Träningspass</h2>
                {loading && <p>Laddar träningspass...</p>}
                {error && <p className="text-danger">{error}</p>}

                <div className="row">
                    {workoutClasses.map((wc) => (
                        <div key={wc.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{wc.workoutName}</h5>
                                    <p className="card-text">{wc.description}</p>
                                    <p><strong>Start:</strong> {new Date(wc.startDate).toLocaleString()}</p>
                                    <p><strong>Slut:</strong> {new Date(wc.endDate).toLocaleString()}</p>
                                    <p><strong>Max deltagare:</strong> {wc.maxParticipants}</p>
                                    <button
                                        className={`btn ${bookedClasses.includes(wc.id) ? 'btn-danger' : 'btn-primary'}`}
                                        onClick={() => toggleBooking(wc.id)}
                                    >
                                        {bookedClasses.includes(wc.id) ? 'Avboka' : 'Boka'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
