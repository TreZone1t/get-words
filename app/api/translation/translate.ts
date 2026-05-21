import { aiService } from "@/lib/services";
import { SchemaType } from '@google/generative-ai';

const translationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    translation: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of possible Arabic translations for the sentence"
    }
  },
  required: ["translation"]
};

export const translate = async (sentence: string) => {
  const prompt = `Translate the following sentence into Arabic: ${sentence}`;
  
  const generatedContent = await aiService.generateContentWithFallback(prompt, {
    responseMimeType: "application/json",
    responseSchema: translationSchema,
  });
  
  const responseText = generatedContent.response.text();
  const jsonResponse = JSON.parse(responseText.trim());
  return jsonResponse;
}