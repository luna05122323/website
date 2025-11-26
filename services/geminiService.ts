import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Artwork } from "../types";

// Initialize Gemini Client
// Note: In a real production app, ensure this is handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates a sophisticated museum-style description for an artwork.
 */
export const generateMuseumDescription = async (artwork: Artwork): Promise<string> => {
  try {
    const prompt = `
      Act as a world-renowned art curator for a high-end museum. 
      Write a sophisticated, 100-word descriptions for an artwork with the following details:
      Title: "${artwork.title}"
      Category: "${artwork.category}"
      Materials: "${artwork.materials}"
      Year: "${artwork.year}"
      Initial thought: "${artwork.shortDescription}"

      The tone should be academic yet accessible, poetic, and evocative. 
      Focus on the texture, the potential meaning, and the craftsmanship.
      Do not use markdown formatting. Just plain text.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "The curator is currently observing other pieces. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Detailed analysis is currently unavailable due to high visitor volume.";
  }
};

/**
 * Chat with the curator about a specific piece.
 */
export const chatWithCurator = async (
  history: { role: 'user' | 'model'; text: string }[],
  currentMessage: string,
  artwork: Artwork
): Promise<string> => {
  try {
    const systemInstruction = `
      You are the Head Curator of the Lumière Museum. You are knowledgeable, polite, and passionate about art.
      You are currently discussing the artwork titled "${artwork.title}" created in ${artwork.year}.
      Category: ${artwork.category}.
      Materials: ${artwork.materials}.
      
      Answer the visitor's question about this specific piece. 
      If the question is unrelated to the art, politely steer the conversation back to the beauty of this piece.
      Keep answers concise (under 80 words) to fit the chat interface.
    `;

    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction,
      }
    });

    // Reconstruct history for the chat session context
    // Note: In a stateless request like this we might just send the whole history as prompt context 
    // if using generateContent, but using chats.create is cleaner if we persisted the object.
    // For this simple SPA, we will just send the last message with context injected if needed, 
    // or assume the system instruction sets the scene enough for a single turn response.
    
    // To make it stateless and simple for this demo, we use generateContent with history formatted
    let chatHistory = history.map(h => `${h.role === 'user' ? 'Visitor' : 'Curator'}: ${h.text}`).join('\n');
    
    const prompt = `
      ${systemInstruction}

      Conversation History:
      ${chatHistory}
      
      Visitor: ${currentMessage}
      Curator:
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "I apologize, I didn't quite catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The curator is stepping away for a moment.";
  }
};