const mongoose = require("mongoose");

const degreesSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "file",
      default: null,
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

const degreesModel = mongoose.model("degrees", degreesSchema);

module.exports = degreesModel;
