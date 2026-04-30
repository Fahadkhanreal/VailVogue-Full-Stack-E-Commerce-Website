'use client';

import { ProductSortOption } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductSortProps {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={value} onValueChange={(val) => {
        if (val) onChange(val as ProductSortOption);
      }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
