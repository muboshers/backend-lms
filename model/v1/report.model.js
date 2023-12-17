const mongoose = require("mongoose");

const { REPORT_STATUS, REPORT_TYPE } = require("../../constants");

const pupilSchema = mongoose.Schema(
  {
    message: String,
    status: {
      type: String,
      enum: REPORT_STATUS,
      required: true,
    },
    type: {
      type: String,
      enum: REPORT_TYPE,
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true,
    },
    groups_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups",
      default: "",
      required: true,
    },
    pupil_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pupils",
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

const pupilModel = mongoose.model("pupils", pupilSchema);

module.exports = pupilModel;
