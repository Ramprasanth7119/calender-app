// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdChevronLeft, 
  MdChevronRight, 
  MdToday,
  MdEvent,
  MdFilterList,
  MdArrowDropDown,
  MdDone,
  MdCalendarToday,
  MdViewWeek,
  MdViewDay
} from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventModal from './EventModal';
import MiniCalendar from './MiniCalendar';
import eventsData from '../events.json';
import ThemeToggle from './ThemeToggle';
import '../styles/Calender.css';

const monthNames = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const VIEW_OPTIONS = [
  { label: 'Month', value: 'month', icon: <MdCalendarToday className="w-4 h-4" /> },
  { label: 'Week', value: 'week', icon: <MdViewWeek className="w-4 h-4" /> },
  { label: 'Day', value: 'day', icon: <MdViewDay className="w-4 h-4" /> }
];

const Calendar = () => {
  const today = new Date();

  console.log(eventsData);
  
  // State declarations
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState(eventsData);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('month');
  const [theme, setTheme] = useState('light');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchText, setSearchText] = useState('');
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const filterOptions = [
    { 
      label: 'All Events', 
      value: 'all',
      icon: <MdEvent className="w-4 h-4 mr-2" />
    },
    { 
      label: 'This Month', 
      value: 'thisMonth',
      icon: <MdEvent className="w-4 h-4 mr-2" /> 
    },
    { 
      label: `Previous Month (${monthNames[currentMonth === 0 ? 11 : currentMonth - 1]})`, 
      value: 'previousMonth',
      icon: <MdChevronLeft className="w-4 h-4 mr-2" />
    },
    { 
      label: 'Upcoming', 
      value: 'upcoming',
      icon: <MdChevronRight className="w-4 h-4 mr-2" />
    },
    { 
      label: 'Completed', 
      value: 'completed',
      icon: <MdDone className="w-4 h-4 mr-2" />
    }
  ];

  // Add this helper function for time slots
  const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    time: `${String(i).padStart(2, '0')}:00`
  }));

  // Update the existing useEffect for filtered events
  useEffect(() => {
    let filtered = [...events];

    // Apply search filter
    if (searchText.trim()) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchText.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply date/status filters
    switch(activeFilter) {
      case 'thisMonth':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === currentMonth && 
                 eventDate.getFullYear() === currentYear;
        });
        break;
      case 'previousMonth':
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === prevMonth && 
                 eventDate.getFullYear() === prevYear;
        });
        break;
      case 'upcoming':
        const now = new Date();
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now && !event.completed;
        });
        break;
      case 'completed':
        filtered = filtered.filter(event => event.completed);
        break;
      case 'all':
      default:
        // Keep all events
        break;
    }

    setFilteredEvents(filtered);
  }, [events, activeFilter, searchText, currentMonth, currentYear]); // Add all dependencies

  // Update the useEffect for loading events and checking conflicts
  useEffect(() => {
    // Load events from localStorage first, then from JSON if none exist
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(eventsData);
    }
  }, []);

  // Add useEffect to save events to localStorage
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // 1. First, update the filter handler function
  const handleFilterChange = (filterValue) => {
    setActiveFilter(filterValue);
    let filtered = [...events];

    // First apply search filter if exists
    if (searchText.trim()) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchText.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        event.date.includes(searchText)
      );
    }

    // Then apply date/status filters
    switch(filterValue) {
      case 'thisMonth':
        // Use the existing today constant from component scope
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= monthStart && eventDate <= monthEnd;
        });

        toast.info(`Showing events for ${monthNames[today.getMonth()]} ${today.getFullYear()}`);
        break;

      case 'all':
        // Use the existing today constant
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        break;

      case 'previousMonth':
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        setCurrentMonth(prevMonth);
        setCurrentYear(prevYear);
        
        const prevMonthStart = new Date(prevYear, prevMonth, 1);
        const prevMonthEnd = new Date(prevYear, prevMonth + 1, 0);
        
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= prevMonthStart && eventDate <= prevMonthEnd;
        });

        toast.info(`Showing events for ${monthNames[prevMonth]} ${prevYear}`);
        break;

      // ... rest of the cases remain the same
    }

    setFilteredEvents(filtered);
    setFilterOpen(false);
  };

  // 2. Update the search handler
  const handleSearch = (value) => {
    setSearchText(value);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      let filtered = [...events];
      
      if (value.trim()) {
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(value.toLowerCase()) ||
          event.description?.toLowerCase().includes(value.toLowerCase()) ||
          event.date.includes(value)
        );
      }
      
      setFilteredEvents(filtered);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // 3. Update the clear filters function
  const clearFilters = () => {
    const today = new Date();
    setActiveFilter('all');
    setSearchText('');
    setFilteredEvents(events);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    toast.success('Filters cleared');
  };

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
  const getStartDay = (month, year) => {
    const startDay = new Date(year, month, 1).getDay();
    return startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start
  };

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

  // Update getWeekDates function
  const getWeekDates = () => {
    const dates = [];
    // If no selected date, use current date
    const baseDate = selectedDate || new Date(currentYear, currentMonth, 1);
    // Get the first day of the week (Sunday)
    const first = new Date(baseDate);
    first.setDate(baseDate.getDate() - baseDate.getDay());
    
    // Get 7 days starting from first
    for(let i = 0; i < 7; i++) {
      const date = new Date(first);
      date.setDate(first.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Update the renderView function to include the view selector
  const renderView = () => {
    // First render the view selector
    const viewContent = (() => {
      switch(viewMode) {
        case 'week':
          return renderWeekView();
        case 'day':
          return renderDayView();
        default:
          return renderCalendarDays();
      }
    })();

    return (
      <div className="flex flex-col h-full">
        {/* <div className="mb-4">
          {renderViewSelector()}
        </div> */}
        {viewContent}
      </div>
    );
  };

  const renderDayView = () => {
    const selectedDateEvents = selectedDate ? 
      events.filter(event => event.date === selectedDate.toISOString().split('T')[0]) : [];

    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Day header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedDate?.toLocaleDateString(undefined, { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-y-auto calendar-body">
          <div className="relative min-h-full">
            {TIME_SLOTS.map(({ hour, time }) => (
              <div 
                key={hour}
                className="flex border-b dark:border-gray-700 relative h-20"
              >
                {/* Time label */}
                <div className="w-20 py-2 px-3 text-right text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {time}
                </div>

                {/* Event slot */}
                <div className="flex-1 border-l dark:border-gray-700 relative group">
                  {selectedDateEvents
                    .filter(event => {
                      const eventHour = parseInt(event.startTime.split(':')[0]);
                      return eventHour === hour;
                    })
                    .map(event => (
                      <div
                        key={event.id}
                        className="absolute left-0 right-0 mx-2 p-2 rounded-lg cursor-pointer transition-all"
                        style={{
                          backgroundColor: `${event.color}20`,
                          borderLeft: `4px solid ${event.color}`,
                          top: '4px'
                        }}
                        onClick={() => {
                          setSelectedDate(new Date(event.date));
                          setShowModal(true);
                        }}
                      >
                        <div className="font-medium text-sm" style={{ color: event.color }}>
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    ))}

                  {/* Add event button on hover */}
                  <button
                    onClick={() => {
                      setSelectedDate(new Date(currentYear, currentMonth, selectedDate?.getDate() || 1));
                      setShowModal(true);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 
                             bg-blue-50 dark:bg-blue-900/20 transition-opacity flex items-center 
                             justify-center"
                  >
                    <MdAdd className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add the renderWeekView function  
  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b dark:border-gray-700">
          <div className="w-20" />
          {weekDates.map(date => (
            <div 
              key={date.toISOString()}
              className={`p-4 text-center border-l dark:border-gray-700 ${
                isSameDay(date, new Date()) ? 
                  'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {date.toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
              <div className={`text-2xl font-semibold mt-1 ${
                isSameDay(date, new Date()) ?
                  'text-blue-600 dark:text-blue-400' :
                  'text-gray-900 dark:text-gray-100'
              }`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-y-auto calendar-body">
          <div className="relative min-h-full">
            {TIME_SLOTS.map(({ hour, time }) => (
              <div 
                key={hour}
                className="grid grid-cols-8 border-b dark:border-gray-700 relative h-20"
              >
                <div className="w-20 py-2 px-3 text-right text-sm text-gray-500 dark:text-gray-400">
                  {time}
                </div>

                {weekDates.map(date => {
                  // Safely format date for comparison
                  const formattedDate = date.toISOString().split('T')[0];
                  
                  // Filter events with proper type checking
                  const dateEvents = events.filter(event => {
                    if (!event || !event.date || !event.startTime) return false;
                    return event.date === formattedDate && 
                           parseInt(event.startTime.split(':')[0]) === hour;
                  });

                  return (
                    <div 
                      key={date.toISOString()} 
                      className="border-l dark:border-gray-700 relative group"
                    >
                      {dateEvents.map(event => (
                        <div
                          key={event.id}
                          className="absolute left-0 right-0 mx-2 p-2 rounded-lg cursor-pointer transition-all"
                          style={{
                            backgroundColor: `${event.color}20`,
                            borderLeft: `4px solid ${event.color}`,
                            top: '4px'
                          }}
                          onClick={() => {
                            setSelectedDate(date);
                            setShowModal(true);
                          }}
                        >
                          <div className="font-medium text-sm truncate" style={{ color: event.color }}>
                            {event.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      ))}

                      {/* Add event button */}
                      <button
                        onClick={() => {
                          setSelectedDate(date);
                          setShowModal(true);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 
                                 bg-blue-50 dark:bg-blue-900/20 transition-opacity flex items-center 
                                 justify-center"
                      >
                        <MdAdd className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Uncomment and update the view selector in the header section
  const renderViewSelector = () => (
    <div className="hidden sm:flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      {VIEW_OPTIONS.map(option => (
        <button
          key={option.value}
          onClick={() => handleViewChange(option.value)}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${
            viewMode === option.value
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {option.icon}
          <span className="ml-2">{option.label}</span>
        </button>
      ))}
    </div>
  );

  const handleViewChange = (newView) => {
    setViewMode(newView);
    
    // Set selected date to today if not already set
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    
    // Reset filters when changing views
    if (activeFilter !== 'all') {
      clearFilters();
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
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
        
        // Save to localStorage
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
    
    return filteredEvents.filter(event => event.date === targetDateString);
  };

  // Add this helper function to check for event conflicts
  const checkEventConflicts = () => {
    const conflicts = [];
    
    events.forEach((event1, index) => {
      events.slice(index + 1).forEach(event2 => {
        if (event1.date === event2.date) {
          const time1 = new Date(`2000-01-01T${event1.startTime}`);
          const time2 = new Date(`2000-01-01T${event2.startTime}`);
          const endTime1 = new Date(`2000-01-01T${event1.endTime}`);
          const endTime2 = new Date(`2000-01-01T${event2.endTime}`);

          if ((time1 <= time2 && endTime1 > time2) || 
              (time2 <= time1 && endTime2 > time1)) {
            conflicts.push({
              date: event1.date,
              events: [event1, event2]
            });
          }
        }
      });
    });
    
    return conflicts;
  };

  // Update the conflict checking useEffect
  useEffect(() => {
    const conflicts = checkEventConflicts();
    
    // Save conflicts to localStorage
    localStorage.setItem('calendarConflicts', JSON.stringify(conflicts));
    
    if (conflicts.length > 0) {
      conflicts.forEach(conflict => {
        const conflictKey = `${conflict.date}-${conflict.events[0].id}-${conflict.events[1].id}`;
        
        // Check if we've already shown this conflict notification
        const shownConflicts = JSON.parse(localStorage.getItem('shownConflicts') || '[]');
        
        if (!shownConflicts.includes(conflictKey)) {
          toast.error(
            <div>
              <p className="font-semibold">Event Conflict Detected!</p>
              <p className="text-sm">Date: {new Date(conflict.date).toLocaleDateString()}</p>
              <p className="text-sm">Events:</p>
              <ul className="text-sm list-disc pl-4">
                <li>{conflict.events[0].title} ({conflict.events[0].startTime} - {conflict.events[0].endTime})</li>
                <li>{conflict.events[1].title} ({conflict.events[1].startTime} - {conflict.events[1].endTime})</li>
              </ul>
            </div>,
            {
              autoClose: false,
              closeOnClick: true,
              onClose: () => {
                // Add this conflict to shown conflicts
                const updatedShownConflicts = [...shownConflicts, conflictKey];
                localStorage.setItem('shownConflicts', JSON.stringify(updatedShownConflicts));
              }
            }
          );
        }
      });
    }
  }, [events]);

  // Update the renderCalendarDays function
  const renderCalendarDays = () => {
    const MAX_VISIBLE_EVENTS = 2;
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    return (
      <div className="grid grid-cols-7 gap-px">
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <div key={`empty-${index}`} className="bg-gray-50 dark:bg-gray-800 h-32" />
        ))}
        
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const date = new Date(currentYear, currentMonth, day);
          const dateString = date.toISOString().split('T')[0];
          const dayEvents = events.filter(event => event.date === dateString);
          const hasMoreEvents = dayEvents.length > MAX_VISIBLE_EVENTS;

          return (
            <div 
              key={day}
              onClick={() => {
                setSelectedDate(date);
                setShowModal(true);
              }}
              className="min-h-[120px] p-2 bg-white dark:bg-gray-800 relative 
                       cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 
                       transition-colors"
            >
              <span className={`text-sm font-medium ${
                isToday(day) ? 'text-blue-600 dark:text-blue-400' : 
                             'text-gray-900 dark:text-gray-100'
              }`}>
                {day}
              </span>
              
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, MAX_VISIBLE_EVENTS).map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent day click when clicking event
                      setSelectedDate(date);
                      setShowModal(true);
                    }}
                    className="flex items-center p-1 rounded-md text-xs"
                    style={{ backgroundColor: `${event.color}20` }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="font-medium truncate">{event.title}</span>
                    <span className="ml-auto text-gray-500">
                      {event.startTime}
                    </span>
                  </div>
                ))}

                {hasMoreEvents && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent day click
                      setSelectedDate(date);
                      setShowModal(true);
                    }}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 
                             hover:text-blue-800 dark:hover:text-blue-300 
                             transition-colors mt-1"
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

  // Add this before the return statement
  const renderHeader = () => (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4">
      {/* Left side - Navigation and current month/year */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                      text-gray-600 dark:text-gray-300"
            aria-label="Previous month"
          >
            <MdChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                      text-gray-600 dark:text-gray-300"
            aria-label="Next month"
          >
            <MdChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <button
          onClick={handleTodayClick}
          className="flex items-center px-3 py-2 text-sm font-medium 
                    text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 
                    rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <MdToday className="w-5 h-5 mr-2" />
          Today
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-3 py-2 text-sm font-medium 
                      text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 
                      rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <MdFilterList className="w-5 h-5 mr-2" />
            {filterOptions.find(option => option.value === activeFilter)?.label || 'Filter'}
            <MdArrowDropDown className="w-5 h-5 ml-1" />
          </button>

          {filterOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                onClick={() => setFilterOpen(false)}
              />
              {/* Updated positioning for mobile */}
              <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 lg:absolute lg:inset-auto lg:right-0 lg:top-full lg:translate-y-0 
                  lg:mt-2 p-4 w-auto lg:w-72 bg-white dark:bg-gray-800 
                  rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 
                  z-50 space-y-4 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Filter Events
                  </h3>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                </div>

                <div className="space-y-2">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleFilterChange(option.value);
                        setFilterOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm rounded-lg
                        transition-colors ${
                activeFilter === option.value
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
                    >
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                      {activeFilter === option.value && (
                        <span className="ml-auto">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                {activeFilter !== 'all' && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        clearFilters();
                        setFilterOpen(false);
                      }}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm 
                        font-medium text-red-600 dark:text-red-400 rounded-lg 
                        hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        
        {renderViewSelector()}  

        <button
          onClick={() => {
            setSelectedDate(new Date());
            setShowModal(true);
          }}
          className="flex items-center px-3 py-2 text-sm font-medium 
                    text-white bg-blue-600 hover:bg-blue-700 
                    dark:bg-blue-500 dark:hover:bg-blue-600 
                    rounded-lg shadow-sm transition-colors"
        >
          <MdAdd className="w-5 h-5 mr-2" />
          Add Event
        </button>

        <ThemeToggle />
      </div>
    </div>
  );

  // Add the touch event handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX) return;
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50; // minimum distance for swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right - go to previous month
        goToPreviousMonth();
      } else {
        // Swipe left - go to next month
        goToNextMonth();
      }
    }

    // Reset touch coordinates
    setTouchStartX(null);
    setTouchEndX(null);
    setIsSwiping(false);
  };

  // Add the renderMobileView function
  const renderMobileView = () => (
    <div className="p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <MiniCalendar 
          currentMonth={currentMonth}
          currentYear={currentYear}
          onDateSelect={handleDateClick}
          events={events}
          className="w-full" // Make mini calendar full width on mobile
        />
        
        {/* Event list for selected date */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Events for {selectedDate ? selectedDate.toLocaleDateString() : 'Today'}
          </h3>
          <div className="space-y-3">
            {(selectedDate ? getEventsForDate(selectedDate.getDate()) : []).map(event => (
              <div
                key={event.id}
                className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg 
                         cursor-pointer hover:shadow-md transition-all"
                onClick={() => setShowModal(true)}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: event.color }}
                />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>
            ))}
            {(selectedDate ? getEventsForDate(selectedDate.getDate()) : []).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                No events for this date
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Add renderUpcomingEvents function
  const renderUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && !event.completed;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Show only next 5 upcoming events

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Upcoming Events
        </h3>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedDate(new Date(event.date));
                  setShowModal(true);
                }}
                className="flex items-center p-3 bg-white dark:bg-gray-700 
                         rounded-lg cursor-pointer hover:shadow-md transition-all"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {event.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.date).toLocaleDateString()} • {event.startTime}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No upcoming events
            </p>
          )}
        </div>
      </div>
    );
  };

  // Update the main return statement
  return (
    <div 
      className="h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto lg:overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile view */}
      <div className="lg:hidden">
        {renderHeader()}
        {renderMobileView()}
      </div>

      {/* Desktop view - hide on mobile */}
      <div className="hidden lg:flex flex-col lg:flex-row h-full relative">
        {/* Existing sidebar code */}
        <aside className="lg:w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-b lg:border-r 
                         border-gray-200 dark:border-gray-700 overflow-y-auto sticky top-0
                         h-auto max-h-[250px] lg:max-h-screen lg:h-screen">
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

        {/* Existing main calendar area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0 sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
            {renderHeader()}
          </div>
          <div className="flex-1 overflow-auto p-4 h-full">
            <div className="min-h-full">
              {renderView()}
            </div>
          </div>
        </main>
      </div>

      {/* Modal and Toast container */}
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
  );
};

export default Calendar;
