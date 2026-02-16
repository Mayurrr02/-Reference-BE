
const scrapeIPIndia = require("./Scraper/scrapeIPR");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ==============================
   CONNECT MONGODB
============================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("IPQuest Reference Hub API is Running 🚀");
});

/* ==============================
   ROUTES
============================== */
const referenceRoutes = require("./routes/referenceRoutes");
app.use("/api/references", referenceRoutes);


app.get("/run-scraper", async (req, res) => {
  try {
    await scrapeIPIndia();
    res.send("Scraper executed successfully");
  } catch (err) {
    res.status(500).send("Scraper failed");
  }
});

/* ==============================
   START SERVER
============================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
scrapeIPIndia();
