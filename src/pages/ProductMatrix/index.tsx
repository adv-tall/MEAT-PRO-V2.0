import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Icons from 'lucide-react';

// --- Mocking External Dependencies for Standalone Run ---
const Swal = typeof window !== 'undefined' ? (window as any).Swal || null : null;
const Papa = typeof window !== 'undefined' ? (window as any).Papa || null : null;

// --- Comprehensive Mock Data (22 Items) ---
const MOCK_STANDARDS = [
    {id: 'BT-CK-STD', name: 'เนื้อไส้กรอกไก่ (Standard)'},
    {id: 'BT-MB-CK-A', name: 'เนื้อลูกชิ้นไก่เกรด A'},
    {id: 'BT-MB-FH', name: 'เนื้อลูกชิ้นปลาเยาวราช'},
    {id: 'BT-BL-CH', name: 'เนื้อโบโลน่าผสมพริก'},
    {id: 'BT-HM-CK', name: 'เนื้อแฮมไก่'},
    {id: 'BT-KY', name: 'เนื้อไก๋ยอ'},
    {id: 'BT-BL-PK', name: 'เนื้อโบโลน่าหมู'},
    {id: 'BT-PK-STD', name: 'เนื้อไส้กรอกหมู (Standard)'},
    {id: 'BT-MB-PK-A', name: 'เนื้อลูกชิ้นหมูเกรด A'},
    {id: 'BT-MB-BF', name: 'เนื้อลูกชิ้นวัว'},
    {id: 'BT-MB-BF-T', name: 'เนื้อลูกชิ้นเอ็นวัว'},
    {id: 'BT-CK-GR', name: 'เนื้อไส้กรอกไก่กระเทียม'},
    {id: 'BT-CK-VN', name: 'เนื้อไส้กรอกไก่วุ้นเส้น'},
    {id: 'BT-HM-YK', name: 'เนื้อยอร์คแฮม'},
    {id: 'BT-BC-SM', name: 'เนื้อเบคอนรมควัน'},
    {id: 'BT-MY-BP', name: 'เนื้อหมูยอพริกไทยดำ'},
    {id: 'BT-MB-SQ', name: 'เนื้อลูกชิ้นปลาหมึก'},
    {id: 'FL-CHZ', name: 'ไส้ชีส (Cheese Filling)'},
    {id: 'FL-KTC', name: 'ซอสมะเขือเทศ (Ketchup Filling)'},
    {id: 'LY-CK-GRN', name: 'เนื้อไก่บดผสมผักโขม (Green Layer)'},
    {id: 'LY-CK-WHT', name: 'เนื้อไก่บดสีขาว (White Layer)'},
    {id: 'LY-CK-RED', name: 'เนื้อไก่บดผสมปาปริก้า (Red Layer)'},
];

