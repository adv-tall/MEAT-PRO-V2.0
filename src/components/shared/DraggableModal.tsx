import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  width?: string;
  className?: string;
  icon?: React.ReactNode;
  headerClassName?: string;
}

export function DraggableModal({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
  className,
  icon,
  headerClassName
}: DraggableModalProps) {
  const nodeRef = useRef(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Draggable nodeRef={nodeRef} handle=".modal-handle">
            <div 
              ref={nodeRef}
              className={clsx(
                "bg-white rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col w-full",
                width,
                className
              )}
            >
              {/* Header / Handle */}
              <div className={clsx("modal-handle cursor-move px-6 py-4 border-b flex items-center justify-between shrink-0", headerClassName || "bg-slate-50 border-slate-100 text-[#111f42]")}>
                <div className="flex items-center gap-3">
                  {icon}
                  <h3 className="text-sm font-black uppercase tracking-widest leading-tight">
                    {title}
                  </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-black/10 rounded-xl transition-colors opacity-80 hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </Draggable>
        </div>
      )}
    </AnimatePresence>
  );
}
