import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function GuideModal({ isOpen, onClose, title, subtitle, icon, children }: GuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="fixed right-4 top-4 bottom-4 w-[480px] bg-white rounded-2xl shadow-2xl z-[101] flex flex-col overflow-hidden border border-white/20"
          >
            {/* Header */}
            <div className="bg-[#1a2035] p-6 relative flex-shrink-0">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <div className="text-[#E3624A]">
                  {icon}
                </div>
                <h2 className="text-xl font-black text-white tracking-widest uppercase" style={{ fontFamily: 'var(--font-prompt)' }}>
                  {title}
                </h2>
              </div>
              <p className="text-[#8F9FBF] text-xs font-bold tracking-widest uppercase ml-[38px]">
                {subtitle}
              </p>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA] custom-scrollbar">
              <div className="space-y-8 pb-20">
                {children}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-[#E6E1DB] flex justify-end flex-shrink-0">
              <button 
                onClick={onClose}
                className="bg-[#1a2035] text-white px-8 py-3 rounded-xl font-bold tracking-widest text-sm hover:bg-[#E3624A] transition-colors uppercase"
                style={{ fontFamily: 'var(--font-prompt)' }}
              >
                เข้าใจแล้ว (Understood)
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