const MOCK_MATRIX = [
    { 
        id: 'SFG-001', name: 'ไส้กรอกไก่รมควัน 6 นิ้ว (จัมโบ้)', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 100}], 
        fgs: [{sku: 'FG-1001', name: 'SMC ไส้กรอกไก่ ARO 1kg', weight: 1, pieces: 20}, {sku: 'FG-1002', name: 'SMC ไส้กรอกไก่ 500g', weight: 0.5, pieces: 10}, {sku: 'FG-1003', name: 'SMC ไส้กรอกไก่ 5kg', weight: 5, pieces: 100}] 
    },
    { 
        id: 'SFG-002', name: 'ไส้กรอกไก่คอกเทล 4 นิ้ว', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 100}], 
        fgs: [{sku: 'FG-2001', name: 'CP Frank Cocktail 1kg', weight: 1, pieces: 80}, {sku: 'FG-2002', name: 'CP Frank Cocktail 0.5kg', weight: 0.5, pieces: 40}, {sku: 'FG-2003', name: 'CP Frank 1kg', weight: 1, pieces: 80}, {sku: 'FG-2004', name: 'CP Frank 0.5kg', weight: 0.5, pieces: 40}, {sku: 'FG-2005', name: 'CP Frank 0.2kg', weight: 0.2, pieces: 15}, {sku: 'FG-2006', name: 'CP Frank 5kg', weight: 5, pieces: 400}] 
    },
    { 
        id: 'SFG-003', name: 'ลูกชิ้นไก่ (ต้มสุก)', 
        batterConfig: [{id: 'BT-MB-CK-A', ratio: 100}], 
        fgs: [{sku: 'FG-3001', name: 'ลูกชิ้นไก่เกรด A 1kg', weight: 1, pieces: 100}, {sku: 'FG-3002', name: 'ลูกชิ้นไก่เกรด A 0.5kg', weight: 0.5, pieces: 50}] 
    },
    { 
        id: 'SFG-004', name: 'ลูกชิ้นปลา (ต้มสุก)', 
        batterConfig: [{id: 'BT-MB-FH', ratio: 100}], 
        fgs: [{sku: 'FG-3005', name: 'ลูกชิ้นปลาเยาวราช', weight: 0.5, pieces: 45}] 
    },
    { 
        id: 'SFG-005', name: 'ลูกชิ้นไก่ (ย่างเสียบไม้)', 
        batterConfig: [{id: 'BT-MB-CK-A', ratio: 100}], 
        fgs: [{sku: 'FG-3010', name: 'ลูกชิ้นไก่ย่าง', weight: 0.8, pieces: 10}] 
    },
    { 
        id: 'SFG-006', name: 'โบโลน่าไก่พริก (แท่งยาวรอสไลซ์)', 
        batterConfig: [{id: 'BT-BL-CH', ratio: 100}], 
        fgs: [{sku: 'FG-4001', name: 'BKP Chili Bologna 1kg', weight: 1, pieces: 50}, {sku: 'FG-4002', name: 'BKP Chili Bologna 0.2kg', weight: 0.2, pieces: 10}] 
    },
    { 
        id: 'SFG-007', name: 'แฮมไก่ (Block สี่เหลี่ยมรอสไลซ์)', 
        batterConfig: [{id: 'BT-HM-CK', ratio: 100}], 
        fgs: [{sku: 'FG-4005', name: 'Chicken Ham Block', weight: 0.5, pieces: 25}] 
    },
    { 
        id: 'SFG-008', name: 'ไก่ยอแผ่น (นึ่งสายพาน)', 
        batterConfig: [{id: 'BT-KY', ratio: 100}], 
        fgs: [{sku: 'FG-5001', name: 'ไก่ยอแผ่นเล็ก', weight: 0.5, pieces: 5}, {sku: 'FG-5002', name: 'ไก่ยอแผ่นใหญ่', weight: 1, pieces: 10}] 
    },
    { 
        id: 'SFG-009', name: 'ไส้กรอกไก่สอดไส้ชีส (Cheese-Stuffed)', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 80}, {id: 'FL-CHZ', ratio: 20}], 
        fgs: [{sku: 'FG-8001', name: 'Cheese Sausage 0.5kg', weight: 0.5, pieces: 30}] 
    },
    { 
        id: 'SFG-010', name: 'ไส้กรอกไก่สอดไส้ซอสมะเขือเทศ (Ketchup-Stuffed)', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 85}, {id: 'FL-KTC', ratio: 15}], 
        fgs: [{sku: 'FG-8002', name: 'Ketchup Sausage 1kg', weight: 1, pieces: 60}] 
    },
    { 
        id: 'SFG-011', name: 'โบโลน่าหมู (แท่งยาวรอสไลซ์)', 
        batterConfig: [{id: 'BT-BL-PK', ratio: 100}], 
        fgs: [{sku: 'FG-4011', name: 'Pork Bologna 1kg', weight: 1, pieces: 50}] 
    },
    { 
        id: 'SFG-012', name: 'ไส้กรอกหมูรมควัน 5 นิ้ว', 
        batterConfig: [{id: 'BT-PK-STD', ratio: 100}], 
        fgs: [{sku: 'FG-1012', name: 'Smoked Pork Sausage 1kg', weight: 1, pieces: 25}, {sku: 'FG-1013', name: 'Smoked Pork Sausage 0.5kg', weight: 0.5, pieces: 12}] 
    },
    { 
        id: 'SFG-013', name: 'ลูกชิ้นหมู (ต้มสุก)', 
        batterConfig: [{id: 'BT-MB-PK-A', ratio: 100}], 
        fgs: [{sku: 'FG-3013', name: 'Pork Meatball 1kg', weight: 1, pieces: 100}, {sku: 'FG-3014', name: 'Pork Meatball 0.5kg', weight: 0.5, pieces: 50}] 
    },
    { 
        id: 'SFG-014', name: 'ลูกชิ้นเนื้อ (ต้มสุก)', 
        batterConfig: [{id: 'BT-MB-BF', ratio: 100}], 
        fgs: [{sku: 'FG-3015', name: 'Beef Meatball 1kg', weight: 1, pieces: 90}] 
    },
    { 
        id: 'SFG-015', name: 'ลูกชิ้นเอ็นเนื้อ', 
        batterConfig: [{id: 'BT-MB-BF-T', ratio: 100}], 
        fgs: [{sku: 'FG-3016', name: 'Beef Tendon Meatball 1kg', weight: 1, pieces: 90}, {sku: 'FG-3017', name: 'Beef Tendon Meatball 0.5kg', weight: 0.5, pieces: 45}] 
    },
    { 
        id: 'SFG-016', name: 'ไส้กรอกไก่กระเทียมพริกไทย', 
        batterConfig: [{id: 'BT-CK-GR', ratio: 100}], 
        fgs: [{sku: 'FG-1016', name: 'Garlic Chicken Sausage 1kg', weight: 1, pieces: 30}] 
    },
    { 
        id: 'SFG-017', name: 'ไส้กรอกไก่วุ้นเส้น', 
        batterConfig: [{id: 'BT-CK-VN', ratio: 100}], 
        fgs: [{sku: 'FG-1017', name: 'Vermicelli Chicken Sausage 1kg', weight: 1, pieces: 25}, {sku: 'FG-1018', name: 'Vermicelli Chicken Sausage 0.5kg', weight: 0.5, pieces: 12}] 
    },
    { 
        id: 'SFG-018', name: 'ยอร์คแฮม (York Ham Block)', 
        batterConfig: [{id: 'BT-HM-YK', ratio: 100}], 
        fgs: [{sku: 'FG-4018', name: 'York Ham Block 2kg', weight: 2, pieces: 100}] 
    },
    { 
        id: 'SFG-019', name: 'เบคอนสไลซ์ (Smoked Bacon)', 
        batterConfig: [{id: 'BT-BC-SM', ratio: 100}], 
        fgs: [{sku: 'FG-4019', name: 'Smoked Bacon 0.5kg', weight: 0.5, pieces: 20}, {sku: 'FG-4020', name: 'Smoked Bacon 1kg', weight: 1, pieces: 40}] 
    },
    { 
        id: 'SFG-020', name: 'ไส้กรอกไก่ชีสไบท์ (Cheese Bite)', 
        batterConfig: [{id: 'BT-CK-STD', ratio: 75}, {id: 'FL-CHZ', ratio: 25}], 
        fgs: [{sku: 'FG-8020', name: 'Cheese Bite Sausage 1kg', weight: 1, pieces: 100}, {sku: 'FG-8021', name: 'Cheese Bite Sausage 0.5kg', weight: 0.5, pieces: 50}] 
    },
    { 
        id: 'SFG-021', name: 'หมูยอพริกไทยดำ', 
        batterConfig: [{id: 'BT-MY-BP', ratio: 100}], 
        fgs: [{sku: 'FG-5021', name: 'Black Pepper Pork Roll 0.5kg', weight: 0.5, pieces: 3}, {sku: 'FG-5022', name: 'Black Pepper Pork Roll 1kg', weight: 1, pieces: 6}] 
    },
    { 
        id: 'SFG-022', name: 'ลูกชิ้นปลาหมึก (ต้มสุก)', 
        batterConfig: [{id: 'BT-MB-SQ', ratio: 100}], 
        fgs: [{sku: 'FG-3022', name: 'Squid Meatball 0.5kg', weight: 0.5, pieces: 40}] 
    },
    { 
        id: 'SFG-023', name: 'แซนวิซผักโขม 3 ชั้น', 
        batterConfig: [{id: 'LY-CK-WHT', ratio: 30}, {id: 'LY-CK-GRN', ratio: 40}, {id: 'LY-CK-WHT', ratio: 30}], 
        fgs: [{sku: 'FG-9023', name: '3-Layer Spinach Sausage 500g', weight: 0.5, pieces: 20}] 
    },
    { 
        id: 'SFG-024', name: 'แซนวิซผักโขมปาปริก้า', 
        batterConfig: [{id: 'LY-CK-RED', ratio: 15}, {id: 'LY-CK-WHT', ratio: 20}, {id: 'LY-CK-GRN', ratio: 30}, {id: 'LY-CK-WHT', ratio: 20}, {id: 'LY-CK-RED', ratio: 15}], 
        fgs: [{sku: 'FG-9024', name: '5-Layer Tricolor Sausage 1kg', weight: 1, pieces: 40}] 
    }
];

