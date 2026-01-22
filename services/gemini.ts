import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";

const apiKey = process.env.API_KEY || '';
if (!apiKey) {
    console.error("Warning: API_KEY is missing or empty.");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const createChatSession = (): ChatSession => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-001",
        systemInstruction: "You are FlipBot, an expert assistant for Flip, an Authority Hub platform for creators. You help users find resources, understand the academy courses, and guide them on scaling their business. You are helpful, professional, and concise. Your responses should be encouraging.",
    });

    return model.startChat({
        history: [],
    });
};
