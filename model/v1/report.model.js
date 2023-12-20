const mongoose = require("mongoose");

const {REPORT_STATUS, REPORT_TYPE} = require("../../constants");

const reportSchema = mongoose.Schema(
    {
        message: {
            type:String,
            required:true,
        },
        type: {
            type: String,
            enum: REPORT_TYPE,
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

const reportModel = mongoose.model("report", reportSchema);

module.exports = reportModel;
