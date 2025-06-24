import React, { useState, useEffect } from 'react';
import { 
  MdAccessTime, 
  MdPeople, 
  MdLocationOn, 
  MdDescription,
  MdClose,
  MdSave,
  MdAdd,
  MdEdit,
  MdDelete,
  MdDone,
  MdEvent,
  MdPalette,
  MdVideoCall
} from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventModal = ({ date, events = [], onClose, onSave, onDelete, onComplete, theme = 'light' }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Initialize with proper date
  const initialState = {
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    repeat: 'none',
    guests: [],
    location: '',
    description: '',
    videoConference: false,
    notification: '30',
    visibility: 'default',
    date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    color: '#1a73e8',
    completed: false
  };

  const [event, setEvent] = useState(initialState);

  // Update useEffect for date changes
  useEffect(() => {
    if (date) {
      const formattedDate = new Date(date).toLocaleDateString('en-CA');
      setEvent(prev => ({
        ...prev,
        date: formattedDate
      }));
    }
  }, [date]);

  // Update the handleSave function
  const handleSave = () => {
    if (!event.title.trim()) {
      toast.error('Please add a title for the event', {
        className: 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100',
        progressClassName: 'bg-red-500'
      });
      return;
    }

    try {
      // Check if date is in the past
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        // Show warning toast but allow creation
        toast.warning('You are creating an event for a past date', {
          position: "top-center",
          icon: '⚠️',
          className: 'bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
          progressClassName: 'bg-yellow-500',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      const eventToSave = {
        ...event,
        id: isEditing ? editingEvent.id : Date.now(),
        date: date.toISOString().split('T')[0],
        startTime: event.startTime,
        endTime: event.endTime,
        completed: false
      };

      onSave(eventToSave, isEditing);
      toast.success(isEditing ? 'Event updated successfully!' : 'Event added successfully!', {
        className: 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100',
        progressClassName: 'bg-green-500'
      });
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event. Please try again.', {
        className: 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100',
        progressClassName: 'bg-red-500'
      });
    }
  };

  const handleEdit = (evt) => {
    setEditingEvent(evt);
    setEvent({
      ...evt,
      date: new Date(evt.date).toISOString().split('T')[0]
    });
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleDelete = (eventId) => {
    try {
      onDelete(eventId);
      toast.success('Event deleted successfully!');
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    }
  };

  const handleComplete = (eventId) => {
    try {
      onComplete(eventId);
      toast.success('Event marked as completed!');
    } catch (error) {
      console.error('Error completing event:', error);
      toast.error('Failed to complete event. Please try again.');
    }
  };

  const resetForm = () => {
    setEvent({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      repeat: 'none',
      guests: [],
      location: '',
      description: '',
      videoConference: false,
      notification: '30',
      visibility: 'default',
      date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      color: '#1a73e8',
      completed: false
    });
    setIsCreating(false);
    setIsEditing(false);
    setEditingEvent(null);
  };

  const renderEventsList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Events for {date.toLocaleDateString()}
        </h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          <MdAdd className="mr-1" /> Add Event
        </button>
      </div>
      
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map(evt => (
            <div
              key={evt.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all"
              style={{ borderLeft: `4px solid ${evt.color}` }}
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{evt.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <MdAccessTime className="w-4 h-4 mr-1" />
                  {evt.startTime} - {evt.endTime}
                </p>
                {evt.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {evt.location}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(evt)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Edit"
                >
                  <MdEdit className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleDelete(evt.id)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                  title="Delete"
                >
                  <MdDelete className="w-5 h-5 text-red-500" />
                </button>
                {!evt.completed && (
                  <button
                    onClick={() => handleComplete(evt.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                    title="Mark as completed"
                  >
                    <MdDone className="w-5 h-5 text-green-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : renderEmptyState()}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <div className="flex justify-center mb-3">
        <MdEvent className="w-12 h-12 opacity-50" />
      </div>
      <p>No events scheduled for this day</p>
      <button
        onClick={() => setIsCreating(true)}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center mx-auto transition-colors"
      >
        <MdAdd className="w-4 h-4 mr-2" /> Add Your First Event
      </button>
    </div>
  );

  // Update the modal container structure
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect and click handler */}
      <div 
        className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" 
        onClick={onClose}
      />

      <div className="flex items-center justify-center min-h-screen px-4 py-6 relative">
        {/* Modal panel */}
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all">
          {/* Move close button inside header */}
          <div className="relative border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Close"
            >
              <MdClose className="w-5 h-5 text-gray-500 dark:text-gray-400" style={{    position: "absolute",
    left: "20px",
    top: "-5px"}} />
            </button>
            {/* Rest of your header content */}
          </div>
          {isCreating ? (
            // Event Form View
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Header */}
              <div className="px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <span className="mr-2">
                    {isEditing ? <MdEdit className="w-5 h-5" /> : <MdAdd className="w-5 h-5" />}
                  </span>
                  {isEditing ? 'Edit Event' : 'New Event'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <MdClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="px-6 py-4 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Event title"
                    value={event.title}
                    onChange={(e) => setEvent({...event, title: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 pl-10"
                  />
                  <MdDescription className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <MdAccessTime className="w-4 h-4 mr-2" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={event.startTime}
                      onChange={(e) => setEvent({...event, startTime: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <MdAccessTime className="w-4 h-4 mr-2" />
                      End Time
                    </label>
                    <input
                      type="time"
                      value={event.endTime}
                      onChange={(e) => setEvent({...event, endTime: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Location"
                    value={event.location}
                    onChange={(e) => setEvent({...event, location: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 pl-10"
                  />
                  <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                <div className="flex items-center gap-3">
                  <MdPalette className="text-gray-400 w-5 h-5" />
                  <select
                    value={event.color}
                    onChange={(e) => setEvent({...event, color: e.target.value})}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="#1a73e8">Blue</option>
                    <option value="#16a765">Green</option>
                    <option value="#7986cb">Purple</option>
                    <option value="#e67c73">Red</option>
                    <option value="#f4511e">Orange</option>
                  </select>
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Description"
                    value={event.description}
                    onChange={(e) => setEvent({...event, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 min-h-[100px] pl-10"
                  />
                  <MdDescription className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex justify-end gap-3">
                {isEditing && (
                  <button
                    onClick={() => handleDelete(editingEvent.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg flex items-center transition-colors"
                  >
                    <MdDelete className="w-4 h-4 mr-2" /> Delete
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <MdClose className="w-4 h-4 mr-2" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center transition-colors"
                >
                  <MdSave className="w-4 h-4 mr-2" /> {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            // Events List View with improved styling
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <MdEvent className="w-6 h-6 mr-2" />
                  Events for {date.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center transition-colors"
                >
                  <MdAdd className="w-4 h-4 mr-2" /> Add Event
                </button>
              </div>

              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map(evt => (
                    <div
                      key={evt.id}
                      className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-all"
                      style={{ borderLeft: `4px solid ${evt.color}` }}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{evt.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <MdAccessTime className="w-4 h-4 mr-1" />
                          {evt.startTime} - {evt.endTime}
                        </p>
                        {evt.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <MdLocationOn className="w-4 h-4 mr-1" />
                            {evt.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(evt)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          title="Edit"
                        >
                          <MdEdit className="w-5 h-5 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(evt.id)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          title="Delete"
                        >
                          <MdDelete className="w-5 h-5 text-red-500" />
                        </button>
                        {!evt.completed && (
                          <button
                            onClick={() => handleComplete(evt.id)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                            title="Mark as completed"
                          >
                            <MdDone className="w-5 h-5 text-green-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : renderEmptyState()}
            </div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
        toastClassName={({ type }) => 
          `relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer 
          ${type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' : ''}
          ${type === 'success' ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100' : ''}
          ${type === 'error' ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100' : ''}`
        }
      />
    </div>
  );
};

export default EventModal;