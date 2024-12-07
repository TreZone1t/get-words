import { NextResponse } from "next/server";
import { generate } from "./generate";
import { wordService } from "@/lib/services";
import { zWord } from "@/schema/word";
import { Word as PrismaWord } from "@prisma/client";

export async function GET(
    request: Request,
    context: { params: Promise<{ word: string }> }
) {
    try {
        const { word } = await context.params;
        const validation = zWord.safeParse(word);
        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.message }, 
                { status: 400 }
            );
        }

        console.log('Generating word data for:', word);
        const mainWord: PrismaWord = await generate(word);
        
        if (!mainWord) {
            return NextResponse.json(
                { message: "Failed to generate word data" },
                { status: 500 }
            );
        }

        const [synonyms, antonyms, similar] = await Promise.all([
            wordService.getRelatedWords(mainWord.synonyms),
            wordService.getRelatedWords(mainWord.antonyms),
            wordService.getRelatedWords(mainWord.similar)
        ]);

        return NextResponse.json({
            mainWord,
            synonyms,
            antonyms,
            similar
        });
    } catch (error) {
        console.error('Error in word route handler:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message }, { status: 500 });
    }
}