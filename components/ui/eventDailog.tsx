import React, { Dispatch, SetStateAction, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EventDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  handleSubmit: (e: FormEvent) => void;
  handleClose: () => void;
  eventTitle: string;
  setEventTitle: Dispatch<SetStateAction<string>>;
  eventCategory: string;
  setEventCategory: Dispatch<SetStateAction<string>>;
  isEditMode?: boolean;
  handleDeleteEvent?: () => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  setIsOpen,
  title,
  handleSubmit,
  handleClose,
  eventTitle,
  setEventTitle,
  eventCategory,
  setEventCategory,
  isEditMode = false,
  handleDeleteEvent,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-700">
            {isEditMode ? "✏️ Edit Event" : "🆕 Add a New Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter event title..."
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-md text-lg w-full focus:ring-2 focus:ring-blue-400 transition"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Event Category</label>
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
              onClick={handleClose}
              className="px-6 py-2 text-white bg-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-md"
            >
              {isEditMode ? "Update Event" : "Add Event"}
            </button>
          </div>
        </form>
        {isEditMode && handleDeleteEvent && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleDeleteEvent}
              className="text-sm text-red-500"
            >
              Delete Event
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
