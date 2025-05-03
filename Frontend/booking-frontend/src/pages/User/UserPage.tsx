import { useEffect, useState } from "react";
import { BookingOutputDto, WorkoutClassDto } from "../../domain/client";
import { fetchUserBookings, fetchRecommendation, bookWorkout, cancelBooking } from "../../services/Api";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "../../components/Navbar/Navbar";
import { AppButton } from "../../components/Button/Button.component";

export function UserPage() {
    const { userId } = useAuth();
    const [bookings, setBookings] = useState<BookingOutputDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [recommendation, setRecommendation] = useState<WorkoutClassDto | null>(null);
    const [recLoading, setRecLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        fetchUserBookings(userId)
            .then(result => {
                setBookings(result || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Kunde inte hömta bokningar:', error);
                setLoading(false);
            });

            fetchRecommendation(userId)
                .then(data => {
                    setRecommendation(data[0] || null);
                    setRecLoading(false);
                })
                .catch(error => {
                    console.error('Kunde inte hämta rekommendationer:', error);
                    setRecLoading(false);
                });

    }, [userId]);

    const now = new Date();
    const upcoming = bookings.filter(b => b.startDate && new Date(b.startDate) > now);
    const past = bookings. filter(b => b.endDate && new Date(b.endDate) < now);

    const isRecommendedBooked = recommendation && bookings.some(b => b.workoutClassId === recommendation.id)
    const getBookingIdForWorkout = (workoutClassId: number) => {
        return bookings.find(b => b.workoutClassId === workoutClassId)?.id;
    };
    const toggleBooking = async (workoutClassId: number) => {
        if (!userId) {
            alert("Du måste vara inloggad för att boka eller avboka.");
            return;
        }

        const isBooked = bookings.some(b => b.workoutClassId === workoutClassId);

        if (isBooked) {
            const bookingId = getBookingIdForWorkout(workoutClassId);
            if (!bookingId) return;

            try {
                await cancelBooking(bookingId);
                setBookings(prev => prev.filter(b => b.id !== bookingId));
                alert("Du har avbokat passet.");
            } catch (err) {
                console.error(err);
                alert("Något gick fel vid avbokning.");
            }
        } else {
            try {
                const data = await bookWorkout(userId, workoutClassId);
                setBookings(prev => [...prev, data]);
                alert(`Du har bokat: ${data.workoutClassName}`);
            } catch (err) {
                console.error(err);
                alert("Något gick fel vid bokning.");
            }
        }
    };

    return (
        <div>
        <Navbar/>
        <div className="container mt-5">
            {recLoading ? (
                <p>Laddar rekommendation...</p>
                ) : recommendation ? (
                    <div className="alert alert-info">
                        <h4>Rekommenderat pass:</h4>
                        <p><strong>{recommendation.workoutName}</strong></p>
                        <p>{recommendation.description}</p>
                        <p>{formatDateRange(recommendation.startDate, recommendation.endDate)}</p>
                        <AppButton
                            onClick={() => toggleBooking(recommendation.id!)}
                            variant={isRecommendedBooked ? "cancel" : "default"}
                        >
                            {isRecommendedBooked ? "Avboka" : "Boka"}
                        </AppButton>
                    </div>
                ) : (
                    <div className="alert alert-secondary">
                        <p>Det finns inget rekommenderat pass just nu!</p>
                    </div>
                )}

            <h2 className="mb-4">Mina bokningar</h2>
            {loading ? (
                <p>Laddar bokningar...</p>
            ) : (
                <>
                        <section className="mb-5">
                            <h4>Kommande pass</h4>
                            {upcoming.length === 0 ? (
                                <p>Inga kommande pass bokade.</p>
                            ) : (
                                <ul className="list-group">
                                    {upcoming.map(b => (
                                        <li key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{b.workoutClassName}</strong><br />
                                                {formatDateRange(b.startDate, b.endDate)}
                                            </div>
                                            <AppButton
                                                onClick={() => toggleBooking(b.workoutClassId!)}
                                                variant="cancel"
                                            >
                                                Avboka
                                            </AppButton>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                    <section>
                        <h4>Tidigare pass</h4>
                        {past.length === 0 ? (
                            <p>Inga tidigare pass hittades.</p>
                        ) : (
                            <ul className="list-group">
                                {past.map(b => (
                                    <li key={b.id} className="list-group-item">
                                        <strong>{b.workoutClassName}</strong><br />
                                        {formatDateRange(b.startDate, b.endDate)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            )}
        </div>
        </div>
    );
}
function formatDateRange(start?: Date, end?: Date): string {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleString()} – ${endDate.toLocaleTimeString()}`;
}