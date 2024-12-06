import { NextResponse } from 'next/server';
import { translate } from './translate';

export async function POST(request: Request) {
    const { sentence } = await request.json();
    const response = await translate(sentence);
    return NextResponse.json(response);
}
