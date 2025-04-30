import { useEffect, useState, useContext } from 'react';
import { WorkoutClass } from '../../interfaces/WorkoutClass';
import { Booking } from '../../domain/client';
import { Navbar } from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { fetchUserBookings, fetchWorkoutClasses, bookWorkout, cancelBooking } from '../../services/Api';

export function WorkoutClassesPage() {
    const [workoutClasses, setWorkoutClasses] = useState<WorkoutClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookedClasses, setBookedClasses] = useState<{ workoutClassId: number, bookingId: number | undefined}[]>([]);

    const auth = useContext(AuthContext);
    const { userId }  = auth ?? {};

    const isClassBooked = (workoutClassId: number) =>
        bookedClasses.some((b) => b.workoutClassId === workoutClassId);
    
    const getBookingId = (workoutClassId: number) => {
        const booking = bookedClasses.find((b) => b.workoutClassId === workoutClassId);
        return booking?.bookingId;
    };

    useEffect(() => {
        const loadUserBookings = async () => {
            if (!userId) return;
    
            try {
                const data: Booking[] = await fetchUserBookings(userId);
                const transformed = data.map((booking) => ({
                    workoutClassId: booking.workoutClassId,
                    bookingId: booking.id
                }));
                setBookedClasses(transformed);
            } catch (err) {
                console.error("Fel vid hämntning av bokningar: ", err);
            }
        };
        loadUserBookings();
    }, [userId]);

    useEffect(() => {
        const loadWorkoutClasses = async () => {
            try {
                const data = await fetchWorkoutClasses();
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
        loadWorkoutClasses();
    }, []);

    const toggleBooking = async (workoutClassId: number) => {
        if (!userId) {
            alert("Du måste vara inloggad för att boka eller avboka.");
            return;
        }
    
        const alreadyBooked = isClassBooked(workoutClassId);
        if (alreadyBooked) {
            const bookingId = getBookingId(workoutClassId);
            if (!bookingId) {
                alert("Kunde inte hitta boknings-ID för att avboka.");
                return;
            }
    
            try {
                await cancelBooking(bookingId);
                setBookedClasses((prev) =>
                    prev.filter((b) => b.workoutClassId !== workoutClassId)
                );
                alert('Du har avbokat passet.');
            } catch (err) {
                console.error(err);
                alert('Något gick fel vid avbokning.');
            }
        } else {
            try {
                const data = await bookWorkout(userId, workoutClassId);
                setBookedClasses((prev) => [
                    ...prev,
                    { workoutClassId: data.workoutClassId, bookingId: data.id },
                ]);
                alert(`Du har bokat: ${data.workoutClassName}`);
            } catch (err) {
                console.error(err);
                alert('Något gick fel vid bokning.');
            }
        }
    };
    

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
                                        className={`btn ${isClassBooked(wc.id) ? 'btn-danger' : 'btn-primary'}`}
                                        onClick={() => toggleBooking(wc.id)}
                                    >
                                        {isClassBooked(wc.id) ? 'Avboka' : 'Boka'}
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
