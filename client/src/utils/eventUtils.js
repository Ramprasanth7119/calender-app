/**
 * Check for conflicts between events
 */
export const checkEventConflicts = (events = []) => {
  if (!Array.isArray(events) || events.length === 0) return [];

  const conflicts = [];
  const eventsByDate = {};

  // Group events by date
  events.forEach(event => {
    if (!event?.date) return;
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });

  // Check conflicts for each date
  Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
    dayEvents.forEach((event1, index) => {
      if (!event1?.startTime || !event1?.endTime) return;
      
      dayEvents.slice(index + 1).forEach(event2 => {
        if (!event2?.startTime || !event2?.endTime) return;

        const time1 = new Date(`2000-01-01T${event1.startTime}`);
        const time2 = new Date(`2000-01-01T${event2.startTime}`);
        const endTime1 = new Date(`2000-01-01T${event1.endTime}`);
        const endTime2 = new Date(`2000-01-01T${event2.endTime}`);

        if ((time1 <= time2 && endTime1 > time2) || 
            (time2 <= time1 && endTime2 > time1)) {
          conflicts.push({
            date,
            events: [event1, event2]
          });
        }
      });
    });
  });

  return conflicts;
};

/**
 * Get upcoming events
 */
export const getUpcomingEvents = (events = [], limit = 5) => {
  if (!Array.isArray(events)) return [];

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return events
    .filter(event => {
      if (!event?.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= now && !event.completed;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    })
    .slice(0, limit);
};