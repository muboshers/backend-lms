const mongoose = require("mongoose");

const tgUserSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    profile_image: String,
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
