import React, { useState, useEffect } from "react";
import EventModal from "../EventModal";
import MiniCalendar from "../MiniCalendar";
import eventsData from "../../events.json";
import "../../styles/Calender.css";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ViewSelector from "./ViewSelector";
import WeekView from "./WeekView";
import DayView from "./DayView";
import UpcomingEvents from "./UpcomingEvents";
import {
  getDaysInMonth,
  getStartDay,
  isSameDay,
  getWeekDates,
  getEventsForDate,
  getConflictsForDate,
  checkEventConflicts
} from "./helpers";
import { ToastContainer, toast } from "react-toastify";
import {
  MdEvent,
  MdChevronRight,
  MdDone,
  MdCalendarToday,
  MdViewWeek,
  MdViewDay,
  MdSearch
} from "react-icons/md";

const monthNames = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const VIEW_OPTIONS = [
  { label: "Month", value: "month", icon: <MdCalendarToday className="w-4 h-4" /> },
  { label: "Week", value: "week", icon: <MdViewWeek className="w-4 h-4" /> },
  { label: "Day", value: "day", icon: <MdViewDay className="w-4 h-4" /> }
];

const Calendar = () => {
  const today = new Date();

  // State
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState(eventsData);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("month");
  const [theme, setTheme] = useState("light");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchText, setSearchText] = useState("");
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

