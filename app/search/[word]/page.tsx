import { Card, CardContent } from "@/components/ui/card";
import { fetchWords } from "@/lib/fetch";
import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { Word } from "@prisma/client";

type Props = {
  params: { word: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { word } = await params;
  return {
    title: `Word Map - ${word}`,
  };
}

export default async function Page({ params }: Props) {
  const { word } = await params;
  const { mainWord, synonyms, antonyms, similar } = await fetchWords(word);

  const renderWordList = (title: string, words: Word[]) => (
    <div className="mt-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="list-disc pl-4">
        {words.map((word: Word) => (
          <li key={word.id}>
            <Link href={`/search/${word.word}`}>{word.word}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto p-4 m-3 ">
      <Card className="w-full h-1/6 p-5 m-4">
        <p className="flex justify-between items-center gap-2 text-3xl">
          {mainWord.word}
          <ArrowLeftRight className="h-6 w-6" />
          {mainWord.translation.join(", ")}
        </p>
      </Card>
      <Card className="w-full h-1/6 p-5 m-4">
        <h2 className="text-lg font-bold">meaning</h2>
        <ul className="list-disc pl-4">
          {mainWord.meaning.map((meaning: string, i: number) => (
            <li key={i}>{meaning}</li>
          ))}
        </ul>
      </Card>
      <Card className="w-full h-3/6 p-5 m-4">
        <CardContent>
          {renderWordList("Synonyms", synonyms)}
          {renderWordList("Antonyms", antonyms)}
          {renderWordList("Similar Words", similar)}
        </CardContent>
      </Card>
      <Card className="w-full h-1/6 p-5 m-4">
        <div className="mt-4">
          <h2 className="text-lg font-bold">Examples</h2>
          <ul className="list-disc pl-4">
            {mainWord.example.map((ex: string, i: number) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
