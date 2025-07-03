export interface WorkoutClass {
  id: number;
  workoutName: string;
  shortDescription: string;
  longDescription: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  bookingIds: number[];
}
