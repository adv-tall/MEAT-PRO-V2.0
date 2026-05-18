import React from 'react';
import { DraggableModal } from './DraggableModal';
import { Activity, Battery, Save, X } from 'lucide-react';

interface AspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title?: string;
  data?: any;
}

export function AspectModal({ isOpen, onClose, onSave, title = "Energy Consumption", data }: AspectModalProps) {
  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      icon={<Activity size={18} className="text-[#C22D2E]" />}
      className="w-full max-w-lg z-[600]"
    >
      <div className="p-6 bg-[#F2F4F6] flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#55738D]">Current Usage</span>
            <Battery size={16} className="text-[#537E72]" />
          </div>
          <div className="text-2xl font-mono font-black text-[#2E395F]">
            1,245.50 <span className="text-[12px] text-[#737597] font-bold tracking-widest">kWh</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#55738D] border-b border-[#E6E1DB] pb-2">Adjust Parameters</h4>
            
            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#2E395F]">Target Efficiency</label>
                <input type="number" defaultValue="85" className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-lg px-3 py-1.5 text-[12px] font-mono font-bold focus:outline-none focus:border-[#C22D2E] transition-colors" />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#2E395F]">Peak Limit</label>
                <input type="number" defaultValue="1500" className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-lg px-3 py-1.5 text-[12px] font-mono font-bold focus:outline-none focus:border-[#C22D2E] transition-colors" />
            </div>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t border-[#E6E1DB] flex justify-end gap-0.5 shrink-0">
        <button 
          onClick={onClose} 
          className="px-4 py-[6px] border border-[#B2CADE] bg-white rounded-lg text-[#55738D] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors hover:bg-gray-50 flex items-center justify-center gap-1.5"
        >
          <X size={14} /> Cancel
        </button>
        <button 
          onClick={() => { if(onSave) onSave(); onClose(); }} 
          className="px-5 py-[6px] bg-[#537E72] hover:bg-[#3d5e55] text-white font-black text-[11px] uppercase tracking-widest rounded-lg shadow-md transition-colors flex items-center gap-1.5 justify-center"
        >
          <Save size={14} /> Save
        </button>
      </div>
    </DraggableModal>
  );
}
