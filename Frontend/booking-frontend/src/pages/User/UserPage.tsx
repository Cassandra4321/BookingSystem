import { useEffect, useState } from "react";
import { BookingOutputDto, WorkoutClassDto } from "../../domain/client";
import { fetchUserBookings, fetchRecommendation } from "../../services/Api";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "../../components/Navbar/Navbar";

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

    return (
        <div>
        <Navbar/>
        <div className="container mt-5">
            {recLoading ? (
                <p>Laddar rekommendation...</p>
                ) : recommendation ? (
                    <div className="alert alert-info">
                        <h4>Rekommenderat pass:</h4>
                        <p><strong>{recommendation.name}</strong></p>
                        <p>{recommendation.description}</p>
                        <p>{formatDateRange(recommendation.startDate, recommendation.endDate)}</p>
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
                                    <li key={b.id} className="list-group-item">
                                        <strong>{b.workoutClassName}</strong><br />
                                        {formatDateRange(b.startDate, b.endDate)}
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