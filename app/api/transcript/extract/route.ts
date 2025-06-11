import { NextResponse } from "next/server"
import { YoutubeTranscript } from "youtube-transcript"

export interface TranscriptItem {
  text: string
  start: number
  duration: number
}

export async function POST(req: Request) {
  console.log("API: /api/transcript/extract POST request received")
  try {
    const { videoId } = await req.json()

    if (!videoId) {
      console.error("API: Video ID is missing for transcript extraction")
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
    }

    console.log(`API: Extracting transcript for video: ${videoId}`)

    const transcript = await YoutubeTranscript.fetchTranscript(videoId)

    const formattedTranscript: TranscriptItem[] = transcript.map((item) => ({
      text: item.text,
      start: item.offset / 1000, // Convert milliseconds to seconds
      duration: item.duration / 1000, // Convert milliseconds to seconds
    }))

    console.log(`API: Successfully extracted ${formattedTranscript.length} transcript segments`)

    return NextResponse.json({
      transcript: formattedTranscript,
      totalSegments: formattedTranscript.length,
      totalDuration: formattedTranscript.reduce((acc, item) => acc + item.duration, 0),
    })
  } catch (error) {
    console.error("API: Error extracting transcript:", error)

    if (error instanceof Error) {
      if (error.message.includes("Transcript is disabled")) {
        return NextResponse.json(
          {
            error: "Transcript not available",
            message: "This video does not have captions enabled or available.",
          },
          { status: 404 },
        )
      }

      if (error.message.includes("Video unavailable")) {
        return NextResponse.json(
          {
            error: "Video not found",
            message: "The video is private, deleted, or does not exist.",
          },
          { status: 404 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Failed to extract transcript",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
