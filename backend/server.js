const express = require("express");
const db = require("./models");

const app = express();
const PORT = 3001;

app.use(express.json());

(async () => {
  await db.testConnection();  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
