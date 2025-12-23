const express = require("express");
const db = require("./models");
const adminRoutes = require("./route/adminRoutes");


const app = express();
const PORT = 3001;

app.use(express.json());
adminRoutes(app);


(async () => {
  await db.testConnection();  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