const filterOptions = [
  { label: "All Events", value: "all", icon: <MdEvent className="w-4 h-4 mr-2" /> },
  { label: "This Month", value: "thisMonth", icon: <MdEvent className="w-4 h-4 mr-2" /> },
  { label: "Upcoming", value: "upcoming", icon: <MdChevronRight className="w-4 h-4 mr-2" /> },
  { label: "Completed", value: "completed", icon: <MdDone className="w-4 h-4 mr-2" /> }
];

  const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    time: `${String(i).padStart(2, "0")}:00`
  }));

  // Effects
  useEffect(() => {
    // Load events from localStorage first, then from JSON if none exist
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(eventsData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    let filtered = [...events];
    if (searchText.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchText.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    switch (activeFilter) {
      case "thisMonth":
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        });
        break;
      case "upcoming":
        const now = new Date();
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now && !event.completed;
        });
        break;
      case "completed":
        filtered = filtered.filter(event => event.completed);
        break;
      case "all":
      default:
        break;
    }
    setFilteredEvents(filtered);
  }, [events, activeFilter, searchText, currentMonth, currentYear]);

  // Update the conflict checking useEffect
  useEffect(() => {
    // Debounce the conflict checking to avoid repeated calls
    const timeoutId = setTimeout(() => {
      const conflicts = checkEventConflicts(events);
      
      if (conflicts.length > 0) {
        conflicts.forEach(conflict => {
          // Create a unique ID for each conflict based on date and event IDs
          const conflictId = `conflict-${conflict.date}-${conflict.events.map(e => e.id).sort().join('-')}`;
          
          toast.warn(
            <div className="conflict-notification">
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                Schedule Overlap Detected
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {new Date(conflict.date).toLocaleDateString()}
              </p>
              <div className="mt-2 bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg">
                {conflict.events.map((event, idx) => (
                  <div
                    key={event.id}
                    className={`flex items-center ${idx === 0 ? "mb-2" : ""}`}
                  >
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: event.color }} />
                    <span className="text-sm text-amber-700 dark:text-amber-300">
                      {event.title} ({event.startTime} - {event.endTime})
                    </span>
                  </div>
                ))}
              </div>
            </div>,
            {
              autoClose: 5000,
              className: "!bg-amber-100 dark:!bg-amber-900 !text-amber-800 dark:!text-amber-200",
              progressClassName: "!bg-amber-500",
              toastId: conflictId, // This prevents duplicate toasts with the same ID
              updateId: conflictId // This updates existing toast instead of creating new one
            }
          );
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [events]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Handlers
  const handleFilterChange = (filterValue) => {
    setActiveFilter(filterValue);
    let filtered = [...events];
    
    if (searchText.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchText.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        event.date.includes(searchText)
      );
    }
    
    switch (filterValue) {
      case "thisMonth":
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= monthStart && eventDate <= monthEnd;
        });
        toast.info(`Showing events for ${monthNames[today.getMonth()]} ${today.getFullYear()}`, {
          toastId: "filter-this-month",
        });
        break;
        
      case "all":
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        break;
        
      case "previousMonth":
        // Fix: Calculate previous month from TODAY, not current displayed month
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        const prevMonth = todayMonth === 0 ? 11 : todayMonth - 1;
        const prevYear = todayMonth === 0 ? todayYear - 1 : todayYear;
        
        // Update the display to show previous month
        setCurrentMonth(prevMonth);
        setCurrentYear(prevYear);
        
        // Filter events for previous month
        const prevMonthStart = new Date(prevYear, prevMonth, 1);
        const prevMonthEnd = new Date(prevYear, prevMonth + 1, 0);
        
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= prevMonthStart && eventDate <= prevMonthEnd;
        });
        
        toast.info(`Showing events for ${monthNames[prevMonth]} ${prevYear}`, {
          toastId: "filter-previous-month",
        });
        break;
        
      case "upcoming":
        const now = new Date();
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now && !event.completed;
        });
        break;
        
      case "completed":
        filtered = filtered.filter(event => event.completed);
        break;
        
      default:
        break;
    }
    
    setFilteredEvents(filtered);
    setFilterOpen(false);
  };

  // Debounced search handler, but instant in practice for UX
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const clearFilters = () => {
    setActiveFilter("all");
    setSearchText("");
    setFilteredEvents(events);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    toast.success("Filters cleared", { toastId: "filters-cleared" });
  };

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

  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const handleDateClick = date => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleViewChange = (newView) => {
    setViewMode(newView);
    if (!selectedDate) setSelectedDate(new Date());
    if (activeFilter !== "all") clearFilters();
  };

  const handleTodayClick = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };

  const handleSaveEvent = (newEvent, isEditing) => {
    try {
      const updatedEvent = {
        ...newEvent,
        id: isEditing ? newEvent.id : Date.now(),
        date: selectedDate.toISOString().split("T")[0],
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        completed: newEvent.completed || false,
        color: newEvent.color || "#1a73e8"
      };
      setEvents(prevEvents => {
        const newEvents = isEditing
          ? prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event)
          : [...prevEvents, updatedEvent];
        localStorage.setItem("calendarEvents", JSON.stringify(newEvents));
        return newEvents;
      });
      setShowModal(false);
      toast.success(isEditing ? "Event updated successfully!" : "Event added successfully!", {
        toastId: isEditing ? `event-update-${newEvent.id}` : `event-add-${newEvent.id}`,
      });
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.", {
        toastId: `event-save-error-${Date.now()}`,
      });
    }
  };

  const handleDeleteEvent = (eventId) => {
    try {
      setEvents(prevEvents => {
        const newEvents = prevEvents.filter(event => event.id !== eventId);
        localStorage.setItem("calendarEvents", JSON.stringify(newEvents));
        return newEvents;
      });
      toast.success("Event deleted successfully!", {
        toastId: `event-deleted-${eventId}`,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.", {
        toastId: `event-delete-error-${eventId}`,
      });
    }
  };

  const handleCompleteEvent = (eventId) => {
    try {
      setEvents(prevEvents => {
        const newEvents = prevEvents.map(event =>
          event.id === eventId ? { ...event, completed: true } : event
        );
        localStorage.setItem("calendarEvents", JSON.stringify(newEvents));
        return newEvents;
      });
      toast.success("Event marked as completed!", {
        toastId: `event-complete-${eventId}`,
      });
    } catch (error) {
      console.error("Error completing event:", error);
      toast.error("Failed to mark event as completed.", {
        toastId: `event-complete-error-${eventId}`,
      });
    }
  };

  // Touch
  const handleTouchStart = e => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };
  const handleTouchMove = e => {
    if (!touchStartX) return;
    setTouchEndX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50;
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) goToPreviousMonth();
      else goToNextMonth();
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsSwiping(false);
  };

  // Render
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDay(currentMonth, currentYear);
  const weekDates = getWeekDates(selectedDate, currentYear, currentMonth);

  const renderViewSelector = () =>
    <ViewSelector VIEW_OPTIONS={VIEW_OPTIONS} viewMode={viewMode} handleViewChange={handleViewChange} />;

  let calendarContent = null;
  if (viewMode === "month") {
    calendarContent = (
      <CalendarGrid
        daysInMonth={daysInMonth}
        startDay={startDay}
        currentMonth={currentMonth}
        currentYear={currentYear}
        isToday={isToday}
        events={filteredEvents}
        getEventsForDate={day =>
          getEventsForDate(filteredEvents, day, currentYear, currentMonth)
        }
        getConflictsForDate={date => getConflictsForDate(date, filteredEvents)}
        setSelectedDate={setSelectedDate}
        setShowModal={setShowModal}
      />
    );
  } else if (viewMode === "week") {
    calendarContent = (
      <WeekView
        weekDates={weekDates}
        isSameDay={isSameDay}
        events={filteredEvents}
        TIME_SLOTS={TIME_SLOTS}
        setSelectedDate={setSelectedDate}
        setShowModal={setShowModal}
        currentYear={currentYear}
        currentMonth={currentMonth}
      />
    );
  } else if (viewMode === "day") {
    calendarContent = (
      <DayView
        selectedDate={selectedDate}
        events={filteredEvents}
        TIME_SLOTS={TIME_SLOTS}
        setShowModal={setShowModal}
        setSelectedDate={setSelectedDate}
        currentYear={currentYear}
        currentMonth={currentMonth}
        theme={theme}
      />
    );
  }

  return (
    <div
      className="h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto lg:overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <MiniCalendar
              currentMonth={currentMonth}
              currentYear={currentYear}
              onDateSelect={handleDateClick}
              events={filteredEvents}
            />
            <UpcomingEvents
              events={filteredEvents}
              setSelectedDate={setSelectedDate}
              setShowModal={setShowModal}
            />
          </div>
        </aside>
        {/* Main */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-shrink-0 sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
            <CalendarHeader
              monthNames={monthNames}
              currentMonth={currentMonth}
              currentYear={currentYear}
              goToPreviousMonth={goToPreviousMonth}
              goToNextMonth={goToNextMonth}
              handleTodayClick={handleTodayClick}
              filterOptions={filterOptions}
              activeFilter={activeFilter}
              setFilterOpen={setFilterOpen}
              filterOpen={filterOpen}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              renderViewSelector={renderViewSelector}
              setShowModal={() => {
                setSelectedDate(new Date());
                setShowModal(true);
              }}
            />
            {/* --- Search Bar --- */}
            <div className="flex items-center mt-4 mb-2 px-4">
              <div className="relative w-full max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <MdSearch className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearch}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* --- End Search Bar --- */}
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="min-h-full">
              {calendarContent}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <EventModal
          date={selectedDate || new Date()}
          events={
            selectedDate
              ? getEventsForDate(filteredEvents, selectedDate.getDate(), currentYear, currentMonth)
              : []
          }
          onClose={() => setShowModal(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onComplete={handleCompleteEvent}
          theme={theme}
        />
      )}

      <ToastContainer
        position={window.innerWidth < 768 ? "top-center" : "bottom-right"}
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
        limit={3}
        style={{
          "--toastify-toast-width": window.innerWidth < 768 ? "90vw" : "380px",
          "--toastify-toast-max-height": "80vh"
        }}
      />
    </div>
  );
};

export default Calendar;