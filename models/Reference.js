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
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reference", referenceSchema);
