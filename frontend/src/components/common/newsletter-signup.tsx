'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-12 text-center text-white">
        <Mail className="h-12 w-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and fashion tips.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-foreground"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        <p className="text-sm mt-4 opacity-75">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
