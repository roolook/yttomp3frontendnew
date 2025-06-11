"use client"

import { useState } from "react"
import Header from "@/components/Header"
import VideoInput from "@/components/VideoInput"
import TranscriptDisplay from "@/components/TranscriptDisplay"
import AIAnalysis from "@/components/AIAnalysis"
import LoadingState from "@/components/LoadingState"
import VideoDetails from "@/components/VideoDetails"
import { apiService, type VideoData, type TranscriptItem } from "@/lib/api"
import type { AIAnalysisData } from "@/app/api/analysis/analyze/route"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function HomePage() {
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<"input" | "transcribing-video" | "analysis">("input")
  const { toast } = useToast()

  const handleVideoSubmit = async (url: string) => {
    setIsLoading(true)
    setVideoData(null)
    setTranscript([])
    setAiAnalysis(null)
    setCurrentStep("transcribing-video") // Initial step for transcription
    toast({
      title: "Processing video...",
      description: "Fetching video information and transcribing audio.",
      duration: 9000,
    })

    try {
      // 1. Get video information
      console.log("APP: Fetching video info...")
      const videoInfo = await apiService.getVideoInfo(url)
      setVideoData(videoInfo)
      toast({
        title: "Video Info Fetched",
        description: `Found video: "${videoInfo.title}"`,
        duration: 3000,
      })

      // Extract video ID for transcript fetching
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
      const videoId = videoIdMatch ? videoIdMatch[1] : null

      if (!videoId) {
        throw new Error("Invalid YouTube URL: Could not extract video ID.")
      }

      let transcriptData: { transcript: TranscriptItem[]; totalSegments: number; totalDuration: number }

      try {
        // Attempt 1: Extract transcript from YouTube captions (youtube-transcript library)
        console.log("APP: Attempting to extract transcript from YouTube captions...")
        setCurrentStep("transcribing-video")
        toast({
          title: "Extracting Transcript",
          description: "Attempting to extract captions from the YouTube video.",
          duration: 9000,
        })
        transcriptData = await apiService.extractTranscript(videoId)
        console.log("APP: Successfully extracted captions.")
        toast({
          title: "Transcript Extracted",
          description: `Successfully extracted ${transcriptData.totalSegments} segments from captions.`,
          duration: 3000,
        })
      } catch (captionError) {
        console.warn("APP: Failed to extract captions. Error object:", captionError) // Log the full error object
        toast({
          title: "Captions Not Found",
          description: "No captions available. Attempting audio transcription via Deepgram.",
          variant: "destructive",
          duration: 5000,
        })

        try {
          // Attempt 2: Fallback to audio transcription using Deepgram (via MichaelBelgium API)
          console.log("APP: Initiating fallback to audio transcription...")
          setCurrentStep("transcribing-video") // Still transcribing, but now audio
          toast({
            title: "Transcribing Audio",
            description: "Converting video to audio and transcribing with Deepgram.",
            duration: 9000,
          })
          transcriptData = await apiService.transcribeYouTubeVideo(url) // Pass full URL
          console.log("APP: Successfully transcribed audio.")
          toast({
            title: "Audio Transcribed",
            description: `Successfully transcribed ${transcriptData.totalSegments} segments from audio.`,
            duration: 3000,
          })
        } catch (audioTranscriptionError) {
          console.error("APP: Failed during audio transcription fallback. Error:", audioTranscriptionError)
          // Re-throw the error so the outer catch block can handle it as a final failure
          throw audioTranscriptionError
        }
      }

      setTranscript(transcriptData.transcript)

      // 3. Analyze transcript with AI
      console.log("APP: Analyzing transcript...")
      setCurrentStep("analysis")
      toast({
        title: "Analyzing Transcript",
        description: "Our AI is generating insights from the transcript.",
        duration: 9000,
      })
      const analysis = await apiService.analyzeTranscript(transcriptData.transcript, videoInfo.title)
      setAiAnalysis(analysis)
      console.log("APP: Analysis complete.")
      toast({
        title: "Analysis Complete!",
        description: "AI insights are ready.",
        variant: "success",
        duration: 5000,
      })
    } catch (err) {
      console.error("APP: Error processing video in handleVideoSubmit (outer catch):", err)
      let title = "Error"
      let description = "An unknown error occurred."
      const variant: "default" | "destructive" | "success" = "destructive"

      if (err instanceof Error) {
        try {
          const errorJson = JSON.parse(err.message)
          title = errorJson.error || title
          description = errorJson.message || description
        } catch (parseError) {
          description = err.message // Fallback to raw message if not JSON
        }
      }

      toast({
        title,
        description,
        variant,
        duration: 5000,
      })
      setVideoData(null)
      setTranscript([])
      setAiAnalysis(null)
      setCurrentStep("input") // Go back to input on error
    } finally {
      setIsLoading(false)
      console.log("APP: Processing finished (either success or error).")
    }
  }

  const handleReset = () => {
    setVideoData(null)
    setTranscript([])
    setAiAnalysis(null)
    setCurrentStep("input")
    toast({
      title: "Ready for a new video!",
      description: "Enter another YouTube URL to get started.",
      duration: 3000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentStep === "input" && !isLoading && <VideoInput onSubmit={handleVideoSubmit} />}

        {isLoading && <LoadingState step={currentStep} />}

        {!isLoading && transcript.length > 0 && (
          <div className="space-y-8">
            {videoData && <VideoDetails videoData={videoData} onReset={handleReset} />}

            <TranscriptDisplay transcript={transcript} />

            {aiAnalysis && <AIAnalysis analysis={aiAnalysis} />}
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}
