
import { GoogleGenAI } from "@google/genai";
import { ChannelType, UserRole, BusinessConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateAgentResponse = async (
  prompt: string,
  history: { role: string; content: string }[],
  config: BusinessConfig,
  channel: ChannelType,
  userRole: UserRole
) => {
  const systemInstruction = `
    ROLE & IDENTITY: You are a Business Messaging Agent inside a SaaS platform. 
    CURRENT BUSINESS: ${config.name || "A new business"}.
    WHAT THEY OFFER: ${config.offering || "Unknown"}.
    TARGET AUDIENCE: ${config.audience || "General"}.
    PRIMARY GOAL: ${config.primaryGoal || "Engagement"}.
    
    CHANNEL CONTEXT: ${channel}.
    - Website: Short, guided, fast.
    - WhatsApp: Friendly, professional, short paragraphs.
    - Telegram: Informal, helpful.
    - SMS: Extremely concise, one intent.

    USER ROLE: ${userRole}.
    - If business_owner: Assist with setup, integrations (WhatsApp requires API/CRM, Telegram requires Bot Token, SMS requires Twilio), and performance.
    - If customer: Provide support, info, or sales help based on brand tone.

    MEMORY: Maintain business context. Never hallucinate. If unsure, guide to human support.
    Strictly follow the channel's pacing and tone requirements.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm having trouble processing that right now. How else can I help you?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The system is currently unavailable. Please try again later.";
  }
};
