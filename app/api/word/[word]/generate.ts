import { Word } from '@prisma/client';
import { aiService, wordService } from "@/lib/services";
import { RelationType } from "@/lib/types";
import { AIResponseT, zWord } from "@/schema/word";
import { SchemaType } from '@google/generative-ai';

type RankedWord = {
  word: string;
  ranking: number;
};

const wordSchema = {
  type: SchemaType.OBJECT,
  properties: {
    isRealWord: { type: SchemaType.BOOLEAN, description: "Whether the given word is a real English word" },
    message: { type: SchemaType.STRING, description: "Message if the word is not real" },
    synonym: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { word: { type: SchemaType.STRING }, ranking: { type: SchemaType.INTEGER } },
        required: ["word", "ranking"]
      }
    },
    antonym: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { word: { type: SchemaType.STRING }, ranking: { type: SchemaType.INTEGER } },
        required: ["word", "ranking"]
      }
    },
    related: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { word: { type: SchemaType.STRING }, ranking: { type: SchemaType.INTEGER } },
        required: ["word", "ranking"]
      }
    },
    translation: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: { word: { type: SchemaType.STRING, description: "arabic word without tashkeel" }, ranking: { type: SchemaType.INTEGER } },
        required: ["word", "ranking"]
      }
    },
    meaning: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    example: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    type: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ["isRealWord"]
};

async function generateAIResponse(word: string): Promise<AIResponseT> {
  const prompt = `Analyze the word '${word}'. If it's a real word, provide synonyms, antonyms, related words, arabic translations, meanings, examples, and its type (e.g., noun, verb). Rate related words 1-10 on closeness. If not a real word, set isRealWord to false and provide a message.`;
  
  const generatedContent = await aiService.generateContentWithFallback(prompt, {
    responseMimeType: "application/json",
    responseSchema: wordSchema,
  });
  
  const responseText = generatedContent.response.text();
  const jsonResponse = JSON.parse(responseText.trim());

  if (!jsonResponse.isRealWord) {
    throw new Error(jsonResponse.message || `'${word}' is not a real word`);
  }

  const sortByRanking = (a: RankedWord, b: RankedWord) => b.ranking - a.ranking;
  jsonResponse.synonym = jsonResponse.synonym || [];
  jsonResponse.antonym = jsonResponse.antonym || [];
  jsonResponse.related = jsonResponse.related || [];
  jsonResponse.translation = jsonResponse.translation || [];

  jsonResponse.synonym.sort(sortByRanking);
  jsonResponse.antonym.sort(sortByRanking);
  jsonResponse.related.sort(sortByRanking);
  jsonResponse.translation.sort(sortByRanking);
  
  return jsonResponse as AIResponseT;
}

export async function generate(w: string): Promise<Word> {
  const validation = zWord.safeParse(w);
  if (!validation.success) {
    throw new Error(validation.error.message);
  }

  const existingWord = await wordService.findWord(w);
  if (existingWord?.searched) {
    return existingWord;
  }

  const aiResponse = await generateAIResponse(w);
  
  const wordData = {
    word: w,
    type: aiResponse.type || [],
    meaning: aiResponse.meaning || [],
    example: aiResponse.example || [],
    translation: aiResponse.translation.map((t) => t.word) || [],
    synonyms: [],
    antonyms: [],
    similar: [],
  };

  const newWord = await wordService.createWord(w, wordData);

  // Process related words sequentially to avoid Prisma transaction deadlocks and race conditions
  if (aiResponse.synonym) {
    for (const s of aiResponse.synonym) {
      await wordService.createRelWord(newWord, s.word, RelationType.SYNONYM);
    }
  }
  if (aiResponse.antonym) {
    for (const a of aiResponse.antonym) {
      await wordService.createRelWord(newWord, a.word, RelationType.ANTONYM);
    }
  }
  if (aiResponse.related) {
    for (const r of aiResponse.related) {
      await wordService.createRelWord(newWord, r.word, RelationType.SIMILARITY);
    }
  }

  return newWord;
}
