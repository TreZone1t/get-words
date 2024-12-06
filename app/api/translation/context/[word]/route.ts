import { NextRequest, NextResponse } from 'next/server';
import { translate } from './translate';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) {
  try {
    const word  = (await params).word;
    const { sentence } = await req.json();
    
    if (!sentence.includes(word)) {
      return NextResponse.json(
        { message: `The word "${word}" does not exist in the sentence "${sentence}"` },
        { status: 400 }
      );
    }
    
    const response = await translate(word, sentence);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST request:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
      return NextResponse.json(
        { message: 'Invalid API key. Please check your configuration.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}