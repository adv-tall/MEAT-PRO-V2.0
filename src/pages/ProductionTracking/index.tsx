import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';

// --- Global Styles ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');

  :root {
    --font-mixed: 'JetBrains Mono', 'Noto Sans Thai', sans-serif;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(46, 57, 95, 0.1); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(194, 45, 46, 0.5); }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }

  @keyframes pulse-red {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; background-color: #ef4444; }
  }
  .animate-alarm {
    animation: pulse-red 1.5s infinite;
  }

  .shadow-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02);
  }

  .status-inner-box { background: white; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); }

  .unified-container {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 0px; 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
  }
`;

// --- MOCK DATA GENERATOR ---
const generateMockDailyMonitor = () => {
    const items = [
        {
            id: 'JO-2602-001', customer: 'ARO (Makro)', name: 'SMC ไส้กรอกไก่ ARO 125g', target: 200, time: '13:00', progress: 10, status: 'IN PROGRESS',
            stages: [
                { step: 'mixing', count: 150, color: '#55738D' }, { step: 'forming', count: 120, color: '#DCBC1B' },
                { step: 'cooking', count: 90, color: '#C22D2E' }, { step: 'cooling', count: 85, color: '#90B7BF' },
                { step: 'cutting', count: 80, color: '#BB8588' }, { step: 'packing', count: 50, color: '#2E395F' },
                { step: 'wh', count: 20, color: '#537E72' }
            ]
        },
        {
            id: 'JO-2602-002', customer: 'Betagro', name: 'BKP Chili Bologna', target: 50, time: '09:00', progress: 0, status: 'IN PROGRESS',
            stages: [
                { step: 'mixing', count: 50, color: '#537E72' }, { step: 'forming', count: 45, color: '#DCBC1B' },
                { step: 'cooking', count: 40, color: '#C22D2E' }, { step: 'cooling', count: 0, color: '#E6E1DB' },
                { step: 'cutting', count: 0, color: '#E6E1DB' }, { step: 'packing', count: 0, color: '#E6E1DB' },
                { step: 'wh', count: 0, color: '#E6E1DB' }
            ]
        },
        {
            id: 'JO-2602-003', customer: 'Foodland', name: 'Ham Slice 500g', target: 30, time: '08:30', progress: 0, status: 'IN PROGRESS',
            stages: [
                { step: 'mixing', count: 30, color: '#537E72' }, { step: 'forming', count: 30, color: '#537E72' },
                { step: 'cooking', count: 30, color: '#537E72' }, { step: 'cooling', count: 30, color: '#537E72' },
                { step: 'cutting', count: 30, color: '#537E72' }, { step: 'packing', count: 5, color: '#2E395F' },
                { step: 'wh', count: 0, color: '#E6E1DB' }
            ]
        },
        {
            id: 'JO-2602-004', customer: 'Big C', name: 'Cheese Sausage 4 inch', target: 80, time: '11:00', progress: 0, status: 'IN PROGRESS',
            stages: [
                { step: 'mixing', count: 80, color: '#537E72' }, { step: 'forming', count: 60, color: '#DCBC1B' },
                { step: 'cooking', count: 0, color: '#E6E1DB' }, { step: 'cooling', count: 0, color: '#E6E1DB' },
                { step: 'cutting', count: 0, color: '#E6E1DB' }, { step: 'packing', count: 0, color: '#E6E1DB' },
                { step: 'wh', count: 0, color: '#E6E1DB' }
            ]
        },
        {
            id: 'JO-2602-005', customer: 'CJ Express', name: 'ไส้กรอกแวมไพร์ AFM 500g', target: 40, time: '15:00', progress: 5, status: 'DELAYED',
            stages: [
                { step: 'mixing', count: 40, color: '#C22D2E' }, { step: 'forming', count: 2, color: '#DCBC1B' },
                { step: 'cooking', count: 0, color: '#E6E1DB' }, { step: 'cooling', count: 0, color: '#E6E1DB' },
                { step: 'cutting', count: 0, color: '#E6E1DB' }, { step: 'packing', count: 0, color: '#E6E1DB' },
                { step: 'wh', count: 0, color: '#E6E1DB' }
            ]
        }
    ];

    const customers = ['CP All', 'Lotus', 'Tops', 'MaxValu', 'CJ Express'];
    const products = ['ไส้กรอกหมูรมควัน', 'ลูกชิ้นเนื้อ', 'ลูกชิ้นไก่ปิ้ง', 'โบโลน่าหมูพริก', 'แฮมสไลซ์', 'ไก่ยอแผ่น', 'ไส้กรอกชีสลาวา', 'ไส้กรอกแดงจัมโบ้'];
    
    // Generate 20 more items
    for (let i = 6; i <= 25; i++) {
        const target = Math.floor(Math.random() * 150) + 30;
        const progress = Math.floor(Math.random() * 100);
        let status = 'IN PROGRESS';
        if (progress === 100) status = 'COMPLETED';
        else if (Math.random() > 0.8) status = 'DELAYED';

        const cMix = Math.min(target, Math.floor(target * (progress + 20) / 100));
        const cFrm = Math.min(cMix, Math.floor(target * (progress + 15) / 100));
        const cCok = Math.min(cFrm, Math.floor(target * (progress + 10) / 100));
        const cCol = Math.min(cCok, Math.floor(target * (progress + 5) / 100));
        const cCut = Math.min(cCol, Math.floor(target * (progress) / 100));
        const cPak = Math.min(cCut, Math.floor(target * (progress - 5) / 100));
        const cWh = Math.max(0, Math.floor(target * (progress - 10) / 100));

        items.push({
            id: `JO-2602-${String(i).padStart(3, '0')}`,
            customer: customers[i % customers.length],
            name: `${products[i % products.length]} ${i % 2 === 0 ? '500g' : '1kg'}`,
            target: target,
            time: `${String(8 + (i % 8)).padStart(2, '0')}:00`,
            progress: progress,
            status: status,
            stages: [
                { step: 'mixing', count: cMix, color: cMix > 0 ? '#55738D' : '#E6E1DB' },
                { step: 'forming', count: cFrm, color: cFrm > 0 ? '#DCBC1B' : '#E6E1DB' },
                { step: 'cooking', count: cCok, color: cCok > 0 ? '#C22D2E' : '#E6E1DB' },
                { step: 'cooling', count: cCol, color: cCol > 0 ? '#90B7BF' : '#E6E1DB' },
                { step: 'cutting', count: cCut, color: cCut > 0 ? '#BB8588' : '#E6E1DB' },
                { step: 'packing', count: cPak, color: cPak > 0 ? '#2E395F' : '#E6E1DB' },
                { step: 'wh', count: cWh, color: cWh > 0 ? '#537E72' : '#E6E1DB' }
            ]
        });
    }
    return items;
};

const MOCK_DAILY_MONITOR = generateMockDailyMonitor();

const MOCK_NOT_STARTED = [
    { id: 'JOB-CHE-009', name: 'SFG Cheese Sausage Lava', sku: 'SFG-CHE-009', totalBatches: 50, priority: 'Normal', plannedTime: '13:00' },
    { id: 'JOB-MTB-002', name: 'SFG Pork Meatball Grade A', sku: 'SFG-MTB-002', totalBatches: 80, priority: 'Urgent', plannedTime: '14:30' },
    { id: 'JOB-SND-020', name: 'SFG Sandwich Ham', sku: 'SFG-SND-020', totalBatches: 30, priority: 'Normal', plannedTime: '15:00' },
    { id: 'JOB-CK-001', name: 'SFG Chicken Sausage', sku: 'SFG-CK-001', totalBatches: 120, priority: 'Normal', plannedTime: '16:00' },
    { id: 'JOB-BL-004', name: 'SFG Pork Bologna', sku: 'SFG-BL-004', totalBatches: 45, priority: 'Normal', plannedTime: '16:30' }
];

const MOCK_PACKING_QUEUE = [
    { id: 'JOB-SMC-002', name: 'ไส้กรอกไก่จัมโบ้ ARO 1kg', sku: 'FG-1001', readyToPack: 45, packed: 10, totalBatches: 100 },
    { id: 'JOB-CHE-001', name: 'ไส้กรอกชีสลาวา 500g', sku: 'FG-5001', readyToPack: 20, packed: 0, totalBatches: 50 },
    { id: 'JOB-BOL-001', name: 'โบโลน่าพริก CP 1kg', sku: 'FG-4001', readyToPack: 15, packed: 15, totalBatches: 60 },
    { id: 'JOB-MB-003', name: 'ลูกชิ้นเนื้อ MaxValu 500g', sku: 'FG-3005', readyToPack: 30, packed: 20, totalBatches: 80 },
    { id: 'JOB-HM-001', name: 'แฮมสไลซ์ 200g', sku: 'FG-4008', readyToPack: 10, packed: 5, totalBatches: 40 }
];

const MOCK_COMPLETED = [
    { id: 'JOB-MTB-001', name: 'ลูกชิ้นหมู ARO 1kg', sku: 'FG-3001', totalBatches: 120, lastUpdated: '10:45 AM', transferRef: 'TRF-260416-01' },
    { id: 'JOB-SMC-000', name: 'ไส้กรอกคอกเทล ARO 1kg', sku: 'FG-2001', totalBatches: 80, lastUpdated: '09:30 AM', transferRef: 'TRF-260416-02' },
    { id: 'JOB-BOL-002', name: 'โบโลน่าหมูพริก 500g', sku: 'FG-4003', totalBatches: 60, lastUpdated: '11:15 AM', transferRef: 'TRF-260416-03' }
];

// --- HELPER COMPONENTS ---
const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
const LucideIcon = ({ name, size = 16, className = "", color, style }: { name: string, size?: number, className?: string, color?: string, style?: any }) => {
    if (!name) return null;
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.CircleHelp;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2.2} />;
};

const KPICardTracker = ({ title, val, sub, icon, color }: any) => (
    <div className="sys-card-base relative overflow-hidden group hover:shadow-md transition-shadow">
        <p className="sys-kpi-label mb-3">{title}</p>
        <div className="flex items-end gap-3">
            <h3 className="sys-kpi-value">{val}</h3>
            <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>
            </div>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 shadow-inner group-hover:scale-110 transition-transform">
            <LucideIcon name={icon} size={20} color={color} />
        </div>
        <div className="absolute -right-4 -bottom-4 text-slate-100 pointer-events-none group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
            <LucideIcon name={icon} size={100} color={color} style={{ opacity: 0.1 }} />
        </div>
    </div>
);

const GuideTrigger = ({ onClick }: { onClick: () => void }) => {
  if (typeof document === 'undefined') return null;
  return (
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
};

function UserGuidePanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (typeof document === 'undefined') return null;
    return (
        <>
            <div 
                className={`fixed inset-0 z-[190] bg-[#2E395F]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[200] w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-white/60 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-[#E6E1DB] bg-[#F2F4F6] text-[#2E395F] shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm"><LucideIcon name="book-open" size={18} className="text-[#55738D]"/> TRACKING GUIDE</h3>
                    <button onClick={onClose} className="p-1.5 text-[#737597] hover:text-[#C22D2E] rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 text-[#737597] leading-relaxed text-[12px]">
                    <section>
                        <p className="mb-4">
                            <strong className="text-[#2E395F]">การเชื่อมโยงข้อมูล (Data Sync):</strong><br/>
                            รายการสินค้าที่ต้องผลิตทั้งหมดในบอร์ดนี้ จะถูกซิงค์ (Sync) มาจากหน้า <strong className="text-[#C22D2E] font-mono">Production Planning</strong> แบบอัตโนมัติ เพื่อให้ฝ่ายผลิตและฝ่ายวางแผนเห็นเป้าหมายที่ตรงกัน
                        </p>
                        <ul className="list-disc list-outside ml-4 space-y-3">
                            <li><strong className="text-[#2E395F] font-mono">DAILY MONITOR:</strong> แสดงภาพรวมของออเดอร์ที่กำลังดำเนินการ (<span className="font-mono">Active Orders</span>) แยกตามสถานะในแต่ละ <span className="font-mono">Stage</span> พร้อมตารางสรุป <span className="font-mono">Progress</span> รูปแบบ <span className="font-mono">Real-Time</span> (สามารถใช้ตัวกรอง Status Filter เพื่อดูเฉพาะงานที่เสร็จแล้ว หรือล่าช้าได้)</li>
                            <li><strong className="text-[#2E395F] font-mono">PACKING QUEUE:</strong> คิวงานคอขวดสำหรับแผนกบรรจุ โดยแสดงจำนวนสินค้าที่ผ่านขั้นตอน <span className="font-mono">Cutting/Peeling</span> มาแล้ว และ <span className="font-mono text-[#B06821]">Ready to Pack</span> รอดำเนินการแพ็คลงซอง</li>
                            <li><strong className="text-[#2E395F] font-mono">NOT STARTED:</strong> ออเดอร์ที่ได้รับแผนมาแล้ว แต่ยังไม่ได้เริ่มลงมือผลิตในขั้นตอนแรก (คิวงานที่รอเข้า <span className="font-mono">Mixing</span>)</li>
                            <li><strong className="text-[#2E395F] font-mono">COMPLETED:</strong> ตารางสรุปออเดอร์ที่ผลิตเสร็จสิ้น <span className="font-mono text-[#537E72]">100%</span> และถูกโอนย้ายเข้าคลังสินค้า (<span className="font-mono text-[#537E72]">FG Transfer</span>) เรียบร้อยแล้ว</li>
                        </ul>
                    </section>
                </div>
                <div className="p-6 bg-[#F2F4F6]/50 border-t border-[#E6E1DB] flex justify-end shadow-inner shrink-0">
                    <button onClick={onClose} className="px-8 py-3 bg-[#55738D] text-white font-black rounded-lg uppercase font-mono text-[11px] hover:bg-[#2E395F] transition-all shadow-sm">เข้าใจแล้ว</button>
                </div>
            </div>
        </>
    );
}

