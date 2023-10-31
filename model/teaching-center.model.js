const mongoose = require("mongoose");

const teachingCenterSchema = mongoose.Schema(
  {
    branch: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "teaching_centers",
    },
    name: String,
    address: String,
    location: String,
    phone_number: String,
    logo: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "file",
    },
    login: String,
    password: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const teachingCenterModel = mongoose.model(
  "teaching_centers",
  teachingCenterSchema
);

module.exports = teachingCenterModel;
