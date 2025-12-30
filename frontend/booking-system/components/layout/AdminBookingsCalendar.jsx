import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const AdminBookingsCalendar = ({ bookings = [], onDateSelect, onEventSelect }) => {
  // Map status to color
  const statusToColor = (status) => {
    const s = String(status || "pending").toLowerCase().trim();
    if (s === "accepted") return "#16a34a"; 
    if (s === "rejected") return "#dc2626"; 
    return "#f59e0b"; 
  };

  const toEvents = (list) => {
    return list.map((b) => {
      const id = b._id || b.id;
      const start = b.startTime || b.start || b.date;
      const end = b.endTime || b.end;
      
      // Get user name - check multiple possible fields
      const userName = b.name || b.userName || b.user?.name || 
                      b.customerName || b.customer?.name || 
                      `User ${id?.substring(0, 6)}`;
      
      // Get user email if available
      const userEmail = b.email || b.userEmail || b.user?.email || 
                       b.customerEmail || b.customer?.email || "";
      
      // Format display name
      const userLabel = userName + (userEmail ? ` (${userEmail})` : "");
      
      // Get status with fallback
      const status = b.status || "pending";
      const statusText = status.charAt(0).toUpperCase() + status.slice(1);
      
      // Assign color based on booking status
      const color = statusToColor(status);

      return {
        id: String(id),
        title: `${userLabel} - ${statusText}`, // Simplified title format
        start,
        end,
        backgroundColor: color,
        borderColor: color,
        textColor: "#ffffff", // White text
        extendedProps: { 
          booking: b,
          userName: userName,
          status: status,
          color: color
        },
        display: "block",
        classNames: ["booking-event"]
      };
    });
  };

  const events = toEvents(bookings);

  // Custom event content renderer
  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const extendedProps = event.extendedProps || {};
    const userName = extendedProps.userName || "User";
    const status = extendedProps.status || "pending";
    
    return (
      <div style={{
        padding: "4px 2px",
        textAlign: "center",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}>
        <div style={{ 
          fontWeight: "600", 
          fontSize: "12px",
          marginBottom: "2px",
          color: "#fff"
        }}>
          {userName}
        </div>
        <div style={{ 
          fontSize: "10px", 
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
          padding: "1px 4px",
          display: "inline-block",
          color: "#fff"
        }}>
          {status}
        </div>
      </div>
    );
  };

  

  return (
    <div style={{ 
      background: "#fff", 
      padding: "16px", 
      borderRadius: "8px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        dateClick={(info) => {
          const day = info.dateStr;
          onDateSelect?.(day);
        }}
        eventClick={(info) => {
          const booking = info.event.extendedProps?.booking;
          if (booking) onEventSelect?.(booking);
        }}
        dayMaxEvents={3} 
        eventContent={renderEventContent}
        eventDisplay="block"
        eventTimeFormat={{ hour: '2-digit', minute: '2-digit' }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week'
        }}
        // Add some custom styles
        eventClassNames="booking-event"
      />
      
      {/* Status Legend */}
      <div style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#16a34a",
            borderRadius: "4px"
          }}></div>
          <span style={{ fontSize: "14px" }}>Accepted</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#dc2626",
            borderRadius: "4px"
          }}></div>
          <span style={{ fontSize: "14px" }}>Rejected</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#f59e0b",
            borderRadius: "4px"
          }}></div>
          <span style={{ fontSize: "14px" }}>Pending</span>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsCalendar;