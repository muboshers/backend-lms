const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema(
    {
        name: String,
        reports: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "report",
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

const sectionModel = mongoose.model("sections", sectionSchema);

module.exports = sectionModel;
