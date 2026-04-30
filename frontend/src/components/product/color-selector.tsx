'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorSelectorProps {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Select Color</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={cn(
              'relative h-10 w-10 rounded-full border-2 transition-all',
              selectedColor === color
                ? 'border-primary-500 scale-110'
                : 'border-muted hover:border-muted-foreground'
            )}
            style={{ backgroundColor: color }}
            title={color}
          >
            {selectedColor === color && (
              <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