const MOCK_MASTER = MOCK_MATRIX.flatMap(sfg => sfg.fgs.map(fg => ({...fg, name: fg.name || fg.sku})));

// --- HELPER COMPONENTS ---

const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
const LucideIcon = ({ name, size = 16, className = "", color, style, strokeWidth = 2 }: any) => {
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.CircleHelp || Icons.Activity;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
};

const GuideTrigger = ({ onClick }: any) => (
  <button 
    onClick={onClick} 
    className="fixed right-0 top-32 bg-primary text-white py-4 px-2 rounded-l-xl shadow-md hover:bg-slate-800 transition-colors duration-300 z-[100] flex flex-col items-center gap-3 group border border-r-0 border-white/20"
  >
    <LucideIcon name="help-circle" size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
    <span className="font-extrabold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-[11px]">
      USER GUIDE
    </span>
  </button>
);

function UserGuidePanel({ isOpen, onClose }: any) {
    if (typeof document === 'undefined') return null;
    return (
        <>
            <div 
                className={`fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[200] w-96 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50 text-primary shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm"><LucideIcon name="book-open" size={18} className="text-accent"/> MATRIX GUIDE</h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-accent rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-slate-500 leading-relaxed text-[12px]">
                    <section>
                        <h4 className="text-sm font-black text-primary mb-3 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">
                            <LucideIcon name="git-merge" size={16} className="text-accent"/> Product Structure
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>SFG Definition:</strong> กำหนดสินค้ากึ่งสำเร็จรูปที่เป็นแกนหลักในการผลิต</li>
                            <li><strong>Batter Config:</strong> กำหนดสูตร Batter หรือส่วนผสมที่ใช้ (รองรับหลาย Layer/Filling) โดยต้องระบุสัดส่วนรวมกันให้ได้ 100%</li>
                            <li><strong>FG Mapping:</strong> จับคู่สินค้าขาย (SKU) ที่เกิดจาก SFG ตัวนี้ เพื่อให้ระบบสามารถคำนวณการผลิตย้อนกลับได้ถูกต้อง</li>
                        </ul>
                    </section>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end shadow-inner">
                    <button onClick={onClose} className="px-8 py-3 bg-slate-500 text-white font-black rounded-lg uppercase font-mono text-[11px] hover:bg-primary transition-all shadow-sm">ปิดคู่มือ</button>
                </div>
            </div>
        </>
    );
}

function CsvUploadModal({ isOpen, onClose, onUpload }: any) {
    const [dragActive, setDragActive] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [error, setError] = useState<string|null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else setDragActive(false); };
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) processFile(e.target.files[0]); };
    
    const processFile = (file: File) => {
        setError(null);
        if(!Papa) { setError("CSV Parser (PapaParse) ไม่ได้โหลดในระบบ แนะนำให้ป้อนข้อมูลแบบแมนนวล"); return; }
        Papa.parse(file, { header: true, skipEmptyLines: true, complete: function (results: any) {
            if (results.errors.length > 0) { setError("Error parsing CSV: " + results.errors[0].message); return; }
            setPreviewData(results.data);
        }});
    };

    const confirmUpload = () => {
        onUpload([]); 
        onClose(); 
        setPreviewData([]); 
        setError(null);
        if(Swal) Swal.fire({ icon: 'success', title: 'Imported!', timer: 1500, showConfirmButton: false });
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn font-sans">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/40" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-primary text-white">
                    <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-sm"><LucideIcon name="upload-cloud" /> Import CSV</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><LucideIcon name="x" /></button>
                </div>
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                    {!previewData.length ? (
                        <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-all bg-slate-50 ${dragActive ? 'border-accent bg-accent/5' : 'border-slate-300'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-500"><LucideIcon name="file-up" size={32} /></div>
                            <p className="text-primary font-black mb-2 uppercase tracking-widest text-[12px]">Drag & Drop CSV file here</p>
                            <p className="text-slate-500 text-[10px] mb-6">Or click the button below to browse</p>
                            <button onClick={() => fileInputRef.current?.click()} className="sys-btn-primary px-6 py-2.5">Browse File</button>
                            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleChange} />
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-[300px] custom-scrollbar shadow-inner text-[12px]">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="sys-table-header sticky top-0 z-10">
                                    <tr>
                                        <th className="p-3 sys-table-th">SFG_ID</th>
                                        <th className="p-3 sys-table-th">FG_SKU</th>
                                        <th className="p-3 sys-table-th">FG_Name</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {previewData.slice(0, 10).map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="p-3 font-mono font-bold text-accent">{row.SFG_ID || '-'}</td>
                                            <td className="p-3 font-mono text-primary font-bold">{row.FG_SKU || '-'}</td>
                                            <td className="p-3 text-slate-500">{row.FG_Name || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-[12px] rounded-lg border border-red-100 flex items-center gap-2 font-bold"><LucideIcon name="alert-circle" size={16}/> {error}</div>}
                </div>
                {previewData.length > 0 && (
                    <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                        <button onClick={onClose} className="px-6 py-2.5 text-slate-500 hover:text-primary font-bold text-[12px] uppercase tracking-widest transition-colors">Cancel</button>
                        <button onClick={confirmUpload} className="sys-btn-primary px-8 py-2.5 flex items-center gap-2">
                            <LucideIcon name="check" size={14} color="white"/> Confirm Upload
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function MatrixConfigModal({ isOpen, onClose, sfgData, onSave, batters, fgDatabase }: any) {
    const [formData, setFormData] = useState<any>(null);
    const [selectedFgSku, setSelectedFgSku] = useState('');
    const [selectedBatterId, setSelectedBatterId] = useState('');

    useEffect(() => {
        if (isOpen && sfgData) {
            const data = JSON.parse(JSON.stringify(sfgData));
            if (!data.batterConfig) data.batterConfig = data.batterId ? [{ id: data.batterId, ratio: 100 }] : [];
            setFormData(data); 
        } else if (isOpen) {
            setFormData({ id: '', name: '', batterConfig: [], fgs: [] }); 
        }
        setSelectedFgSku(''); setSelectedBatterId('');
    }, [isOpen, sfgData]);

    if (!isOpen || !formData) return null;

    const totalRatio = formData.batterConfig.reduce((acc: number, curr: any) => acc + (parseFloat(String(curr.ratio)) || 0), 0);
    const isRatioValid = Math.abs(totalRatio - 100) < 0.1;

    const handleSave = () => {
        if (formData.batterConfig.length > 0 && !isRatioValid) { 
            if(Swal) Swal.fire({ icon: 'warning', title: 'Ratio Mismatch', text: `Total ratio is ${totalRatio}%. It must be 100%.` }); 
            else alert(`Total ratio is ${totalRatio}%. It must be 100%.`);
            return; 
        }
        onSave(formData); onClose();
    };

    const handleAddBatter = () => {
        if (selectedBatterId && !formData.batterConfig.some((b: any) => b.id === selectedBatterId)) {
            const currentTotal = formData.batterConfig.reduce((acc: number, curr: any) => acc + (parseFloat(String(curr.ratio)) || 0), 0);
            const remaining = Math.max(0, 100 - currentTotal);
            setFormData({ ...formData, batterConfig: [...formData.batterConfig, { id: selectedBatterId, ratio: remaining }] });
            setSelectedBatterId('');
        }
    };

    const handleAddFgFromDb = () => {
        if (!selectedFgSku) return;
        const fgMaster = fgDatabase.find((f: any) => f.sku === selectedFgSku);
        if (fgMaster) {
            if (formData.fgs.some((f: any) => f.sku === fgMaster.sku)) { 
                if(Swal) Swal.fire({ icon: 'warning', title: 'Duplicate', text: 'SKU already mapped.', timer: 1000 }); 
                else alert('SKU already mapped.');
                return; 
            }
            setFormData({ ...formData, fgs: [...formData.fgs, { sku: fgMaster.sku, name: fgMaster.name, brand: fgMaster.brand, weight: fgMaster.weight, pieces: 0 }] });
            setSelectedFgSku('');
        }
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn font-sans">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-white/40" onClick={e => e.stopPropagation()}>
                <div className="bg-primary px-8 py-5 flex justify-between items-center shrink-0 border-b border-primary">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                            <LucideIcon name="settings-2" size={20} color="white"/>
                        </div>
                        Product Structure Config
                    </h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><LucideIcon name="x" size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
                    
                    {/* Basic Info */}
                    <div className="sys-card-base p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="sys-label">SFG Code</label>
                                <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="sys-input w-full font-mono font-bold focus:border-accent focus:bg-white" disabled={!!sfgData} placeholder="E.g. SFG-001" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="sys-label">SFG Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="sys-input w-full focus:bg-white" placeholder="Enter product name..." />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Batter Config */}
                        <div className="sys-card-base p-6 flex flex-col h-[400px]">
                            <h4 className="text-[12px] font-black text-primary border-b border-slate-200 pb-3 mb-5 uppercase tracking-widest flex justify-between items-center">
                                <span>Batter Composition</span>
                                <span className={`text-[10px] px-2 py-1 rounded-md font-mono ${isRatioValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-accent animate-pulse'}`}>Total: {totalRatio}%</span>
                            </h4>
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <select value={selectedBatterId} onChange={e => setSelectedBatterId(e.target.value)} className="sys-input w-full appearance-none pr-10 cursor-pointer">
                                        <option value="">-- Select Batter Standard --</option>
                                        {batters.map((b: any) => <option key={b.id} value={b.id}>{b.name} ({b.id})</option>)}
                                    </select>
                                    <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <button onClick={handleAddBatter} className="bg-slate-500 hover:bg-primary text-white px-4 py-2.5 rounded-xl transition-colors shadow-sm"><LucideIcon name="plus" size={16} color="white"/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                                {formData.batterConfig.map((b: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border border-slate-200 rounded-xl bg-slate-50 text-[12px]">
                                        <div className="flex-1 font-bold text-primary truncate pr-2">
                                            <span className="text-accent font-mono mr-2">{b.id}</span>
                                            {batters.find((x: any) => x.id === b.id)?.name || b.id}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={b.ratio} onChange={e => {const newC = [...formData.batterConfig]; newC[idx].ratio = parseFloat(e.target.value)||0; setFormData({...formData, batterConfig: newC})}} className="sys-input w-16 text-right font-black text-slate-500 focus:bg-white font-mono p-1.5" />
                                            <span className="text-slate-400 font-bold font-mono">%</span>
                                            <button onClick={() => setFormData({...formData, batterConfig: formData.batterConfig.filter((x: any)=>x.id!==b.id)})} className="text-red-400 hover:text-accent bg-white p-1.5 rounded-md border border-slate-200 hover:border-red-200 transition-all shadow-sm"><LucideIcon name="trash-2" size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                                {formData.batterConfig.length === 0 && <div className="text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold pt-10 opacity-60">No batters configured</div>}
                            </div>
                        </div>

                        {/* FG Mapping */}
                        <div className="sys-card-base p-6 flex flex-col h-[400px]">
                            <h4 className="text-[12px] font-black text-primary border-b border-slate-200 pb-3 mb-5 uppercase tracking-widest">Mapped SKUs (FGs)</h4>
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <input type="text" list="fgList" value={selectedFgSku} onChange={e => setSelectedFgSku(e.target.value)} className="sys-input w-full" placeholder="Search & Select FG SKU..." />
                                    <datalist id="fgList">{fgDatabase.map((fg: any) => <option key={fg.sku} value={fg.sku}>{fg.name}</option>)}</datalist>
                                </div>
                                <button onClick={handleAddFgFromDb} className="bg-accent hover:bg-red-600 text-white px-4 py-2.5 rounded-xl transition-colors shadow-sm"><LucideIcon name="plus" size={16} color="white"/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                                {formData.fgs.map((fg: any, idx: number) => (
                                    <div key={idx} className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-[12px] relative group flex flex-col gap-1">
                                        <div className="flex justify-between items-start">
                                            <span className="font-black font-mono text-slate-500">{fg.sku}</span>
                                            <button onClick={() => setFormData({...formData, fgs: formData.fgs.filter((_: any, i: number) => i !== idx)})} className="text-slate-400 hover:text-accent bg-white p-1 rounded-md transition-colors border border-slate-200 shadow-sm"><LucideIcon name="trash-2" size={14}/></button>
                                        </div>
                                        <div className="text-primary font-bold truncate pr-6">{fg.name}</div>
                                    </div>
                                ))}
                                {formData.fgs.length === 0 && <div className="text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold pt-10 opacity-60">No Finished Goods Mapped</div>}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="p-5 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 text-slate-500 hover:text-primary font-bold text-[12px] uppercase tracking-widest transition-colors">Cancel</button>
                    <button onClick={handleSave} className="sys-btn-primary px-8 py-2.5 flex items-center gap-2"><LucideIcon name="save" size={14} color="white"/> Save Config</button>
                </div>
            </div>
        </div>
    );
}

export default function ProductMatrix() {
    const [searchTerm, setSearchQuery] = useState('');
    const [matrixData, setMatrixData] = useState<any[]>([]);
    const [masterItems, setMasterItems] = useState<any[]>([]);
    const [batters, setBatters] = useState<any[]>([]);
    const [modal, setModal] = useState<{isOpen: boolean, data: any}>({ isOpen: false, data: null });
    const [csvModalOpen, setCsvModalOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Mock Data Loading for Standalone Environment
    useEffect(() => {
        const load = () => {
            setLoading(true);
            setTimeout(() => {
                setMasterItems(MOCK_MASTER);
                setBatters(MOCK_STANDARDS);
                setMatrixData(MOCK_MATRIX);
                setLoading(false);
            }, 600); // Simulate network delay
        };
        load();
    }, []);

    const filteredData = useMemo(() => matrixData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, matrixData]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleSave = (item: any) => { 
        const newData = modal.data ? matrixData.map(i => i.id === item.id ? item : i) : [...matrixData, item]; 
        setMatrixData(newData); 
        if(Swal) Swal.fire({ icon: 'success', title: 'Saved!', timer: 1500, showConfirmButton: false });
    };
    
    const handleDelete = (id: string) => { 
        if(Swal) {
            Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444' }).then((r: any) => { 
                if(r.isConfirmed) { setMatrixData(matrixData.filter(i => i.id !== id)); } 
            }); 
        } else {
            if(window.confirm('Are you sure you want to delete this item?')) {
                setMatrixData(matrixData.filter(i => i.id !== id));
            }
        }
    };

    if(loading) return (
        <div className="flex h-[80vh] w-full items-center justify-center bg-transparent">
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-accent" />
                <span className="text-primary font-black uppercase tracking-widest text-sm animate-pulse">Loading Matrix Data...</span>
            </div>
        </div>
    );

    return (
        <div className="w-full relative flex flex-col h-full min-h-0">
            <GuideTrigger onClick={() => setShowGuide(true)} />
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} />
            <CsvUploadModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} onUpload={(d: any) => { setMatrixData([...matrixData, ...d]); }} />
            <MatrixConfigModal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false, data: null })} sfgData={modal.data} onSave={handleSave} batters={batters} fgDatabase={masterItems} />

            {/* Header Bar */}
            <header className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 animate-fadeIn z-10 relative">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="sys-header-icon-box text-primary">
                        <Icons.GitMerge className="sys-header-icon" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center leading-none">
                        <h1 className="sys-title-main flex gap-2">
                            <span>PRODUCT</span>
                            <span className="text-accent">MATRIX</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.3em] font-medium">กำหนดโครงสร้างความสัมพันธ์ Batter &rarr; SFG &rarr; FG</p>
                    </div>
                </div>
                
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full custom-scrollbar shrink-0">
                    <div className="sys-tab-active flex items-center gap-2 whitespace-nowrap">
                        <Icons.GitMerge size={16} /> Matrix Config
                    </div>
                </div>
            </header>

            <main className="sys-page-layout flex flex-col flex-1 min-h-0">
                <div className="sys-table-card flex flex-col flex-1 shadow-soft">
                    
                    {/* TOOLBAR */}
                    <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-[12px] font-black text-primary uppercase tracking-widest">
                                <LucideIcon name="list" size={16} className="text-accent"/>
                                <span>SFG Master List</span>
                            </div>
                            <span className="hidden md:inline text-slate-300">|</span>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm">
                                {filteredData.length} Records
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <LucideIcon name="search" size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input type="text" placeholder="Search SFG..." value={searchTerm} onChange={(e) => setSearchQuery(e.target.value)} className="sys-input w-full pl-10 pr-4 py-2 h-10 shadow-sm font-bold" />
                            </div>
                            <button onClick={() => setCsvModalOpen(true)} className="flex-1 sm:flex-none justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-500 px-4 py-2 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors hover:text-primary h-10"><LucideIcon name="upload" size={14} /> Import</button>
                            <button onClick={() => setModal({ isOpen: true, data: null })} className="sys-btn-primary flex-1 sm:flex-none h-10 whitespace-nowrap">
                                <LucideIcon name="plus" size={16} color="white"/> New SFG
                            </button>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-white border-x border-slate-200 shadow-sm rounded-b-2xl">
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left min-w-[1000px] border-collapse relative">
                                <thead className="sys-table-header sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="py-4 px-6 pl-8 w-[25%] whitespace-nowrap sys-table-th">SFG Code & Name</th>
                                        <th className="py-4 px-6 w-[25%] whitespace-nowrap sys-table-th">Source Batter(s) & Formula</th>
                                        <th className="py-4 px-6 w-[40%] min-w-[400px] sys-table-th">Mapped FGs</th>
                                        <th className="py-4 px-6 pr-8 text-right w-24 sys-table-th">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {currentItems.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
                                            
                                            {/* Col 1: SFG Code & Name */}
                                            <td className="sys-table-td py-3 px-6 pl-8 align-middle">
                                                <div className="flex flex-col items-start gap-1.5">
                                                    <span className="font-bold text-primary text-[12px] leading-tight">{item.name}</span>
                                                    <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2 py-1 rounded-md text-[11px] font-mono shadow-sm">{item.id}</span>
                                                </div>
                                            </td>

                                            {/* Col 2: Batter Config */}
                                            <td className="sys-table-td py-3 px-6 align-middle">
                                                <div className="flex flex-wrap gap-2">
                                                    {item.batterConfig?.map((b: any, i: number) => {
                                                        const std = batters.find((x: any) => x.id === b.id);
                                                        const isFilling = b.id.startsWith('FL-');
                                                        const isLayer = b.id.startsWith('LY-');
                                                        const bgClass = isFilling ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200';
                                                        const textClass = isFilling ? 'text-amber-700' : 'text-slate-600';
                                                        let icon = 'database';
                                                        if (isFilling) icon = 'droplet';
                                                        if (isLayer) icon = 'layers';
                                                        
                                                        return (
                                                            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-md border w-fit shadow-sm ${bgClass}`}>
                                                                <span className={`font-mono font-black text-[11px] w-[28px] text-right shrink-0 ${textClass}`}>{b.ratio}%</span>
                                                                <LucideIcon name={icon} size={14} className={`${textClass} shrink-0`} />
                                                                <span className={`text-[11px] font-medium whitespace-nowrap ${textClass}`}>{std?.name || b.id}</span>
                                                            </div>
                                                        )
                                                    })}
                                                    {(!item.batterConfig?.length) && <span className="text-slate-400 italic text-[11px]">No Configuration</span>}
                                                </div>
                                            </td>

                                            {/* Col 3: Mapped FGs */}
                                            <td className="sys-table-td py-3 px-6 align-middle">
                                                <div className="flex flex-wrap gap-2">
                                                    {item.fgs?.map((f: any, i: number) => (
                                                        <div key={i} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md px-2 py-1 shadow-sm shrink-0 w-fit">
                                                            <span className="bg-slate-100 text-slate-500 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-md border border-slate-200">{f.sku}</span>
                                                            <span className="text-primary font-mono font-bold text-[11px]">{f.weight}kg</span>
                                                            <span className="bg-red-50 text-accent border border-red-100 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-md">{f.pieces}pcs</span>
                                                        </div>
                                                    ))}
                                                    {(!item.fgs?.length) && <span className="text-slate-400 italic text-[11px]">No FG Mapped</span>}
                                                </div>
                                            </td>

                                            {/* Col 4: Action */}
                                            <td className="sys-table-td py-3 px-6 pr-8 align-middle">
                                                <div className="flex justify-end gap-0.5 transition-opacity">
                                                    <button onClick={() => setModal({ isOpen: true, data: item })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-primary hover:bg-white transition-colors shadow-sm bg-slate-50"><LucideIcon name="pencil" size={14} /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-accent hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm bg-slate-50"><LucideIcon name="trash-2" size={14} /></button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                    {currentItems.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[12px] opacity-70">
                                                No Records Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination (Synced) */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center font-bold text-slate-500 uppercase tracking-widest shrink-0 font-mono text-[10px]">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span>SHOW:</span>
                                    <select 
                                        value={itemsPerPage} 
                                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                        className="bg-white border border-slate-200 rounded-md px-2 py-1 outline-none focus:border-slate-300 text-primary cursor-pointer shadow-sm"
                                    >
                                        {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>TOTAL {filteredData.length} ITEMS</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-1.5 border border-slate-200 bg-white rounded-lg transition-all shadow-sm ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 text-primary hover:border-slate-300'}`}><LucideIcon name="chevron-left" size={16}/></button>
                                <div className="bg-white border border-slate-200 px-5 py-1.5 rounded-lg shadow-sm text-primary font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} OF {totalPages || 1}</div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`p-1.5 border border-slate-200 bg-white rounded-lg transition-all shadow-sm ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 text-primary hover:border-slate-300'}`}><LucideIcon name="chevron-right" size={16}/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
