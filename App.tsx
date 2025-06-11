export interface TranscriptItem {
  text: string
  start: number
  duration: number
}

export interface AIAnalysisData {
  summary: string
  keyPoints: string[]
  actionItems: string[]
  topics: string[]
  sentiment: "positive" | "negative" | "neutral"
  readingTime: number
  wordCount: number
}
