'use client'

import { useState, useEffect } from 'react'
import { Question } from '../types/question'
import { socketService } from '../services/socket'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { PollHistory } from './poll-history'
import { MessageSquare } from 'lucide-react'
import { ChatDialog } from './chat-dialog'

interface ResultsViewProps {
  question: Question
  onNewQuestion: () => void
}

interface AnswerPercentage {
  answerId: number
  percentage: number
}

export function ResultsView({ question, onNewQuestion }: ResultsViewProps) {
  const [percentages, setPercentages] = useState<AnswerPercentage[]>([])
  const [totalResponses, setTotalResponses] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const handleResponseUpdate = (data: { 
      questionId: string
      percentages: AnswerPercentage[]
      totalResponses: number 
    }) => {
      if (data.questionId === question.id) {
        setPercentages(data.percentages)
        setTotalResponses(data.totalResponses)
      }
    }
    console.log(percentages)
    socketService.onResponseUpdate(handleResponseUpdate)

    return () => {
      socketService.offResponseUpdate(handleResponseUpdate)
    }
  }, [question.id])
  
  const getPercentageForAnswer = (answerId: number) => {
    const result = percentages.find(p => p.answerId === answerId)
    return result?.percentage || 0
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Question</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowHistory(true)}
        >
          <Eye className="w-5 h-5" />
          View Poll history
        </Button>
      </div>

      {/* Question Card */}
      <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gray-800 text-white p-4">
          <h2 className="text-lg font-medium">{question.text}</h2>
        </div>

        <div className="p-4 space-y-4">
          {question.answers.map((answer, index) => (
            <div key={answer.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span className="font-medium">{answer.text}</span>
                </div>
                <span className="font-medium">{getPercentageForAnswer(answer.id)}%</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${getPercentageForAnswer(answer.id)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Question Button */}
      <div className="flex justify-end">
        <Button
          onClick={onNewQuestion}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          + Ask a new question
        </Button>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <ChatDialog
        open={showChat}
        onOpenChange={setShowChat}
        questionId={question.id}
        userName="teacher"
        userRole="teacher"
      />
      <PollHistory 
        open={showHistory} 
        onOpenChange={setShowHistory} 
      />
    </div>
  )
}

