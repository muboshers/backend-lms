const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    teaching_center_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teaching_centers",
      default: null,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "file",
      default: null,
    },
    teachers_id: {
      type: [
        {
          price: Number,
          teacher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "teachers",
          },
        },
      ],
      default: [],
      required: true,
    },
    sections: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sections",
      default: [],
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
