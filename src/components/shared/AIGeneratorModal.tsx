import React, { useState } from 'react';
import { DraggableModal } from './DraggableModal';
import { Bot, Play, CheckCircle, Flame, Battery, Cpu } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (plan: any) => void;
  orders: any[];
}

export function AIGeneratorModal({ isOpen, onClose, onApply, orders }: AIGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const startGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
        setIsGenerating(false);
        setIsDone(true);
    }, 2000);
  };

  const handleApply = () => {
      onApply({}); // Return dummy plan or modified status
      onClose();
  };

  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="AI Production Planner" 
      icon={<Bot size={18} className="text-[#DCBC1B]" />}
      className="w-full max-w-lg z-[600]"
    >
      <div className="p-6 bg-[#F2F4F6] flex flex-col gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#E6E1DB] shadow-sm relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                 <Cpu size={120} />
             </div>
             
             <h4 className="text-[12px] font-black uppercase tracking-widest text-[#2E395F] mb-1">Smart Scheduling</h4>
             <p className="text-[10px] text-[#737597] font-bold mb-4">Analyze {orders.length} pending orders to optimize routing and minimize idle time.</p>

             {isDone ? (
                 <div className="space-y-3 animate-fadeIn relative z-10">
                     <div className="flex items-center gap-3 bg-[#537E72]/10 p-3 rounded-lg border border-[#537E72]/20 text-[#537E72]">
                         <CheckCircle size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Plan Optimized Successfully</span>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                         <div className="bg-[#F2F4F6] p-3 rounded-lg border border-[#E6E1DB]">
                             <div className="flex items-center gap-1 text-[#55738D] mb-1"><Battery size={14}/> <span className="text-[9px] font-bold uppercase tracking-widest">Energy Saved</span></div>
                             <div className="font-mono font-black text-[#537E72] text-lg">-14.5%</div>
                         </div>
                         <div className="bg-[#F2F4F6] p-3 rounded-lg border border-[#E6E1DB]">
                             <div className="flex items-center gap-1 text-[#55738D] mb-1"><Flame size={14}/> <span className="text-[9px] font-bold uppercase tracking-widest">Capacity Used</span></div>
                             <div className="font-mono font-black text-[#C22D2E] text-lg">92%</div>
                         </div>
                     </div>
                 </div>
             ) : (
                 <div className="flex items-center justify-center p-4 relative z-10">
                     <button 
                         onClick={startGeneration} 
                         disabled={isGenerating}
                         className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-[12px] uppercase tracking-widest text-white transition-all shadow-md ${isGenerating ? 'bg-[#55738D] cursor-wait' : 'bg-[#2E395F] hover:bg-[#1f2641] active:scale-95'}`}
                     >
                         {isGenerating ? (
                             <><Bot size={18} className="animate-pulse text-[#DCBC1B]"/> Analyzing Routing Limits...</>
                         ) : (
                             <><Play size={18} className="text-[#DCBC1B]"/> Generate Optimal Plan</>
                         )}
                     </button>
                 </div>
             )}
        </div>

      </div>
      
      <div className="p-4 bg-white border-t border-[#E6E1DB] flex justify-end gap-0.5 shrink-0">
        <button 
          onClick={onClose} 
          className="px-4 py-[6px] border border-[#B2CADE] bg-white rounded-lg text-[#55738D] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors hover:bg-gray-50 flex items-center justify-center gap-1.5"
        >
          Cancel
        </button>
        {isDone && (
            <button 
            onClick={handleApply} 
            className="px-5 py-[6px] bg-[#537E72] hover:bg-[#3d5e55] text-white font-black text-[11px] uppercase tracking-widest rounded-lg shadow-md transition-colors flex items-center gap-1.5 justify-center animate-fadeIn"
            >
            Apply Plan
            </button>
        )}
      </div>
    </DraggableModal>
  );
}
