import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  orderId: string;
  orderTotal: number;
  customerName?: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function WhatsAppButton({
  orderId,
  orderTotal,
  customerName,
  className,
  size = 'default',
}: WhatsAppButtonProps) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  const generateWhatsAppMessage = () => {
    const message = `Hello VeilVogue!

I have a question about my order:

*Order ID:* ${orderId.slice(0, 8)}
*Total Amount:* Rs. ${orderTotal.toLocaleString()}
${customerName ? `*Customer Name:* ${customerName}` : ''}

Please assist me with this order.`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant="default"
      size={size}
      className={cn('bg-green-600 hover:bg-green-700', className)}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      Contact via WhatsApp
    </Button>
  );
}
