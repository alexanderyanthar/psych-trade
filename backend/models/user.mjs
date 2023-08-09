import { Schema } from "mongoose";
import mongoose from "mongoose";

export const User = mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    assessments: [{ type: Schema.Types.ObjectId, ref: 'AssessmentAnswer' }]
}));