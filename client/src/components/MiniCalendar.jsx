import React from 'react';
import '../styles/MiniCalendar.css';

const MiniCalendar = ({ currentMonth, currentYear, onDateSelect, events }) => {
  // Remove onEventClick from parameters since it's not being passed

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (month, year) => new Date(year, month, 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  // Add isToday function
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentMonth === today.getMonth() &&
           currentYear === today.getFullYear();
  };

  const hasEventOnDate = (day) => {
    const targetDate = new Date(currentYear, currentMonth, day);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    return events.some(event => event.date === targetDateString);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDay(currentMonth, currentYear);

  const handleDateClick = (day, hasEvent) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onDateSelect(selectedDate);
    // Remove the onEventClick call since it's not needed
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="text-center font-medium mb-4 text-gray-700 dark:text-gray-200">
        {monthNames[currentMonth]} {currentYear}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-sm text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {[...Array(startDay)].map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const hasEvent = hasEventOnDate(day);
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day}
              onClick={() => handleDateClick(day, hasEvent)}
              className={`relative h-8 flex items-center justify-center rounded-full cursor-pointer text-sm
                ${hasEvent ? 'font-medium' : ''}
                ${isCurrentDay ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              {day}
              {hasEvent && (
                <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;