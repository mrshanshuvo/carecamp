import React from 'react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';
import { Button } from '@/components/ui/button';

const CampTable = ({ camps, onPay, onCancel, onFeedback }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#495E57] dark:bg-slate-950 text-white font-bold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4 text-left">Camp Info</th>
              <th className="px-5 py-4 text-center">Fees</th>
              <th className="px-5 py-4 text-left">Participant</th>
              <th className="px-5 py-4 text-center">Payment</th>
              <th className="px-5 py-4 text-center">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {camps.map((camp) => {
              const participant = camp.participants[0];
              return (
                <tr
                  key={camp._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-5 py-4 text-left">
                    <div className="mb-1">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{camp.name}</p>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {format(new Date(camp.dateTime), 'MMM d, yyyy h:mm a')} • {camp.location}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-bold text-center text-slate-900 dark:text-slate-100">
                    ${camp.fees}
                  </td>

                  <td className="px-5 py-4 text-left">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {participant?.participantName || 'N/A'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Registered:{' '}
                      {format(new Date(participant?.registrationDate || Date.now()), 'MMM d, yyyy')}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <StatusBadge status={participant?.paymentStatus} />
                  </td>

                  <td className="px-5 py-4 text-center font-medium capitalize text-slate-600 dark:text-slate-300">
                    {participant?.confirmationStatus || 'Pending'}
                  </td>

                  <td className="px-5 py-4 text-center whitespace-nowrap space-x-2">
                    {participant?.paymentStatus !== 'Paid' ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onPay(camp)}
                          className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs px-3 py-1.5 h-auto rounded-xl hover:opacity-90 transition cursor-pointer border-none"
                        >
                          Pay Now
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onCancel(camp._id)}
                          className="font-bold text-xs px-3 py-1.5 h-auto rounded-xl cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!camp.hasFeedback) {
                            onFeedback(camp);
                          }
                        }}
                        disabled={camp.hasFeedback}
                        variant={camp.hasFeedback ? 'secondary' : 'default'}
                        className={`font-bold text-xs px-3 py-1.5 h-auto rounded-xl cursor-pointer ${
                          camp.hasFeedback
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-none'
                            : 'bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 border-none'
                        }`}
                      >
                        {camp.hasFeedback ? 'Feedback Submitted' : 'Give Feedback'}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampTable;
