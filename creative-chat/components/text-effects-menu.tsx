'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TextEffectsMenuProps {
  onApplyEffect: (effect: TextEffect) => void;
}

export type TextEffect = {
  type: 'big' | 'loop' | 'flip' | 'emoji' | 'decorate' | 'ascii' | 'emoticon';
  value?: string;
}

export function TextEffectsMenu({ onApplyEffect }: TextEffectsMenuProps) {
  const [selectedEffect, setSelectedEffect] = useState<TextEffect['type'] | null>(null)

  const effects = [
    { type: 'big', label: 'Big text', icon: 'Aa' },
    { type: 'loop', label: 'Loop text', icon: '🔄' },
    { type: 'flip', label: 'Flip text', icon: '⟲' },
    { type: 'emoji', label: 'Emoji text', icon: '😊' },
    { type: 'decorate', label: 'Decorate', icon: '✨' },
    { type: 'ascii', label: 'ASCII Art', icon: '▒' },
    { type: 'emoticon', label: 'Emoticons', icon: '(◕‿◕)' },
  ]

  return (
    <PopoverContent className="w-80">
      <div className="grid grid-cols-3 gap-2 p-2">
        {effects.map((effect) => (
          <Button
            key={effect.type}
            variant="ghost"
            className={cn(
              "flex flex-col items-center justify-center h-20 p-2 hover:bg-muted",
              selectedEffect === effect.type && "bg-muted"
            )}
            onClick={() => {
              setSelectedEffect(effect.type)
              onApplyEffect({ type: effect.type })
            }}
          >
            <span className="text-2xl mb-1">{effect.icon}</span>
            <span className="text-xs text-center">{effect.label}</span>
          </Button>
        ))}
      </div>
    </PopoverContent>
  )
}

