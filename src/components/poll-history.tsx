'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Question } from '../types/question'
import { socketService } from '../services/socket'

interface PollHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface QuestionWithResults extends Question {
  results: Array<{
    answerId: number
    percentage: number
  }>
  totalResponses: number
}

export function PollHistory({ open, onOpenChange }: PollHistoryProps) {
  const [history, setHistory] = useState<QuestionWithResults[]>([])

  useEffect(() => {
    if (open) {
      socketService.getPollHistory()
      
      const handleHistory = (data: QuestionWithResults[]) => {
        setHistory(data)
      }
      
      socketService.onPollHistory(handleHistory)
      
      return () => {
        socketService.offPollHistory(handleHistory)
      }
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">View Poll History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-8">
            {history.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-800 text-white p-4">
                    <h4 className="text-lg font-medium">{question.text}</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    {question.answers.map((answer, answerIndex) => {
                      const result = question.results.find(r => r.answerId === answer.id)
                      const percentage = result?.percentage || 0
                      
                      return (
                        <div key={answer.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                {answerIndex + 1}
                              </div>
                              <span className="font-medium">{answer.text}</span>
                            </div>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

