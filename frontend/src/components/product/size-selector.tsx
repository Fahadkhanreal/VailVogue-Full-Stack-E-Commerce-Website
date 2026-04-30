'use client';

import { Size } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize?: Size;
  onSizeSelect: (size: Size) => void;
}

export function SizeSelector({ sizes, selectedSize, onSizeSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Select Size</label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSizeSelect(size)}
            className={cn(
              'min-w-[3rem]',
              selectedSize === size && 'bg-primary-500 hover:bg-primary-600'
            )}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}
