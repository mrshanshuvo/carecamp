import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Paid':
      return (
        <Badge className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle size={12} />
          Paid
        </Badge>
      );
    case 'Pending':
      return (
        <Badge className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock size={12} />
          Pending
        </Badge>
      );
    default:
      return (
        <Badge className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertCircle size={12} />
          Unpaid
        </Badge>
      );
  }
};

export default StatusBadge;
