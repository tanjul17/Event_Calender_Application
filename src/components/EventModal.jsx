import React, { useContext, useState, useEffect } from "react";
import { X, Trash2, Check, Calendar, Clock, AlignLeft, BookmarkIcon } from "lucide-react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";

const labelsClasses = [
  { color: "indigo", name: "Work" },
  { color: "gray", name: "Personal" },
  { color: "green", name: "Health" },
  { color: "blue", name: "Leisure" },
  { color: "red", name: "Urgent" },
  { color: "purple", name: "Social" }
];

export default function EventModal() {
  const { 
    setShowEventModal, 
    daySelected, 
    dispatchCalEvent, 
    selectedEvent 
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [startTime, setStartTime] = useState(
    selectedEvent ? selectedEvent.startTime : dayjs().format("HH:mm")
  );
  const [endTime, setEndTime] = useState(
    selectedEvent ? selectedEvent.endTime : dayjs().add(1, 'hour').format("HH:mm")
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl.color === selectedEvent.label)
      : labelsClasses[0]
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Add animation and keyboard support
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    setIsAnimating(true);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleClose() {
    setIsAnimating(false);
    setTimeout(() => setShowEventModal(false), 300);
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Enhanced validation
    if (!title.trim()) {
      alert("Please enter a title for the event.");
      return;
    }

    // Validate time
    const start = dayjs(`${daySelected.format('YYYY-MM-DD')} ${startTime}`);
    const end = dayjs(`${daySelected.format('YYYY-MM-DD')} ${endTime}`);

    if (end.isBefore(start)) {
      alert("End time must be after start time.");
      return;
    }

    const calendarEvent = {
      title: title.trim(),
      description: description.trim(),
      startTime: startTime,
      endTime: endTime,
      label: selectedLabel.color,
      day: daySelected.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };

    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setShowEventModal(false);
  }

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center 
      bg-black bg-opacity-50 transition-opacity duration-300
      ${isAnimating ? 'opacity-100' : 'opacity-0'}
    `}>
      <form 
        onSubmit={handleSubmit}
        className={`
          bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'scale-100' : 'scale-95'}
        `}
      >
        {/* Header */}
        <header className="bg-gray-100 px-4 py-3 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-500" size={20} />
            <p className="text-sm text-gray-600">
              {daySelected.format("dddd, MMMM DD")}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedEvent && (
              <button
                type="button"
                onClick={() => {
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  handleClose();
                }}
                className="text-red-500 hover:bg-red-50 p-1 rounded-full transition"
                aria-label="Delete Event"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 hover:bg-gray-200 p-1 rounded-full transition"
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Title Input */}
          <div>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={title}
              required
              className="w-full text-xl font-semibold text-gray-800 
              border-b-2 border-gray-300 focus:border-blue-500 
              outline-none py-2 transition-colors"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Time Selection */}
          <div className="flex space-x-4 items-center">
            <div className="flex items-center space-x-2 w-full">
              <Clock size={20} className="text-gray-500" />
              <label className="text-gray-600 mr-2">Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 
                outline-none py-2 transition-colors text-gray-700"
              />
            </div>
            <div className="flex items-center space-x-2 w-full">
              <label className="text-gray-600 mr-2">End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 
                outline-none py-2 transition-colors text-gray-700"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <textarea
              name="description"
              placeholder="Add a description (optional)"
              value={description}
              rows={3}
              className="w-full text-gray-700 
              border-b-2 border-gray-300 focus:border-blue-500 
              resize-none outline-none py-2 transition-colors"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Label Selection */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <BookmarkIcon size={20} className="mr-2" />
              <span>Select Label</span>
            </div>
            <div className="flex space-x-3">
              {labelsClasses.map((lblClass) => (
                <button
                  key={lblClass.color}
                  type="button"
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    bg-${lblClass.color}-500 hover:opacity-80 
                    transition-all relative
                  `}
                  aria-label={`Select ${lblClass.name} label`}
                >
                  {selectedLabel.color === lblClass.color && (
                    <Check className="text-white" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-100 px-6 py-4 flex justify-end rounded-b-lg">
          <button
            type="submit"
            className="
              bg-blue-500 text-white px-6 py-2 rounded-md 
              hover:bg-blue-600 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            Save Event
          </button>
        </footer>
      </form>
    </div>
  );
}