// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdChevronLeft, 
  MdChevronRight, 
  MdToday,
  MdEvent,
  MdAccessTime,
  MdLocationOn 
} from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventModal from './EventModal';
import MiniCalendar from './MiniCalendar';
import eventsData from '../events.json';
import '../styles/Calender.css';

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load events from JSON
    setEvents(eventsData);
  }, []);

  // Add useEffect to save events to localStorage
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Add overflow hidden to body to prevent double scrollbars
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Helper to get number of days in month
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Helper to get the day index of first date in month (0 = Sunday)
  const getStartDay = (month, year) => new Date(year, month, 1).getDay();

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(year => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(year => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDay(currentMonth, currentYear);
  const totalCells = startDay + daysInMonth;

  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  // Update the handleDateClick function
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventsForDate = getEventsForDate(date.getDate());
    setShowModal(true); // Always show modal
  };

  const isWeekend = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const getWeekDates = () => {
    const dates = [];
    const current = new Date(currentYear, currentMonth, selectedDate?.getDate() || 1);
    const first = current.getDate() - current.getDay();
    
    for(let i = 0; i < 7; i++) {
      const date = new Date(current);
      date.setDate(first + i);
      dates.push(date);
    }
    return dates;
  };

  const renderView = () => {
    switch(viewMode) {
      case 'week':
        return (
          <div className="week-view">
            {getWeekDates().map((date, index) => (
              <div 
                key={index}
                className={`calendar-day ${
                  isToday(date.getDate()) &&
                  date.getMonth() === currentMonth ? 
                  'today' : ''
                }`}
              >
                <div className="day-number">{date.getDate()}</div>
                <div className="events-container">
                  {getEventsForDate(date.getDate()).map(event => (
                    <div 
                      key={event.id}
                      className="event-indicator"
                      title={`${event.title} - ${event.time}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'day':
        return renderDayView();
      default:
        return (
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="calendar-day-name">{d}</div>
            ))}

            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-empty"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDate(day);
              
              return (
                <div
                  key={day}
                  className={`calendar-day ${isToday(day) ? 'today' : ''} 
                               ${isWeekend(day) ? 'weekend' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="day-number">{day}</div>
                  <div className="events-container">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={`event-indicator ${event.completed ? 'completed' : ''}`}
                        style={{ 
                          backgroundColor: event.color,
                          opacity: event.completed ? 0.7 : 1,
                          borderLeft: `3px solid ${event.color}`
                        }}
                      >
                        <div className="event-content">
                          <span className="event-time">
                            {event.startTime}
                          </span>
                          <span className="event-title" style={{
                            textDecoration: event.completed ? 'line-through' : 'none'
                          }}>
                            {event.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
    }
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDate(selectedDate?.getDate() || today.getDate());

    return (
      <div className="day-view">
        {hours.map(hour => (
          <div key={hour} className="hour-slot">
            <div className="hour-label">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
            <div className="hour-events">
              {dayEvents
                .filter(event => parseInt(event.time.split(':')[0]) === hour)
                .map(event => (
                  <div
                    key={event.id}
                    className="event-indicator"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleViewChange = (newView) => {
    setViewMode(newView);
    // Reset selected date when changing views
    setSelectedDate(new Date(currentYear, currentMonth, today.getDate()));
  };

  const handleTodayClick = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };

  // Update handleSaveEvent to include proper error handling
  const handleSaveEvent = (newEvent, isEditing) => {
    try {
      const updatedEvent = {
        ...newEvent,
        id: isEditing ? newEvent.id : Date.now(),
        date: selectedDate.toISOString().split('T')[0],
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        completed: newEvent.completed || false,
        color: newEvent.color || '#1a73e8'
      };

      setEvents(prevEvents => {
        const newEvents = isEditing
          ? prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event)
          : [...prevEvents, updatedEvent];
        
        // Save to localStorage immediately after update
        localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
        return newEvents;
      });

      setShowModal(false);
      toast.success(isEditing ? 'Event updated successfully!' : 'Event added successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event. Please try again.');
    }
  };

  // Update handleDeleteEvent to persist changes
  const handleDeleteEvent = (eventId) => {
    try {
      setEvents(prevEvents => {
        const newEvents = prevEvents.filter(event => event.id !== eventId);
        localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
        return newEvents;
      });
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    }
  };

  // Update handleCompleteEvent to persist changes
  const handleCompleteEvent = (eventId) => {
    try {
      setEvents(prevEvents => {
        const newEvents = prevEvents.map(event =>
          event.id === eventId ? { ...event, completed: true } : event
        );
        localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
        return newEvents;
      });
      toast.success('Event marked as completed!');
    } catch (error) {
      console.error('Error completing event:', error);
      toast.error('Failed to mark event as completed.');
    }
  };

  // Update getEventsForDate function
  const getEventsForDate = (day) => {
    if (!day) return [];
    
    const targetDate = new Date(currentYear, currentMonth, day);
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    return events.filter(event => event.date === targetDateString);
  };

  // Update the calendar day rendering section
  const renderCalendarDays = () => {
    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="bg-gray-50 dark:bg-gray-800 py-2 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            {day}
          </div>
        ))}
        {[...Array(getDaysInMonth(currentMonth, currentYear))].map((_, i) => {
          const day = i + 1;
          const date = new Date(currentYear, currentMonth, day);
          const isCurrentDay = isSameDay(date, new Date());
          const dayEvents = getEventsForDate(day);
          
          return (
            <div
              key={day}
              onClick={() => handleDateClick(date)}
              className={`min-h-[120px] p-2 bg-white dark:bg-gray-800 transition-all cursor-pointer
                hover:bg-gray-50 dark:hover:bg-gray-700 ${
                isCurrentDay ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentDay ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`flex items-center p-2 rounded-lg text-sm ${
                      event.completed ? 'opacity-60' : ''
                    }`}
                    style={{
                      backgroundColor: `${event.color}15`,
                      borderLeft: `3px solid ${event.color}`
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: event.color }}>
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.startTime}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                      {event.completed ? '✓' : event.title[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Add navigation controls to header
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8 px-4">
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Calendar</h1>
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <MdChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <MdChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button onClick={handleTodayClick} className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full">
            <MdToday className="inline mr-1" /> Today
          </button>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {['Month', 'Week', 'Timeline'].map(view => (
            <button
              key={view}
              onClick={() => handleViewChange(view.toLowerCase())}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === view.toLowerCase()
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
      <button 
        onClick={() => setShowModal(true)}
        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all"
      >
        <MdAdd className="mr-1" /> Add Event
      </button>
    </div>
  );

  const renderUpcomingEvents = () => {
    const today = new Date();
    const upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    return (
      <div className="upcoming-events">
        <h3>Upcoming Events</h3>
        {upcomingEvents.length > 0 ? (
          <div className="upcoming-events-list">
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                className="upcoming-event-card"
                style={{ borderLeft: `4px solid ${event.color}` }}
                onClick={() => {
                  setSelectedDate(new Date(event.date));
                  setShowModal(true);
                }}
              >
                <div className="event-date">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-time">{event.startTime}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-events">No upcoming events</p>
        )}
      </div>
    );
  };

  // Update the main return statement
  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Sidebar - collapsible on mobile */}
        <aside className="lg:w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-b lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto
          transform lg:transform-none lg:opacity-100 transition-all duration-300 ease-in-out
          h-[250px] lg:h-full"
        >
          <div className="p-4">
            <MiniCalendar 
              currentMonth={currentMonth}
              currentYear={currentYear}
              onDateSelect={handleDateClick}
              events={events}
            />
            {renderUpcomingEvents()}
          </div>
        </aside>

        {/* Main Calendar Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0">{renderHeader()}</div>
          <div className="flex-1 overflow-auto p-4">
            <div className="h-full">{renderCalendarDays()}</div>
          </div>
        </main>

        {/* Modal */}
        {showModal && (
          <EventModal
            date={selectedDate || new Date()}
            events={selectedDate ? getEventsForDate(selectedDate.getDate()) : []}
            onClose={() => setShowModal(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onComplete={handleCompleteEvent}
            theme={theme}
          />
        )}
        <ToastContainer position="bottom-right" theme={theme} />
      </div>
    </div>
  );
};

export default Calendar;
