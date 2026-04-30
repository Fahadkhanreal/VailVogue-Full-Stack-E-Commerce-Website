import { CartItem } from '@/types';

export interface WhatsAppOrderData {
  items: CartItem[];
  total: number;
  customerName?: string;
  customerPhone?: string;
}

export function generateWhatsAppLink(orderDetails: WhatsAppOrderData): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  const message = `
*New Order from VeilVogue*

${orderDetails.items.map(item =>
  `• ${item.name} (${item.size}${item.color ? `, ${item.color}` : ''}) x${item.quantity} - Rs. ${item.price * item.quantity}`
).join('\n')}

*Total: Rs. ${orderDetails.total}*

${orderDetails.customerName ? `Name: ${orderDetails.customerName}\n` : ''}${orderDetails.customerPhone ? `Phone: ${orderDetails.customerPhone}\n` : ''}
Please confirm my order. Thank you!
  `.trim();

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
