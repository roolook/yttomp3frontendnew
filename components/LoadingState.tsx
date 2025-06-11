import { Youtube, Brain, FileText, Loader } from "lucide-react"

interface LoadingStateProps {
  step: "input" | "transcribing-video" | "analysis"
}

export default function LoadingState({ step }: LoadingStateProps) {
  const getStepStatus = (current: string, target: string) => {
    const order = ["input", "transcribing-video", "analysis"]
    const currentIndex = order.indexOf(current)
    const targetIndex = order.indexOf(target)
    if (currentIndex >= targetIndex) {
      return "completed"
    }
    return "pending"
  }

  const getStepClasses = (targetStep: string) => {
    const status = getStepStatus(step, targetStep)
    if (status === "completed") {
      return "bg-green-100 text-green-600"
    }
    if (step === targetStep) {
      return "bg-blue-600 text-white animate-pulse"
    }
    return "bg-gray-100 text-gray-400"
  }

  const getProgressBarWidth = () => {
    switch (step) {
      case "input":
        return "0%"
      case "transcribing-video":
        return "50%"
      case "analysis":
        return "100%" // Analysis is the final step
      default:
        return "0%"
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {step === "transcribing-video" && "Transcribing Video"}
            {step === "analysis" && "Analyzing Content"}
          </h2>

          <p className="text-gray-600 mb-8">
            {step === "transcribing-video" && "Our AI is converting the video audio to text..."}
            {step === "analysis" && "Our AI is analyzing the transcript to generate insights..."}
          </p>

          {/* Progress Steps */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getStepClasses("input")}`}
              >
                <Youtube className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-900">Video</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getStepClasses("transcribing-video")}`}
              >
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-900">Transcript</span>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getStepClasses("analysis")}`}
              >
                <Brain className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-900">Analysis</span>
            </div>
          </div>

          {/* Loading Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: getProgressBarWidth() }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
