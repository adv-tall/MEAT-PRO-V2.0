import React, { useState, useRef } from 'react';
import { LucideIcon, StandardModalWrapper } from '../helpers';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export function CsvUploadModal({ isOpen, onClose, onUpload }: any) {
    const [dragActive, setDragActive] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: any) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); 
        else setDragActive(false); 
    };
    const handleDrop = (e: any) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        setDragActive(false); 
        if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); 
    };
    const handleChange = (e: any) => { 
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]); 
    };
    
    const processFile = (file: File) => {
        setError(null);
        const Papa = typeof window !== 'undefined' ? (window as any).Papa : null;
        if(!Papa) { setError("CSV Parser (PapaParse) ไม่ได้โหลดในระบบ แนะนำให้ป้อนข้อมูลแบบแมนนวล"); return; }
        Papa.parse(file, { header: true, skipEmptyLines: true, complete: function (results: any) {
            if (results.errors.length > 0) { setError("Error parsing CSV: " + results.errors[0].message); return; }
            const requiredHeaders = ["ID", "Name", "Category", "Raw_Batch", "Yield", "Status"];
            const headers = results.meta.fields;
            const missing = requiredHeaders.filter(h => !headers.includes(h));
            if (missing.length > 0) { setError(`Missing columns: ${missing.join(", ")}`); return; }
            setPreviewData(results.data);
        }});
    };

    const confirmUpload = () => {
        const newData = previewData.map(row => ({
            id: row.ID,
            name: row.Name,
            category: row.Category,
            rawWeightPerBatch: parseFloat(row.Raw_Batch) || 100,
            yieldPercent: parseFloat(row.Yield) || 100,
            status: row.Status || 'Active',
            updateDate: new Date().toLocaleDateString('en-GB'),
            mixingStandards: [], formingStandards: [], cookingStandards: [],
            coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [],
            packVariants: []
        }));
        onUpload(newData);
        onClose();
        setPreviewData([]);
        setError(null);
        const Swal = typeof window !== 'undefined' ? (window as any).Swal : null;
        if(Swal) Swal.fire({ icon: 'success', title: 'Imported!', text: 'Data has been successfully imported.', timer: 1500, showConfirmButton: false });
    };

    return (
        <DraggableModal isOpen={isOpen} onClose={onClose} title="Import CSV" icon={<LucideIcon name="upload-cloud" size={18} />} className="w-full max-w-3xl">
                <div className="p-8 flex-1 overflow-y-auto">
                    {!previewData.length ? (
                        <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-all bg-[#F2F4F6]/50 ${dragActive ? 'border-[#C22D2E] bg-[#C22D2E]/5' : 'border-[#B2CADE]'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-[#55738D]"><LucideIcon name="file-spreadsheet" size={32} /></div>
                            <p className="text-[#2E395F] font-black mb-2 uppercase tracking-widest text-[12px]">Drag & Drop CSV file here</p>
                            <p className="text-[#737597] text-[10px] mb-6">Or click the button below to browse</p>
                            <button onClick={() => fileInputRef.current?.click()} className="bg-[#C22D2E] text-white px-6 py-2.5 rounded-lg text-[12px] uppercase tracking-widest font-black hover:bg-[#9E2C21] transition-colors shadow-md">Browse File</button>
                            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
                            <div className="mt-8 bg-[#F2F4F6] p-4 rounded-lg border border-[#E6E1DB] text-left">
                                <h4 className="text-[#55738D] font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><LucideIcon name="info" size={14}/> CSV Format Guide</h4>
                                <code className="block bg-white p-2 rounded-md border border-[#E6E1DB] text-[10px] text-[#2E395F] font-mono overflow-x-auto whitespace-nowrap">
                                    ID, Name, Category, Raw_Batch, Yield, Status
                                </code>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-[#E6E1DB] rounded-lg max-h-[300px] custom-scrollbar shadow-inner text-[12px]">
                            <h4 className="font-bold text-[#2E395F] mb-3 px-4 pt-4 flex justify-between items-center">
                                <span>Preview Data ({previewData.length} rows)</span>
                                <button onClick={() => setPreviewData([])} className="text-[10px] text-[#C22D2E] uppercase tracking-widest bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors">Clear</button>
                            </h4>
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-[#55738D] text-white sticky top-0">
                                    <tr>
                                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">ID</th>
                                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Name</th>
                                        <th className="p-3 font-bold uppercase tracking-wider text-[10px]">Category</th>
                                        <th className="p-3 font-bold uppercase tracking-wider text-[10px] text-right">Raw Batch</th>
                                        <th className="p-3 font-bold uppercase tracking-wider text-[10px] text-right">Yield</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E6E1DB]">
                                    {previewData.slice(0, 10).map((row, i) => (
                                        <tr key={i} className="hover:bg-[#F2F4F6]">
                                            <td className="p-3 font-mono font-bold text-[#C22D2E]">{row.ID || '-'}</td>
                                            <td className="p-3 text-[#2E395F] font-bold">{row.Name || '-'}</td>
                                            <td className="p-3 text-[#55738D]">{row.Category || '-'}</td>
                                            <td className="p-3 text-[#2E395F] font-mono text-right">{row.Raw_Batch || '-'}</td>
                                            <td className="p-3 text-[#2E395F] font-mono text-right">{row.Yield || '-'}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {error && <div className="mt-4 p-3 bg-red-50 text-[#C22D2E] text-[12px] rounded-lg border border-red-100 flex items-center gap-2 font-bold"><LucideIcon name="alert-circle" size={16}/> {error}</div>}
                </div>
                {previewData.length > 0 && (
                    <div className="p-4 border-t border-[#E6E1DB] flex justify-end gap-0.5 bg-[#F2F4F6]">
                        <button onClick={onClose} className="px-6 py-2 border border-[#B2CADE] bg-white rounded-lg text-[#55738D] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors hover:bg-gray-50 flex items-center justify-center">Cancel</button>
                        <button onClick={confirmUpload} className="px-8 py-2 bg-[#537E72] hover:bg-[#3d5e55] text-white font-black text-[11px] uppercase tracking-widest rounded-lg shadow-md transition-colors flex items-center gap-2 justify-center">
                            <LucideIcon name="check" size={14}/> Confirm Upload
                        </button>
                    </div>
                )}
        </DraggableModal>
    );
}
