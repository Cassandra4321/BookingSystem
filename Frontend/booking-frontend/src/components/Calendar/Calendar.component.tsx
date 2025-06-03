import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { sv } from 'date-fns/locale/sv';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.component.css';
import { WorkoutClass } from '../../interfaces/WorkoutClass';
import { useState } from 'react';

const locales = {
  sv: sv,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface AppCalendarProps {
  workoutClasses: WorkoutClass[];
  onClassClick: (workoutClass: WorkoutClass) => void;
  bookedClasses: { workoutClassId: number; bookingId: number | undefined }[];
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  workoutClass: WorkoutClass;
}

export function AppCalendar({
  workoutClasses,
  onClassClick,
  bookedClasses,
}: AppCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');

  const events: CalendarEvent[] = workoutClasses.map(wc => ({
    title: wc.workoutName,
    start: new Date(wc.startDate),
    end: new Date(wc.endDate),
    workoutClass: wc,
  }));

  const handleViewChange = (newView: View) => {
    setView(newView);
    if (newView === 'month') {
      setCurrentDate(new Date());
    }
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const isClassBooked = (workoutClassId: number) => {
    return bookedClasses.some(b => b.workoutClassId === workoutClassId);
  };

  const isClassFull = (workoutClass: WorkoutClass) => {
    return workoutClass.bookingIds.length >= workoutClass.maxParticipants;
  };

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        culture="sv"
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        view={view}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        date={currentDate}
        onSelectEvent={(event: CalendarEvent) => {
          const isBooked = isClassBooked(event.workoutClass.id);
          const isFull = isClassFull(event.workoutClass);

          if (isFull && !isBooked) return;

          onClassClick(event.workoutClass);
        }}
        messages={{
          today: 'Idag',
          previous: 'Föregående',
          next: 'Nästa',
          month: 'Månad',
          week: 'Vecka',
          day: 'Dag',
          agenda: 'Agenda',
        }}
        eventPropGetter={event => {
          const isBooked = isClassBooked(event.workoutClass.id);
          const isFull = isClassFull(event.workoutClass);

          let className = 'calendar-event';
          if (isBooked) {
            className += ' booked';
          } else if (isFull) {
            className += ' full';
          }

          return { className };
        }}
      />
    </div>
  );
}
