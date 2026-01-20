import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: "You are FlipBot, an expert assistant for Flip, an Authority Hub platform for creators. You help users find resources, understand the academy courses, and guide them on scaling their business. You are helpful, professional, and concise. Your responses should be encouraging.",
        },
    });
};
