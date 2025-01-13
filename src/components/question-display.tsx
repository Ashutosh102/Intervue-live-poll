'use client'

import { useState, useEffect } from 'react'
import { Question, Answer } from '../types/question'
import { CountdownTimer } from './countdown-timer'
import { socketService } from '../services/socket'
import { Button } from '@/components/ui/button'
import { ChatDialog } from './chat-dialog'
import { KickedOutScreen } from './kicked-out-screen'
import { MessageSquare } from 'lucide-react'

interface QuestionDisplayProps {
  question: Question
  userName: string
  onSubmit: () => void
}

interface AnswerPercentage {
  answerId: number
  percentage: number
}

export function QuestionDisplay({ question, userName, onSubmit }: QuestionDisplayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [percentages, setPercentages] = useState<AnswerPercentage[]>([])
  const [showChat, setShowChat] = useState(false)
  const [isKickedOut, setIsKickedOut] = useState(false)

  useEffect(() => {
    const handleResponseUpdate = (data: {
      questionId: string
      percentages: AnswerPercentage[]
    }) => {
      if (data.questionId === question.id) {
        setPercentages(data.percentages)
      }
    }

    const handleKickedOut = () => {
      setIsKickedOut(true)
    }

    socketService.onResponseUpdate(handleResponseUpdate)
    socketService.onKickedOut(handleKickedOut)

    return () => {
      socketService.offResponseUpdate(handleResponseUpdate)
    }
  }, [question.id])

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      socketService.submitAnswer({
        questionId: question.id,
        answerId: selectedAnswer
      })
      setShowResults(true)
      onSubmit()
    }
  }

  if (isKickedOut) {
    return <KickedOutScreen />
  }

  const getPercentageForAnswer = (answerId: number) => {
    const result = percentages.find(p => p.answerId === answerId)
    console.log(result)
    return result?.percentage || 0
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Question {question.id}</h2>
        <CountdownTimer
          initialSeconds={question.timeLimit}
          onTimeUp={handleSubmit}
        />
      </div>

      {/* Question */}
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium">{question.text}</h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <div
            key={answer.id}
            onClick={() => !showResults && setSelectedAnswer(answer.id)}
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all
              ${
                selectedAnswer === answer.id
                  ? 'border-2 border-purple-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  selectedAnswer === answer.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }
              `}
            >
              {index + 1}
            </div>
            <span className="flex-1">{answer.text}</span>
            {showResults && (
              <span className="font-medium">{getPercentageForAnswer(answer.id)}%</span>
            )}
            {showResults && (
              <div className="absolute left-0 h-full bg-purple-100" style={{
                width: `${getPercentageForAnswer(answer.id)}%`,
                zIndex: -1
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      {!showResults && (
        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-full"
          >
            Submit
          </Button>
        </div>
      )}

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
        userName={userName}
        userRole="student"
      />
    </div>
  )
}

