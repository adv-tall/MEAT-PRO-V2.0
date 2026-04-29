import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- THEME ---
const THEME = {
    primary: '#111f42',   // Primary Navy
    secondary: '#334155', // Slate 700
    warning: '#f59e0b',   // Amber 500
    success: '#10b981',   // Emerald 500
    info: '#3b82f6',      // Blue 500
    accent: '#E3624A',    // Accent Red
    muted: '#94a3b8'      // Slate 400
};

// --- Master Data ---
const FG_DATABASE = [
    { sku: 'FG-1001', name: 'ไส้กรอกไก่จัมโบ้ ARO 1kg', weight: 1.0, sfg: 'SFG-SMC-001' },
    { sku: 'FG-1002', name: 'ไส้กรอกไก่จัมโบ้ CP 500g', weight: 0.5, sfg: 'SFG-SMC-001' },
    { sku: 'FG-2001', name: 'ไส้กรอกคอกเทล ARO 1kg', weight: 1.0, sfg: 'SFG-002' },
    { sku: 'FG-3001', name: 'ลูกชิ้นหมู ARO 1kg', weight: 1.0, sfg: 'SFG-MTB-002' },
    { sku: 'FG-4001', name: 'โบโลน่าพริก CP 1kg (Sliced)', weight: 1.0, sfg: 'SFG-BOL-004' },
    { sku: 'FG-5001', name: 'ไส้กรอกชีสลาวา 500g', weight: 0.5, sfg: 'SFG-CHE-009' },
    { sku: 'FG-8001', name: 'แซนวิชไก่แฮม 500g', weight: 0.5, sfg: 'SFG-SND-020' },
    { sku: 'FG-8003', name: 'ไส้กรอกระเบิดซอส 120g', weight: 0.12, sfg: 'SFG-SPY-040' }
];

const PACKING_MACHINES = [
    { id: 'M-THERMO-01', name: 'Thermoformer Line 1', capacityKgHr: 800, type: 'Thermoformer' },
    { id: 'M-THERMO-02', name: 'Thermoformer Line 2', capacityKgHr: 600, type: 'Thermoformer' },
    { id: 'M-FLOW-01', name: 'Flow Pack Line A', capacityKgHr: 400, type: 'Flow Pack' },
    { id: 'M-VAC-01', name: 'Vacuum Chamber B', capacityKgHr: 300, type: 'Vacuum Chamber' }
];

const INITIAL_PACKING_PLANS = [
    { id: 'PK-2603-001', sku: 'FG-8001', fgName: 'แซนวิชไก่แฮม 500g', targetPacks: 200, packedPacks: 50, wipPacks: 0, status: 'In Progress' },
    { id: 'PK-2603-002', sku: 'FG-8003', fgName: 'ไส้กรอกระเบิดซอส 120g', targetPacks: 500, packedPacks: 0, wipPacks: 0, status: 'Pending' },
    { id: 'PK-2603-003', sku: 'FG-5001', fgName: 'ไส้กรอกชีสลาวา 500g', targetPacks: 50, packedPacks: 50, wipPacks: 0, status: 'Completed' },
    { id: 'PK-2603-004', sku: 'FG-1001', fgName: 'ไส้กรอกไก่จัมโบ้ ARO 1kg', targetPacks: 450, packedPacks: 0, wipPacks: 0, status: 'Pending' },
];

const INITIAL_SFG_STOCK: Record<string, number> = {
    'SFG-SND-020': 150,
    'SFG-SPY-040': 100,
    'SFG-CHE-009': 0,
    'SFG-SMC-001': 500 
};

// --- Helper Components ---
const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return null;
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.CircleHelp;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2.2} />;
};