// --- MAIN APPLICATION ---
export default function ProductionTracking() {
    const [activeTab, setActiveTab] = useState('daily');
    const [showGuide, setShowGuide] = useState(false);
    
    // Daily Monitor Filter & Search States
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchDaily, setSearchDaily] = useState('');
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    // Derived filtered data for Daily Monitor
    const filteredDailyMonitor = useMemo(() => {
        return MOCK_DAILY_MONITOR.filter(item => {
            const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
            const matchSearch = item.name.toLowerCase().includes(searchDaily.toLowerCase()) || 
                                item.id.toLowerCase().includes(searchDaily.toLowerCase()) ||
                                item.customer.toLowerCase().includes(searchDaily.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [filterStatus, searchDaily]);

    const activeStatuses = ['ALL', 'IN PROGRESS', 'DELAYED', 'COMPLETED'];

    return (
        <>
            <style>{globalStyles}</style>
            <div className="w-full relative flex flex-col h-full min-h-0 text-[#2E395F] font-sans">
                
                <GuideTrigger onClick={() => setShowGuide(true)} />
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} />

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn pb-6 z-10 relative">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="sys-header-icon-box text-primary">
                            <Icons.ClipboardList className="sys-header-icon" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="sys-title-main flex gap-2">
                                <span>PRODUCTION</span>
                                <span className="text-accent">TRACKING</span>
                            </h1>
                            <p className="sys-title-sub uppercase tracking-[0.3em]">Real-Time Floor Monitoring & Execution</p>
                        </div>
                    </div>
                    
                    {/* Main Nav */}
                    <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
                        {[
                            { id: 'daily', label: 'DAILY MONITOR', icon: 'layout-dashboard' },
                            { id: 'packing', label: 'PACKING QUEUE', icon: 'package-open' },
                            { id: 'not_started', label: 'NOT STARTED', icon: 'clock' },
                            { id: 'completed', label: 'COMPLETED', icon: 'archive' }
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)} 
                                className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${
                                    activeTab === tab.id ? 'sys-tab-active' : 'sys-tab-inactive'
                                }`}
                            >
                                <LucideIcon name={tab.icon} size={13} color={activeTab === tab.id ? 'white' : '#94a3b8'} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col gap-6 animate-fadeIn min-h-0">
                    
                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <KPICardTracker title="Total Planned" val={920} sub="OUTPUT BATCHES" color="#C22D2E" icon="target" />
                        <KPICardTracker title="Pending Start" val={1} sub="WAITING ORDERS" color="#55738D" icon="clock" />
                        <KPICardTracker title="In Progress" val={6} sub="LINE ACTIVE" color="#537E72" icon="activity" />
                        <KPICardTracker title="Total WIP" val={195} sub="WAIT PACKING" color="#DCBC1B" icon="layers" />
                    </div>

                    {/* CONTENT VIEWS */}
                    <div className="flex flex-col flex-1 min-h-0 bg-transparent">
                        
                        {/* 1. DAILY MONITOR VIEW */}
                        {activeTab === 'daily' && (
                            <div className="bg-white rounded-xl shadow-card border border-[#E6E1DB] overflow-hidden flex flex-col flex-1 min-h-0 animate-fadeIn relative">
                                {/* Toolbar */}
                                <div className="px-6 py-4 border-b border-[#E6E1DB] flex justify-between items-center bg-[#F2F4F6]/50 shrink-0">
                                    <div className="flex items-center gap-2 relative">
                                        <button 
                                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                            className="flex items-center gap-2 bg-white border border-[#E6E1DB] px-4 py-2 rounded-xl shadow-sm text-[12px] font-black text-[#55738D] uppercase tracking-widest hover:bg-gray-50 transition-colors h-10"
                                        >
                                            STATUS | <span className="text-[#2E395F]">{filterStatus}</span> 
                                            <span className="text-[#C22D2E] ml-1 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100 leading-none">
                                                {filterStatus === 'ALL' ? MOCK_DAILY_MONITOR.length : MOCK_DAILY_MONITOR.filter(x => x.status === filterStatus).length}
                                            </span> 
                                            <Icons.ChevronDown size={14} className="text-[#737597] ml-2"/>
                                        </button>
                                        
                                        {isStatusDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => setIsStatusDropdownOpen(false)}></div>
                                                <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-[#E6E1DB] shadow-lg rounded-xl overflow-hidden z-40 py-1">
                                                    {activeStatuses.map(st => (
                                                        <button 
                                                            key={st} 
                                                            onClick={() => { setFilterStatus(st); setIsStatusDropdownOpen(false); }} 
                                                            className="w-full text-left px-4 py-2.5 hover:bg-[#F2F4F6] text-[12px] font-black text-[#2E395F] uppercase tracking-widest transition-colors flex justify-between items-center"
                                                        >
                                                            {st}
                                                            {filterStatus === st && <Icons.Check size={14} className="text-[#C22D2E]" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="relative w-64 hidden md:block">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737597]" />
                                        <input 
                                            type="text" 
                                            placeholder="Search Active Order..." 
                                            value={searchDaily}
                                            onChange={(e) => setSearchDaily(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 text-[12px] font-bold text-[#2E395F] bg-white border border-[#E6E1DB] rounded-xl outline-none focus:border-[#C22D2E] shadow-sm h-10"
                                        />
                                    </div>
                                </div>

                                {/* Main Table (Highly Compact Padding + Adjusted Grid Cols) */}
                                <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse min-w-[1100px]">
                                        <thead className="sys-table-header sys-table-th sticky top-0 z-20 shadow-sm">
                                            <tr>
                                                <th className="py-4 px-6 pl-8 w-[25%] min-w-[280px]">ORDER / PRODUCT INFO</th>
                                                <th className="py-4 px-2 text-center w-[9.7%]"><Icons.ChefHat size={16} className="mx-auto opacity-90"/></th>
                                                <th className="py-4 px-2 text-center w-[9.7%]"><Icons.Component size={16} className="mx-auto opacity-90"/></th>
                                                <th className="py-4 px-2 text-center w-[9.7%]"><Icons.Thermometer size={16} className="mx-auto opacity-90"/></th>
                                                <th className="py-4 px-2 text-center w-[9.7%]"><Icons.Snowflake size={16} className="mx-auto opacity-90"/></th>
                                                <th className="py-4 px-2 text-center w-[9.7%]"><Icons.Scissors size={16} className="mx-auto opacity-90"/></th>
                                                <th className="py-4 px-2 text-center w-[9.7%]"><Icons.Package size={16} className="mx-auto opacity-90"/></th>
                                                <th className="py-4 px-2 text-center w-[9.7%]"><Icons.Archive size={16} className="mx-auto opacity-90"/></th>
                                                <th className="py-4 px-2 pr-6 text-center w-[7%]">PROGRESS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {filteredDailyMonitor.map((item, idx) => (
                                                <tr key={idx} className="border-b border-[#E6E1DB] hover:bg-[#F2F4F6]/50 transition-colors">
                                                    {/* Order Info */}
                                                    <td className="py-2.5 px-6 pl-8 border-r border-[#E6E1DB]/40 h-[70px]">
                                                        <div className="flex justify-between items-start mb-1.5">
                                                            <span className="bg-[#F2F4F6] border border-[#E6E1DB] text-[#737597] font-mono font-black text-[10px] px-2 py-0.5 rounded shadow-sm leading-none">{item.id}</span>
                                                            <span className="text-[#737597] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 leading-none"><Icons.User size={10}/> {item.customer}</span>
                                                        </div>
                                                        <h4 className="font-bold text-[#2E395F] text-[12px] mb-1.5 truncate max-w-[220px] leading-tight">{item.name}</h4>
                                                        <div className="flex justify-between items-center text-[10px]">
                                                            <span className="font-mono font-black text-[#737597] flex items-center gap-1.5 leading-none"><Icons.Target size={12} className="text-[#C22D2E]"/> {item.target} Batches</span>
                                                            <span className="bg-[#F2F4F6] border border-[#E6E1DB] text-[#737597] font-mono font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1.5 leading-none"><Icons.Clock size={10}/> {item.time}</span>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Stages */}
                                                    {item.stages.map((stage, sIdx) => (
                                                        <td key={sIdx} className="py-2.5 px-3 align-middle border-r border-[#E6E1DB]/40">
                                                            <div className="flex flex-col items-center justify-center gap-1.5 w-full mx-auto">
                                                                <span className={`font-mono font-black text-[12px] leading-none ${stage.count > 0 ? 'text-[#2E395F]' : 'text-[#94A3B8]'}`}>{stage.count}</span>
                                                                <div className="w-full h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden border border-[#E6E1DB]/50">
                                                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(stage.count / item.target) * 100}%`, backgroundColor: stage.count === 0 ? 'transparent' : stage.color }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    ))}

                                                    {/* Progress Circular */}
                                                    <td className="py-2.5 px-2 pr-6 align-middle text-center relative z-0">
                                                        <div className="relative w-8 h-8 mx-auto flex items-center justify-center bg-white rounded-full shadow-sm border border-[#E6E1DB]">
                                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm p-0.5" viewBox="0 0 36 36">
                                                                <circle cx="18" cy="18" r="15" fill="transparent" stroke="#F2F4F6" strokeWidth="3" />
                                                                <circle cx="18" cy="18" r="15" fill="transparent" stroke={item.progress > 0 ? "#DCBC1B" : "transparent"} strokeWidth="3" strokeDasharray="94.2" strokeDashoffset={94.2 - (94.2 * item.progress) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                                            </svg>
                                                            <span className="absolute text-[8px] font-mono font-black text-[#2E395F]">{item.progress}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredDailyMonitor.length === 0 && (
                                                <tr>
                                                    <td colSpan={9} className="py-16 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
                                                        No active orders match the criteria
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 2. PACKING QUEUE VIEW (Equal Cards Grid) */}
                        {activeTab === 'packing' && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 animate-fadeIn">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                    {MOCK_PACKING_QUEUE.map(item => (
                                        <div key={item.id} 
                                             className="border rounded-[14px] p-3 relative group transition-all hover:shadow-md hover:-translate-y-1 flex flex-col min-h-[160px] bg-white"
                                             style={{ borderColor: '#DCBC1B30', backgroundColor: '#DCBC1B1A' }}
                                        >
                                            <div className="flex justify-between items-start mb-2 gap-1">
                                                <span className="text-[10px] font-black text-[#55738D] font-mono tracking-tighter truncate">{item.id}</span>
                                                <span className="text-[8px] text-[#B06821] px-1.5 py-0.5 rounded-md border border-[#DCBC1B] font-black uppercase tracking-tight bg-white shadow-sm whitespace-nowrap">Ready</span>
                                            </div>
                                            <h4 className="font-bold text-[#2E395F] text-[11px] leading-tight line-clamp-2 mb-1" title={item.name}>{item.name}</h4>
                                            <p className="text-[9px] text-[#737597] font-mono mb-2 truncate">{item.sku}</p>
                                            
                                            <div className="status-inner-box p-2 mb-3 shadow-inner bg-white/90 grid grid-cols-2 gap-2 mt-auto">
                                                <div className="text-center">
                                                    <span className="block text-[8px] text-[#737597] font-black uppercase tracking-widest mb-0.5">Ready</span>
                                                    <span className="block text-[14px] font-black text-[#DCBC1B] leading-none font-mono">{item.readyToPack}</span>
                                                </div>
                                                <div className="text-center border-l border-[#E6E1DB]">
                                                    <span className="block text-[8px] text-[#737597] font-black uppercase tracking-widest mb-0.5">Packed</span>
                                                    <span className="block text-[14px] font-black text-[#55738D] leading-none font-mono">{item.packed}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-[9px] font-bold text-[#737597] uppercase tracking-widest px-1">
                                                <span>Target: <span className="font-mono text-[#2E395F]">{item.totalBatches}</span></span>
                                                <span className="text-[#55738D] font-black font-mono">{Math.round((item.packed/item.totalBatches)*100)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                    {MOCK_PACKING_QUEUE.length === 0 && (
                                        <div className="col-span-full py-16 text-center opacity-30">
                                            <Icons.Inbox size={40} className="mx-auto mb-2" />
                                            <p className="font-black uppercase tracking-widest text-[10px]">No items in packing queue</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 3. NOT STARTED VIEW (Equal Cards Grid) */}
                        {activeTab === 'not_started' && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 animate-fadeIn">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                    {MOCK_NOT_STARTED.map(item => (
                                        <div key={item.id} 
                                             className="border rounded-[14px] p-3 relative group transition-all hover:shadow-md hover:-translate-y-1 flex flex-col min-h-[160px] bg-white"
                                             style={{ borderColor: '#55738D30', backgroundColor: '#55738D1A' }}
                                        >
                                            <div className="flex justify-between items-start mb-2 gap-1">
                                                <span className="text-[10px] font-black text-[#55738D] font-mono tracking-tighter truncate">{item.id}</span>
                                                <span className={`text-[8px] px-1.5 py-0.5 rounded-md border font-black uppercase tracking-tight bg-white shadow-sm whitespace-nowrap ${item.priority === 'Urgent' ? 'text-[#C22D2E] border-[#C22D2E]' : 'text-[#55738D] border-[#55738D]'}`}>
                                                    Pending
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-[#2E395F] text-[11px] leading-tight line-clamp-2 mb-1" title={item.name}>{item.name}</h4>
                                            <p className="text-[9px] text-[#737597] font-mono mb-2 truncate">{item.sku}</p>
                                            
                                            <div className="status-inner-box p-2 mb-3 shadow-inner bg-white/90 flex flex-col gap-1.5 mt-auto">
                                                <div className="flex justify-between items-center text-[9px] font-bold text-[#737597] uppercase tracking-widest">
                                                    <span>Target:</span>
                                                    <span className="font-mono font-black text-[#2E395F] text-[11px]">{item.totalBatches} bts</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[9px] font-bold text-[#737597] uppercase tracking-widest">
                                                    <span>Planned:</span>
                                                    <span className="font-mono font-black text-[#C22D2E] text-[11px]">{item.plannedTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. COMPLETED VIEW (Equal Cards Grid) */}
                        {activeTab === 'completed' && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 animate-fadeIn">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                    {MOCK_COMPLETED.map(item => (
                                        <div key={item.id} 
                                             className="border rounded-[14px] p-3 relative group transition-all hover:shadow-md hover:-translate-y-1 flex flex-col min-h-[160px] bg-white"
                                             style={{ borderColor: '#537E7230', backgroundColor: '#537E721A' }}
                                        >
                                            <div className="flex justify-between items-start mb-2 gap-1">
                                                <span className="text-[10px] font-black text-[#55738D] font-mono tracking-tighter truncate">{item.id}</span>
                                                <span className="text-[8px] text-[#537E72] px-1.5 py-0.5 rounded-md border border-[#537E72] font-black uppercase tracking-tight bg-white shadow-sm whitespace-nowrap">Finished</span>
                                            </div>
                                            <h4 className="font-bold text-[#2E395F] text-[11px] leading-tight line-clamp-2 mb-1" title={item.name}>{item.name}</h4>
                                            <p className="text-[9px] text-[#737597] font-mono mb-2 truncate">{item.sku}</p>
                                            
                                            <div className="status-inner-box p-2 mb-3 shadow-inner bg-white/90 flex flex-col gap-1.5 mt-auto">
                                                <div className="flex items-center justify-between text-[9px] text-[#55738D] font-bold">
                                                    <span className="flex items-center gap-1 uppercase tracking-widest"><Icons.PackageCheck size={10} className="text-[#537E72]"/> Out</span>
                                                    <span className="text-[#2E395F] font-mono"><b className="text-[11px]">{item.totalBatches}</b> Bts</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[9px] text-[#737597] font-bold">
                                                    <span className="flex items-center gap-1 uppercase tracking-widest"><Icons.Clock size={10}/> Time</span>
                                                    <span className="font-mono text-[#2E395F] truncate max-w-[60px] text-right">{item.lastUpdated}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-1 mt-auto">
                                                <button className="flex-1 bg-white border border-[#E6E1DB] py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:border-[#537E72] hover:text-[#537E72] text-[#55738D] transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95">
                                                    <Icons.FileText size={10}/> Summary
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {MOCK_COMPLETED.length === 0 && (
                                        <div className="col-span-full py-16 text-center opacity-30">
                                            <Icons.Inbox size={40} className="mx-auto mb-2" />
                                            <p className="font-black uppercase tracking-widest text-[10px]">No completed items yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </>
    );
}
