import React from "react";

const CalendarGrid = ({
  daysInMonth,
  startDay,
  currentYear,
  currentMonth,
  isToday,
  getEventsForDate,
  events,
  getConflictsForDate,
  setSelectedDate,
  setShowModal,
}) => {
  const MAX_VISIBLE_EVENTS = 2;
  return (
    <div className="grid grid-cols-7 gap-px">
      {[...Array(startDay)].map((_, index) => (
        <div key={`empty-${index}`} className="bg-gray-50 dark:bg-gray-800 h-32" />
      ))}
      {[...Array(daysInMonth)].map((_, index) => {
        const day = index + 1;
        const date = new Date(currentYear, currentMonth, day);
        const dateString = date.toISOString().split("T")[0];
        const dayEvents = events.filter(event => event.date === dateString);
        const conflicts = getConflictsForDate(date);
        const hasConflicts = conflicts.length > 0;
        const hasMoreEvents = dayEvents.length > MAX_VISIBLE_EVENTS;
        return (
          <div
            key={day}
            onClick={() => {
              setSelectedDate(date);
              setShowModal(true);
            }}
            className={`min-h-[120px] p-2 relative cursor-pointer transition-colors ${
              hasConflicts
                ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30"
                : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {hasConflicts && (
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-200 dark:shadow-amber-900/30" />
            )}
            <span className={`text-sm font-medium ${isToday(day) ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>{day}</span>
            <div className="mt-1 space-y-1">
              {dayEvents.slice(0, MAX_VISIBLE_EVENTS).map(event => (
                <div
                  key={event.id}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedDate(date);
                    setShowModal(true);
                  }}
                  className="flex items-center p-1 rounded-md text-xs"
                  style={{ backgroundColor: `${event.color}20` }}
                >
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: event.color }} />
                  <span className="font-medium truncate">{event.title}</span>
                  <span className="ml-auto text-gray-500">{event.startTime}</span>
                </div>
              ))}
              {hasMoreEvents && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedDate(date);
                    setShowModal(true);
                  }}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mt-1"
                >
                  +{dayEvents.length - MAX_VISIBLE_EVENTS} more events
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;