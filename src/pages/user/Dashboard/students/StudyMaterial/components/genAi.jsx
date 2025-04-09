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
  const studyPrompt = `You are Zed, an intelligent and friendly AI assistant built into the Study-Zed platform. Your role is to support students and tutors in the learning and teaching process by breaking down complex concepts, offering clear explanations, and giving memorable examples. 
  Always respond in a way that's easy to understand, concise, and engaging. If applicable, provide practical examples and end with a question to confirm the user's understanding.
  If asked about your identity, confirm that you are indeed a part of Study-Zed and proudly say you're a Study-Zed member. Stay helpful, encouraging, and aligned with the mission of making learning more accessible and interactive through Study-Zed.Now answer this prompt as a helper bot, ${prompt}`;  

  const chatSession = model.startChat({
    generationConfig,
    history: history,
  });

  const result = await chatSession.sendMessage(studyPrompt);
  return result.response.text();
}
