const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    sourceName: {
      type: String,
      required: true,
    },
    officialUrl: {
      type: String,
      required: true,
      unique: true // prevents duplication
    },
    tags: [String],
  },
  { timestamps: true }
);

// ✅ Index must be OUTSIDE schema definition
referenceSchema.index({ officialUrl: 1 }, { unique: true });

module.exports = mongoose.model("Reference", referenceSchema);