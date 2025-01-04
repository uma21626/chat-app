'use client'

import { useState } from 'react'
import { PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ColorPaletteProps {
  onSelectColor: (color: string) => void;
}

export function ColorPalette({ onSelectColor }: ColorPaletteProps) {
  const [selectedColor, setSelectedColor] = useState<string>('#000000')

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FF8800', '#8800FF', '#00FF88', '#FF0088', '#88FF00', '#0088FF',
    '#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF'
  ]

  return (
    <PopoverContent className="w-64">
      <div className="p-2">
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                selectedColor === color ? "border-gray-400" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColor(color)
                onSelectColor(color)
              }}
            />
          ))}
        </div>
        <div className="mt-4">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value)
              onSelectColor(e.target.value)
            }}
            className="w-full h-8"
          />
        </div>
      </div>
    </PopoverContent>
  )
}

