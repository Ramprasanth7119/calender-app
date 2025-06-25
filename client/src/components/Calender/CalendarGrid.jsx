import React from "react";

/**
 * CalendarGrid renders the calendar's month grid, ensuring proper alignment by always filling
 * all 6 rows (42 cells) and accounting for the first day's offset, so the grid remains consistent.
 * Now includes the weekday headers at the top.
 */
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  // Calculate the total number of cells (6 rows x 7 columns = 42)
  // This ensures consistent grid alignment for all months
  const totalCells = 42;
  const gridCells = [];

  // Fill leading empty cells (before the 1st day of month)
  for (let i = 0; i < startDay; i++) {
    gridCells.push(
      <div key={`empty-start-${i}`} className="bg-gray-50 dark:bg-gray-800 h-32" />
    );
  }

  // Fill in the actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split("T")[0];
    const dayEvents = events.filter(event => event.date === dateString);
    const conflicts = getConflictsForDate(date);
    const hasConflicts = conflicts.length > 0;
    const hasMoreEvents = dayEvents.length > MAX_VISIBLE_EVENTS;
    gridCells.push(
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
  }

  // Fill trailing empty cells (after last day of month), if needed
  while (gridCells.length < totalCells) {
    gridCells.push(
      <div key={`empty-end-${gridCells.length}`} className="bg-gray-50 dark:bg-gray-800 h-32" />
    );
  }

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 px-1 text-xs md:text-sm font-semibold text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px">
        {gridCells}
      </div>
    </div>
  );
};

export default CalendarGrid;