const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema(
  {
    name: String,
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      default: "",
      required: true,
    },
    reports: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "reports",
      default: "",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const sectionModel = mongoose.model("sections", sectionSchema);

module.exports = sectionModel;
