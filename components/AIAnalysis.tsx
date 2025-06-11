"use client"

import { useState } from "react"
import { Brain, FileText, Target, Tag, TrendingUp, Download, Copy, Check } from "lucide-react"
import type { AIAnalysisData } from "../App"

interface AIAnalysisProps {
  analysis: AIAnalysisData
}

export default function AIAnalysis({ analysis }: AIAnalysisProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const downloadAnalysis = () => {
    const content = `
AI ANALYSIS REPORT

SUMMARY:
${analysis.summary}

KEY POINTS:
${analysis.keyPoints.map((point) => `• ${point}`).join("\n")}

ACTION ITEMS:
${analysis.actionItems.map((item) => `□ ${item}`).join("\n")}

TOPICS:
${analysis.topics.join(", ")}

SENTIMENT: ${analysis.sentiment.toUpperCase()}
  `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ai-analysis.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100"
      case "negative":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Analysis</h3>
              <p className="text-sm text-gray-600">Powered by advanced AI processing</p>
            </div>
          </div>

          <button
            onClick={downloadAnalysis}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Summary</h4>
            </div>
            <button
              onClick={() => copyToClipboard(analysis.summary, "summary")}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {copiedSection === "summary" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-gray-800 leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Key Points */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-900">Key Points</h4>
            </div>
            <button
              onClick={() => copyToClipboard(analysis.keyPoints.join("\n• "), "keypoints")}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
            >
              {copiedSection === "keypoints" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="space-y-3">
            {analysis.keyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-700 text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-800">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <h4 className="text-lg font-semibold text-gray-900">Action Items</h4>
            </div>
            <button
              onClick={() => copyToClipboard(analysis.actionItems.join("\n□ "), "actions")}
              className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
            >
              {copiedSection === "actions" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="space-y-3">
            {analysis.actionItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
              >
                <div className="w-5 h-5 border-2 border-orange-400 rounded flex-shrink-0 mt-1"></div>
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Topics and Sentiment */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="w-5 h-5 text-purple-600" />
              <h4 className="text-lg font-semibold text-gray-900">Topics</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.topics.map((topic, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h4 className="text-lg font-semibold text-gray-900">Sentiment</h4>
            </div>
            <div
              className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${getSentimentColor(analysis.sentiment)}`}
            >
              {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