const KPICardLarge = ({ title, val, sub, icon, color }: any) => (
    <div className="sys-card-base p-3 flex flex-col items-start justify-between relative overflow-hidden group min-h-[90px]">
        <div className="relative z-10 flex flex-col gap-1 w-full">
            <p className="sys-kpi-label">{title}</p>
            <div className="flex items-baseline gap-2">
                <span className="sys-kpi-value leading-none">{val.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase">{sub}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 w-full">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">Live Target Update</span>
            </div>
        </div>
        <div className="absolute top-3 right-3 w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:shadow-md transition-all z-10 shrink-0">
            <LucideIcon name={icon} size={20} color={color} />
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-700 pointer-events-none z-0">
            <LucideIcon name={icon} size={100} color={color} />
        </div>
    </div>
);

const GuideTrigger = ({ onClick }: any) => (
  <button 
    onClick={onClick} 
    className="fixed right-0 top-32 bg-primary text-white py-4 px-2 rounded-l-xl shadow-md hover:bg-slate-800 transition-colors duration-300 z-[100] flex flex-col items-center gap-3 group border border-r-0 border-white/20"
  >
    <LucideIcon name="help-circle" size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
    <span className="font-extrabold tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase font-mono text-[11px]">USER GUIDE</span>
  </button>
);

function UserGuidePanel({ isOpen, onClose }: any) {
    if (typeof document === 'undefined') return null;
    return (
        <>
            <div className={`fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <div className={`fixed inset-y-0 right-0 z-[200] w-96 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50 text-primary shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm"><LucideIcon name="package" size={18} className="text-accent"/> PACKING GUIDE</h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-accent rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-slate-500 leading-relaxed text-[12px]">
                    <section>
                        <h4 className="text-sm font-black text-primary mb-3 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">1. กระบวนการบรรจุ</h4>
                        <p>ดึงสินค้า SFG (Semi-Finished Goods) จากห้องพักเย็นเพื่อเข้าสู่กระบวนการบรรจุใส่บรรจุภัณฑ์สำเร็จรูป (FG)</p>
                    </section>
                    <section>
                        <h4 className="text-sm font-black text-primary mb-3 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">2. เครื่องบรรจุ (Machines)</h4>
                        <p>แต่ละเครื่องจักรจะมีกำลังการผลิต (Capacity) ที่ต่างกัน ระบบจะคำนวณเวลาที่ใช้โดยอัตโนมัติเมื่อระบุจำนวนที่ต้องการบรรจุ</p>
                    </section>
                    <section>
                        <h4 className="text-sm font-black text-primary mb-3 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">3. สถานะงาน</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span> <strong>Pending:</strong> งานที่รอคิวดำเนินการ</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>In Progress:</strong> งานที่กำลังบรรจุอยู่</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <strong>Completed:</strong> บรรจุครบตามแผนแล้ว</li>
                        </ul>
                    </section>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end shadow-inner"><button onClick={onClose} className="sys-btn-primary">เข้าใจแล้ว</button></div>
            </div>
        </>
    );
}

const StandardModalWrapper = ({ children, className }: any) => (
    <div className={`relative ${className}`} onClick={e => e.stopPropagation()}>
        {children}
    </div>
);

// --- MAIN APPLICATION ---
export default function PackingBoard() {
    const [activeTab, setActiveTab] = useState('execution');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [plans, setPlans] = useState(INITIAL_PACKING_PLANS);
    const [sfgStock, setSfgStock] = useState<Record<string, number>>(INITIAL_SFG_STOCK);
    const [showGuide, setShowGuide] = useState(false);
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    
    // Execution State
    const [selectedPlanId, setSelectedPlanId] = useState(plans[0].id);
    const [selectedMachineId, setSelectedMachineId] = useState(PACKING_MACHINES[0].id);
    const [releaseInput, setReleaseInput] = useState(100);
    const [activeLots, setActiveLots] = useState<any[]>([]);
    const [simSpeed, setSimSpeed] = useState(1);
    const [batchSeq, setBatchSeq] = useState(1);

    // Derived State
    const currentPlan = useMemo(() => plans.find(p => p.id === selectedPlanId), [plans, selectedPlanId]);
    const fgObj = useMemo(() => FG_DATABASE.find(fg => fg.sku === currentPlan?.sku), [currentPlan]);
    const selectedMachine = useMemo(() => PACKING_MACHINES.find(m => m.id === selectedMachineId), [selectedMachineId]);
    
    const planRemaining = currentPlan ? Math.max(0, currentPlan.targetPacks - (currentPlan.packedPacks + currentPlan.wipPacks)) : 0;
    const availSfgQty = fgObj ? (sfgStock[fgObj.sfg] || 0) : 0;
    const maxByStock = fgObj ? Math.floor(availSfgQty / fgObj.weight) : 0;
    const maxRelease = Math.min(planRemaining, maxByStock);

    const estTime = useMemo(() => {
        if (!selectedMachine || releaseInput <= 0 || !fgObj) return 0;
        return ((releaseInput * fgObj.weight) / selectedMachine.capacityKgHr) * 60;
    }, [releaseInput, selectedMachine, fgObj]);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveLots(prev => {
                const next = prev.map(lot => {
                    if (lot.timeLeft > 0) {
                        const newTime = Math.max(0, lot.timeLeft - (1 * simSpeed));
                        if (newTime === 0) {
                            // Finish logic
                            setPlans(currPlans => currPlans.map(p => {
                                if (p.id === lot.jobId) {
                                    const isDone = (p.packedPacks + lot.qty) >= p.targetPacks;
                                    return { 
                                        ...p, 
                                        packedPacks: p.packedPacks + lot.qty, 
                                        wipPacks: Math.max(0, p.wipPacks - lot.qty),
                                        status: isDone ? 'Completed' : 'In Progress'
                                    };
                                }
                                return p;
                            }));
                            return null;
                        }
                        return { ...lot, timeLeft: newTime };
                    }
                    return lot;
                }).filter(Boolean);
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [simSpeed]);

    const handleStartPacking = () => {
        if (releaseInput <= 0 || releaseInput > maxRelease) {
            if ((window as any).Swal) (window as any).Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Check available SFG or Plan limit' });
            return;
        }

        const lotId = `LOT-${String(batchSeq).padStart(3, '0')}`;
        const newLot = {
            id: lotId,
            jobId: selectedPlanId,
            sku: fgObj?.sku,
            name: fgObj?.name,
            qty: releaseInput,
            machineName: selectedMachine?.name,
            totalTime: Math.ceil(estTime),
            timeLeft: Math.ceil(estTime)
        };

        // Deduct Stock
        if(fgObj) {
            setSfgStock(prev => ({ ...prev, [fgObj.sfg]: prev[fgObj.sfg] - (releaseInput * fgObj.weight) }));
        }
        
        // Update Plan WIP
        setPlans(curr => curr.map(p => p.id === selectedPlanId ? { ...p, wipPacks: p.wipPacks + releaseInput, status: 'In Progress' } : p));
        
        setActiveLots(prev => [...prev, newLot]);
        setBatchSeq(s => s + 1);
        
        if ((window as any).Swal) (window as any).Swal.fire({ icon: 'success', title: 'Lot Released', timer: 1000, showConfirmButton: false, position: 'top-end', toast: true });
    };

    return (
        <div className="flex flex-col min-h-0 h-full w-full font-sans relative">
            <GuideTrigger onClick={() => setShowGuide(true)} />
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} />

            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn pb-6 z-10 relative">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="sys-header-icon-box text-primary">
                        <Icons.Package className="sys-header-icon" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center leading-none">
                        <h1 className="sys-title-main flex gap-2">
                            <span>PACKING</span>
                            <span className="text-accent">BOARD</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.3em]">Finished Goods Production Control</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto custom-scrollbar no-scrollbar">
                    <div className="flex items-center bg-white px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm h-10 shrink-0">
                        <Icons.Calendar size={14} className="text-slate-500 mr-2"/>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-[11px] font-bold font-mono text-primary outline-none cursor-pointer bg-transparent uppercase" />
                    </div>

                    <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full custom-scrollbar shrink-0">
                        <button onClick={() => setActiveTab('execution')} className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${activeTab === 'execution' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                            <Icons.Play size={14} /> Packing Execution
                        </button>
                        <button onClick={() => setActiveTab('overview')} className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                            <Icons.LayoutDashboard size={14} /> Overview
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-col flex-1 min-h-0">
                
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 mb-6">
                    <KPICardLarge title="Total Planned" val={plans.reduce((s,p)=>s+p.targetPacks, 0)} sub="Packs" color={THEME.primary} icon="target" />
                    <KPICardLarge title="Total FG Packed" val={plans.reduce((s,p)=>s+p.packedPacks, 0)} sub="Packs" color={THEME.success} icon="package-check" />
                    <KPICardLarge title="Packing WIP" val={plans.reduce((s,p)=>s+p.wipPacks, 0)} sub="Packs" color={THEME.info} icon="activity" />
                    <KPICardLarge title="Completed Jobs" val={plans.filter(p=>p.status==='Completed').length} sub="Lines" color={THEME.accent} icon="check-circle" />
                </div>

                {activeTab === 'overview' ? (
                    /* --- OVERVIEW TABLE VIEW --- */
                    <div className="sys-table-card flex-1 flex flex-col min-h-0 shadow-soft">
                        <div className="p-5 flex flex-col md:flex-row justify-between items-center bg-white border-b border-slate-200 shrink-0 gap-4">
                            <div className="flex items-center gap-2 text-[12px] font-black text-primary uppercase tracking-widest">
                                <LucideIcon name="list" size={16} className="text-accent" /> Daily Packing Plan List
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm">
                                {plans.length} Records
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                            <table className="w-full text-left min-w-[1000px] border-collapse">
                                <thead className="sys-table-header sys-table-th sticky top-0 z-20">
                                    <tr>
                                        <th className="py-4 px-6 pl-8 whitespace-nowrap">Job ID</th>
                                        <th className="py-4 px-6 whitespace-nowrap">FG Product (SKU)</th>
                                        <th className="py-4 px-6 text-center whitespace-nowrap">Target (Pks)</th>
                                        <th className="py-4 px-6 text-center whitespace-nowrap">Packed</th>
                                        <th className="py-4 px-6 text-center whitespace-nowrap">WIP</th>
                                        <th className="py-4 px-6 text-center whitespace-nowrap w-40">Progress</th>
                                        <th className="py-4 px-6 pr-8 text-center whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {plans.map(p => {
                                        const pct = Math.round((p.packedPacks / p.targetPacks) * 100);
                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                                                <td className="sys-table-td py-3 px-6 pl-8 font-mono font-bold text-accent text-[12px]">{p.id}</td>
                                                <td className="sys-table-td py-3 px-6">
                                                    <div className="font-bold text-primary text-[12px]">{p.fgName}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono font-medium mt-0.5">{p.sku}</div>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 text-center font-mono font-black text-primary text-[12px]">{p.targetPacks.toLocaleString()}</td>
                                                <td className="sys-table-td py-3 px-6 text-center font-mono font-black text-emerald-600 text-[12px]">{p.packedPacks.toLocaleString()}</td>
                                                <td className="sys-table-td py-3 px-6 text-center font-mono font-black text-slate-500 text-[12px]">{p.wipPacks.toLocaleString()}</td>
                                                <td className="sys-table-td py-3 px-6 text-center w-40">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                                                            <div className="bg-emerald-500 h-full transition-all duration-500 rounded-full" style={{ width: `${pct}%` }}></div>
                                                        </div>
                                                        <span className="font-mono text-[10px] font-bold text-slate-500 w-8">{pct}%</span>
                                                    </div>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 pr-8 text-center">
                                                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                        p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                        p.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        'bg-slate-50 text-slate-500 border-slate-200'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* --- EXECUTION BOARD VIEW --- */
                    <div className="flex flex-col flex-1 min-h-0">
                        <DraggableModal isOpen={isPlannerOpen} onClose={() => setIsPlannerOpen(false)} title="Select Job Plan" icon={<Icons.PackageCheck size={18} className="text-primary" />} className="w-full max-w-4xl">
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
                                    <div className="lg:col-span-4 flex flex-col gap-1.5 w-full">
                                        <label className="sys-label pl-1">Select Job Plan</label>
                                        <div className="relative">
                                            <select value={selectedPlanId} onChange={e=>setSelectedPlanId(e.target.value)} className="sys-input w-full appearance-none cursor-pointer">
                                                {plans.filter(p=>p.status !== 'Completed').map(p => <option key={p.id} value={p.id}>{p.id} : {p.sku}</option>)}
                                            </select>
                                            <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 flex flex-col gap-1.5 w-full">
                                        <label className="sys-label pl-1">Target Machine</label>
                                        <div className="relative">
                                            <select value={selectedMachineId} onChange={e=>setSelectedMachineId(e.target.value)} className="sys-input w-full appearance-none cursor-pointer">
                                                {PACKING_MACHINES.map(m => <option key={m.id} value={m.id}>{m.name} ({m.capacityKgHr} kg/hr)</option>)}
                                            </select>
                                            <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 w-full">
                                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-inner h-[50px] mt-[22px]">
                                            <div className="flex flex-col mt-[-10px]">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1 mt-1.5">Stock SFG</p>
                                                <div className="flex items-baseline gap-1"><span className="text-[14px] font-black text-primary font-mono leading-none">{availSfgQty.toLocaleString()}</span><span className="text-[9px] font-bold text-slate-400 uppercase">kg</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-8 flex flex-col gap-1.5 w-full mt-4">
                                        <div className="flex justify-between items-center px-1 h-[14px]">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">Qty to Release</label>
                                        </div>
                                        <div className="relative w-full">
                                            <input type="number" value={releaseInput} onChange={e=>setReleaseInput(Number(e.target.value))} className="sys-input w-full text-center text-lg font-black text-accent pr-10" />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">PCK</span>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-4 w-full mt-4">
                                        <button onClick={() => { handleStartPacking(); setIsPlannerOpen(false); }} disabled={releaseInput <= 0 || releaseInput > maxRelease} className="sys-btn-primary w-full h-[50px] flex items-center justify-center gap-2 text-xs">
                                            <Icons.Play size={16} fill="white" /> START LOT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DraggableModal>

                        {/* Active Lots Visualization */}
                        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 w-full overflow-hidden relative">
                            
                            {/* Summary Side Box */}
                            <div className="w-full md:w-64 bg-primary text-white flex flex-col p-6 shadow-md relative overflow-hidden shrink-0 border border-slate-200 rounded-2xl md:border-none md:rounded-none md:rounded-l-2xl">
                                <div className="absolute -right-8 -bottom-8 text-white/5 transform rotate-12 transition-transform group-hover:scale-110 duration-700 pointer-events-none"><LucideIcon name="package" size={200}/></div>
                                <div className="relative z-10 flex flex-col justify-center h-full w-full">
                                    <h3 className="text-[11px] font-black uppercase text-slate-400 mb-6 tracking-widest border-b border-white/10 pb-3">TOTAL PACKED TODAY</h3>
                                    <div className="flex flex-col gap-2 mb-8 md:items-center md:text-center text-left">
                                        <span className="text-4xl md:text-5xl font-black font-mono text-white tracking-tighter">{plans.reduce((s,p)=>s+p.packedPacks, 0).toLocaleString()}</span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Finished Packs</span>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-white/10 w-full bg-black/20 backdrop-blur-sm rounded-2xl py-4 flex flex-col items-center">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <Icons.Activity size={14} className="text-warning animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">Packing Sim Speed</span>
                                        </div>
                                        <div className="flex justify-center gap-2 px-2 w-full">
                                            {[1, 10, 60].map(s => (
                                                <button key={s} onClick={()=>setSimSpeed(s)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${simSpeed === s ? 'bg-warning text-primary shadow-sm' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}>{s}x</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Active Board */}
                            <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-2xl md:rounded-l-none md:rounded-r-2xl shadow-sm md:border-l-0">
                                <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 shrink-0 border-b border-slate-200">
                                    <h3 className="font-black text-[12px] text-primary flex items-center gap-2 uppercase tracking-widest">
                                        <LucideIcon name="cpu" size={16} className="text-accent" /> PACKING PROCESS BOARD
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                                            {activeLots.length} Lines Processing
                                        </div>
                                        <button onClick={() => setIsPlannerOpen(true)} className="sys-btn-primary py-1.5 px-3 flex items-center gap-1.5 text-[11px]">
                                            <Icons.Plus size={14} /> NEW PACKING
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-slate-50/50">
                                    {activeLots.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
                                            {activeLots.map(lot => {
                                                const progress = 100 - ((lot.timeLeft / lot.totalTime) * 100);
                                                return (
                                                    <div key={lot.id} className="sys-card-base p-3 relative group hover:shadow-md transition-all flex flex-col h-[180px]">
                                                        <div className="flex justify-between items-start mb-2 gap-2">
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <span className="font-mono font-black text-accent text-[12px]">{lot.id}</span>
                                                                <h4 className="font-bold text-primary text-[11px] uppercase mt-0.5 truncate max-w-[120px]" title={lot.name}>{lot.name}</h4>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate max-w-[80px]" title={lot.machineName}>{lot.machineName}</div>
                                                                <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-md border border-blue-200 animate-pulse uppercase shadow-sm">Packing</span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 mb-3 shadow-inner">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-[10px] font-black uppercase text-slate-500">Progress</span>
                                                                <span className="text-[11px] font-black text-primary font-mono">{Math.round(progress)}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                                                                <div className="bg-blue-500 h-full transition-all duration-1000 ease-linear rounded-full" style={{ width: `${progress}%` }}></div>
                                                            </div>
                                                            <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                                                                <span>{lot.qty.toLocaleString()} Pks</span>
                                                                <span>{Math.ceil(lot.timeLeft)} min left</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1.5 mt-auto">
                                                            <button onClick={() => {
                                                                setActiveLots(curr => curr.map(l => l.id === lot.id ? {...l, timeLeft: 0} : l));
                                                            }} className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:text-white hover:bg-accent hover:border-transparent flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-slate-500">
                                                                Force Finish
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                            <LucideIcon name="package-open" size={48} className="mb-4" />
                                            <p className="font-black uppercase tracking-widest text-xs text-slate-500">No machines currently processing</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
    );
}
