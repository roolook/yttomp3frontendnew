const API_BASE_URL = "/api"

export interface VideoData {
  id: string
  title: string
  thumbnail: string
  duration: string
  channel: string
  description: string
  viewCount: number
  publishDate: string | null
}

export interface TranscriptItem {
  text: string
  start: number
  duration: number
}

import type { AIAnalysisData } from "@/app/api/analysis/analyze/route"

class APIService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Include status in the error message for better client-side handling
      throw new Error(
        JSON.stringify({
          status: response.status,
          error: errorData.error || `HTTP error! status: ${response.status}`,
          message: errorData.message || `Request to ${url} failed with status ${response.status}`,
        }),
      )
    }

    return response.json()
  }

  async getVideoInfo(url: string): Promise<VideoData> {
    return this.request<VideoData>("/video/info", {
      method: "POST",
      body: JSON.stringify({ url }),
    })
  }

  // Method to extract transcript from YouTube captions
  async extractTranscript(
    videoId: string,
  ): Promise<{ transcript: TranscriptItem[]; totalSegments: number; totalDuration: number }> {
    return this.request<{ transcript: TranscriptItem[]; totalSegments: number; totalDuration: number }>(
      "/transcript/extract",
      {
        method: "POST",
        body: JSON.stringify({ videoId }),
      },
    )
  }

  // Method to transcribe YouTube video directly using Deepgram
  async transcribeYouTubeVideo(
    videoUrl: string,
  ): Promise<{ transcript: TranscriptItem[]; totalSegments: number; totalDuration: number }> {
    return this.request<{ transcript: TranscriptItem[]; totalSegments: number; totalDuration: number }>(
      "/transcribe/deepgram",
      {
        method: "POST",
        body: JSON.stringify({ videoUrl }),
      },
    )
  }

  async analyzeTranscript(transcript: TranscriptItem[], videoTitle?: string): Promise<AIAnalysisData> {
    return this.request<AIAnalysisData>("/analysis/analyze", {
      method: "POST",
      body: JSON.stringify({ transcript, videoTitle }),
    })
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request("/health")
  }
}

export const apiService = new APIService()
console.log("apiService instance created and exported from lib/api.ts")
