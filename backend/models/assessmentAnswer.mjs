import mongoose from "mongoose";

const assessmentAnswerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assessment: {  // Add this field
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true,
    },
    userPreference: {
        type: String,
        required: true,
    },
    assessmentResults: [
        {
            type: {
                type: String,
            },
            points: {
                type: Number,
            },
            // You can add more fields specific to each result type if needed
        },
    ],
});

const AssessmentAnswer = mongoose.model('AssessmentAnswer', assessmentAnswerSchema);

export { AssessmentAnswer };
