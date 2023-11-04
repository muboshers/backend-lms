const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    teaching_center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teaching_centers",
      default: null,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "file",
      default: "654625ad0398406e87556a16",
    },
    topics: {
      ref: "topics",
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
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

const groupModel = mongoose.model("groups", groupSchema);

module.exports = groupModel;
