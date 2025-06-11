"use client"

import type { VideoData } from "@/lib/api"
import { Clock, Eye } from "lucide-react"

interface VideoDetailsProps {
  videoData: VideoData
  onReset: () => void
}

export default function VideoDetails({ videoData, onReset }: VideoDetailsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <img
          src={videoData.thumbnail || "/placeholder.svg"}
          alt={videoData.title}
          className="w-full md:w-48 h-32 object-cover rounded-lg shadow-md flex-shrink-0"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{videoData.title}</h2>
          <p className="text-md text-gray-700 mb-3">{videoData.channel}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{videoData.duration}</span>
            </div>
            {videoData.viewCount > 0 && (
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{videoData.viewCount.toLocaleString()} views</span>
              </div>
            )}
            {videoData.publishDate && <span>• Published: {new Date(videoData.publishDate).toLocaleDateString()}</span>}
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-5 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium flex-shrink-0"
        >
          New Video
        </button>
      </div>
    </div>
  )
}
