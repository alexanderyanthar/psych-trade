import mongoose from "mongoose";
import { Assessment, Question, Answer } from "./models/assessment.mjs";

questions: [
    {
        text: "Your favorite uncle's 50th birthday is coming up and you want to make a big celebration for him. How do you prepare for it?",
        type: "option",
        options: [
            { text: "I've been preparing for this celebration for the entire year in case the plans I made started falling through." },
            { text: "Algorithmic Trader - I have reminders on my phone and I've written a program that takes care of reservations for me by simply imputting the date, time and location of the event I want." },
            { text: "Swing Trader - When the big day is just a few months away, I start looking around for my uncle's favorite things to do and set up times and reservations." },
            { text: "I set up a special surprise party and bake a cake at his home the day of his birthday."},
            { text: "I can't wait to celebrate my uncle's birthday so I give him a call first thing in the morning and drive over to see him." }
        ],
    },
    {
        text: "Your friends are planning a weekend getaway, and they want you to join them. How do you decide whether to go or not?",
        type: "option",
        options: [
            { text: "I carefully weigh the long-term benefits and commitments before committing to the getaway, considering how it fits into my overall plans." },
            { text: "I use a decision-making algorithm that takes into account my schedule, budget, and preferences, ensuring an efficient choice without much fuss." },
            { text: "I analyze the potential fun and experiences of the trip, checking for any medium-term conflicts, and make a decision based on the excitement it offers." },
            { text: "I spontaneously decide on the day of the trip, assessing my mood and workload, and join my friends if everything aligns perfectly." },
            { text: "I'm thrilled about the idea, so I quickly pack my bags and decide to join my friends for an impromptu adventure!" }
        ],
    },
]

const saveAssessmentQuestionsAndAnswers = async () => {
    try {
        const analysisAssessment = new Assessment({
            name: 'Analysis Assessment',
            assessmentType: 'Analysis',
            questions: [],
            answers: [],
        })
        for (const questionObj of questions) {
            const { text, type, options } = questionObj;

            // save questions
            const question = new Question({ text, type, options });
            await question.save();
            console.log(`Saved question: ${question.text}`);

            analysisAssessment.questions.push(question);

            for (const optionObj of options) {
                const { text } = optionObj;
                const answer = new Answer({
                    question: question._id,
                    selectedOption: text,
                });
                await answer.save();
                console.log(`Save answer for question: ${question.text}`);
            }
            await analysisAssessment.save();
            console.log('Analysis Assessment saved successfully!');
        }
    } catch (err) {
        console.error("Error saving assessment questions:", err);
    }
}


const populateDatabase = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/PsychTradeDB');

    await saveAssessmentQuestionsAndAnswers();

    await mongoose.disconnect();
}

populateDatabase();