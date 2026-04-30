'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckoutFormData } from '@/types';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^03\d{9}$/, 'Invalid Pakistani phone number (e.g., 03001234567)'),
  address: z.string().min(10, 'Please provide complete address'),
});

interface CheckoutFormProps {
  onSubmit: (data: Omit<CheckoutFormData, 'paymentMethod'>) => void;
  isLoading?: boolean;
}

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<CheckoutFormData, 'paymentMethod'>>({
    resolver: zodResolver(checkoutSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shipping Details</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Fatima Ahmed"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="03001234567"
            {...register('phone')}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Complete Address</Label>
          <Textarea
            id="address"
            placeholder="House 123, Street 5, DHA Phase 2, Karachi"
            rows={3}
            {...register('address')}
            disabled={isLoading}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}
