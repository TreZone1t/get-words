import { NextResponse } from "next/server";
import { generate } from "./generate";
import { wordService } from "@/lib/services";
import { zWord , Word } from "@/schema/word";
import { Word as PrismaWord } from "@prisma/client";

export async function GET(
    request: Request,
    context: { params: { word: string } }
) {
    const { word } = await context.params;
    const validation = zWord.safeParse(word);
    if (!validation.success) {
        return NextResponse.json({ message: validation.error.message }, { status: 400 });
    }
    try {
        console.log('Generating word data for:', word);
        const mainWord : PrismaWord = await generate(word);
        const validation = Word.safeParse(mainWord);
        if (!validation.success) {
            console.log('No main word generated');
            return NextResponse.json(
                { message: "Failed to generate word data :" + `${validation.error.message}` },
                { status: 500 }
            );
        }
        const synonyms = await wordService.getRelatedWords(mainWord.synonyms);
        const antonyms = await wordService.getRelatedWords(mainWord.antonyms);
        const similar = await wordService.getRelatedWords(mainWord.similar);
        const waitForAll = Promise.all([synonyms, antonyms, similar]);
        await waitForAll;
        return NextResponse.json({ mainWord , synonyms, antonyms, similar });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}