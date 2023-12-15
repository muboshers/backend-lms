const mongoose = require("mongoose");

const pupilSchema = mongoose.Schema(
    {
        name: String,
        age: Number,
        parent_contact_information: {
            type: String,
            unique: true
        },

        teaching_center_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "teaching_centers",
            default: null,
            required: true,
        },
        degree: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "degrees",
            default: [],
            required: false,
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
