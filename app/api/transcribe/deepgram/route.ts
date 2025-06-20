import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { youtube_url } = await req.json();

  const response = await fetch("https://finalytbackend.onrender.com/api/yt-to-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: youtube_url }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
