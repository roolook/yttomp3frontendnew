"use client"

import type React from "react"
import { useState } from "react"
import { Youtube, ArrowRight, Link, Play } from "lucide-react"

interface VideoInputProps {
  onSubmit: (url: string) => void
}

export default function VideoInput({ onSubmit }: VideoInputProps) {
  const [url, setUrl] = useState("")
  const [isValid, setIsValid] = useState(false)

  const validateUrl = (input: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    return regex.test(input)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
    setIsValid(validateUrl(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onSubmit(url)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Youtube className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Extract & Analyze YouTube Videos</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get instant transcriptions and AI-powered insights from any YouTube video. Perfect for research, content
          creation, and learning.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="youtube-url" className="block text-lg font-semibold text-gray-900 mb-3">
              YouTube Video URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="youtube-url"
                value={url}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                  url && !isValid
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : url && isValid
                      ? "border-green-300 focus:border-green-500 bg-green-50"
                      : "border-gray-200 focus:border-blue-500 bg-gray-50"
                }`}
              />
            </div>
            {url && !isValid && <p className="mt-2 text-sm text-red-600">Please enter a valid YouTube URL</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
              isValid
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Play className="w-5 h-5" />
            <span>Transcribe & Analyze</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Youtube className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Accurate Transcription</h3>
          <p className="text-gray-600 text-sm">Extract complete transcripts with timestamps from any YouTube video</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
          <p className="text-gray-600 text-sm">Get summaries, key points, and actionable insights powered by AI</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <ArrowRight className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Export Results</h3>
          <p className="text-gray-600 text-sm">Download transcripts and analysis in multiple formats</p>
        </div>
      </div>
    </div>
  )
}
