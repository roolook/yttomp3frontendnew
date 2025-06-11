import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { youtube_url } = await req.json();

  const response = await fetch("https://your-render-backend.onrender.com/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ youtube_url }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}