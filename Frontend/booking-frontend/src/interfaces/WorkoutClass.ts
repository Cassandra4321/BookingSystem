export interface WorkoutClass {
  id: number;
  workoutName: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  bookingIds: number[];
}
