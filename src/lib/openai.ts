import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  category?: string
}

export async function parseTransactionFromText(text: string): Promise<ParsedTransaction[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a transaction parser for a roommate expense splitting app. 
          Parse the following text and extract all transactions. Return a JSON array of transactions.
          Each transaction should have: date (YYYY-MM-DD format), description, amount (number), and category.
          Categories should be one of: Rent, Groceries, Utilities, Internet, Fun/Entertainment, Household Items, Miscellaneous.
          If no date is specified, use today's date. If multiple transactions are mentioned, return all of them.
          Example response: [{"date": "2024-01-15", "description": "Grocery shopping at Safeway", "amount": 45.50, "category": "Groceries"}]`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.1,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const transactions = JSON.parse(content)
    return Array.isArray(transactions) ? transactions : [transactions]
  } catch (error) {
    console.error('Error parsing transaction:', error)
    throw new Error('Failed to parse transaction')
  }
}

export async function parseTransactionFromImage(imageBase64: string): Promise<ParsedTransaction[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a receipt and transaction parser for a roommate expense splitting app. 
          Analyze the image and extract all transactions. Return a JSON array of transactions.
          Each transaction should have: date (YYYY-MM-DD format), description, amount (number), and category.
          Categories should be one of: Rent, Groceries, Utilities, Internet, Fun/Entertainment, Household Items, Miscellaneous.
          If no date is specified, use today's date. If multiple items are on the receipt, return all of them.
          Example response: [{"date": "2024-01-15", "description": "Grocery shopping at Safeway", "amount": 45.50, "category": "Groceries"}]`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Parse this receipt/transaction image and extract all transactions:"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const transactions = JSON.parse(content)
    return Array.isArray(transactions) ? transactions : [transactions]
  } catch (error) {
    console.error('Error parsing transaction from image:', error)
    throw new Error('Failed to parse transaction from image')
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to transcribe audio')
    }

    const result = await response.json()
    return result.text
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw new Error('Failed to transcribe audio')
  }
}
