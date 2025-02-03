// components/Calendar.tsx
'use client';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { startOfWeek } from 'date-fns';
import { getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': require('date-fns/locale/en-US') };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Task {
  title: string;
  dueDate: string | number | Date;
}

interface CalendarProps {
  tasks: Task[];
}

export const Calendar = ({ tasks }: CalendarProps) => {
  const events = tasks.map(
    (task: { title: any; dueDate: string | number | Date }) => ({
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
    })
  );

  return (
    <div className="mt-4 h-96">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};
