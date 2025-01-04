'use client'

import { useState, useCallback } from 'react'
import { Message } from '../types/chat'

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [draggedMessageId, setDraggedMessageId] = useState<string | null>(null)

  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date()
    }])
  }, [])

  const updateMessagePosition = useCallback((id: string, position: { x: number; y: number }) => {
    setMessages(prev => prev.map(message => 
      message.id === id ? { ...message, position } : message
    ))
  }, [])

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id))
  }, [])

  return { 
    messages, 
    sendMessage, 
    deleteMessage, 
    updateMessagePosition,
    draggedMessageId,
    setDraggedMessageId
  }
}

