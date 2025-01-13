'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { socketService } from '../services/socket'
import { MessageSquare, Users } from 'lucide-react'

interface ChatMessage {
  id: string
  message: string
  sender: string
  role: 'teacher' | 'student'
  timestamp: string
}

interface Participant {
  name: string
  socketId: string
}

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questionId: string
  userName: string
  userRole: 'teacher' | 'student'
}

export function ChatDialog({ open, onOpenChange, questionId, userName, userRole }: ChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleNewMessage = (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  
    const handleChatHistory = (history: ChatMessage[]) => {
      setMessages(history)
    }
  
    const handleParticipantsUpdate = (updatedParticipants: Participant[]) => {
      setParticipants(updatedParticipants)
    }
  
    const handleKickedOut = () => {
      alert('You have been kicked out.')
      onOpenChange(false) // Close the dialog or handle as needed
    }
  
    socketService.onNewMessage(handleNewMessage)
    socketService.onChatHistory(handleChatHistory)
    socketService.onParticipantsUpdate(handleParticipantsUpdate)
    socketService.onKickedOut(handleKickedOut)
  
    return () => {
      socketService.offNewMessage(handleNewMessage)
      socketService.offChatHistory(handleChatHistory)
      socketService.offParticipantsUpdate(handleParticipantsUpdate)
      socketService.offKickedOut(handleKickedOut)
    }
  }, [])
  

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socketService.sendMessage({
        questionId,
        message: newMessage.trim(),
        sender: userName,
        role: userRole
      })
      setNewMessage('')
    }
  }

  const handleKickStudent = (socketId: string) => {
    socketService.kickStudent({ studentId: socketId })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === userName ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.sender === userName
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">{msg.sender}</p>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </TabsContent>
          <TabsContent value="participants" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div
                    key={participant.socketId}
                    className="flex items-center justify-between py-2"
                  >
                    <span>{participant.name}</span>
                    {userRole === 'teacher' && (
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleKickStudent(participant.socketId)}
                      >
                        Kick out
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

