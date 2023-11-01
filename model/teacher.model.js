const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    name: String,
    phone_number: String,
    age: Number,
    login: String,
    password: String,
    degree: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "degrees",
      default: [],
    },
    teaching_center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teaching_centers",
      default: null,
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

const teacherModel = mongoose.model("teachers", teacherSchema);

module.exports = teacherModel;
