import React from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon } from '../helpers';

export function UserGuidePanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (typeof document === 'undefined') return null;
    return createPortal(
        <>
            <div 
                className={`fixed inset-0 z-[190] bg-[#2E395F]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[200] w-96 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-white/60 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-[#E6E1DB] bg-[#F2F4F6] text-[#2E395F] shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm"><LucideIcon name="book-open" size={18} className="text-[#55738D]"/> STD PROCESS GUIDE</h3>
                    <button onClick={onClose} className="p-1.5 text-[#737597] hover:text-[#C22D2E] rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-[#737597] leading-relaxed text-[12px]">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <LucideIcon name="settings-2" size={16} className="text-[#55738D]"/> Overview
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>Purpose:</strong> กำหนดมาตรฐานกระบวนการผลิต (Routing) และ Parameters ของแต่ละขั้นตอนสำหรับสินค้านั้นๆ</li>
                            <li><strong>Process Steps:</strong> สามารถตั้งค่าได้ตั้งแต่ Mixing, Forming, Cooking, Cooling, ไปจนถึง Packing</li>
                            <li><strong>Capacity & Yield:</strong> ระบุ Batch Size, Cycle Time และ Yield เพื่อใช้ในการคำนวณแผนการผลิต</li>
                        </ul>
                    </section>
                </div>
                <div className="p-6 bg-[#F2F4F6]/50 border-t border-[#E6E1DB] flex justify-end shadow-inner">
                    <button onClick={onClose} className="px-8 py-3 bg-[#55738D] text-white font-black rounded-lg uppercase font-mono text-[11px] hover:bg-[#2E395F] transition-all shadow-sm">ปิดคู่มือ</button>
                </div>
            </div>
        </>,
        document.body
    );
}

export const GuideTrigger = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="fixed right-0 top-32 bg-[#55738D] text-white py-4 px-2 rounded-l-xl shadow-[-4px_0_15px_rgba(0,0,0,0.15)] hover:bg-[#C22D2E] transition-colors duration-300 z-[100] flex flex-col items-center gap-3 group border border-r-0 border-white/20"
  >
    <LucideIcon name="help-circle" size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
    <span className="font-extrabold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-[11px]">
      USER GUIDE
    </span>
  </button>
);
