import { NextRequest, NextResponse } from 'next/server';
import { translate } from './translate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { sentence, word } = await req.json();
    
    if (!sentence.includes(word)) {
      return NextResponse.json(
        { message: `The word "${word}" does not exist in the sentence "${sentence}"` },
        { status: 400 }
      );
    }
    
    const response = await translate(word, sentence);
    return NextResponse.json(response);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in POST:', err);
    return NextResponse.json(
      { message: err?.message || 'An error occurred while processing the request', stack: err?.stack },
      { status: 500 }
    );
  }
}