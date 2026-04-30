'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  console.log('🎠 ImageCarousel received images:', images);
  console.log('🎠 Total images:', images?.length || 0);

  const handleThumbnailClick = (index: number) => {
    console.log('👆 Thumbnail clicked:', index);
    setSelectedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[selectedIndex] || '/placeholder.svg'}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnail Grid - Simplified */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all cursor-pointer hover:scale-105 ${
                selectedIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
            >
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
