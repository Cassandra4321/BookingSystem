import { ApiClient } from "../domain/client";

export const apiClient = new ApiClient("https://localhost:7193")

export async function fetchWorkoutClasses() {
    const res = await fetch('https://localhost:7193/api/WorkoutClass');
    if (!res.ok) throw new Error('Kunde inte hämta träningspassen.');
    return res.json();
  }
  
  export async function fetchUserBookings(userId: string) {
    const res = await fetch(`https://localhost:7193/api/booking/user/${userId}`);
    if (!res.ok) throw new Error('Kunde inte hämta bokningar.');
    return res.json();
  }
  
  export async function bookWorkout(userId: string, workoutClassId: number) {
    const res = await fetch('https://localhost:7193/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, workoutClassId }),
    });
    if (!res.ok) throw new Error('Kunde inte boka passet.');
    return res.json();
  }
  
  export async function cancelBooking(bookingId: number) {
    const res = await fetch(`https://localhost:7193/api/booking/${bookingId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Kunde inte avboka passet.');
  }