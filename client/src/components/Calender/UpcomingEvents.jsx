import React from "react";

const UpcomingEvents = ({ events, setSelectedDate, setShowModal }) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && !event.completed;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA - dateB !== 0) return dateA - dateB;
      const timeA = new Date(`2000-01-01T${a.startTime}`);
      const timeB = new Date(`2000-01-01T${b.startTime}`);
      return timeA - timeB;
    })
    .slice(0, 5);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Events</h3>
      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <div
              key={event.id}
              onClick={() => {
                setSelectedDate(new Date(event.date));
                setShowModal(true);
              }}
              className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
              <div className="ml-3 flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{event.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(event.date).toLocaleDateString()} • {event.startTime}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No upcoming events</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;