import mongoose, { Schema, mongoose } from "mongoose";

export const assessmentTypeSchema = new mongoose.Schema({
    name: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});
const AssessmentType = mongoose.model('AssessmentType', assessmentTypeSchema);

export const questionSchema = new mongoose.Schema({
    text: String,
    type: String,
    options: [{ text: String, points: Number }],
    statements: [{ text: String, type: String, point: Number}],
});
const Question = mongoose.model('Question', questionSchema);

export const answerSchema = new mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: String,
    statementOption: String,
});
const Answer = mongoose.model('Answer', answerSchema);

export const assessmentSchema = new mongoose.Schema({
    assessmentType: { type: Schema.Types.ObjectId, ref: 'AssessmentType' },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
});
const Assessment = mongoose.model('Assessment', assessmentSchema);

export { AssessmentType, Question, Answer, Assessment };