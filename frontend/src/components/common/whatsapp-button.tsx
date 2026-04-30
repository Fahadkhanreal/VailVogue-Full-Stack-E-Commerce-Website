'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateWhatsAppLink, WhatsAppOrderData } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  orderData: WhatsAppOrderData;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  orderData,
  variant = 'outline',
  size = 'default',
  className,
  children,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const whatsappLink = generateWhatsAppLink(orderData);
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn('gap-2', className)}
    >
      <MessageCircle className="h-4 w-4" />
      {children || 'Order via WhatsApp'}
    </Button>
  );
}
