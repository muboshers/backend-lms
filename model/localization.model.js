const mongoose = require("mongoose");

const localizationSchema = mongoose.Schema(
  {
    language_name: String,
    teaching_center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teaching_centers",
      required: true,
    },
    language: {
      logo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "file",
        required: true,
      },
      translation_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "file",
        required: true,
      },
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

const localizationModel = mongoose.model("localization", localizationSchema);

module.exports = localizationModel;
