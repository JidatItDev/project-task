const express = require("express");
const db = require("./models");
const adminRoutes = require("./route/adminRoutes");
const userRoutes = require("./route/userRoutes");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3001;

app.use(express.json());
adminRoutes(app);
userRoutes(app);

(async () => {
  await db.testConnection();  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
