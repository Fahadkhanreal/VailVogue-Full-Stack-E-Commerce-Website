import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const statusConfig = {
    PENDING: {
      label: 'Pending',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    },
    CONFIRMED: {
      label: 'Confirmed',
      variant: 'default' as const,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    },
    SHIPPED: {
      label: 'Shipped',
      variant: 'default' as const,
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
    },
    DELIVERED: {
      label: 'Delivered',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 hover:bg-green-100',
    },
    CANCELLED: {
      label: 'Cancelled',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
