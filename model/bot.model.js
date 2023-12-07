const mongoose = require("mongoose");

const botSchema = mongoose.Schema(
  {
    token: String,
    greeting_message: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const botModel = mongoose.model("bots", botSchema);

module.exports = botModel;
