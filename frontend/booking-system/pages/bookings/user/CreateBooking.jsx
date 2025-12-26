import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../services/booking.service";
import "../../pages.css";

const CreateBooking = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      navigate("/user/dashboard");
    } catch (err) {
      setError("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  console.log("from creatingbooking")

  return (
    <div className="user-container">
      <h2>Create Booking</h2>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <label>End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <label>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
};

export default CreateBooking;
