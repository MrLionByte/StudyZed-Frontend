import { useState, useMemo } from 'react';
import {
  Check,
  CircleCheckBig,
  CalendarArrowUp,
  CalendarArrowDown,
} from 'lucide-react';
import {
  format,
  getDaysInMonth,
  startOfMonth,
  addDays,
  isBefore,
  isToday,
  parseISO,
} from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import { debounce } from 'lodash';

const TaskCalendar = ({ tasks, onCreateTask, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthError, setMonthError] = useState('');

  const taskMap = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      const taskDate = parseISO(task.date);
      taskDate.setUTCHours(0, 0, 0, 0);
      const dateKey = format(taskDate, 'yyyy-MM-dd');
      map.set(dateKey, task);
    });
    return map;
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayOfMonth = startOfMonth(currentDate);
    const daysInMonthCount = getDaysInMonth(currentDate);
    const startOffset = firstDayOfMonth.getDay();

    for (let i = 0; i < startOffset; i++) {
      days.push({ empty: true });
    }

    for (let day = 1; day <= daysInMonthCount; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
        0,
        0,
        0,
        0,
      );
      const dateKey = format(date, 'yyyy-MM-dd');

      days.push({
        date: date,
        task: taskMap.get(dateKey) || null,
        isPast: isBefore(date, new Date()),
        isToday: isToday(date),
      });
    }

    return days;
  }, [currentDate, taskMap]);

  const handlePreviousMonth = () => {
    setMonthError('');
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      if (newDate.getFullYear() < 2025) {
        return prevDate;
      }
      return newDate;
    });
  };

  const handleNextMonth = debounce((e) => {
    e.preventDefault();

    setCurrentDate((nextDate) => {
      const newDate = new Date(nextDate);
      newDate.setMonth(newDate.getMonth() + 1);

      const thisMonth = new Date();
      const maxAllowedMonth = new Date(thisMonth);
      maxAllowedMonth.setMonth(thisMonth.getMonth() + 1);

      if (newDate > maxAllowedMonth) {
        setMonthError(
          'You can only add tasks up to one month in advance. Please select a date in between',
        );
        return nextDate;
      }
      return newDate;
    });
  }, 500);

  return (
    <div className="w-full">
      <div className="flex justify-center text-center text-lg font-bold mb-4 text-emerald-400">
        <button
          onClick={handlePreviousMonth}
          className="mr-4 text-white text-center"
        >
          <CalendarArrowUp width={18} />
        </button>
        {format(currentDate, 'MMMM yyyy')}
        <button
          onClick={(e) => handleNextMonth(e)}
          className="ml-4 text-white text-center"
        >
          <CalendarArrowDown width={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-emerald-600 text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) =>
          day.empty ? (
            <div key={index} className="p-2"></div>
          ) : (
            <div
              key={index}
              onClick={() =>
                day.task
                  ? onTaskClick(day.task, index, day.date)
                  : !day.isPast && onCreateTask(day.date)
              }
              className={`
                p-2 border border-emerald-800/30 rounded relative cursor-pointer
                ${day.isPast ? 'bg-black/20 border-red-400' : 'hover:bg-emerald-800/30'}
                ${day.task ? 'bg-emerald-900/30' : ''}
                transition-colors duration-200
              `}
            >
              <span className="absolute top-0.5 left-1 text-xs text-emerald-400">
                {day.date.getDate()}
              </span>
              <div className="flex items-center justify-center h-full pt-2">
                {day.task && (
                  <CircleCheckBig className="text-emerald-400 w-4 h-4" />
                )}
              </div>
            </div>
          ),
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default TaskCalendar;
