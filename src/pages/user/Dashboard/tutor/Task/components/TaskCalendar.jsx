import { useState, useMemo } from "react";
import { Check, CircleCheckBig } from "lucide-react";
import { format, getDaysInMonth, startOfMonth, addDays, isBefore, isToday } from "date-fns";

const TaskCalendar = ({ tasks, onCreateTask, onTaskClick }) => {
  const currentDate = new Date();

  const taskMap = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      const taskDate = format(new Date(task.date), "yyyy-MM-dd");
      map.set(taskDate, task);
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
        day
      );
      const dateKey = format(date, "yyyy-MM-dd");
      days.push({
        date,
        task: taskMap.get(dateKey) || null,
        isPast: isBefore(date, new Date()),
        isToday: isToday(date),
      });
    }

    return days;
  }, [currentDate, taskMap]);

  return (
    <div className="w-full">
      <div className="text-center text-lg font-bold mb-4 text-emerald-400">
        {format(currentDate, "MMMM yyyy")}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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
                  ? onTaskClick(day.task)
                  : !day.isPast && onCreateTask(day.date)
              }
              className={`
                p-2 border border-emerald-800/30 rounded relative cursor-pointer
                ${day.isPast ? "bg-black/20 border-red-400" : "hover:bg-emerald-800/30"}
                ${day.task ? "bg-emerald-900/30" : ""}
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
          )
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;
