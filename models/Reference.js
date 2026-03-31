const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    // Main content (used for learning + cases)
    content: {
      type: String,
    },

    // Keep description for backward compatibility
    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Patent",
        "Trademark",
        "Copyright",
        "GI",
        "Design",
        "General"
      ],
    },

    // NEW: Learning level
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },

    // NEW: Type of content
    type: {
      type: String,
      enum: ["concept", "case", "document"],
      default: "concept"
    },

    sourceName: {
      type: String,
    },

    officialUrl: {
      type: String,
      required: true,
      unique: true
    },

    // VERY IMPORTANT for similarity feature
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

// Index for faster search
referenceSchema.index({ title: "text", content: "text" });

// Prevent duplicate URLs


module.exports = mongoose.model("Reference", referenceSchema);