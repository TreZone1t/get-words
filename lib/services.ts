import { PrismaClient, Word} from '@prisma/client';
import { RelationType } from './types';
import { DataForCreateWord, DataForCreateWordT, UpdateRelatedWordSchema, UpdateRelatedWordT } from '@/schema/word';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';


const googleApiKey = process.env.GOOGLE_API_KEY;
if (!googleApiKey) {
  throw new Error('Google API Key is missing. Add your API key to the .env file.');
}

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(googleApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
export class AIService { 
        constructor() {
            this.prisma = prisma;
            this.genAI = genAI;
            this.model = model;
        }
        prisma: PrismaClient;
        genAI: GoogleGenerativeAI;
        model: GenerativeModel ;
        connectToDatabase() {
            return this.prisma;
        }
        connectToAi() {
            return this.genAI;  
        }
        connectToModel() {
            return this.model;  
        }
    }
export const aiService = new AIService();
export class URlService {
   getMyURL() {
    const url = process.env.URL;
    if (!url) {
      return 'http://localhost:3000';
    }
    return url;
  }
}
export const urlService = new URlService();
export class WordService {
  async findWord(word: string): Promise<Word | null> {
    return prisma.word.findUnique({
      where: { word },
    });
  }

  async createWord(word: string, data: DataForCreateWordT): Promise<Word> {
      const validation = DataForCreateWord.safeParse(data);
      if (!validation.success) {
        throw new Error(validation.error.message);
      }
      return await prisma.word.upsert({
        where: { word },
        create: {  
          word,
          translation: data.translation,
          meaning: data.meaning,
          example: data.example,
          antonyms: [],
          synonyms: [],
          similar: [],
          type: data.type,
          searched: true,
        },
        update: {
          searched: true,
          translation: {
            set:  data.translation,
          },
          type: {
            set: data.type,
          },
          meaning: {
            set: data.meaning,
          },
          example: {
            set: data.example,
          },
        },
      });
  }

 async addTranslations(word: Word, translations: string[]): Promise<Word> {
  const newT : string[] = [];
  for(let i=0; i< translations.length; i++){    
    const validation = word.translation.some((t) => t === translations[i]);
    if (!validation) {
      newT.push(translations[i]);
    }
  }
    const updatedTranslations = [...word.translation, ...newT];
    const updatedWord = await prisma.word.update({
      where: { id: word.id },
      data: { translation: updatedTranslations },
    });
    return updatedWord;
  }
  async createRelWord(word: Word, RWord: string, relationType: RelationType): Promise<Word> {
    const relWord = await prisma.word.upsert({
      where: { word: RWord },
      create: {
        word: RWord,
        translation: [],
        antonyms: [],
        synonyms: [],
        similar: [],
        meaning: [],
        example: [],
        type: [],
        searched: false,
      },
      update: {}
    });

    const updateData: UpdateRelatedWordT = {};
    const relField = relationType === RelationType.SYNONYM ? 'synonyms' :
                     relationType === RelationType.ANTONYM ? 'antonyms' : 'similar';

    // Ensure the arrays exist
    const currentArray = word[relField] || [];
    if (!currentArray.includes(relWord.id)) {
      updateData[relField] = { push: relWord.id };
    }

    const relWordArray = relWord[relField] || [];
    if (!relWordArray.includes(word.id)) {
      await prisma.word.update({
        where: { id: relWord.id },
        data: { [relField]: { push: word.id } }
      });
    }

    if (Object.keys(updateData).length > 0) {
      const validation = UpdateRelatedWordSchema.safeParse(updateData);
      if (!validation.success) {
        throw new Error(validation.error.message);
      }
      await prisma.word.update({
        where: { id: word.id },
        data: updateData
      });
    }
    return relWord;
  }
  async getRelatedWords(relatedId: number[]): Promise<Word[]> {
    if (!relatedId || relatedId.length === 0) {
      return [];
    }
    
    const relatedWords = await prisma.word.findMany({
      where: {
        id: {
          in: relatedId,
        },
      }
    });
    
    return relatedWords;
  };
}

export const wordService = new WordService();