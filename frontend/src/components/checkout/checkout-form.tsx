'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckoutFormData } from '@/types';
import { useEffect } from 'react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Phone number is too short')
    .refine((val) => {
      const cleaned = val.replace(/[\s-]/g, '');
      return /^(\+92|0092|92|0)?3[0-9]{9}$/.test(cleaned);
    }, 'Please enter a valid Pakistani mobile number (e.g. 03001234567 or +923001234567)'),
  address: z.string().min(5, 'Please provide a complete delivery address (at least 5 characters)'),
});

interface CheckoutFormProps {
  onSubmit: (data: Omit<CheckoutFormData, 'paymentMethod'>) => void;
  isLoading?: boolean;
  defaultValues?: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

export function CheckoutForm({ onSubmit, isLoading, defaultValues }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<CheckoutFormData, 'paymentMethod'>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      phone: defaultValues?.phone || '',
      address: defaultValues?.address || '',
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset((prev) => ({
        name: prev.name || defaultValues.name || '',
        phone: prev.phone || defaultValues.phone || '',
        address: prev.address || defaultValues.address || '',
      }));
    }
  }, [defaultValues, reset]);

  return (
    <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shipping Details</h2>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Fatima Ahmed"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="03001234567 or +923001234567"
            {...register('phone')}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Complete Delivery Address *</Label>
          <Textarea
            id="address"
            placeholder="House 123, Street 5, DHA Phase 2, Karachi"
            rows={3}
            {...register('address')}
            disabled={isLoading}
          />
          {errors.address && (
            <p className="text-sm font-medium text-destructive">{errors.address.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}
