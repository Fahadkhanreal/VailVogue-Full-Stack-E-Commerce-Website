'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/types';

interface CategoryCardProps {
  category: {
    id: string;
    name: Category;
    slug: string;
    image?: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const handleClick = () => {
    window.location.href = `/shop?category=${category.slug}`;
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={category.image || '/placeholder.svg'}
          alt={category.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          loading="lazy"
          quality={75}
          draggable={false}
        />
      </div>
      <CardContent className="p-4 text-center">
        <h3 className="font-semibold text-lg">{category.name}</h3>
      </CardContent>
    </Card>
  );
}
