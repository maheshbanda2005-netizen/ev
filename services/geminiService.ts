
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithAi = async (message: string, history: { role: 'user' | 'model', text: string }[], context: any) => {
  try {
    const contextString = `
      Current App Context:
      - Available Charging Stations: ${JSON.stringify(context.stations.map((s: any) => ({ name: s.name, city: s.city, power: s.powerOutput, slots: s.slots.length })))}
      - User's Vehicles: ${JSON.stringify(context.vehicles.map((v: any) => ({ make: v.make, model: v.model, plug: v.plugType })))}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: contextString }] },
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are Eva, the AI assistant for Eva Electrical. You help users find charging stations, manage their EVs, and plan trips. Use the provided context to give specific recommendations. If a user asks for a station, recommend one from the list if it matches their city. Be helpful, concise, and professional.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

export const getChargingGuide = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a detailed, helpful guide for an EV owner on the topic: ${topic}. Include step-by-step instructions, safety tips, and efficiency recommendations. Format with clear headings.`,
      config: {
        systemInstruction: "You are an expert EV consultant for Eva Electrical. Be professional, technical yet accessible.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't generate a guide at the moment. Please try again later.";
  }
};
