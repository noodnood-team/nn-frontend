import Link from "next/link";
import { Ghost, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-b from-[#b5d5e2] to-[#7198ad] text-[#13202e] p-6 justify-center items-center">
      
      <div className="bg-[#f2ead6] border-4 border-[#13202e] shadow-[8px_8px_0px_#13202e] rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-sm w-full animate-in zoom-in-95 duration-300">
        
        {/* Decorative Icon */}
        <div className="w-24 h-24 bg-[#de4b28] text-white rounded-full border-4 border-[#13202e] flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
          <Ghost size={48} strokeWidth={2.5} className="absolute animate-bounce" />
        </div>
        
        {/* 404 Header */}
        <h1 className="text-7xl font-black tracking-tighter text-[#13202e] mb-2 leading-none">
          404
        </h1>
        
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#13202e] mb-4">
          Lost in Space
        </h2>
        
        <p className="text-[#3c556b] font-bold mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Home Button */}
        <Link href="/" className="w-full">
          <button className="w-full group py-4 flex items-center justify-center gap-2 rounded-xl bg-[#13202e] text-[#f2ead6] font-black uppercase tracking-widest text-lg border-4 border-[#13202e] shadow-[4px_4px_0px_rgba(19,32,46,0.3)] hover:bg-[#1a2c3f] hover:shadow-[6px_6px_0px_rgba(19,32,46,0.3)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
            <Home size={20} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform" />
            Go Home
          </button>
        </Link>
        
      </div>
      
    </div>
  );
}
