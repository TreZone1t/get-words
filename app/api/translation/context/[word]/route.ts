import { NextRequest, NextResponse } from 'next/server';
import { translate } from './translate';


export async function POST(
  req: NextRequest,
  res: NextResponse,
  { params }: { params: Promise<{ word: string }> }
) {
  const  word  = (await params).word;
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