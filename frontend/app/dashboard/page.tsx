"use client";

import React, { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { DashboardSummary, PredictionsResponse } from "@/lib/api-types";
import { LayoutDashboard, Flame, Beef, Wheat, Droplets, AlertCircle, X, MousePointerClick } from "lucide-react";
import HistoryList from "@/components/HistoryList";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [predictions, setPredictions] = useState<PredictionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showOutcomesModal, setShowOutcomesModal] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 4;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = getApiBaseUrl();
        const offset = page * limit;
        const [summaryRes, predictionsRes] = await Promise.all([
          fetch(`${base}/api/v1/dashboard/summary`),
          fetch(`${base}/api/v1/dashboard/predictions?limit=${limit}&offset=${offset}`)
        ]);

        if (summaryRes.ok && predictionsRes.ok) {
          const [summaryData, predictionsData] = await Promise.all([
            summaryRes.json(),
            predictionsRes.json()
          ]);

          setSummary(summaryData);
          setPredictions(predictionsData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  if (loading && page === 0) {
    return (
      <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] text-[#13202e] p-6 pt-28 overflow-y-auto pb-24">
        <div className="w-full max-w-6xl mx-auto flex flex-col">
          <div className="flex items-center gap-4 mb-8 opacity-70 animate-pulse">
            <div className="w-14 h-14 bg-[#13202e] text-[#f2ead6] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_rgba(19,32,46,1)] border-4 border-[#13202e]">
              <LayoutDashboard size={28} strokeWidth={3} />
            </div>
            <div className="h-10 w-48 bg-[#13202e] rounded-xl border-4 border-[#13202e]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-6 flex flex-col justify-center items-center text-center animate-pulse h-48">
               <div className="h-6 w-32 bg-[#3c556b] opacity-30 rounded-full mb-4"></div>
               <div className="h-16 w-24 bg-[#13202e] opacity-20 rounded-xl mb-4"></div>
            </div>
            <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-6 flex flex-col animate-pulse h-[500px]">
               <div className="h-6 w-32 bg-[#3c556b] opacity-30 rounded-full mb-4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !summary || !predictions) {
    return (
      <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] text-[#13202e] p-6 pt-32 overflow-y-auto items-center">
        <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-sm">
          <div className="w-20 h-20 bg-[#de4b28] text-white rounded-full border-4 border-[#13202e] flex items-center justify-center mb-6 shadow-inner">
            <AlertCircle size={36} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[#13202e] mb-2">System Error</h2>
          <p className="text-[#3c556b] font-bold mb-8">Failed to load dashboard data. The backend server might be unreachable.</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 rounded-xl bg-[#13202e] text-[#f2ead6] font-black uppercase tracking-widest text-lg border-4 border-[#13202e] hover:bg-[#1a2c3f] active:translate-y-1 active:translate-x-1 transition-all">Try Again</button>
        </div>
      </div>
    );
  }

  const hasData = summary.total_requests > 0;

  return (
    <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] text-[#13202e] p-6 pt-28 overflow-y-auto pb-24">
      <div className="w-full max-w-6xl mx-auto flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-[#13202e] text-[#f2ead6] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_rgba(19,32,46,1)] border-4 border-[#13202e]">
            <LayoutDashboard size={28} strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#13202e]">
            Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column: Stats */}
          <div className="flex flex-col gap-6">
            {!hasData ? (
               <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-8 flex flex-col items-center justify-center text-center h-64">
                 <h2 className="text-3xl font-black uppercase tracking-tight text-[#13202e] mb-2">No Fuel Logged</h2>
                 <p className="text-[#3c556b] font-bold text-lg">Scan some food to see your stats!</p>
               </div>
            ) : (
              <>
                <button 
                  onClick={() => setShowOutcomesModal(true)}
                  className="group w-full bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-[#e8dec7] transition-colors active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                   <span className="text-[#3c556b] font-black uppercase tracking-widest text-sm mb-1">Total Scans</span>
                   <span className="text-6xl font-black tracking-tighter text-[#13202e]">{summary.total_requests}</span>
                   <span className="text-[#de4b28] font-bold mt-2 bg-[#de4b28]/20 px-3 py-1 rounded-lg border-2 border-[#de4b28]">{((summary.success_count / summary.total_requests) * 100).toFixed(2)}% Success Rate</span>
                   <div className="flex items-center gap-1.5 mt-4 text-[#3c556b] opacity-80 bg-[#13202e]/5 px-3 py-1.5 rounded-full border-2 border-transparent group-hover:border-[#13202e]/20 transition-all">
                      <MousePointerClick size={16} strokeWidth={2.5} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Tap for Details</span>
                   </div>
                </button>

                <h2 className="text-2xl font-black uppercase tracking-tight text-[#13202e] mt-4 mb-2">Average Fuel</h2>
                
                <div className="flex flex-col gap-3">
                   <div className="bg-[#de4b28] text-white border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-2xl p-4 flex justify-between items-center mb-1">
                      <div className="flex flex-col">
                        <span className="font-black uppercase tracking-widest text-xs opacity-90">Total Calories</span>
                        <span className="text-4xl font-black">{(summary.nutrition_averages?.avg_calories || 0).toFixed(2)}</span>
                      </div>
                      <Flame size={40} strokeWidth={2.5} className="opacity-50" />
                   </div>

                   <div className="grid grid-cols-3 gap-3">
                     <div className="bg-[#b5d5e2] text-[#13202e] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                       <Beef size={20} strokeWidth={2.5} className="mb-1 text-[#de4b28]" />
                       <span className="text-lg font-black leading-none">{(summary.nutrition_averages?.avg_protein || 0).toFixed(2)}g</span>
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-70 mt-1">Pro</span>
                     </div>
                     <div className="bg-[#f2ead6] text-[#13202e] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                       <Wheat size={20} strokeWidth={2.5} className="mb-1 text-[#a88655]" />
                       <span className="text-lg font-black leading-none">{(summary.nutrition_averages?.avg_carbs || 0).toFixed(2)}g</span>
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-70 mt-1">Carb</span>
                     </div>
                     <div className="bg-[#7198ad] text-[#f2ead6] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                       <Droplets size={20} strokeWidth={2.5} className="mb-1 text-[#b5d5e2]" />
                       <span className="text-lg font-black leading-none">{(summary.nutrition_averages?.avg_fat || 0).toFixed(2)}g</span>
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-90 mt-1">Fat</span>
                     </div>
                   </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: History */}
          <div className="flex flex-col relative">
             <div className="flex items-center justify-between mb-4 mt-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-[#13202e]">History</h2>
             </div>
             
             {loading && page > 0 ? (
               <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-6 flex flex-col animate-pulse h-[500px]">
                 <div className="h-6 w-32 bg-[#3c556b] opacity-30 rounded-full mb-4 mx-auto"></div>
               </div>
             ) : (
               <div className="-mt-6">
                 <HistoryList items={predictions.items || []} isAdminDashboard={true} />
               </div>
             )}

             {predictions && predictions.total > limit && (
              <div className="flex items-center justify-between mt-8 mb-4">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-6 py-3 bg-[#13202e] text-[#f2ead6] border-4 border-[#13202e] rounded-xl font-black uppercase tracking-widest hover:bg-[#1a2c3f] active:translate-y-1 active:translate-x-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:translate-x-0 disabled:pointer-events-none transition-all"
                >
                  Prev
                </button>
                
                <span className="font-bold text-[#13202e]">
                  Page {page + 1} of {Math.max(1, Math.ceil(predictions.total / limit))}
                </span>

                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={(page + 1) * limit >= predictions.total}
                  className="px-6 py-3 bg-[#13202e] text-[#f2ead6] border-4 border-[#13202e] rounded-xl font-black uppercase tracking-widest hover:bg-[#1a2c3f] active:translate-y-1 active:translate-x-1 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:translate-x-0 disabled:pointer-events-none transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Modal */}
      {showOutcomesModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#13202e]/80 backdrop-blur-sm"
          onClick={() => setShowOutcomesModal(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-6 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowOutcomesModal(false)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-[#de4b28] text-white border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl flex items-center justify-center hover:bg-[#c93f1f] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all z-10"
            >
              <X size={24} strokeWidth={3} />
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#13202e] mb-4 text-center">Outcome Breakdown</h2>
            <div className="w-full flex flex-col gap-2 text-left">
              {["success", "rejected_non_food", "validation_error", "inference_error", "internal_error"].map(type => {
                const outcomeObj = summary.outcome_counts?.find(o => o.outcome === type);
                const count = outcomeObj ? outcomeObj.count : 0;
                return (
                  <div key={type} className="flex justify-between items-center bg-white border-2 border-[#13202e] rounded-xl px-4 py-3 shadow-[2px_2px_0px_#13202e]">
                    <span className="font-bold text-[#13202e] uppercase text-xs tracking-wider">
                      {type.replace(/_/g, ' ')}
                    </span>
                    <span className="font-black text-[#de4b28] bg-[#f2ead6] border-2 border-[#13202e] rounded-lg px-2 py-0.5">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
