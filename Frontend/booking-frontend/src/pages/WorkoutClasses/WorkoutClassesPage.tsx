import { useEffect, useState, useContext } from 'react';
import { WorkoutClass } from '../../interfaces/WorkoutClass';
import { Booking } from '../../domain/client';
import { Navbar } from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { AppButton } from '../../components/Button/Button.component';

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
        const fetchUserBookings = async () => {
            if (!userId) return;
    
            try {
                const response = await fetch(`https://localhost:7193/api/booking/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Kunde inte hämta användarens bokningar.');
                }
    
                const data: Booking[] = await response.json();
                const transformed = data.map((booking: Booking) => ({
                    workoutClassId: booking.workoutClassId,
                    bookingId: booking.id
                }));
                setBookedClasses(transformed);
            } catch (err) {
                console.error("Fel vid hämntning av bokningar: ", err);
            }
        };
    
        fetchUserBookings();
    }, [userId]);

    useEffect(() => {
        const fetchWorkoutClasses = async () => {
            try {
                const response = await fetch('https://localhost:7193/api/WorkoutClass');
                if (!response.ok) {
                    throw new Error('Kunde inte hämta träningspassen.');
                }
                const data = await response.json();

                const filteredData = data.filter((wc: WorkoutClass) => new Date(wc.startDate) > new Date());

                setWorkoutClasses(filteredData);
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
                const response = await fetch(`https://localhost:7193/api/booking/${bookingId}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) {
                    throw new Error('Kunde inte avboka passet.');
                }
    
                setBookedClasses((prev) =>
                    prev.filter((b) => b.workoutClassId !== workoutClassId)
                );

                setWorkoutClasses((prev) =>
                prev.map((wc) =>
                    wc.id === workoutClassId
                        ? { ...wc, bookingIds: wc.bookingIds.filter(id => id !== bookingId)}
                        : wc
                    ));
    
                alert('Du har avbokat passet.');
            } catch (err) {
                console.error(err);
                alert('Något gick fel vid avbokning.');
            }
        } else {
            try {
                const response = await fetch('https://localhost:7193/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        workoutClassId: workoutClassId,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Kunde inte boka passet.');
                }
    
                const data = await response.json();
    
                setBookedClasses((prev) => [
                    ...prev,
                    { workoutClassId: data.workoutClassId, bookingId: data.id },
                ]);

                setWorkoutClasses((prev) =>
                    prev.map((wc) =>
                        wc.id === workoutClassId
                        ? { ...wc, bookingIds: [...wc.bookingIds, data.id]}
                        : wc
                ));
    
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
                    {workoutClasses.map((wc) => {
                        const isBooked = isClassBooked(wc.id);
                        const isFull = wc.bookingIds.length >= wc.maxParticipants;

                        return (
                        <div key={wc.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{wc.workoutName}</h5>
                                    <p className="card-text">{wc.description}</p>
                                    <p><strong>Start:</strong> {new Date(wc.startDate).toLocaleString()}</p>
                                    <p><strong>Slut:</strong> {new Date(wc.endDate).toLocaleString()}</p>
                                    <p><strong>Bokade platser:</strong> {wc.bookingIds.length} / {wc.maxParticipants}</p>
                                    <AppButton
                                        onClick={() => toggleBooking(wc.id)}
                                        disabled={isFull && !isBooked}
                                    >
                                        {isBooked ? "Avboka" : isFull ? "Fullbokat" : "Boka"}
                                    </AppButton>
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </div>
    );
}
