
import { MdAdd } from "react-icons/md";

const WeekView = ({
  weekDates,
  isSameDay,
  events,
  TIME_SLOTS,
  setSelectedDate,
  setShowModal,
}) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="grid grid-cols-8 border-b dark:border-gray-700">
      <div className="w-20" />
      {weekDates.map(date => (
        <div
          key={date.toISOString()}
          className={`p-4 text-center border-l dark:border-gray-700 ${isSameDay(date, new Date()) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
        >
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {date.toLocaleDateString(undefined, { weekday: "short" })}
          </div>
          <div className={`text-2xl font-semibold mt-1 ${isSameDay(date, new Date()) ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
            {date.getDate()}
          </div>
        </div>
      ))}
    </div>
    <div className="flex-1 overflow-y-auto calendar-body">
      <div className="relative min-h-full">
        {TIME_SLOTS.map(({ hour, time }) => (
          <div key={hour} className="grid grid-cols-8 border-b dark:border-gray-700 relative h-20">
            <div className="w-20 py-2 px-3 text-right text-sm text-gray-500 dark:text-gray-400">{time}</div>
            {weekDates.map(date => {
              const formattedDate = date.toISOString().split("T")[0];
              const dateEvents = events.filter(event => {
                if (!event || !event.date || !event.startTime) return false;
                return event.date === formattedDate && parseInt(event.startTime.split(":")[0]) === hour;
              });
              return (
                <div key={date.toISOString()} className="border-l dark:border-gray-700 relative group">
                  {dateEvents.map(event => (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 mx-2 p-2 rounded-lg cursor-pointer transition-all"
                      style={{
                        backgroundColor: `${event.color}20`,
                        borderLeft: `4px solid ${event.color}`,
                        top: "4px",
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
                  <button
                    onClick={() => {
                      setSelectedDate(date);
                      setShowModal(true);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-blue-50 dark:bg-blue-900/20 transition-opacity flex items-center justify-center"
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

export default WeekView;