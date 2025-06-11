import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ThemeProvider from "@/components/theme-provider" // Assumed to be part of default v0 project

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TranscribeAI - YouTube Video Transcription & Analysis",
  description: "Extract and analyze YouTube video transcripts with AI-powered insights",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
