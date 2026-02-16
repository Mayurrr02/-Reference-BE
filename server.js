require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Scraper imports
const scrapeIPIndia = require("./Scraper/scrapeIPR");
const scrapeWIPO = require("./Scraper/scrapeWIPO");

// Reference routes
const referenceRoutes = require("./routes/referenceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* ==============================
   CONNECT MONGODB
============================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB connection error:", err));

/* ==============================
   HOME ROUTE
============================== */
app.get("/", (req, res) => {
  res.send("IPQuest Reference Hub API is Running 🚀");
});

/* ==============================
   REFERENCE ROUTES
============================== */
app.use("/api/references", referenceRoutes);

/* ==============================
   SCRAPER ROUTES
============================== */
app.get("/api/scrape/ipindia", async (req, res) => {
  try {
    await scrapeIPIndia();
    res.json({ message: "IP India scraping completed ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "IP India scraping failed ❌" });
  }
});

app.get("/api/scrape/wipo", async (req, res) => {
  try {
    await scrapeWIPO();
    res.json({ message: "WIPO scraping completed ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "WIPO scraping failed ❌" });
  }
});

/* ==============================
   START SERVER
============================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
