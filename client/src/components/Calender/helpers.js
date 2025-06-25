export const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

export const getStartDay = (month, year) => {
  const startDay = new Date(year, month, 1).getDay();
  return startDay === 0 ? 6 : startDay - 1;
};

export const isSameDay = (date1, date2) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

export const getWeekDates = (selectedDate, currentYear, currentMonth) => {
  const dates = [];
  const baseDate = selectedDate || new Date(currentYear, currentMonth, 1);
  const first = new Date(baseDate);
  first.setDate(baseDate.getDate() - baseDate.getDay());
  for (let i = 0; i < 7; i++) {
    const date = new Date(first);
    date.setDate(first.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const getEventsForDate = (events, day, currentYear, currentMonth) => {
  if (!day) return [];
  const targetDate = new Date(currentYear, currentMonth, day);
  const targetDateString = targetDate.toISOString().split("T")[0];
  return events.filter(event => event.date === targetDateString);
};

export const getConflictsForDate = (date, events) => {
  const dateString = date.toISOString().split("T")[0];
  const dayEvents = events.filter(event => event.date === dateString);
  const conflicts = [];
  dayEvents.forEach((event1, index) => {
    dayEvents.slice(index + 1).forEach(event2 => {
      const time1 = new Date(`2000-01-01T${event1.startTime}`);
      const time2 = new Date(`2000-01-01T${event2.startTime}`);
      const endTime1 = new Date(`2000-01-01T${event1.endTime}`);
      const endTime2 = new Date(`2000-01-01T${event2.endTime}`);
      if ((time1 <= time2 && endTime1 > time2) || (time2 <= time1 && endTime2 > time1)) {
        conflicts.push(event1, event2);
      }
    });
  });
  return conflicts;
};

export const checkEventConflicts = events => {
  const conflicts = [];
  const eventsByDate = {};
  events.forEach(event => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });
  Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
    dayEvents.forEach((event1, index) => {
      dayEvents.slice(index + 1).forEach(event2 => {
        const time1 = new Date(`2000-01-01T${event1.startTime}`);
        const time2 = new Date(`2000-01-01T${event2.startTime}`);
        const endTime1 = new Date(`2000-01-01T${event1.endTime}`);
        const endTime2 = new Date(`2000-01-01T${event2.endTime}`);
        if ((time1 <= time2 && endTime1 > time2) || (time2 <= time1 && endTime2 > time1)) {
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