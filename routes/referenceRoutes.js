const express = require("express");
const router = express.Router();
const Reference = require("../models/Reference");

/* =================================
   ADD NEW REFERENCE (Admin)
================================= */
router.post("/", async (req, res) => {
  try {
    const newReference = new Reference({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      level: req.body.level,
      tags: req.body.tags || [],
      type: req.body.type || "concept"
    });

    const saved = await newReference.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =================================
   GET ALL REFERENCES (WITH FILTERS)
================================= */
router.get("/", async (req, res) => {
  try {
    const { category, level, search } = req.query;

    let filter = {};

    // CATEGORY (case-insensitive)
    if (category) {
      filter.category = {
        $regex: category,
        $options: "i"
      };
    }

    // LEVEL (case-insensitive)
    if (level) {
      filter.level = {
        $regex: level,
        $options: "i"
      };
    }

    // SEARCH (title + content)
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          content: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const references = await Reference.find(filter).sort({ createdAt: -1 });

    res.json(references);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =================================
   GET SIMILAR REFERENCES
================================= */
router.get("/similar/:id", async (req, res) => {
  try {
    const current = await Reference.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: "Reference not found" });
    }

    const similar = await Reference.find({
      _id: { $ne: current._id },
      tags: { $in: current.tags }
    }).limit(5);

    res.json(similar);
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