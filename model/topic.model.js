const { default: mongoose } = require("mongoose");

const topicSchema = mongoose.Schema(
  {
    price: Number,
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
    },
    sections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "sections",
      default: [],
    },
    pupils: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "pupils",
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

const topicModel = mongoose.model("topics", topicSchema);

module.exports = topicModel;
