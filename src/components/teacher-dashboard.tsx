'use client'

import { useState } from 'react'
import { Question, Answer } from '../types/question'
import { socketService } from '../services/socket'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ResultsView } from './results-view'

export function TeacherDashboard() {
  const [question, setQuestion] = useState('')
  const [timeLimit, setTimeLimit] = useState('60')
  const [answers, setAnswers] = useState<Answer[]>([
    { id: 1, text: '', isCorrect: true },
    { id: 2, text: '', isCorrect: false },
  ])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleAddOption = () => {
    setAnswers([...answers, { id: answers.length + 1, text: '', isCorrect: false }])
  }

  const handleAnswerChange = (id: number, text: string) => {
    setAnswers(answers.map(answer =>
      answer.id === id ? { ...answer, text } : answer
    ))
  }

  const handleCorrectAnswer = (id: number) => {
    setAnswers(answers.map(answer =>
      ({ ...answer, isCorrect: answer.id === id })
    ))
  }

  const handleSubmit = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: question,
      timeLimit: parseInt(timeLimit),
      answers,
    }
    socketService.emitNewQuestion(newQuestion)
    setCurrentQuestion(newQuestion)
    setShowResults(true)
    // Reset form
    setQuestion('')
    setTimeLimit('60')
    setAnswers([
      { id: 1, text: '', isCorrect: true },
      { id: 2, text: '', isCorrect: false },
    ])
  }

  const handleNewQuestion = () => {
    setShowResults(false)
    setCurrentQuestion(null)
  }

  if (showResults && currentQuestion) {
    return <ResultsView question={currentQuestion} onNewQuestion={handleNewQuestion} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-white px-4 py-2 rounded-full inline-flex items-center gap-2"
          style={{
            background: 'linear-gradient(90deg, #7765DA, #5767D0, #4F0DCE)'
          }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.2762 8.76363C12.2775 8.96965 12.2148 9.17098 12.0969 9.33992C11.979 9.50887 11.8116 9.63711 11.6178 9.707L8.35572 10.907L7.15567 14.1671C7.08471 14.3604 6.95614 14.5272 6.78735 14.645C6.61855 14.7628 6.41766 14.826 6.21181 14.826C6.00596 14.826 5.80506 14.7628 5.63627 14.645C5.46747 14.5272 5.33891 14.3604 5.26794 14.1671L4.06537 10.9111L0.804778 9.71104C0.611716 9.63997 0.445097 9.5114 0.327404 9.34266C0.20971 9.17392 0.146606 8.97315 0.146606 8.76742C0.146606 8.56169 0.20971 8.36092 0.327404 8.19218C0.445097 8.02345 0.611716 7.89487 0.804778 7.82381L4.06688 6.62376L5.26693 3.36418C5.33799 3.17112 5.46657 3.0045 5.6353 2.88681C5.80404 2.76911 6.00482 2.70601 6.21054 2.70601C6.41627 2.70601 6.61705 2.76911 6.78578 2.88681C6.95452 3.0045 7.08309 3.17112 7.15416 3.36418L8.35421 6.62629L11.6138 7.82633C11.8074 7.8952 11.9749 8.02223 12.0935 8.19003C12.2121 8.35782 12.2759 8.55817 12.2762 8.76363ZM8.73923 2.70024H9.7498V3.71081C9.7498 3.84482 9.80303 3.97334 9.89779 4.06809C9.99255 4.16285 10.1211 4.21609 10.2551 4.21609C10.3891 4.21609 10.5176 4.16285 10.6124 4.06809C10.7071 3.97334 10.7604 3.84482 10.7604 3.71081V2.70024H11.7709C11.9049 2.70024 12.0335 2.64701 12.1282 2.55225C12.223 2.45749 12.2762 2.32897 12.2762 2.19496C12.2762 2.06095 12.223 1.93243 12.1282 1.83767C12.0335 1.74291 11.9049 1.68968 11.7709 1.68968H10.7604V0.679111C10.7604 0.545101 10.7071 0.416581 10.6124 0.321822C10.5176 0.227063 10.3891 0.173828 10.2551 0.173828C10.1211 0.173828 9.99255 0.227063 9.89779 0.321822C9.80303 0.416581 9.7498 0.545101 9.7498 0.679111V1.68968H8.73923C8.60522 1.68968 8.4767 1.74291 8.38194 1.83767C8.28718 1.93243 8.23395 2.06095 8.23395 2.19496C8.23395 2.32897 8.28718 2.45749 8.38194 2.55225C8.4767 2.64701 8.60522 2.70024 8.73923 2.70024ZM14.2973 4.72137H13.7921V4.21609C13.7921 4.08208 13.7388 3.95356 13.6441 3.8588C13.5493 3.76404 13.4208 3.71081 13.2868 3.71081C13.1528 3.71081 13.0242 3.76404 12.9295 3.8588C12.8347 3.95356 12.7815 4.08208 12.7815 4.21609V4.72137H12.2762C12.1422 4.72137 12.0137 4.77461 11.9189 4.86937C11.8242 4.96412 11.7709 5.09264 11.7709 5.22665C11.7709 5.36066 11.8242 5.48918 11.9189 5.58394C12.0137 5.6787 12.1422 5.73194 12.2762 5.73194H12.7815V6.23722C12.7815 6.37123 12.8347 6.49975 12.9295 6.59451C13.0242 6.68927 13.1528 6.7425 13.2868 6.7425C13.4208 6.7425 13.5493 6.68927 13.6441 6.59451C13.7388 6.49975 13.7921 6.37123 13.7921 6.23722V5.73194H14.2973C14.4313 5.73194 14.5599 5.6787 14.6546 5.58394C14.7494 5.48918 14.8026 5.36066 14.8026 5.22665C14.8026 5.09264 14.7494 4.96412 14.6546 4.86937C14.5599 4.77461 14.4313 4.72137 14.2973 4.72137Z" fill="white" />
            </svg>
            <span className="font-semibold">Intervue Poll</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Let's Get Started</h1>
        <p className="text-gray-600">
          You'll have the ability to create and manage polls, ask questions, and monitor
          your students' responses in real-time.
        </p>
      </div>

      {/* Question Form */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Enter your question</h2>
          <Select value={timeLimit} onValueChange={setTimeLimit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
              <SelectItem value="90">90 seconds</SelectItem>
              <SelectItem value="120">120 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here"
          className="mb-8"
        />

        <div className="space-y-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Edit Options</h3>
            <h3 className="text-lg font-medium">Is it Correct?</h3>
          </div>

          {answers.map((answer, index) => (
            <div key={answer.id} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                {index + 1}
              </div>
              <Input
                value={answer.text}
                onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                placeholder="Enter answer option"
                className="flex-1"
              />
              <RadioGroup
                value={answer.isCorrect ? "yes" : "no"}
                onValueChange={(value) => handleCorrectAnswer(answer.id)}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id={`yes-${answer.id}`} />
                  <Label htmlFor={`yes-${answer.id}`}>Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id={`no-${answer.id}`} />
                  <Label htmlFor={`no-${answer.id}`}>No</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <Button
          onClick={handleAddOption}
          variant="outline"
          className="mt-4 text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          + Add More option
        </Button>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            disabled={!question || answers.some(a => !a.text)}
          >
            Ask Question
          </Button>
        </div>
      </div>
    </div>
  )
}

