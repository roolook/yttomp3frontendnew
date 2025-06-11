"use client"

import { useState } from "react"
import { FileText, Download, Search, Clock } from "lucide-react"
import type { TranscriptItem } from "../App"

interface TranscriptDisplayProps {
  transcript: TranscriptItem[]
}

export default function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showTimestamps, setShowTimestamps] = useState(true)

  const filteredTranscript = transcript.filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const downloadTranscript = () => {
    const content = transcript.map((item) => `[${formatTime(item.start)}] ${item.text}`).join("\n\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transcript.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Video Transcript</h3>
              <p className="text-sm text-gray-600">{transcript.length} segments</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTimestamps(!showTimestamps)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showTimestamps ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Timestamps
            </button>

            <button
              onClick={downloadTranscript}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
          />
        </div>
      </div>

      {/* Transcript Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No results found for "{searchTerm}"</div>
        ) : (
          <div className="space-y-4">
            {filteredTranscript.map((item, index) => (
              <div key={index} className="flex space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {showTimestamps && (
                  <div className="flex-shrink-0 w-16 text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {formatTime(item.start)}
                  </div>
                )}
                <p className="flex-1 text-gray-800 leading-relaxed">
                  {searchTerm && (
                    <>
                      {item.text.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <mark key={i} className="bg-yellow-200 px-1 rounded">
                            {part}
                          </mark>
                        ) : (
                          part
                        ),
                      )}
                    </>
                  )}
                  {!searchTerm && item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
