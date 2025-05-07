import { useEffect, useState } from "react";
import { BookingOutputDto, WorkoutClassDto } from "../../domain/client";
import { fetchUserBookings, fetchRecommendation, bookWorkout, cancelBooking } from "../../services/Api";
import { useAuth } from "../../hooks/useAuth";
import { AppNavbar } from "../../components/Navbar/Navbar";
import { AppLoading } from "../../components/Loading/Loading.component";
import { FormatDate } from "../../utils/Date-utils";
import { AppCard } from "../../components/Card/Card.component";

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
        <div className="custom-page">
        <AppNavbar/>
        <div className="container mt-5">
            {recLoading ? (
                <AppLoading/>
                ) : recommendation ? (
                    <div className="mb-4">
                        <h4>Rekommenderat pass:</h4>
                        <AppCard
                        title={recommendation.workoutName}
                        description={recommendation.description}
                        time={FormatDate(recommendation.startDate, recommendation.endDate)}
                        bookings={`${recommendation.bookingIds?.length ?? 0} / ${recommendation.maxParticipants}`}
                        onClick={() => toggleBooking(recommendation.id!)}
                        buttonText={isRecommendedBooked ? "Avboka" : "Boka"}
                        buttonVariant={isRecommendedBooked ? "cancel" : "default"}
                    />
                    </div>
                ) : (
                    <div className="alert alert-secondary">
                        <p>Det finns inget rekommenderat pass just nu!</p>
                    </div>
                )}

            <h2 className="mb-4">Mina bokningar</h2>
            {loading ? (
                <AppLoading/>
            ) : (
                <>
                        <section className="mb-5">
                            <h4>Kommande pass</h4>
                            {upcoming.length === 0 ? (
                                <p>Inga kommande pass bokade.</p>
                            ) : (
                                <div className="row">
                                    {[...upcoming]
                                    .sort((a, b) => {
                                        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                                        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                                        return dateA - dateB;
                                    })
                                    .map(b => (
                                        <div key={b.id} className="col-12 mb-4">
                                        <AppCard
                                            title={b.workoutClassName}
                                            description={b.description}
                                            time={FormatDate(b.startDate, b.endDate)}
                                            bookings={`${b.currentParticipants}/${b.maxParticipants}`}
                                            onClick={() => toggleBooking(b.workoutClassId!)}
                                            buttonText="Avboka"
                                            buttonVariant="cancel"
                                        />
                                    </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    <section>
                        <h4>Slutförda pass</h4>
                        {past.length === 0 ? (
                            <p>Inga tidigare pass hittades.</p>
                        ) : (
                            <div className="row">
                                {[...past]
                                .sort((a, b) => {
                                    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                                    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                                    return dateB - dateA;
                                  })
                                .map(b => (
                                    <div key={b.id} className="col-12 mb-4">
                                        <AppCard
                                            title={b.workoutClassName}
                                            description={b.description}
                                            time={FormatDate(b.startDate, b.endDate)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
        </div>
    );
}