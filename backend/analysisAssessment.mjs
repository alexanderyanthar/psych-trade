import mongoose from "mongoose";
import { Assessment, Question, Answer } from "./models/assessment.mjs";

const questions = [
    {
        text: "You've received an invitation to explore an ancient city that holds the key to a long-lost treasure. How do you prepare for the exciting journey?",
        type: "option",
        options: [
            { text: "Meticulously research the city's history, culture, and landmarks to plan a detailed itinerary.", points: 1 },
            { text: "Embrace the spontaneity of the adventure and explore the city without a rigid plan.", points: 2 },
            { text: "Strike a balance between research and spontaneity, allowing room for exploration while having some key places in mind to visit.", points: 3  }
        ],
    },
    {
        text: "You're hosting a themed party at home with friends, and the theme is 'Around the World.' How do you ensure everyone has an unforgettable time?",
        type: "option",
        options: [
            { text: "Plan and organize the party meticulously, curating decorations, music, and dishes from different cultures to create an immersive experience.", points: 1 },
            { text: "Encourage everyone to bring their favorite dishes and drinks from around the world, making it a potluck party with diverse flavors.", points: 2 },
            { text: "Combine planned elements with the guests' contributions, making it a collaborative and multicultural celebration.", points: 3 },
        ],
    },
    {
        text: "You want to cultivate a beautiful and sustainable garden in your backyard. How do you approach the task of creating a green oasis?",
        type: "option",
        options: [
            { text: "Research various plants, soil types, and gardening techniques to create a well-designed and thriving garden.", points: 1 },
            { text: "Start planting intuitively, experimenting with different plants and observing their growth to discover what works best.", points: 2 },
            { text: "Seek advice from experienced gardeners and combine it with your own experiments to create an eco-friendly and flourishing garden.", points: 3 },
        ],
    },
    {
        text: "An opportunity arises to travel to a foreign country with a rich cultural heritage. How do you approach learning the language to immerse yourself in the local experience?",
        type: "option",
        options: [
            { text: "Enroll in language classes and practice regularly, focusing on proper pronunciation and grammar to communicate effectively.", points: 1 },
            { text: "Immerse yourself in the local environment, engaging with the people and learning the language through conversations and daily interactions.", points: 2 },
            { text: "Use language learning apps and resources to acquire essential phrases and expressions while also learning from locals during your travels.", points: 3 },
        ],
    },
    {
        text: "You're considering adopting a pet, and you have various options, from a playful dog to an independent cat. How do you make the decision on the perfect furry companion?",
        type: "option",
        options: [
            { text: "Research different breeds, considering their temperament, energy level, and compatibility with your lifestyle to make an informed choice.", points: 1 },
            { text: "Visit animal shelters and spend time interacting with different pets to see which one naturally connects with you.", points: 2 },
            { text: "Seek advice from experienced pet owners and combine it with your own feelings during the interactions to find the best match.", points: 3 },
        ],
    },
    {
        text: "You're redecorating your living room to reflect your personality and style. How do you approach the design to create a space you love coming home to?",
        type: "option",
        options: [
            { text: "Create a mood board, gathering design inspirations, colors, and furniture styles to plan a cohesive and harmonious living room.", points: 1 },
            { text: "Trust your instincts and select furniture and decor that resonate with you, embracing an eclectic and personalized design.", points: 2 },
            { text: "Seek advice from interior designers and incorporate their suggestions while also adding personal touches to make it uniquely yours.", points: 3 },
        ],
    },
    {
        text: "You're passionate about music and want to learn to play an instrument. How do you begin the journey of mastering the melodies and harmonies?",
        type: "option",
        options: [
            { text: "Take formal music lessons, follow a structured curriculum, and practice regularly to build a strong foundation.", points: 1 },
            { text: "Start by playing songs you love and experimenting with the instrument, relying on your intuition and self-guided learning.", points: 2 },
            { text: "Combine formal lessons with free-form exploration, allowing yourself to enjoy the process while honing your skills.", points: 3 },
        ],
    },
    {
        text: "You have an innovative business idea that could solve a common problem in your community. How do you approach crafting a business plan to turn your vision into reality?",
        type: "option",
        options: [
            { text: "Conduct market research, analyze the competition, and develop a detailed business plan with financial projections.", points: 1 },
            { text: "Start with a simple outline, focusing on the core idea and gradually expanding the plan as the business grows.", points: 2  },
            { text: "Seek guidance from entrepreneurs who have launched successful businesses and incorporate their advice into your flexible business plan.", points: 3 },
        ],
    },
    {
        text: "You're considering joining a fitness program to improve your health and well-being. How do you make the decision to find a program that suits your lifestyle and goals?",
        type: "option",
        options: [
            { text: "Research different fitness programs, consult with fitness experts, and select one that aligns with your specific health objectives.", points: 1 },
            { text: "Try out various fitness classes and activities to see which ones you enjoy the most and feel motivated to continue.", points: 2 },
            { text: "Combine expert advice with your personal preferences, customizing a fitness routine that suits your lifestyle and keeps you engaged.", points: 3 },
        ],
    },
    {
        text: "You're hosting a dinner party for special guests, and you want to impress them with a new and challenging recipe. How do you approach the cooking to create a memorable dining experience?",
        type: "option",
        options: [
            { text: "Carefully plan the menu, practice the recipe beforehand, and ensure all ingredients are of the highest quality for a flawless dinner.", points: 1 },
            { text: "Embrace culinary experimentation, combining flavors and techniques to create a unique dish that surprises and delights the guests.", points: 2 },
            { text: "Seek guidance from experienced chefs while infusing your own creative twists into the recipe, crafting a memorable dining experience.", points: 3 },
        ],
    },
];

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
                // console.log(`Save answer for question: ${question.text}`);
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
