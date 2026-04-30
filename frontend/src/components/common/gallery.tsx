'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';

interface InstagramPost {
  id: string;
  imageUrl: string;
  postUrl: string;
  order: number;
}

export function Gallery() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get<any>('/api/instagram-gallery');
        setPosts(response.data || []);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Don't show section if no posts
  if (!isLoading && posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-beige-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Follow Us on Instagram</h2>
          <p className="text-muted-foreground">
            Get inspired by our community @veilvogue
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <Image
                  src={post.imageUrl}
                  alt="Instagram post"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                  quality={75}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
