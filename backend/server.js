const express = require("express");
const db = require("./models");
const adminRoutes = require("./route/adminRoutes");
const userRoutes = require("./route/userRoutes");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Socket.IO
const server = app.listen(3001, () => {
  console.log(`Server running on port 3001`);
});

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true, 
  },
});

io.on("connection", (socket) => {
  console.log("A user or admin connected");

  socket.on('new-booking', (data) => {
    console.log('New booking data received:', data);

    db.Booking.create(data)
      .then((newBooking) => {
        io.emit('booking-added', newBooking);  
        console.log('New booking added and emitted:', newBooking);
      })
      .catch((err) => {
        console.error('Error saving booking:', err);
      });
  });

  socket.on("disconnect", () => {
    console.log("A user or admin disconnected");
  });
});

adminRoutes(app);
userRoutes(app);

(async () => {
  await db.testConnection();
})();
