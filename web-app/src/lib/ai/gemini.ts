import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK with GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
export const genAI = new GoogleGenerativeAI(apiKey);

export const SYSTEM_PROMPT = `You are the Project Orchestrator for an 8-Agent Swarm that builds software applications. 
Your goal is to talk to the user and gather the full required functionality for the app they want to build. 
Ask clarifying questions if needed. Once you have a clear understanding of the required functionality, do not start writing code yourself. 
Instead, summarize the requirements and tell the user that we can proceed to building. Ask the user: "Please type 'yes' if you would like to build the app now."
When they type 'yes', acknowledge it and state that the multi-agent swarm is now taking over the build process.`;

export function getChatModel() {
  return genAI.getGenerativeModel({ 
    model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
    systemInstruction: SYSTEM_PROMPT
  });
}
