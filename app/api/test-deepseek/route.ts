import { NextResponse } from "next/server"
import OpenAI from "openai"

export const maxDuration = 30

export async function GET() {
  try {
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    })

    const response = await client.chat.completions.create({
      model: "deepseek/deepseek-v4-flash",
      messages: [{ role: "user", content: 'Reply with just: {"ok": true}' }],
      max_tokens: 50,
      temperature: 0,
    })

    const text = response.choices[0]?.message?.content ?? ""
    return NextResponse.json({ success: true, response: text, model: "deepseek/deepseek-v4-flash via OpenRouter" })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
