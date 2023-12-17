const mongoose = require("mongoose");

const tgUserSchema = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    username: String,
    bot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bots",
    },
    chat_id: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timeStamps: true,
  }
);

const tgUserModel = mongoose.model("tgusers", tgUserSchema);

module.exports = tgUserModel;
