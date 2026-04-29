import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

import { MOCK_ORDERS } from '../ProductionPlanning';

// --- CONFIGURATIONS ---
const STEP_CONFIG: Record<string, any> = {
    mixing: { color: '#111f42', label: 'MIXING', icon: 'chef-hat' }, // Using system primary
    forming: { color: '#f59e0b', label: 'FORMING', icon: 'layers' }, // Using system warning
    steaming: { color: '#E3624A', label: 'STEAMING', icon: 'thermometer' }, // Using system accent
    cooling: { color: '#3b82f6', label: 'COOLING', icon: 'snowflake' }, // Using system info
    peeling: { color: '#10b981', label: 'PEELING', icon: 'scroll' }, // Using system success
    cutting: { color: '#334155', label: 'CUTTING', icon: 'scissors' } // Using system secondary
};

// Generate options from Production Planning
const BATTER_OPTIONS = Array.from(new Set(MOCK_ORDERS.map(o => o.sku))).map(sku => {
    const order = MOCK_ORDERS.find(o => o.sku === sku);
    const code = sku.replace('FG-', 'SFG-');
    const totalWeight = MOCK_ORDERS.filter(o => o.sku === sku).reduce((sum, o) => sum + o.batterKg, 0);
    const totalBatches = Math.ceil(totalWeight / 150);
    const remaining = Math.max(0, Math.ceil(totalBatches * (0.3 + Math.random() * 0.4))); // mock remaining
    return { code, name: `SFG ${order?.name.replace(' 1kg', '').replace(' 500g', '')}`, totalBatches, totalWeight, remaining };
});

const INITIAL_BATCHES = [
    { id: 'SMC-8821', setNo: 1, productName: 'SFG Smoked Sausage (Standard)', step: 'mixing', status: 'Processing', totalTime: 900, timeLeft: 275, weight: 150 },
    { id: 'SMC-8822', setNo: 1, productName: 'SFG Smoked Sausage (Standard)', step: 'mixing', status: 'Processing', totalTime: 900, timeLeft: 275, weight: 150 },
    { id: 'MTB-1102', setNo: 5, productName: 'SFG Pork Meatball Grade A', step: 'mixing', status: 'Processing', totalTime: 900, timeLeft: 420, weight: 150 },
    { id: 'CHE-9901', setNo: 2, productName: 'SFG Cheese Sausage Lava', step: 'forming', status: 'Processing', totalTime: 1200, timeLeft: 820, weight: 150 },
    { id: 'CHE-9902', setNo: 2, productName: 'SFG Cheese Sausage Lava', step: 'forming', status: 'Waiting', totalTime: 1200, timeLeft: 1200, weight: 150 },
    { id: 'STM-1001', setNo: 10, productName: 'SFG Pork Meatball', step: 'steaming', status: 'Processing', totalTime: 1800, timeLeft: 450, weight: 150 },
    { id: 'COL-2001', setNo: 15, productName: 'SFG Vienna Sausage', step: 'cooling', status: 'Processing', totalTime: 2400, timeLeft: 1200, weight: 150 },
    { id: 'PEL-3001', setNo: 18, productName: 'SFG Chicken Frank', step: 'peeling', status: 'Processing', totalTime: 600, timeLeft: 300, weight: 150 },
    { id: 'CUT-4001', setNo: 20, productName: 'SFG Ham Block Sliced', step: 'cutting', status: 'Processing', totalTime: 900, timeLeft: 150, weight: 150 },
    { id: 'CUT-4002', setNo: 20, productName: 'SFG Ham Block Sliced', step: 'cutting', status: 'Processing', totalTime: 900, timeLeft: 150, weight: 150 },
    { id: 'CUT-4003', setNo: 21, productName: 'SFG Garlic Ham', step: 'cutting', status: 'Processing', totalTime: 900, timeLeft: 400, weight: 150 }
];

const WAITING_SFG_DATA = [
    { id: 'W-105', code: 'SFG-SMC-001', name: 'SFG Smoked Sausage (Standard)', batchSet: 'SET #105', location: 'Cooling Room A', weight: 450, delay: '5h 10m', isDelayed: true },
    { id: 'W-88', code: 'SFG-BOL-004', name: 'SFG Chili Bologna Bar', batchSet: 'SET #88', location: 'Buffer Zone 2', weight: 300, delay: '24h 40m', isDelayed: true },
    { id: 'W-106', code: 'SFG-SMC-001', name: 'SFG Smoked Sausage (Standard)', batchSet: 'SET #106', location: 'Cooling Room A', weight: 450, delay: '1h 52m', isDelayed: false },
    { id: 'W-112', code: 'SFG-MTB-002', name: 'SFG Pork Meatball Grade A', batchSet: 'SET #112', location: 'Cooling Room B', weight: 500, delay: '1h 25m', isDelayed: false },
];

