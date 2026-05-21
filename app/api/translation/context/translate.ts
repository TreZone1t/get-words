import { aiService, wordService } from "@/lib/services";
import { SchemaType } from '@google/generative-ai';

const contextTranslationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    translation: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of possible Arabic translations for the target word based on the context"
    },
    fullSentence: {
      type: SchemaType.STRING,
      description: "The full translated Arabic sentence"
    },
    isRealWord: {
      type: SchemaType.BOOLEAN,
      description: "Whether the target word is a real valid word"
    },
    message: {
      type: SchemaType.STRING,
      description: "Error message if the word is not real"
    }
  },
  required: ["translation", "fullSentence", "isRealWord"]
};

export const translate = async (word: string , sentence: string) => {
    const prompt = `Translate in an interpretable way the following word '${word}' from the context of the following sentence into Arabic, and also translate the full sentence into Arabic: '${sentence}'. If the word is not a real word, set isRealWord to false and provide a message.`;
    
    const generatedContent = await aiService.generateContentWithFallback(prompt, {
      responseMimeType: "application/json",
      responseSchema: contextTranslationSchema,
    });
    
    const responseText = await generatedContent.response.text();
    const jsonResponse = JSON.parse(responseText.trim()) as { translation: string[], fullSentence: string, isRealWord: boolean, message?: string };
    
    if (!jsonResponse.isRealWord || jsonResponse.message) {
        throw new Error(jsonResponse.message || `('${word}') is not a real word`);
    }
    
    const wordExists = await wordService.findWord(word);
    if (wordExists && jsonResponse.translation.length > 0) { 
        wordService.addTranslations(wordExists, jsonResponse.translation);
    }
    
    return jsonResponse;
}