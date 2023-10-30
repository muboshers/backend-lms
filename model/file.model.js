const mongoose = require("mongoose");

const fileSchema = mongoose.Schema(
  {
    filename: String,
    teaching_center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teaching_centers",
      default: null,
      required: true,
    },
    file_type: String,
    url: {
      type: String,
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

const fileModel = mongoose.model("file", fileSchema);

module.exports = fileModel;
