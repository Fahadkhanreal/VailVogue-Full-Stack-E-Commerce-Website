'use client';

import { PaymentMethod } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PAYMENT_METHODS } from '@/lib/constants';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentSelector({ value, onChange, disabled }: PaymentSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as PaymentMethod)}
        disabled={disabled}
      >
        {PAYMENT_METHODS.map((method) => (
          <div key={method.id} className="flex items-center space-x-2">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="cursor-pointer">
              {method.name}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
