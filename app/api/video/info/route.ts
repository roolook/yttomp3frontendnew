import { NextResponse } from "next/server"

function extractVideoId(url: string): string | null {
  if (typeof url !== "string") {
    console.error("extractVideoId received non-string URL:", url)
    return null
  }
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

export async function POST(req: Request) {
  console.log("API: /api/video/info POST request received")
  try {
    const { url } = await req.json()
    console.log("API: Received URL:", url, "Type:", typeof url)

    if (!url || typeof url !== "string") {
      console.error("API: URL is missing or not a string")
      console.log("API: Returning 400 for missing/invalid URL type.")
      return NextResponse.json({ error: "URL is required and must be a string" }, { status: 400 })
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      console.error("API: Invalid YouTube URL provided:", url)
      console.log("API: Returning 400 for invalid YouTube URL.")
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }
    console.log("API: Extracted video ID:", videoId)

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    console.log("API: Fetching video info from oEmbed:", oembedUrl)

    let oembedResponse
    try {
      oembedResponse = await fetch(oembedUrl)
      if (!oembedResponse.ok) {
        const errorText = await oembedResponse.text()
        console.error(`API: oEmbed fetch failed with status ${oembedResponse.status}:`, errorText)
        console.log("API: Returning oEmbed fetch error.")
        return NextResponse.json(
          {
            error: "Failed to fetch video information from YouTube oEmbed",
            message: `oEmbed API returned status ${oembedResponse.status}`,
          },
          { status: oembedResponse.status },
        )
      }
    } catch (fetchError) {
      console.error("API: Network error fetching from oEmbed:", fetchError)
      console.log("API: Returning network fetch error.")
      return NextResponse.json(
        {
          error: "Network error fetching video information",
          message: fetchError instanceof Error ? fetchError.message : "Unknown network error",
        },
        { status: 500 },
      )
    }

    const oembedData = await oembedResponse.json()
    console.log("API: oEmbed data received:", oembedData)

    const videoData = {
      id: videoId,
      title: oembedData.title || "Unknown Title",
      thumbnail: oembedData.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: "N/A",
      channel: oembedData.author_name || "Unknown Channel",
      description: "Description not available via oEmbed",
      viewCount: 0,
      publishDate: null,
    }
    console.log("API: About to return successful video data.")
    return NextResponse.json(videoData)
  } catch (error) {
    console.error("API: Uncaught error in /api/video/info:", error)
    console.log("API: Returning uncaught error.")
    return NextResponse.json(
      {
        error: "An unexpected server error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