const OVERVIEW_PLANS = [
    { id: 'JOB-SMC-001', name: 'SFG Smoked Sausage (Standard)', code: 'SFG-SMC-001', target: 60, produced: 30, wip: 6, progress: 50, status: 'IN PROGRESS' },
    { id: 'JOB-BOL-004', name: 'SFG Chili Bologna Bar', code: 'SFG-BOL-004', target: 40, produced: 10, wip: 6, progress: 25, status: 'IN PROGRESS' },
];

// --- HELPER COMPONENTS ---

const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return null;
    const pascalName = name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.Activity;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2.2} />;
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
                className={`fixed inset-0 z-[190] bg-[#111f42]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[200] w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50 text-primary shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm"><LucideIcon name="info" size={18} className="text-accent"/> Operation Guide</h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-accent rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-slate-500 leading-relaxed text-[12px]">
                    <section>
                        <h4 className="text-sm font-black text-primary mb-3 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">1. Live View</h4>
                        <p>ตรวจสอบสถานะของแต่ละ Batch แบบ Real-time ตามสีประจำขั้นตอนนั้นๆ</p>
                    </section>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end shadow-inner shrink-0">
                    <button onClick={onClose} className="sys-btn-primary">เข้าใจแล้ว</button>
                </div>
            </div>
        </>
    );
}

function PlannerModal({ isOpen, onClose, onStart }: any) {
    const [selectedBatter, setSelectedBatter] = useState<any>(BATTER_OPTIONS[0]);
    const [orderSets, setOrderSets] = useState(1);
    const remainingPercent = (selectedBatter.totalBatches > 0) ? (selectedBatter.remaining / selectedBatter.totalBatches) * 100 : 0;

    const handleStart = () => {
        if (!onStart || !selectedBatter) return;
        const newBatches = [];
        const numBatches = orderSets * 6; // 1S = 6B
        for (let i = 0; i < numBatches; i++) {
            newBatches.push({
                id: `${selectedBatter.code.split('-').pop()}-NEW-${Math.floor(Math.random() * 10000)}`,
                setNo: Math.floor(i / 6) + 1,
                productName: selectedBatter.name,
                step: 'mixing',
                status: 'Processing',
                totalTime: 900,
                timeLeft: 900,
                weight: 150
            });
        }
        onStart(newBatches);
    };

    return (
        <DraggableModal isOpen={isOpen} onClose={onClose} title="Production Planner" icon={<Icons.Activity size={18} className="text-primary animate-pulse" />} className="w-full max-w-4xl">
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
                    <div className="lg:col-span-4 flex flex-col gap-1.5 w-full">
                        <label className="sys-label pl-1">Batter Selection</label>
                        <div className="relative">
                            <select value={selectedBatter?.code || ''} onChange={(e) => setSelectedBatter(BATTER_OPTIONS.find(b => b.code === e.target.value))} className="sys-input w-full appearance-none cursor-pointer">
                                {BATTER_OPTIONS.map(opt => <option key={opt.code} value={opt.code}>{opt.code} : {opt.name}</option>)}
                            </select>
                            <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="lg:col-span-2 w-full">
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-inner">
                            <div className="flex flex-col">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Plan</p>
                                <div className="flex items-baseline gap-1"><span className="text-lg font-black text-primary font-mono leading-none">{selectedBatter?.totalBatches || 0}</span><span className="text-[9px] font-bold text-slate-400 uppercase">Batches</span></div>
                            </div>
                            <Icons.ClipboardList size={20} className="text-slate-300" />
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-1.5 w-full">
                        <label className="sys-label pl-1">Remaining</label>
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col justify-center gap-2 shadow-inner h-[50px]">
                            <span className="text-[12px] font-black text-primary font-mono leading-none">{selectedBatter?.remaining || 0} <span className="text-[9px] text-slate-400 uppercase">Left</span></span>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden relative">
                                <div className="bg-slate-500 h-full absolute left-0 top-0 transition-all duration-300" style={{ width: `${remainingPercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-1.5 w-full">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-black text-accent uppercase tracking-widest">Order Sets</label>
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase font-mono border border-slate-200">1S=6B</span>
                        </div>
                        <input type="number" value={orderSets} onChange={(e) => setOrderSets(Math.max(1, parseInt(e.target.value) || 1))} className="sys-input w-full text-center text-lg font-black text-accent py-2" />
                    </div>
                    <div className="lg:col-span-2 w-full">
                        <button onClick={handleStart} className="sys-btn-primary w-full h-[50px] flex items-center justify-center gap-2">
                            <Icons.Play size={16} fill="white" /> Start <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] border border-white/20 font-bold font-mono">+{orderSets * 6}</span>
                        </button>
                    </div>
                </div>
            </div>
        </DraggableModal>
    );
}

