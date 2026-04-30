'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-12 text-center text-white">
        <Sparkles className="h-12 w-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Style?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Discover our exclusive collection of modest fashion designed for the modern woman.
          Quality, elegance, and comfort in every piece.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 h-auto"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/shop?featured=true">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 h-auto bg-white/10 border-white text-white hover:bg-white/20"
            >
              View Featured
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
