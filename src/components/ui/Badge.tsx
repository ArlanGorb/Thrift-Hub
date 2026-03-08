import { getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { OrderStatus } from '@/lib/types';

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = 'bg-stone-100 text-stone-700' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      label={getOrderStatusLabel(status)}
      color={getOrderStatusColor(status)}
    />
  );
}

export function ConditionBadge({ condition }: { condition: number }) {
  let color = 'bg-green-100 text-green-800';
  let label = `${condition}/10`;
  if (condition >= 9) {
    color = 'bg-green-100 text-green-800';
    label = `${condition}/10 – Like New`;
  } else if (condition >= 7) {
    color = 'bg-blue-100 text-blue-800';
    label = `${condition}/10 – Great`;
  } else if (condition >= 5) {
    color = 'bg-yellow-100 text-yellow-800';
    label = `${condition}/10 – Good`;
  } else {
    color = 'bg-orange-100 text-orange-800';
    label = `${condition}/10 – Fair`;
  }
  return <Badge label={label} color={color} />;
}
