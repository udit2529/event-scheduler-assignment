"use client";

import React, { useState, useEffect } from "react";
import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <div className="spinner-border animate-spin border-t-4 border-blue-500 w-12 h-12 rounded-full"></div>
  </div>
);

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [eventCategory, setEventCategory] = useState<string>(""); // New state to hold the event category
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
      setIsLoading(false); // Set loading to false once events are loaded
    }
  }, []);

  useEffect(() => {
    if (currentEvents.length > 0) {
      localStorage.setItem("events", JSON.stringify(currentEvents)); // Save events to localStorage
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setNewEventTitle("");
    setEventCategory(""); // Reset category when adding a new event
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    setSelectedEvent(selected.event);
    setNewEventTitle(selected.event.title);
    setEventCategory(selected.event.extendedProps.category || ""); // Set the event category for editing
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setNewEventTitle("");
    setEventCategory("");
    setSelectedEvent(null);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
        extendedProps: {
          category: eventCategory, // Add category to the event's extended properties
        },
      };

      calendarApi.addEvent(newEvent);
      setCurrentEvents((prevEvents: any) => [...prevEvents, newEvent]);
      toast.success("🎉 Event added successfully!");
      handleCloseDialog();
    }
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent) {
      selectedEvent.setProp("title", newEventTitle);
      selectedEvent.setExtendedProp("category", eventCategory); // Update category if changed
      setCurrentEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: newEventTitle,
                extendedProps: { category: eventCategory },
              }
            : event
        )
      );
      toast.success("✏️ Event updated successfully!");
      handleCloseDialog();
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.remove();
      setCurrentEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedEvent.id)
      );
      toast.success("🗑 Event deleted successfully!");
      handleCloseDialog();
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            📅 Calendar Events
          </h1>
          <p className="text-sm md:text-base mt-2 md:mt-0 italic">
            Manage your events easily!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-10 py-6">
          <div className="md:col-span-1 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Upcoming Events
            </h2>
            <ul className="space-y-4">
              {currentEvents.length === 0 ? (
                <div className="italic text-center text-gray-400">
                  No Events Present
                </div>
              ) : (
                currentEvents.map((event: EventApi) => (
                  <li
                    key={event.id}
                    className={`border border-gray-200 shadow-sm px-4 py-3 rounded-md 
                    ${
                      event.extendedProps?.category === "Lunch Break"
                        ? "bg-yellow-100"
                        : event.extendedProps?.category === "Holiday"
                        ? "bg-green-100"
                        : event.extendedProps?.category === "Office"
                        ? "bg-purple-100"
                        : "bg-blue-50"
                    } 
                    text-blue-900 flex justify-between items-center`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">
                        {event.extendedProps?.category === "Lunch Break" &&
                          "🍴"}
                        {event.extendedProps?.category === "Holiday" && "🏖️"}
                        {event.extendedProps?.category === "Office" && "🏢"}
                        {event.extendedProps?.category === "" && "✏️"} 
                        {/* Add more categories with respective emojis as needed */}
                      </span>
                      <p className="font-medium">{event.title}</p>
                    </div>
                    <span className="text-sm text-gray-700 ml-4">
                      {formatDate(event.start!, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="md:col-span-3 bg-white shadow-lg rounded-lg p-4">
            {isLoading ? (
              <Loader />
            ) : (
              <FullCalendar
                height={"75vh"}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={handleDateClick}
                eventClick={handleEventClick}
                initialEvents={
                  typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("events") || "[]")
                    : []
                }
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-700">
              🆕 Add a New Event
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Enter event title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-md text-lg w-full focus:ring-2 focus:ring-blue-400 transition"
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Category
              </label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Lunch Break">Lunch Break</option>
                <option value="Holiday">Holiday/Leave</option>
                <option value="Office">Office</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-6 py-2 text-white bg-gray-500 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-500 rounded-md"
              >
                Add Event
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-700">
              ✏️ Edit Event
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateEvent}>
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-md text-lg w-full focus:ring-2 focus:ring-blue-400 transition"
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Event Category
              </label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Lunch Break">Lunch Break</option>
                <option value="Holiday">Holiday/Leave</option>
                <option value="Office">Office</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-6 py-2 text-white bg-gray-500 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-500 rounded-md"
              >
                Update Event
              </button>
            </div>
          </form>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleDeleteEvent}
              className="text-sm text-red-500"
            >
              Delete Event
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;

