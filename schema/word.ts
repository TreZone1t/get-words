import { z } from "zod";
import validator from 'validator';
import { regexp } from "./lang";
import { Category } from "@prisma/client";

export const zWord = z.string().min(2).max(50).refine(
  (word) => validator.isAlpha(word.replace(/[\s-]/g, ''), 'en-US'),
  { message: "The word should contain only alphabetic characters, spaces, or hyphens." }
).refine(
  (word) => !regexp.test(word),
  { message: "The word is inappropriate or offensive." }
);

export type zWordT = z.infer<typeof zWord>;

export const AIResponseSchema = z.object({
  synonym: z.array(z.object({ word: z.string(), ranking: z.number().int().min(1).max(10) })),
  antonym: z.array(z.object({ word: z.string(), ranking: z.number().int().min(1).max(10) })),
  related: z.array(z.object({ word: z.string(), ranking: z.number().int().min(1).max(10) })),
  translation: z.array(z.object({ word: z.string(), ranking: z.number().int().min(1).max(10) })),
  meaning: z.array(z.string()).min(1),
  example: z.array(z.string()).min(1),
  type: z.array(z.string()).min(1),
});

export type AIResponseT = z.infer<typeof AIResponseSchema>;

export const FilterSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  isNew: z.boolean().default(false),
  isImportant: z.boolean().default(false),
  isNote: z.boolean().default(false),
  category: z.nativeEnum(Category).default('INTERNET'),
  unite: z.number().int().nonnegative().default(0),
  lesson: z.number().int().nonnegative().default(0),
  wordId: z.number().int().positive(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date()
});

export type Filter = z.infer<typeof FilterSchema>;

export const Word = z.object({
  id: z.number().int().positive(),
  word: zWord,
  searched: z.boolean(),
  meaning: z.array(z.string()),
  example: z.array(z.string()),
  translation: z.array(z.string()),
  synonyms: z.array(z.number().int().positive()),
  antonyms: z.array(z.number().int().positive()),
  similar: z.array(z.number().int().positive()),
  type: z.array(z.string()),
  filter: FilterSchema.optional()
});

export const fetchedWordResponse = z.object({
  mainWord: Word,
  synonyms: z.array(Word).min(1),
  antonyms: z.array(Word).min(1),
  similar: z.array(Word).min(1),
});

export type WordT = z.infer<typeof Word>;
export type FetchedWordResponseT = z.infer<typeof fetchedWordResponse>;
export const DataForCreateWord = z.object({
     translation: z.array(z.string()).min(1),
     meaning: z.array(z.string()).min(1), 
     example: z.array(z.string()).min(1),
      type: z.array(z.string()).min(1) 
    });
export type DataForCreateWordT = z.infer<typeof DataForCreateWord>;

export const UpdateRelatedWordSchema = z.object({
  synonyms: z.object({ push: z.number().int().positive() }).optional(),
  antonyms: z.object({ push: z.number().int().positive() }).optional(),
  similar: z.object({ push: z.number().int().positive() }).optional(),
});

export type UpdateRelatedWordT = z.infer<typeof UpdateRelatedWordSchema>;