const KPICardLarge = ({ title, val, sub, icon, color }: any) => (
    <div className="sys-card-base p-4 flex flex-col items-start justify-between relative overflow-hidden group min-h-[110px]">
        <div className="relative z-10 flex flex-col gap-1.5 w-full">
            <p className="sys-kpi-label">{title}</p>
            <div className="flex items-baseline gap-2">
                <span className="sys-kpi-value leading-none">{val}</span>
                <span className="text-[12px] font-bold text-slate-400 uppercase">{sub}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 w-full">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">Live Target Update</span>
            </div>
        </div>
        <div className="absolute top-4 right-4 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:shadow-md transition-all z-10 shrink-0">
            <LucideIcon name={icon} size={24} color={color} />
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none z-0">
            <LucideIcon name={icon} size={150} color={color} />
        </div>
    </div>
);

// --- VIEWS ---

const BatchExecutionView = ({ batches, activeStep, onOpenPlanner }: any) => {
    const config = STEP_CONFIG[activeStep];
    const [qrData, setQrData] = useState<any>(null);
    const [simSpeed, setSimSpeed] = useState(1);

    const totalProduced = 120; // Mock count

    const gridColsClass = activeStep === 'cutting' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4"
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-6 gap-4";

    const renderGrid = () => (
        <div className={gridColsClass}>
            {batches.map((batch: any) => {
                const progress = ((batch.totalTime - batch.timeLeft) / batch.totalTime) * 100;
                return (
                    <div key={batch.id} 
                        className="sys-card-base p-3 relative group flex flex-col h-[180px]"
                    >
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-[11px] font-black uppercase tracking-tighter text-slate-400">SET #{batch.setNo}</span>
                                <h4 className="text-[12px] font-bold text-primary leading-tight line-clamp-1" title={batch.productName}>{batch.productName}</h4>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="text-[14px] font-black text-primary font-mono leading-none">{batch.weight}</span>
                                <span className="text-[8px] font-bold opacity-50 block uppercase text-primary">KG</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 mb-3 shadow-inner">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[11px] font-bold uppercase text-slate-400">Status</span>
                                <span className={`text-[11px] font-black uppercase ${batch.status === 'Processing' ? 'text-emerald-600 animate-pulse' : 'text-slate-500'}`}>{batch.status}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="text-right text-[11px] font-mono font-bold text-slate-500">
                                {Math.floor(batch.timeLeft / 60)}:{String(batch.timeLeft % 60).padStart(2, '0')} Left
                            </div>
                        </div>
                        <div className="flex gap-1.5 mt-auto">
                            <button className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 flex items-center justify-center gap-1.5 shadow-sm active:scale-95" style={{ color: config.color }}>
                                <Icons.CheckCircle size={12}/> FINISH
                            </button>
                            <button onClick={() => setQrData(batch)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm shrink-0 hover:bg-slate-50 transition-colors"><Icons.QrCode size={14} className="text-slate-400"/></button>
                        </div>
                    </div>
                );
            })}
            {batches.length === 0 && (
                <div className="col-span-full py-16 text-center opacity-40 flex flex-col items-center">
                    <Icons.Inbox size={40} className="mb-3 text-slate-400" />
                    <p className="font-black uppercase tracking-widest text-[11px] text-slate-500">No active batches in this stage</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col flex-1 animate-fadeIn overflow-hidden bg-transparent">
            {qrData && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[600] flex items-center justify-center p-4 animate-fadeIn" onClick={()=>setQrData(null)}>
                    <div className="bg-white rounded-2xl p-8 text-center shadow-2xl relative w-full max-w-sm" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>setQrData(null)} className="absolute top-4 right-4 text-slate-400 hover:text-accent transition-colors"><Icons.X size={20}/></button>
                        <h3 className="font-black mb-6 uppercase text-primary tracking-widest border-b border-slate-100 pb-4">BATCH ID: {qrData.id}</h3>
                        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl inline-block shadow-inner mb-6">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData.id}`} alt="QR" className="mx-auto mix-blend-multiply" />
                        </div>
                        <button onClick={()=>setQrData(null)} className="w-full py-3 bg-primary text-white rounded-lg font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm">CLOSE</button>
                    </div>
                </div>
            )}

            {/* Board Sub-Header */}
            <div className="sys-table-card flex-1 flex flex-col shadow-soft mt-0 rounded-t-none border-t-0 z-10 relative">
                <div 
                    className="px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 shrink-0" 
                    style={{ backgroundColor: `${config.color}20` }}
                >
                    <h3 className="font-black text-[13px] flex items-center gap-2 uppercase tracking-widest" style={{ color: config.color }}>
                        <LucideIcon name={config.icon} size={16} /> 
                        {config.label} PROCESS BOARD
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-primary bg-white px-3 py-1.5 rounded-lg uppercase border border-slate-200 shadow-sm whitespace-nowrap">
                            {batches.length} ACTIVE BATCHES
                        </span>
                        <button onClick={onOpenPlanner} className="sys-btn-primary py-1.5 px-3 flex items-center gap-1.5">
                            <Icons.Plus size={14} /> NEW MIXING
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col bg-white">
                {activeStep === 'cutting' ? (
                    <div className="flex-1 flex flex-col md:flex-row">
                        {/* Summary Side Box */}
                        <div className="w-full md:w-64 bg-primary text-white flex flex-col p-6 shadow-md relative overflow-hidden shrink-0 m-0 md:border-r border-slate-200">
                             <div className="absolute -right-8 -bottom-8 text-white/5 transform rotate-12 transition-transform group-hover:scale-110 duration-700 pointer-events-none">
                                <Icons.Scissors size={180} />
                             </div>
                             <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest border-b border-white/10 pb-3">TOTAL SFG TODAY</h3>
                                <div className="flex flex-col gap-2 mb-8 md:items-center md:text-center text-left">
                                    <span className="text-4xl md:text-5xl font-black font-mono text-white tracking-tighter">{totalProduced.toLocaleString()}</span>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">FINISHED BATCHES</span>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/10 w-full bg-black/20 backdrop-blur-sm rounded-xl py-4 px-4">
                                    <div className="flex items-center justify-start md:justify-center gap-2 mb-3">
                                        <Icons.Activity size={14} className="text-warning animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">CUTTING SIM SPEED</span>
                                    </div>
                                    <div className="flex justify-center gap-1.5">
                                        {[1, 10, 60].map(s => (
                                            <button 
                                                key={s} 
                                                onClick={()=>setSimSpeed(s)} 
                                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${simSpeed === s ? 'bg-warning text-primary shadow-sm' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Grid Area for Cutting */}
                        <div className="flex-1 p-4 md:p-6 bg-slate-50/50">
                            {renderGrid()}
                        </div>
                    </div>
                ) : (
                    /* Standard Full Width Grid */
                    <div className="flex-1 p-4 md:p-6 bg-slate-50/50">
                        {renderGrid()}
                    </div>
                )}
                </div>
            </div>
        </div>
    );
};

const SFGWaitingView = () => (
    <div className="sys-table-card animate-fadeIn mt-4 flex flex-col flex-1 min-h-0 min-w-0">
        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-b border-slate-200 shrink-0">
            <h3 className="font-black text-[13px] text-primary flex items-center gap-2 uppercase tracking-widest">
                <LucideIcon name="package" size={18} className="text-accent" /> SFG WAITING FOR PACKING
            </h3>
            <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <Icons.RefreshCcw size={14} /> Auto-refresh
            </button>
        </div>
        
        <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                <table className="w-full text-left min-w-[900px] border-collapse">
                    <thead className="sys-table-header sys-table-th sticky top-0 z-10">
                        <tr>
                            <th className="py-4 px-6 pl-8 whitespace-nowrap">SFG Code</th>
                            <th className="py-4 px-6 whitespace-nowrap">Product Name</th>
                            <th className="py-4 px-6 whitespace-nowrap">Batch Set</th>
                            <th className="py-4 px-6 whitespace-nowrap">Location</th>
                            <th className="py-4 px-6 text-center whitespace-nowrap">Weight (Kg)</th>
                            <th className="py-4 px-6 text-center whitespace-nowrap">Delay (Steam)</th>
                            <th className="py-4 px-6 pr-8 text-center whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {WAITING_SFG_DATA.map(item => (
                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="sys-table-td py-3 px-6 pl-8">
                                    <span className="bg-rose-50 text-accent px-3 py-1 rounded-md border border-rose-200 font-mono text-[11px] font-black tracking-tight">{item.code}</span>
                                </td>
                                <td className="sys-table-td py-3 px-6 font-bold text-primary text-[12px]">{item.name}</td>
                                <td className="sys-table-td py-3 px-6">
                                    <span className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] font-bold">{item.batchSet}</span>
                                </td>
                                <td className="sys-table-td py-3 px-6 font-bold text-slate-500 text-[12px] font-mono">{item.location}</td>
                                <td className="sys-table-td py-3 px-6 text-center font-black text-primary font-mono text-[12px]">{item.weight}</td>
                                <td className={`sys-table-td py-3 px-6 text-center font-black font-mono text-[12px] ${item.isDelayed ? 'text-accent animate-pulse' : 'text-slate-500'}`}>{item.delay}</td>
                                <td className="sys-table-td py-3 px-6 pr-8 text-center">
                                    <span className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">Waiting</span>
                                </td>
                            </tr>
                        ))}
                        {WAITING_SFG_DATA.length === 0 && (
                             <tr>
                                 <td colSpan={7} className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[12px] opacity-70">
                                     No SFG Waiting
                                 </td>
                             </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
);

const OverviewView = () => (
    <div className="animate-fadeIn mt-4 flex flex-col flex-1 min-h-0 min-w-0 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            <KPICardLarge title="Total Daily Plan" val={120} sub="Batches" icon="clipboard-list" color="#111f42" />
            <KPICardLarge title="Produced (Finished)" val={45} sub="Batches" icon="check-circle" color="#10b981" />
            <KPICardLarge title="Work In Process" val={12} sub="Batches" icon="activity" color="#3b82f6" />
            <KPICardLarge title="Overall Progress" val={37.5} sub="%" icon="pie-chart" color="#f59e0b" />
        </div>

        <div className="sys-table-card flex-1 flex flex-col">
            <div className="p-5 flex items-center justify-start gap-3 bg-white border-b border-slate-200 shrink-0">
                <Icons.Calendar size={18} className="text-accent" />
                <h3 className="font-black text-[13px] text-primary uppercase tracking-widest">Daily SFG Production Plan (Synced)</h3>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                    <table className="w-full text-left min-w-[900px] border-collapse">
                        <thead className="sys-table-header sys-table-th sticky top-0 z-10">
                            <tr>
                                <th className="py-4 px-6 pl-8 whitespace-nowrap">Job ID</th>
                                <th className="py-4 px-6 whitespace-nowrap">SFG Name</th>
                                <th className="py-4 px-6 whitespace-nowrap">Code</th>
                                <th className="py-4 px-6 text-center whitespace-nowrap">Target</th>
                                <th className="py-4 px-6 text-center whitespace-nowrap">Produced</th>
                                <th className="py-4 px-6 text-center whitespace-nowrap">WIP</th>
                                <th className="py-4 px-6 text-center w-40 whitespace-nowrap">Progress</th>
                                <th className="py-4 px-6 pr-8 text-center whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {OVERVIEW_PLANS.map(plan => (
                                <tr key={plan.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors text-[12px]">
                                    <td className="sys-table-td py-3 px-6 pl-8 font-black text-accent text-[12px] font-mono">{plan.id}</td>
                                    <td className="sys-table-td py-3 px-6 font-bold text-primary text-[12px]">{plan.name}</td>
                                    <td className="sys-table-td py-3 px-6">
                                        <span className="bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] font-bold">{plan.code}</span>
                                    </td>
                                    <td className="sys-table-td py-3 px-6 text-center font-black text-primary font-mono text-[12px]">{plan.target}</td>
                                    <td className="sys-table-td py-3 px-6 text-center font-black text-emerald-600 font-mono text-[12px]">{plan.produced}</td>
                                    <td className="sys-table-td py-3 px-6 text-center font-black text-slate-500 font-mono text-[12px]">{plan.wip}</td>
                                    <td className="sys-table-td py-3 px-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                <div className="h-full bg-emerald-500" style={{ width: `${plan.progress}%` }}></div>
                                            </div>
                                            <span className="text-[11px] font-black text-slate-500 font-mono">{plan.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="sys-table-td py-3 px-6 pr-8 text-center">
                                        <span className="bg-slate-100 text-slate-500 border border-slate-300 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">{plan.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    </div>
);

// --- MAIN APP ---
export default function DailyBoard() {
    const [activeTab, setActiveTab] = useState('mixing');
    const [activeView, setActiveView] = useState('execution');
    const [showGuide, setShowGuide] = useState(false);
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    const [batches, setBatches] = useState(INITIAL_BATCHES);

    return (
        <div className="flex flex-col min-h-0 h-full w-full font-sans">
            
            <GuideTrigger onClick={() => setShowGuide(true)} />
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} />
            <PlannerModal 
                isOpen={isPlannerOpen} 
                onClose={() => setIsPlannerOpen(false)} 
                onStart={(newBatches: any) => {
                    setBatches(prev => [...newBatches, ...prev]);
                    setIsPlannerOpen(false);
                }} 
            />

            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn pb-6 z-10 relative">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="sys-header-icon-box text-primary">
                        <Icons.Activity className="sys-header-icon" strokeWidth={2.2} />
                    </div>
                    <div className="flex flex-col justify-center leading-none">
                        <h1 className="sys-title-main flex gap-2">
                            <span>MIXING</span>
                            <span className="text-accent">BOARD</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.3em]">Interactive Production Floor Board</p>
                    </div>
                </div>

                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
                    {[
                        { id: 'execution', label: 'BATTER \u2192 SFG', icon: 'layers' },
                        { id: 'waiting', label: 'SFG WAITING', icon: 'package' },
                        { id: 'overview', label: 'OVERVIEW', icon: 'layout-grid' }
                    ].map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveView(tab.id)} 
                            className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${activeView === tab.id ? 'sys-tab-active' : 'sys-tab-inactive'}`}
                        >
                            <LucideIcon name={tab.icon} size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="sys-page-layout flex flex-col flex-1">
                <div className={`flex flex-col flex-1 w-full ${activeView === 'execution' ? 'relative' : ''}`}>
                    
                    {activeView === 'execution' && (
                        <div className="bg-white p-4 lg:p-6 pb-1 border-x border-t border-slate-200 rounded-t-2xl shrink-0 z-10 shadow-sm relative z-20">
                            <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
                                {Object.entries(STEP_CONFIG).map(([id, step]) => (
                                    <button key={id} onClick={() => setActiveTab(id)} 
                                        className={`flex-1 min-w-[140px] px-4 py-3.5 rounded-xl transition-all flex items-center justify-between group border relative overflow-hidden ${activeTab === id ? 'shadow-md text-white border-transparent' : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'}`} 
                                        style={activeTab === id ? { backgroundColor: step.color } : {}}>
                                        <div className="flex flex-col items-start leading-none gap-2 z-10">
                                            <LucideIcon name={step.icon} size={18} color={activeTab === id ? 'white' : step.color} />
                                            <span className="text-[12px] font-black uppercase tracking-widest">{step.label}</span>
                                        </div>
                                        <span className={`text-[12px] font-mono font-black px-2.5 py-1 rounded-lg z-10 shrink-0 ${activeTab === id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {batches.filter(b => b.step === id).length}
                                        </span>
                                        <div className="absolute -right-2 -bottom-2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform">
                                            <LucideIcon name={step.icon} size={60} color={activeTab === id ? 'white' : step.color} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeView === 'execution' ? (
                        <BatchExecutionView batches={batches.filter(b => b.step === activeTab)} activeStep={activeTab} onOpenPlanner={() => setIsPlannerOpen(true)} />
                    ) : activeView === 'waiting' ? (
                        <SFGWaitingView />
                    ) : (
                        <OverviewView />
                    )}
                </div>
            </main>
        </div>
    );
}
