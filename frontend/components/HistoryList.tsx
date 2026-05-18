"use client";

import React, { useState } from "react";
import { PredictionItem } from "@/lib/api-types";
import { X, Flame, Beef, Wheat, Droplets, Clock, ImageOff, AlertTriangle, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";

interface HistoryListProps {
  items: PredictionItem[];
  isAdminDashboard?: boolean;
}

export default function HistoryList({ items, isAdminDashboard = false }: HistoryListProps) {
  const [selected, setSelected] = useState<PredictionItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-8 flex flex-col items-center justify-center text-center h-64 mt-6">
        <h2 className="text-3xl font-black uppercase tracking-tight text-[#13202e] mb-2">No History</h2>
        <p className="text-[#3c556b] font-bold text-lg">Scan some food to start building your history!</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {items.map((item) => {
        const date = new Date(item.created_at);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const isSuccess = item.outcome === "success" || item.ok;

        return (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="group w-full bg-[#f2ead6] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-2xl p-4 flex items-center justify-between hover:bg-[#e8dec7] transition-colors active:translate-y-1 active:translate-x-1 active:shadow-none text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full border-2 border-[#13202e] flex items-center justify-center ${isSuccess ? 'bg-[#b5d5e2]' : 'bg-[#de4b28] text-white'}`}>
                <Clock size={20} strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[#13202e] text-lg leading-tight">{timeStr}</span>
                <span className="font-bold text-[#3c556b] text-xs uppercase">{dateStr}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-right">
                {isSuccess ? (
                  <>
                    <span className="font-black text-[#de4b28] text-xl">{(item.calories || 0).toFixed(2)}</span>
                    <span className="font-bold text-[#13202e] text-sm uppercase tracking-tighter">
                      <span className="hidden sm:inline">Calories</span>
                      <span className="inline sm:hidden">Cal</span>
                    </span>
                  </>
                ) : item.outcome === "rejected_non_food" ? (
                  <span className="font-black text-[#61859b] text-sm uppercase">No Food</span>
                ) : (
                  <span className="font-black text-[#de4b28] text-sm uppercase">Failed</span>
                )}
              </div>
              {isAdminDashboard && item.rating && isSuccess && (
                item.rating === 'like' 
                  ? <ThumbsUp size={18} className="text-[#4ade80] mx-1" strokeWidth={3} />
                  : <ThumbsDown size={18} className="text-[#f87171] mx-1" strokeWidth={3} />
              )}
              <ChevronRight size={20} strokeWidth={3} className="text-[#3c556b] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        );
      })}

      {/* Modal Overlay */}
      {selected && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#13202e]/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div 
            className="relative w-full max-w-sm bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-6 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <button 
              onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 w-12 h-12 bg-[#de4b28] text-white border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl flex items-center justify-center hover:bg-[#c93f1f] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all z-10"
            >
              <X size={24} strokeWidth={3} />
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#13202e] mb-4 text-center">Scan Result</h2>
            
            {selected.outcome === "success" || selected.ok ? (
              <>
                {/* Calories Card */}
                <div className="bg-[#de4b28] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-2xl p-4 text-white flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="font-black uppercase tracking-widest text-xs opacity-90">Total Calories</span>
                    <span className="text-4xl font-black">{(selected.calories || 0).toFixed(2)}</span>
                  </div>
                  <Flame size={40} strokeWidth={2.5} className="opacity-50" />
                </div>

                {/* Macros Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#b5d5e2] text-[#13202e] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <Beef size={20} strokeWidth={2.5} className="mb-1 text-[#de4b28]" />
                    <span className="text-lg font-black leading-none">{(selected.protein || 0).toFixed(2)}g</span>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-70 mt-1">Pro</span>
                  </div>
                  <div className="bg-[#f2ead6] text-[#13202e] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <Wheat size={20} strokeWidth={2.5} className="mb-1 text-[#a88655]" />
                    <span className="text-lg font-black leading-none">{(selected.carbs || 0).toFixed(2)}g</span>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-70 mt-1">Carb</span>
                  </div>
                  <div className="bg-[#7198ad] text-[#f2ead6] border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e] rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <Droplets size={20} strokeWidth={2.5} className="mb-1 text-[#b5d5e2]" />
                    <span className="text-lg font-black leading-none">{(selected.fat || 0).toFixed(2)}g</span>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-90 mt-1">Fat</span>
                  </div>
                </div>

                {/* Message */}
                {selected.message && (
                  <div className="bg-[#13202e] text-[#f2ead6] border-4 border-[#13202e] rounded-xl p-4 text-sm font-bold shadow-inner text-center">
                    {selected.message}
                  </div>
                )}
              </>
            ) : selected.outcome === "rejected_non_food" ? (
              <div className="flex flex-col h-full space-y-4 text-center py-4">
                <div className="w-24 h-24 bg-[#61859b] text-[#f2ead6] rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e]">
                  <ImageOff size={48} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#13202e] mb-2">
                    No Meal Detected
                  </h3>
                  <p className="text-[#3c556b] font-bold text-sm leading-relaxed max-w-[280px] mx-auto">
                    {selected.message || "We could not find food in this image. Try a clearer photo of your meal."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full space-y-4 text-center py-4">
                <div className="w-24 h-24 bg-[#de4b28] text-white rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-[#13202e] shadow-[4px_4px_0px_#13202e]">
                  <AlertTriangle size={48} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#13202e] mb-2">
                    Scan Failed
                  </h3>
                  <p className="text-[#3c556b] font-bold text-sm leading-relaxed max-w-[280px] mx-auto">
                    {selected.message || "An error occurred during this scan. We could not complete it."}
                  </p>
                </div>
              </div>
            )}

            {(selected.outcome === "success" || selected.ok) && isAdminDashboard && (
              <div className="mt-4 flex flex-col items-center">
                {selected.rating === 'like' ? (
                  <div className="flex items-center gap-2 bg-[#4ade80] text-[#13202e] border-2 border-[#13202e] rounded-lg px-4 py-1.5 font-black text-sm uppercase tracking-wider shadow-[2px_2px_0px_#13202e]">
                    <ThumbsUp size={16} strokeWidth={3} /> User Liked
                  </div>
                ) : selected.rating === 'unlike' ? (
                  <div className="flex items-center gap-2 bg-[#f87171] text-[#13202e] border-2 border-[#13202e] rounded-lg px-4 py-1.5 font-black text-sm uppercase tracking-wider shadow-[2px_2px_0px_#13202e]">
                    <ThumbsDown size={16} strokeWidth={3} /> User Disliked
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-[#61859b] text-white border-2 border-[#13202e] rounded-lg px-4 py-1.5 font-black text-sm uppercase tracking-wider shadow-[2px_2px_0px_#13202e]">
                    No Feedback
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
