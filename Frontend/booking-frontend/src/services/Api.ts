import {
  ApiClient,
  WorkoutClassDto,
  CreateWorkoutClassDto,
  UpdateWorkoutClassDto,
} from '../domain/client';

export const apiClient = new ApiClient('https://localhost:7193');

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
  const res = await fetch(`https://localhost:7193/api/booking/${bookingId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Kunde inte avboka passet.');
}

export async function fetchRecommendation(userId: string) {
  return await apiClient.recommendations(userId);
}

export async function downloadUpcomingBookingsCsv(userId: string) {
  const url = `https://localhost:7193/api/Csv/user/${encodeURIComponent(userId)}/upcoming`;
  const res = await fetch(url);

  if (!res.ok) throw new Error('Kunde inte ladda ner kommande bokningar.');

  const blob = await res.blob();
  const urlBlob = window.URL.createObjectURL(blob);

  // Skapa en länk och klicka på den för att trigga nedladdningen
  const a = document.createElement('a');
  a.href = urlBlob;
  a.download = 'kommande_bokningar.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Rensa upp blob-URL efter nedladdning
  window.URL.revokeObjectURL(urlBlob);
}

export async function fetchAdminStatistics() {
  const res = await fetch('https://localhost:7193/api/AdminStatistics');
  if (!res.ok) throw new Error('Kunde inte hämta statistik');
  return res.json();
}

export function getAllWorkoutClasses(): Promise<WorkoutClassDto[]> {
  return apiClient.workoutClassAll();
}
export function createWorkoutClass(
  dto: CreateWorkoutClassDto
): Promise<WorkoutClassDto> {
  return apiClient.workoutClassPOST(dto);
}

export function getWorkoutClass(id: number) {
  return apiClient.workoutClassGET(id);
}

export function updateWorkoutClass(id: number, dto: UpdateWorkoutClassDto) {
  return apiClient.workoutClassPUT(id, dto);
}

export function deleteWorkoutClass(id: number) {
  return apiClient.workoutClassDELETE(id);
}
