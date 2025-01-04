'use client'

import { Message } from '../types/chat'
import { motion, useMotionValue } from 'framer-motion'
import { useRef, useEffect } from 'react'

interface DraggableMessageProps {
  message: Message;
  onDragStart: () => void;
  onDragEnd: (position: { x: number; y: number }) => void;
  isDragging: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function DraggableMessage({ message, onDragStart, onDragEnd, isDragging, containerRef }: DraggableMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(message.position?.x || 0)
  const y = useMotionValue(message.position?.y || 0)

  useEffect(() => {
    if (message.position) {
      x.set(message.position.x)
      y.set(message.position.y)
    }
  }, [message.position, x, y])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <motion.div
      ref={messageRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={onDragStart}
      onDragEnd={() => {
        const newX = x.get()
        const newY = y.get()
        onDragEnd({ x: newX, y: newY })
      }}
      dragConstraints={containerRef}
      style={{ x, y }}
      className={`absolute ${isDragging ? 'z-50' : 'z-0'}`}
    >
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-500 mb-1">
          {formatTime(message.timestamp)}
        </span>
        <div 
          className={`rounded-lg p-3 max-w-[300px] cursor-move ${
            message.sender === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          } ${isDragging ? 'shadow-lg scale-105' : ''}`}
          style={{
            color: message.style?.color,
            transition: 'all 0.2s ease',
          }}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  )
}

