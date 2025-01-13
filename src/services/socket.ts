import { io } from 'socket.io-client'
import { Question } from '../types/question'

const socket = io('https://intervue-poll-backend.vercel.app')

export const socketService = {
  connectAsStudent: (studentId: string, name: string) => {
    socket.emit('student_join', { studentId, name })
  },

  emitNewQuestion: (question: Question) => {
    socket.emit('new_question', question)
  },

  submitAnswer: (answer: { questionId: string; answerId: number }) => {
    socket.emit('submit_answer', answer)
  },
  
  onQuestionReceived: (callback: (question: Question) => void) => {
    socket.on('new_question', callback)
  },
  
  onResponseUpdate: (callback: (data: any) => void) => {
    socket.on('response_update', callback)
  },

  offResponseUpdate: (callback: (data: any) => void) => {
    socket.off('response_update', callback)
  },

  getPollHistory: () => {
    socket.emit('get_poll_history')
  },

  onPollHistory: (callback: (data: any) => void) => {
    socket.on('poll_history', callback)
  },

  offPollHistory: (callback: (data: any) => void) => {
    socket.off('poll_history', callback)
  },// Existing methods...

  sendMessage: (data: { questionId: string; message: string; sender: string; role: string }) => {
    socket.emit('send_message', data)
  },

  onNewMessage: (callback: (message: any) => void) => {
    socket.on('new_message', callback)
  },

  offNewMessage: (callback: (message: any) => void) => {
    socket.off('new_message', callback)
  },

  onChatHistory: (callback: (messages: any[]) => void) => {
    socket.on('chat_history', callback)
  },

  offChatHistory: (callback: (messages: any[]) => void) => {
    socket.off('chat_history', callback)
  },

  onParticipantsUpdate: (callback: (participants: any[]) => void) => {
    socket.on('participants_update', callback)
  },

  offParticipantsUpdate: (callback: (participants: any[]) => void) => {
    socket.off('participants_update', callback)
  },

  onKickedOut: (callback: () => void) => {
    socket.on('kicked_out', callback)
  },
  offKickedOut: (callback: () => void) => {
    socket.off('kicked_out', callback)
  },

  kickStudent: (data: { studentId: string }) => {
    socket.emit('kick_student', data)
  }
}

