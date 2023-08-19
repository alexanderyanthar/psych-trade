// import { Schema } from "mongoose";
const { Schema } = require('mongoose');
// import mongoose from "mongoose";
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    assessments: [{ type: Schema.Types.ObjectId, ref: 'AssessmentAnswer' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;