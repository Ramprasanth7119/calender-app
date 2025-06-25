import React from "react";
import { MdAdd } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const DayView = ({
  selectedDate,
  events,
  TIME_SLOTS,
  setShowModal,
  setSelectedDate,
  currentYear,
  currentMonth,
  theme,
}) => {
  const selectedDateEvents = selectedDate ? events.filter(event => event.date === selectedDate.toISOString().split('T')[0]) : [];
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {selectedDate?.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>
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
          "--toastify-toast-max-height": "80vh",
        }}
      />
      <div className="flex-1 overflow-y-auto calendar-body">
        <div className="relative min-h-full">
          {TIME_SLOTS.map(({ hour, time }) => (
            <div key={hour} className="flex border-b dark:border-gray-700 relative h-20">
              <div className="w-20 py-2 px-3 text-right text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{time}</div>
              <div className="flex-1 border-l dark:border-gray-700 relative group">
                {selectedDateEvents
                  .filter(event => {
                    const eventHour = parseInt(event.startTime.split(":")[0]);
                    return eventHour === hour;
                  })
                  .map(event => (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 mx-2 p-2 rounded-lg cursor-pointer transition-all"
                      style={{
                        backgroundColor: `${event.color}20`,
                        borderLeft: `4px solid ${event.color}`,
                        top: "4px",
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
                <button
                  onClick={() => {
                    setSelectedDate(new Date(currentYear, currentMonth, selectedDate?.getDate() || 1));
                    setShowModal(true);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-blue-50 dark:bg-blue-900/20 transition-opacity flex items-center justify-center"
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

export default DayView;