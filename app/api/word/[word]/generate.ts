import { Word } from '@prisma/client';
import { aiService, wordService } from "@/lib/services";
import { RelationType } from "@/lib/types";
import { AIResponseSchema, AIResponseT, zWord } from "@/schema/word";

type RankedWord = {
  word: string;
  ranking: number;
};

async function generateAIResponse(word: string): Promise<AIResponseT> {
  try {
    const prompt = `For the word '${word}', please provide the following details in JSON format and do not put anything else in the message:
    {
      "synonym": [{ "word": "synonym word", "ranking": number from 1 to 10 }],
      "antonym": [{ "word": "antonym word", "ranking": number from 1 to 10 }],
      "related": [{ "word": "related word", "ranking": number from 1 to 10 }],
      "translation": [{ "word": "arabic word without tashkeel", "ranking": number from 1 to 10 }],
      "meaning": ["sentence", "sentence", "sentence"],
      "example": ["sentence", "sentence", "sentence"],
      "type": ["noun", "verb", "adjective", "adverb",...]
    }
    and if the word is not a real word respond with: {"message": "('${word}') is not a real word"}
    `;
    const model = aiService.connectToModel();
    const generatedContent = await model.generateContent(prompt);
    const responseText = await generatedContent.response.text();
    const cleanedText = responseText.replace(/```json|```/g, '');
    
    const jsonResponse = JSON.parse(cleanedText.trim()) as AIResponseT | { message: string };

    if ('message' in jsonResponse) {
      throw new Error(jsonResponse.message);
      }

    if (!AIResponseSchema.safeParse(jsonResponse).success) {
      throw new Error('Invalid AI response structure : ' + JSON.stringify(jsonResponse));
    }

    const sortByRanking = (a: RankedWord, b: RankedWord) => b.ranking - a.ranking;
    jsonResponse.synonym.sort(sortByRanking);
    jsonResponse.antonym.sort(sortByRanking);
    jsonResponse.related.sort(sortByRanking);
    jsonResponse.translation.sort(sortByRanking);
    
    return jsonResponse;
  } catch (error) {
    throw error;
  }
}

export async function generate(w: string): Promise<Word> {
  try {
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
      type: aiResponse.type,
      meaning: aiResponse.meaning,
      example: aiResponse.example,
      translation: aiResponse.translation.map((t) => t.word),
      synonyms: [],
      antonyms: [],
      similar: [],
    };

    const newWord = await wordService.createWord(w, wordData);

    // Process related words in parallel
    await Promise.all([
      ...aiResponse.synonym.map(async (s) => 
        wordService.createRelWord(newWord, s.word, RelationType.SYNONYM)
      ),
      ...aiResponse.antonym.map(async (a) => 
        wordService.createRelWord(newWord, a.word, RelationType.ANTONYM)
      ),
      ...aiResponse.related.map(async (r) => 
        wordService.createRelWord(newWord, r.word, RelationType.SIMILARITY)
      ),
    ]);

    return newWord;
  } catch (error) {
    console.error('Error in generate function:', error);
    throw error;
  }
}
