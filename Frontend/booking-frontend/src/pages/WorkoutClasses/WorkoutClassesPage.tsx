import { useEffect, useState, useContext } from 'react';
import { WorkoutClass } from '../../interfaces/WorkoutClass';
import { BookingOutputDto } from '../../domain/client';
import { AppNavbar } from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import {
  fetchUserBookings,
  bookWorkout,
  cancelBooking,
} from '../../services/Api';
import { FormatDate } from '../../utils/Date-utils';
import { AppCalendar } from '../../components/Calendar/Calendar.component';
import { Modal } from '../../components/Modals/Modal';
import { AppCard } from '../../components/Card/Card.component';

export function WorkoutClassesPage() {
  const [workoutClasses, setWorkoutClasses] = useState<WorkoutClass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [bookedClasses, setBookedClasses] = useState<
    { workoutClassId: number; bookingId: number | undefined }[]
  >([]);
  const [selectedClass, setSelectedClass] = useState<WorkoutClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const auth = useContext(AuthContext);
  const { userId, isLoading } = auth ?? {};

  const isClassBooked = (workoutClassId: number) =>
    bookedClasses.some(b => b.workoutClassId === workoutClassId);

  const getBookingId = (workoutClassId: number) => {
    const booking = bookedClasses.find(
      b => b.workoutClassId === workoutClassId
    );
    return booking?.bookingId;
  };

  useEffect(() => {
    const loadUserBookings = async () => {
      if (!userId || isLoading) return;

      try {
        const data: BookingOutputDto[] = await fetchUserBookings(userId);
        const transformed = data.map(booking => ({
          workoutClassId: booking.workoutClassId as number,
          bookingId: booking.id,
        }));
        setBookedClasses(transformed);
      } catch (err) {
        console.error('Fel vid hämntning av bokningar: ', err);
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

        const filteredData = data.filter(
          (wc: WorkoutClass) => new Date(wc.startDate) > new Date()
        );

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
    console.log('klickat på knapp för id: ', workoutClassId);
    if (!userId) {
      alert('Du måste vara inloggad för att boka eller avboka.');
      return;
    }

    const alreadyBooked = isClassBooked(workoutClassId);
    if (alreadyBooked) {
      const bookingId = getBookingId(workoutClassId);
      if (!bookingId) {
        alert('Kunde inte hitta boknings-ID för att avboka.');
        return;
      }

      try {
        await cancelBooking(bookingId);
        setBookedClasses(prev =>
          prev.filter(b => b.workoutClassId !== workoutClassId)
        );

        setWorkoutClasses(prev =>
          prev.map(wc =>
            wc.id === workoutClassId
              ? {
                  ...wc,
                  bookingIds: wc.bookingIds.filter(id => id !== bookingId),
                }
              : wc
          )
        );
      } catch (err) {
        console.error(err);
        alert('Något gick fel vid avbokning.');
      }
    } else {
      try {
        const data = await bookWorkout(userId, workoutClassId);
        setBookedClasses(prev => [
          ...prev,
          { workoutClassId: data.workoutClassId, bookingId: data.id },
        ]);

        setWorkoutClasses(prev =>
          prev.map(wc =>
            wc.id === workoutClassId
              ? { ...wc, bookingIds: [...wc.bookingIds, data.id] }
              : wc
          )
        );
      } catch (err) {
        console.error(err);
        alert('Något gick fel vid bokning.');
      }
    }
  };

  const handleCalendarClick = (workoutClass: WorkoutClass) => {
    setSelectedClass(workoutClass);
    setIsModalOpen(true);
  };

  return (
    <div className="custom-page">
      <AppNavbar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Träningspass</h2>
        {error && <p className="text-danger">{error}</p>}
        <AppCalendar
          workoutClasses={workoutClasses}
          onClassClick={handleCalendarClick}
          bookedClasses={bookedClasses}
        />
        <br />
        <br />

        {selectedClass && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onBook={() => {
              toggleBooking(selectedClass.id);
              setIsModalOpen(false);
            }}
            title={selectedClass.workoutName}
            shortDescription={selectedClass.shortDescription}
            time={`Tid ${FormatDate(selectedClass.startDate, selectedClass.endDate)}`}
            actionLabel={isClassBooked(selectedClass.id) ? 'Avboka' : 'Boka'}
          />
        )}

        <h2 className="mb-3">
          Lista med alla kommande pass{' '}
          <i className="bi bi-heart-fill heart-icon-smaller"></i>
        </h2>
        <div className="row">
          {[...workoutClasses]
            .sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
            )
            .map(wc => {
              const isBooked = isClassBooked(wc.id);
              const isFull = wc.bookingIds.length >= wc.maxParticipants;
              return (
                <div key={wc.id} className="col-13 mb-3">
                  <div style={{ width: '45%' }}>
                    <AppCard
                      title={wc.workoutName}
                      shortDescription={wc.shortDescription}
                      time={FormatDate(wc.startDate, wc.endDate)}
                      bookings={`${wc.bookingIds.length} / ${wc.maxParticipants}`}
                      onClick={() => toggleBooking(wc.id)}
                      buttonText={
                        isBooked ? 'Avboka' : isFull ? 'Fullbokat' : 'Boka'
                      }
                      buttonDisabled={isFull && !isBooked}
                      buttonVariant={isBooked ? 'cancel' : 'default'}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
