require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const apiRoutes = require("./server/api");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend HTML/CSS/JS
app.use("/api", apiRoutes);        // Backend routes for API handling

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
