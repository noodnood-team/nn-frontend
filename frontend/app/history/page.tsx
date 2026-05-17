"use client";

import React, { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { PredictionsResponse } from "@/lib/api-types";
import { History, AlertCircle } from "lucide-react";
import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  const [data, setData] = useState<PredictionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 8;

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const base = getApiBaseUrl();
        const offset = page * limit;
        const response = await fetch(`${base}/api/v1/dashboard/predictions?limit=${limit}&offset=${offset}`);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch predictions history", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, [page]);

  if (loading) {
    return (
      <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] text-[#13202e] p-6 pt-28 overflow-y-auto pb-24">
        <div className="flex items-center gap-4 mb-4 opacity-70 animate-pulse">
          <div className="w-14 h-14 bg-[#13202e] text-[#f2ead6] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_rgba(19,32,46,1)] border-4 border-[#13202e]">
            <History size={28} strokeWidth={3} />
          </div>
          <div className="h-10 w-32 bg-[#13202e] rounded-xl border-4 border-[#13202e]"></div>
        </div>
        
        <div className="mt-6 flex flex-col gap-4 animate-pulse">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="w-full bg-[#f2ead6] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-2xl p-4 flex items-center justify-between opacity-70 h-20">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full border-2 border-[#13202e] bg-[#13202e] opacity-20"></div>
                 <div className="flex flex-col gap-2">
                   <div className="h-4 w-20 bg-[#13202e] opacity-20 rounded"></div>
                   <div className="h-3 w-16 bg-[#3c556b] opacity-20 rounded"></div>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] text-[#13202e] p-6 pt-32 overflow-y-auto items-center">
        <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-sm">
          <div className="w-20 h-20 bg-[#de4b28] text-white rounded-full border-4 border-[#13202e] flex items-center justify-center mb-6 shadow-inner">
            <AlertCircle size={36} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#13202e] mb-2">System Error</h2>
          <p className="text-[#3c556b] font-bold mb-8">Failed to load scan history. The backend server might be unreachable.</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 rounded-xl bg-[#13202e] text-[#f2ead6] font-black uppercase tracking-widest text-lg border-4 border-[#13202e] hover:bg-[#1a2c3f] active:translate-y-1 active:translate-x-1 transition-all">Try Again</button>
        </div>
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] text-[#13202e] p-6 pt-28 overflow-y-auto pb-24">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-[#13202e] text-[#f2ead6] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_rgba(19,32,46,1)] border-4 border-[#13202e]">
          <History size={28} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-[#13202e]">
          History
        </h1>
      </div>

      <HistoryList items={items} />

      {data && data.total > limit && (
        <div className="flex items-center justify-between mt-8 mb-4">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 bg-[#13202e] text-[#f2ead6] border-4 border-[#13202e] rounded-xl font-black uppercase tracking-widest hover:bg-[#1a2c3f] active:translate-y-1 active:translate-x-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:translate-x-0 disabled:pointer-events-none transition-all"
          >
            Prev
          </button>
          
          <span className="font-bold text-[#13202e]">
            Page {page + 1} of {Math.max(1, Math.ceil(data.total / limit))}
          </span>

          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * limit >= data.total}
            className="px-6 py-3 bg-[#13202e] text-[#f2ead6] border-4 border-[#13202e] rounded-xl font-black uppercase tracking-widest hover:bg-[#1a2c3f] active:translate-y-1 active:translate-x-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:translate-x-0 disabled:pointer-events-none transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
