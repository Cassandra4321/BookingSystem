import { useEffect, useState, useContext } from 'react';
import { WorkoutClass } from '../../interfaces/WorkoutClass';
import { Booking } from '../../domain/client';
import { AppNavbar } from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { AppButton } from '../../components/Button/Button.component';
import { fetchUserBookings, bookWorkout, cancelBooking } from '../../services/Api';
import { FormatDate } from '../../utils/Date-utils';
import { AppCalendar } from '../../components/Calendar/Calendar.component';
import { Modal } from '../../components/Modals/Modal';


export function WorkoutClassesPage() {
    const [workoutClasses, setWorkoutClasses] = useState<WorkoutClass[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [bookedClasses, setBookedClasses] = useState<{ workoutClassId: number, bookingId: number | undefined}[]>([]);
    const [selectedClass, setSelectedClass] = useState<WorkoutClass | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const auth = useContext(AuthContext);
    const { userId, isLoading }  = auth ?? {};

    const isClassBooked = (workoutClassId: number) =>
        bookedClasses.some((b) => b.workoutClassId === workoutClassId);
    
    const getBookingId = (workoutClassId: number) => {
        const booking = bookedClasses.find((b) => b.workoutClassId === workoutClassId);
        return booking?.bookingId;
    };

    useEffect(() => {
        const loadUserBookings = async () => {
            if (!userId || isLoading) return;
    
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
    }, [userId, isLoading]);

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
            }
        };
        fetchWorkoutClasses();
    }, []);
    
    const toggleBooking = async (workoutClassId: number) => {
        console.log("klickat på knapp för id: ", workoutClassId);
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
                const data = await bookWorkout(userId, workoutClassId);
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
    
    const handleCalendarClick = (workoutClass: WorkoutClass) => {
        setSelectedClass(workoutClass);
        setIsModalOpen(true);
    }

    return (
        <div>
            <AppNavbar />
            <div className="container mt-5">
                <h2 className="mb-4 text-center">Träningspass</h2>
                {error && <p className="text-danger">{error}</p>}
                <AppCalendar 
                    workoutClasses={workoutClasses}
                    onClassClick={handleCalendarClick}
                    bookedClasses={bookedClasses}
                />
                {selectedClass && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onBook={() => {
                            toggleBooking(selectedClass.id);
                            setIsModalOpen(false);
                        }}
                        title={selectedClass.workoutName}
                        description={selectedClass.description}
                        time={`Tid ${FormatDate(selectedClass.startDate, selectedClass.endDate)}`}
                        actionLabel={isClassBooked(selectedClass.id) ? "Avboka" : "Boka"}
                    />
                )}
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
                                    <p><strong>Tid</strong> {FormatDate(wc.startDate, wc.endDate)}</p>
                                    <p><strong>Bokade platser:</strong> {wc.bookingIds.length} / {wc.maxParticipants}</p>
                                    <AppButton
                                        onClick={() => toggleBooking(wc.id)}
                                        disabled={isFull && !isBooked}
                                        variant={isBooked ? "cancel" : "default"}
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
