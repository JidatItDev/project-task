import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const AdminBookingsCalendar = ({ bookings = [], onDateSelect, onEventSelect }) => {
  // Map status to color
  const statusToColor = (status) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved" || s === "accepted") return "#16a34a"; // Green for approved
    if (s === "rejected") return "#dc2626"; // Red for rejected
    return "#f59e0b"; // Yellow for pending
  };

  const toEvents = (list) => {
    return list.map((b) => {
      const id = b._id; // Using _id for event ID
      const start = b.startTime; // Start time of the booking
      const end = b.endTime; // End time of the booking

      // User's name will now directly come from `name`
      const userLabel = b.name ?? b.email ?? `User ${b._id}`;

      // Assign a color based on booking status
      const color = statusToColor(b.status);

      return {
        id: String(id),
        title: `${userLabel} (${b.status || "pending"})`,
        start,
        end,
        backgroundColor: color, // Background color based on status
        borderColor: color, // Border color based on status
        textColor: "#fff", // White text for visibility
        extendedProps: { booking: b }, // Attach the full booking object
      };
    });
  };

  const events = toEvents(bookings); // Convert bookings to FullCalendar events

  return (
    <div style={{ background: "#fff", padding: "16px", borderRadius: "8px" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events} // Pass events to FullCalendar
        dateClick={(info) => {
          const day = info.dateStr; // YYYY-MM-DD format
          onDateSelect?.(day);
        }}
        eventClick={(info) => {
          const booking = info.event.extendedProps?.booking;
          if (booking) onEventSelect?.(booking);
        }}
        dayMaxEvents={true} // Handle max events per day
        eventContent={(eventInfo) => {
          const { event } = eventInfo;
          return (
            <div style={{ padding: "5px", textAlign: "center" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                {event.title.split("(")[0]} {/* User's name */}
              </div>
              <div style={{ fontSize: "12px", color: "#fff" }}>
                {event.title.split("(")[1].slice(0, -1)} {/* Status */}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default AdminBookingsCalendar;
