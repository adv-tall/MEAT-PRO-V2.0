import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon } from '../helpers';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export const ListManagerModal = ({ title, items, onAdd, onRemove, onClose }: any) => {
    const [newItem, setNewItem] = useState('');
    
    const handleAdd = () => {
        if (!newItem.trim()) return;
        if (items.includes(newItem.trim())) {
            const Swal = typeof window !== 'undefined' ? (window as any).Swal : null;
            if (Swal) Swal.fire({ icon: 'warning', title: 'Duplicate', text: 'This item already exists.', timer: 1500, showConfirmButton: false });
            return;
        }
        onAdd(newItem.trim());
        setNewItem('');
    };

    return createPortal(
        <DraggableModal isOpen={true} onClose={onClose} title={title} icon={<LucideIcon name="settings-2" size={18} className="text-[#DCBC1B]" />} className="w-full max-w-sm z-[600]">
                <div className="p-6 bg-[#F2F4F6] flex-1 overflow-hidden flex flex-col">
                    <div className="flex gap-1 mb-5 shrink-0">
                        <input 
                            type="text" 
                            value={newItem} 
                            onChange={(e) => setNewItem(e.target.value)} 
                            className="flex-1 border border-[#B2CADE] rounded-lg px-4 py-2 text-[12px] font-bold focus:outline-none focus:border-[#C22D2E] focus:bg-white shadow-sm" 
                            placeholder="Add new option..."
                            onKeyDown={(e) => { if(e.key === 'Enter') handleAdd(); }}
                        />
                        <button onClick={handleAdd} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-4 py-2 rounded-lg transition-colors shadow-md">
                            <LucideIcon name="plus" size={16}/>
                        </button>
                    </div>
                    <div className="overflow-y-auto custom-scrollbar space-y-2 pr-2 flex-1 max-h-[40vh]">
                        {items.length === 0 ? (
                            <div className="text-center py-8 text-[#737597] text-[10px] font-bold uppercase tracking-widest opacity-50">No items configured.</div>
                        ) : (
                            items.map((item: string, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-white border border-[#E6E1DB] p-2.5 rounded-lg shadow-sm group hover:border-[#C22D2E]/30 transition-colors">
                                    <span className="text-[12px] font-bold text-[#2E395F]">{item}</span>
                                    <button onClick={() => onRemove(item)} className="text-[#737597] hover:text-[#C22D2E] transition-colors p-1 bg-gray-50 rounded-md border border-transparent hover:border-red-100"><LucideIcon name="trash-2" size={14}/></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
        </DraggableModal>,
        document.body
    );
};
