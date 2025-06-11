import { NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod" // For schema definition

export interface TranscriptItem {
  text: string
  start: number
  duration: number
}

// Define the schema for the AI output
const aiAnalysisSchema = z.object({
  summary: z.string().describe("A concise summary of the video content."),
  keyPoints: z.array(z.string()).max(5).describe("Up to 5 most important key points from the video."),
  actionItems: z.array(z.string()).max(4).describe("Up to 4 actionable items or takeaways for the viewer."),
  topics: z.array(z.string()).max(6).describe("Up to 6 main topics or themes discussed in the video."),
  sentiment: z.enum(["positive", "negative", "neutral"]).describe("Overall sentiment of the video content."),
})

export type AIAnalysisData = z.infer<typeof aiAnalysisSchema> & {
  readingTime: number
  wordCount: number
}

export async function POST(req: Request) {
  console.log("API: /api/analysis/analyze POST request received")
  try {
    const { transcript, videoTitle } = await req.json()

    if (!transcript || !Array.isArray(transcript)) {
      console.error("API: Invalid transcript array provided for analysis")
      return NextResponse.json({ error: "Valid transcript array is required" }, { status: 400 })
    }

    console.log(`API: Analyzing transcript with ${transcript.length} segments`)

    const fullText = transcript.map((item: TranscriptItem) => item.text).join(" ")
    const wordCount = fullText.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words per minute

    const { object: analysis } = await generateObject({
      model: openai("gpt-4o"),
      schema: aiAnalysisSchema,
      prompt: `Analyze the following YouTube video transcript titled "${videoTitle || "Video"}".
      
      Transcript:
      ${fullText}
      
      Based on the transcript, provide:
      1. A concise summary.
      2. Up to 5 key points.
      3. Up to 4 actionable items or takeaways.
      4. Up to 6 main topics or themes.
      5. The overall sentiment (positive, negative, or neutral).
      
      Ensure the output is a JSON object matching the provided schema.`,
    })

    const result: AIAnalysisData = {
      ...analysis,
      wordCount,
      readingTime,
    }

    console.log("API: Analysis completed successfully")
    return NextResponse.json(result)
  } catch (error) {
    console.error("API: Error analyzing transcript:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze transcript",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
