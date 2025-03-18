import { meta } from '@eslint/js';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GOOGLE_GEN_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-pro-exp-02-05',
});

export const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function generateContent(prompt, history) {
  const studyPrompt = `You are a helpful study assistant. 
      ${prompt}. Please provide your response in a way that is easy to 
        understand and remember. If applicable, provide examples, and ask a 
        question to verify the users understanding.`;

  const chatSession = model.startChat({
    generationConfig,
    history: history,
  });

  const result = await chatSession.sendMessage(studyPrompt);
  return result.response.text();
}
