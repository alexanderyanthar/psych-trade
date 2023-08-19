// import mongoose, { Schema } from "mongoose";
const mongoose = require('mongoose');
const Schema = require('mongoose');

const answerSchema = new mongoose.Schema({
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: String,
})

const questionSchema = new mongoose.Schema({
    text: String,
    type: String,
    options: [{
        text: String,
        points: {
            type: Number
        },
    }],
});

const assessmentSchema = new mongoose.Schema({
    name: String,
    assessmentType: {
        type: String,
        enum: ['Analysis', 'TypeOfTrader', 'CognitiveBias'],
        required: true,
    },
    questions: [questionSchema],
    answers: [answerSchema],
});


const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);
const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = { Question, Answer, Assessment };