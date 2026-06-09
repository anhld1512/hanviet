import { NextResponse } from "next/server"
import { checkUsage } from "@/lib/usage"

export async function GET() {
  const status = await checkUsage()
  return NextResponse.json(status)
}
