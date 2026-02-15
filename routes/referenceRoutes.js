const express = require("express");
const router = express.Router();
const Reference = require("../models/Reference");

/* =================================
   ADD NEW REFERENCE (Admin)
================================= */
router.post("/", async (req, res) => {
  try {
    const newReference = new Reference(req.body);
    const saved = await newReference.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =================================
   GET ALL REFERENCES (User)
   Filter + Search Supported
================================= */
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const references = await Reference.find(filter).sort({ createdAt: -1 });
    res.json(references);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =================================
   DELETE REFERENCE
================================= */
router.delete("/:id", async (req, res) => {
  try {
    await Reference.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
