import { NextRequest, NextResponse } from 'next/server'
import { parseTransactionFromText, parseTransactionFromImage } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    let transactions

    if (type === 'text') {
      transactions = await parseTransactionFromText(data)
    } else if (type === 'image') {
      transactions = await parseTransactionFromImage(data)
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "text" or "image"' },
        { status: 400 }
      )
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error in parse-transaction API:', error)
    return NextResponse.json(
      { error: 'Failed to parse transaction' },
      { status: 500 }
    )
  }
}
