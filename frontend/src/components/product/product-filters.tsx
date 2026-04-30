'use client';

import { useState } from 'react';
import { Category, Size } from '@/types';
import { CATEGORIES, SIZES } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ProductFiltersProps {
  onFilterChange: (filters: {
    categories: Category[];
    sizes: Size[];
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleCategoryChange = (category: Category, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    setSelectedCategories(updated);
    onFilterChange({
      categories: updated,
      sizes: selectedSizes,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleSizeChange = (size: Size, checked: boolean) => {
    const updated = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter((s) => s !== size);
    setSelectedSizes(updated);
    onFilterChange({
      categories: selectedCategories,
      sizes: updated,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handlePriceChange = () => {
    onFilterChange({
      categories: selectedCategories,
      sizes: selectedSizes,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({
      categories: [],
      sizes: [],
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear All
        </Button>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Category</Label>
        {CATEGORIES.map((category) => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.name)}
              onCheckedChange={(checked) =>
                handleCategoryChange(category.name, checked as boolean)
              }
            />
            <label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Price Range (PKR)</Label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Size</Label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                handleSizeChange(size, !selectedSizes.includes(size))
              }
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
