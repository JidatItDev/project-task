import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../services/booking.service";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as Dialog from "@radix-ui/react-dialog"; 
import "../../pages.css";

const CreateBooking = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // State for opening/closing the modal

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createBooking({
        userId: user.id,
        startTime,
        endTime,
        notes,
      });

      // Close the modal after successful booking
      setOpen(false);
      navigate("/user/dashboard");
    } catch (err) {
      setError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
      {/* Trigger Button to Open Modal */}
      <Button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        + Create Booking
      </Button>

      {/* Dialog Modal */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <div></div>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-6">Create Booking</Dialog.Title>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Start Time Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full h-11 border-gray-300"
                />
              </div>

              {/* End Time Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full h-11 border-gray-300"
                />
              </div>

              {/* Notes Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                  className="w-full h-32 p-3 border border-gray-300 rounded-md"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Create Booking"
                )}
              </Button>
            </form>

            {/* Close Button */}
            <Dialog.Close
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              aria-label="Close"
            >
              ×
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default CreateBooking;
