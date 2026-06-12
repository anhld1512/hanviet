import { NextResponse } from "next/server"
import { checkUsage, checkPromptUsage } from "@/lib/usage"

export async function GET() {
  const [grading, prompt] = await Promise.all([checkUsage(), checkPromptUsage()])
  return NextResponse.json({
    ...grading,
    promptUsed: prompt.used,
    promptRemaining: prompt.remaining,
    promptIsPro: prompt.isPro,
  })
}
