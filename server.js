import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Store active questions, responses, and connected students
const activeQuestions = new Map()
const questionResponses = new Map()
const connectedStudents = new Map()
const questionHistory = new Map() // Store completed questions with results
const chatMessages = new Map()

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('student_join', ({ studentId, name }) => {
    console.log(`Student ${name} (${studentId}) joined`)
    connectedStudents.set(studentId, { name, socketId: socket.id })
    
    io.emit('participants_update', Array.from(connectedStudents.values()))
    
    const currentQuestion = Array.from(activeQuestions.values())[0]
    if (currentQuestion) {
      socket.emit('new_question', currentQuestion)
      const messages = chatMessages.get(currentQuestion.id) || []
      socket.emit('chat_history', messages)
    }
  })

  socket.on('new_question', (question) => {
    console.log('New question received:', question)
    const questionId = randomUUID()
    const questionWithId = { ...question, id: questionId }
    activeQuestions.set(questionId, questionWithId)
    
    io.emit('new_question', questionWithId)
    
    setTimeout(() => {
      const responses = questionResponses.get(questionId) || []
      const totalResponses = responses.length
      const answerCounts = responses.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1
        return acc
      }, {})

      const percentages = Object.entries(answerCounts).map(([id, count]) => ({
        answerId: parseInt(id, 10),
        percentage: (count / totalResponses) * 100
      }))

      // Store the question results in history
      questionHistory.set(questionId, {
        ...questionWithId,
        results: percentages,
        totalResponses
      })

      activeQuestions.delete(questionId)
      io.emit('question_ended', questionId)
    }, question.timeLimit * 1000)
  })

  socket.on('submit_answer', ({ questionId, answerId }) => {
    const student = Array.from(connectedStudents.values())
      .find(student => student.socketId === socket.id)

    if (student && activeQuestions.has(questionId)) {
      console.log(`Answer received from ${student.name}:`, answerId)

      if (!questionResponses.has(questionId)) {
        questionResponses.set(questionId, [])
      }
      questionResponses.get(questionId).push(answerId)

      const responses = questionResponses.get(questionId)
      const totalResponses = responses.length
      const answerCounts = responses.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1
        return acc
      }, {})

      const percentages = Object.entries(answerCounts).map(([id, count]) => ({
        answerId: parseInt(id, 10),
        percentage: (count / totalResponses) * 100
      }))

      io.emit('response_update', {
        questionId,
        percentages,
        totalResponses
      })
    }
  })

  socket.on('get_poll_history', () => {
    const history = Array.from(questionHistory.values())
    socket.emit('poll_history', history)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    for (const [studentId, student] of connectedStudents.entries()) {
      if (student.socketId === socket.id) {
        connectedStudents.delete(studentId)
        break
      }
    }
  })

  socket.on('send_message', ({ questionId, message, sender, role }) => {
    const newMessage = {
      id: randomUUID(),
      message,
      sender,
      role,
      timestamp: new Date().toISOString()
    }
    
    if (!chatMessages.has(questionId)) {
      chatMessages.set(questionId, [])
    }
    chatMessages.get(questionId).push(newMessage)
    
    io.emit('new_message', newMessage)
  })

  socket.on('kick_student', ({ studentId }) => {
    const student = Array.from(connectedStudents.values()).find(student => student.socketId === studentId)
  
    if (student) {
      console.log(`Student ${student.name} was kicked out`)
      io.to(student.socketId).emit('kicked_out')
      connectedStudents.delete(student.studentId)
      io.emit('participants_update', Array.from(connectedStudents.values()))
    }
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log('Starting Socket.IO server...')


