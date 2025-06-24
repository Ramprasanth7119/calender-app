export const addDuration = (date, time, duration) => {
  const [hours, minutes] = duration.replace('h', '').replace('m', '').split(':');
  const datetime = new Date(`${date} ${time}`);
  datetime.setHours(datetime.getHours() + parseInt(hours || 0));
  datetime.setMinutes(datetime.getMinutes() + parseInt(minutes || 0));
  return datetime;
};

export const getOverlappingEvents = (events) => {
  const sortedEvents = events.sort((a, b) => {
    const timeA = new Date(`${a.date} ${a.time}`);
    const timeB = new Date(`${b.date} ${b.time}`);
    return timeA - timeB;
  });

  const overlapping = [];
  for (let i = 0; i < sortedEvents.length - 1; i++) {
    const current = sortedEvents[i];
    const next = sortedEvents[i + 1];
    
    const currentEnd = addDuration(current.date, current.time, current.duration);
    const nextStart = new Date(`${next.date} ${next.time}`);
    
    if (currentEnd > nextStart) {
      overlapping.push([current, next]);
    }
  }
  return overlapping;
};