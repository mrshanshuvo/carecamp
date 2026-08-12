import React, { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Button } from '@/components/ui/button';

const CampCard = ({ camp, onPay, onCancel, onFeedback, feedbackDisabled, isCancelling }) => {
  const [expanded, setExpanded] = useState(false);
  const participant = camp.participants[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{camp.name}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {format(new Date(camp.dateTime), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {expanded && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {camp.location}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fees:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">${camp.fees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Participant:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {participant?.participantName || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Payment:</span>
              <StatusBadge status={participant?.paymentStatus} />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-slate-950 flex gap-2">
        {participant?.paymentStatus !== 'Paid' ? (
          <>
            <Button
              size="sm"
              onClick={() => onPay(camp)}
              className="flex-1 bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2 h-auto rounded-xl border-none"
            >
              Pay Now
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isCancelling}
              onClick={() => onCancel(camp._id)}
              className="flex-1 font-bold text-xs py-2 h-auto rounded-xl"
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            onClick={() => onFeedback(camp)}
            disabled={feedbackDisabled}
            className={`w-full font-bold text-xs py-2 h-auto rounded-xl border-none ${
              feedbackDisabled
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950'
            }`}
          >
            {feedbackDisabled ? 'Feedback Submitted' : 'Give Feedback'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CampCard;
