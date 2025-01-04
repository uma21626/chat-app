'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from './types/chat'
import { useMessages } from './hooks/useMessages'
import { DraggableMessage } from './components/draggable-message'
import { TextEffectsMenu, TextEffect } from './components/text-effects-menu'
import { ColorPalette } from './components/color-palette'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { Mic, ImageIcon, Video, Send, BrushIcon as Draw, Type, ArrowLeft, MoreVertical, Palette } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Chat() {
  const { 
    messages, 
    sendMessage, 
    updateMessagePosition,
    draggedMessageId,
    setDraggedMessageId 
  } = useMessages()
  const [input, setInput] = useState('')
  const [textStyle, setTextStyle] = useState({
    effect: null as TextEffect | null,
    color: '#000000',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const chatAreaRef = useRef<HTMLDivElement>(null)

  const chatPartner = {
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40"
  }

  useEffect(() => {
    const chatArea = chatAreaRef.current
    if (chatArea && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (!lastMessage.position) {
        updateMessagePosition(lastMessage.id, {
          x: chatArea.clientWidth / 2 - 150,
          y: chatArea.clientHeight / 2
        })
      }
    }
  }, [messages, updateMessagePosition])

  const applyTextEffect = (text: string, effect: TextEffect): string => {
    switch (effect.type) {
      case 'big':
        return text.toUpperCase()
      case 'loop':
        return `🔄 ${text} 🔄`
      case 'flip':
        return text.split('').reverse().join('')
      case 'emoji':
        return `${text} 😊`
      case 'decorate':
        return `✨ ${text} ✨`
      case 'ascii':
        return `▒${text}▒`
      case 'emoticon':
        return `(◕‿◕) ${text}`
      default:
        return text
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    
    const content = textStyle.effect 
      ? applyTextEffect(input, textStyle.effect)
      : input

    sendMessage({
      content,
      type: 'text',
      sender: 'user',
      style: {
        color: textStyle.color,
      }
    })
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDragStart = (messageId: string) => {
    setDraggedMessageId(messageId)
  }

  const handleDragEnd = (messageId: string, position: { x: number; y: number }) => {
    setDraggedMessageId(null)
    updateMessagePosition(messageId, position)
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={chatPartner.avatar} alt={chatPartner.name} />
          <AvatarFallback>{chatPartner.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{chatPartner.name}</h1>
          <p className="text-sm text-gray-500">Online</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div 
        ref={chatAreaRef}
        className="flex-1 relative overflow-hidden p-4"
      >
        {messages.map((message) => (
          <DraggableMessage
            key={message.id}
            message={message}
            onDragStart={() => handleDragStart(message.id)}
            onDragEnd={(position) => handleDragEnd(message.id, position)}
            isDragging={draggedMessageId === message.id}
            containerRef={chatAreaRef}
          />
        ))}
      </div>

      {/* Drawing Canvas */}
      {isDrawing && (
        <div className="p-4 border-t">
          <canvas
            ref={canvasRef}
            className="w-full h-40 border rounded-lg bg-white"
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={() => setIsDrawing(false)}>Send Drawing</Button>
            <Button variant="outline" onClick={() => setIsDrawing(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 space-y-2 bg-white">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <TextEffectsMenu 
              onApplyEffect={(effect) => setTextStyle(prev => ({ ...prev, effect }))}
            />
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <ColorPalette
              onSelectColor={(color) => setTextStyle(prev => ({ ...prev, color }))}
            />
          </Popover>
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Draw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            style={{
              color: textStyle.color,
            }}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={(e) => {
          // Handle file upload
          console.log('File selected:', e.target.files?.[0])
        }}
      />
    </div>
  )
}

