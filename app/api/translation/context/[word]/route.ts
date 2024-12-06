import { NextResponse } from 'next/server';
import { translate } from './translate';

export async function POST(
  request: Request,
  { params }: { params: { word: string } }
) {
  const { word } = await params;
  const { sentence } = await request.json();
  if (!sentence.includes(word)) {
    return NextResponse.json(
      { message: `The word "${word}" does not exist in the sentence "${sentence}"` },
      { status: 400 }
    );
  }
  const response = await translate(word, sentence);
  return NextResponse.json(response);
}
