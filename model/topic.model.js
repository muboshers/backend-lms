const { default: mongoose } = require("mongoose");

const topicSchema = mongoose.Schema(
  {
    price: Number,
    percentage: {
      type: Number,
    },
    during_month: {
      type: String,
    },
    start_date: {
      type: String,
    },
    time_of_day: String,
    week_days: {
      type: Array,
      enums: ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"],
    },
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
