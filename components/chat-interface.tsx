"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Loader2, Lightbulb, RefreshCw, Sparkles } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  compact?: boolean
}

export function ChatInterface({ compact = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI financial assistant. How can I help you with market analysis or investment advice today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    if (!compact) {
      inputRef.current?.focus()
    }
  }, [compact])

  // Sample responses for demo purposes
  const sampleResponses = [
    "Based on recent market trends, technology stocks have shown resilience despite broader market volatility. Companies with strong balance sheets and consistent revenue growth are positioned well for the coming quarter.",
    "When analyzing your portfolio allocation, consider diversifying across sectors to mitigate risk. The current economic indicators suggest maintaining a balanced approach between growth and value investments.",
    "The recent Federal Reserve announcements may impact interest rates in the coming months. This could affect bond yields and potentially create opportunities in dividend-paying stocks as investors seek income alternatives.",
    "Looking at technical indicators for Bitcoin, the current support levels appear to be holding. However, cryptocurrency markets remain highly volatile and should represent only a portion of a diversified portfolio based on your risk tolerance.",
    "Market sentiment indicators are showing mixed signals currently. Institutional investors are cautiously optimistic, while retail sentiment has been more bearish. This divergence often precedes market adjustments.",
    "When considering long-term investment strategies, focus on companies with sustainable competitive advantages and strong management teams. These factors tend to outweigh short-term market fluctuations over extended periods.",
  ]

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Select a random response or generate one based on the input
    let responseText = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]

    // Add some context based on the user's question
    if (input.toLowerCase().includes("bitcoin") || input.toLowerCase().includes("crypto")) {
      responseText = "Cryptocurrency markets are showing increased volatility lately. " + responseText
    } else if (input.toLowerCase().includes("stock") || input.toLowerCase().includes("nasdaq")) {
      responseText = "The stock market has been responding to recent economic data. " + responseText
    } else if (input.toLowerCase().includes("portfolio") || input.toLowerCase().includes("invest")) {
      responseText =
        "When evaluating your investment strategy, it's important to consider your time horizon and risk tolerance. " +
        responseText
    }

    // Add AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMessage])
    setIsLoading(false)
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full bg-black/30 border border-[#00DC82]/40 rounded-lg shadow-lg shadow-[#00DC82]/10">
      {/* Chat header */}
      <div className="p-3 border-b border-[#00DC82]/30 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
            <Bot className="h-4 w-4 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Financial Assistant</h3>
            <p className="text-xs text-white/70">Ask me anything about markets or investments</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/30">
                <Bot className="h-5 w-5 text-black" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-[#00DC82] text-black rounded-br-none shadow-lg shadow-[#00DC82]/20"
                  : "bg-[#00DC82]/10 text-white rounded-bl-none border border-[#00DC82]/30 shadow-lg shadow-[#00DC82]/10"
              }`}
            >
              <div className="text-base font-medium">{message.content}</div>
              <div
                className={`text-[10px] mt-1 text-right ${message.role === "user" ? "text-black/70" : "text-white/50"}`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
            {message.role === "user" && (
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center shadow-lg shadow-black/20">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-end gap-2">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/30">
              <Bot className="h-5 w-5 text-black" />
            </div>
            <div className="bg-[#00DC82]/10 rounded-2xl rounded-bl-none px-4 py-3 max-w-[80%] border border-[#00DC82]/30 shadow-lg shadow-[#00DC82]/10">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#00DC82]" />
                <span className="text-sm text-white">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-[#00DC82]/30 p-4 bg-black/30">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ask about market trends, portfolio advice, or predictions..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-white/10 border-[#00DC82]/30 text-white placeholder:text-white/50 h-11 text-base focus-visible:ring-[#00DC82]/30"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className={`shrink-0 h-11 w-11 ${
              isLoading || !input.trim()
                ? "bg-white/10 text-white/50"
                : "bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:opacity-90 shadow-md shadow-[#00DC82]/20"
            }`}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-2 px-1">
          <div className="flex items-center gap-1 text-xs text-white/70">
            <Sparkles className="h-3 w-3 text-[#00DC82]" />
            <span>Type your question and press Enter</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-[#00DC82]/10 hover:text-white"
              onClick={() => {
                setMessages([
                  {
                    id: "welcome",
                    role: "assistant",
                    content:
                      "Hello! I'm your AI financial assistant. How can I help you with market analysis or investment advice today?",
                    timestamp: new Date(),
                  },
                ])
              }}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-[#00DC82]/10 hover:text-white"
              onClick={() => {
                // Add a sample tip
                const tips = [
                  "Try asking about recent market trends in technology stocks.",
                  "You can ask me to analyze your portfolio allocation strategy.",
                  "Ask about the potential impact of recent economic indicators on your investments.",
                  "I can help explain complex financial concepts in simple terms.",
                  "Ask me to compare different investment vehicles like ETFs vs. individual stocks.",
                ]
                const tip = tips[Math.floor(Math.random() * tips.length)]

                const tipMessage: Message = {
                  id: Date.now().toString(),
                  role: "assistant",
                  content: `💡 Tip: ${tip}`,
                  timestamp: new Date(),
                }
                setMessages((prev) => [...prev, tipMessage])
              }}
            >
              <Lightbulb className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

