import { NextRequest, NextResponse } from 'next/server';
import { translate } from './translate';


export async function POST(
  req: NextRequest,
  res: NextResponse,
  context: { params: { word: string } }
) {
  const { word } = await context.params;
  const { sentence } = await req.json();
  
  if (!sentence.includes(word)) {
    return NextResponse.json(
      { message: `The word "${word}" does not exist in the sentence "${sentence}"` },
      { status: 400 }
    );
  }
  
  const response = await translate(word, sentence);
  return NextResponse.json(response);
}