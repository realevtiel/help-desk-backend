require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const ticketRoutes = require("./routes/tickets");

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use("/api", ticketRoutes);

const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB Connection Error:", error));
