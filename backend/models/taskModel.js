const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(

    {
        name: {
            type:String,
            required: true,
        },
        description: {
            type:String,
            required: true,
        },
        status: {
            type:String,
            required: true,
            default: "pending",
        },
        course: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "courses",
        },
        assignedTo: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        assignedBy: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
        attachments: {
            type: Array,
            default: [],
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("tasks", taskSchema);