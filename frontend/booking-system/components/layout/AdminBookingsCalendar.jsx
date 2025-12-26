import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


const AdminBookingsCalendar = ({ bookings = [], onDateSelect, onEventSelect }) => {
  const statusToColor = (status) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "approved" || s === "accepted") return "#16a34a"; 
    if (s === "rejected") return "#dc2626";
    return "#f59e0b"; 
  };

  const toEvents = (list) => {
    return list.map((b) => {
      const id = b.id ?? b._id;
      const start = b.startTime ?? b.start ?? b.date; 
      const end = b.endTime ?? b.end ?? null;

      const userLabel =
        b.user?.name ??
        b.user?.email ??
        b.userName ??
        b.email ??
        (b.userId ? `User ${b.userId}` : "Booking");

      const color = statusToColor(b.status);

      return {
        id: String(id),
        title: `${userLabel} (${b.status || "pending"})`,
        start,
        end,
        backgroundColor: color,
        borderColor: color,
        textColor: "#fff",
        extendedProps: { booking: b },
      };
    });
  };

  const events = toEvents(bookings);

  return (
    <div style={{ background: "#fff" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        dateClick={(info) => {
          // YYYY-MM-DD
          const day = info.dateStr;
          onDateSelect?.(day);
        }}
        eventClick={(info) => {
          const booking = info.event.extendedProps?.booking;
          if (booking) onEventSelect?.(booking);
        }}
        dayMaxEvents={true}
      />
    </div>
  );
};

export default AdminBookingsCalendar;
