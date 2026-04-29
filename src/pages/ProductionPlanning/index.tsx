import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';

// --- MOCK DATABASE (55+ ITEMS) ---
const FG_DATABASE = [
    { sku: 'FG-AFM-001', name: 'ไส้กรอกแดงจัมโบ้ AFM 1kg', weight: 1.0 },
    { sku: 'FG-AFM-002', name: 'ลูกชิ้นปลา AFM 500g', weight: 0.5 },
    { sku: 'FG-AFM-003', name: 'โบโลน่าไก่พริก AFM 1kg', weight: 1.0 },
    { sku: 'FG-1001', name: 'ไส้กรอกไก่จัมโบ้ ARO 1kg', weight: 1.0 },
    { sku: 'FG-1002', name: 'ไส้กรอกคอกเทล CP 500g', weight: 0.5 },
];
for(let i=10; i<60; i++) {
    const brands = ['ARO', 'CP', 'BKP', 'SAVE', 'AFM', 'Generic'];
    FG_DATABASE.push({ sku: `FG-GEN-${i}`, name: `${brands[i % brands.length]} สินค้าทดสอบรายการที่ ${i}`, weight: (i % 2 === 0 ? 1.0 : 0.5) });
}

// --- MASSIVE ORDER GENERATOR ---
const generateMockOrders = () => {
    const orders: any[] = [];
    let idCounter = 1;
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '').slice(2);
    const generateId = () => `${todayStr}-${String(idCounter++).padStart(3, '0')}`;

    // AFM Target 50T
    orders.push({ id: generateId(), sku: 'FG-AFM-001', name: 'ไส้กรอกแดงจัมโบ้ AFM 1kg', qty: 30000, fgKg: 30000, sfgKg: 30000, batterKg: 33000, deadline: '12:00', status: 'IN PROGRESS', isReplacement: false, shift: 'Morning', currentStep: 'Packing' });
    orders.push({ id: generateId(), sku: 'FG-AFM-002', name: 'ลูกชิ้นปลา AFM 500g', qty: 40000, fgKg: 20000, sfgKg: 20000, batterKg: 22000, deadline: '16:00', status: 'PLANNED', isReplacement: false, shift: 'Afternoon', currentStep: 'Mixing' });

    const shifts = ['Morning', 'Afternoon', 'Night'];
    const statuses = ['DRAFT', 'APPROVED', 'PLANNED', 'IN PROGRESS', 'COMPLETED'];
    for (let i = 0; i < 105; i++) {
        const fg = FG_DATABASE[Math.floor(Math.random() * FG_DATABASE.length)];
        const targetKg = Math.floor(Math.random() * 2500) + 500;
        const qty = Math.ceil(targetKg / fg.weight);
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        let deadline = shift === 'Morning' ? '12:00' : (shift === 'Afternoon' ? '16:00' : '23:59');
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        orders.push({
            id: generateId(), sku: fg.sku, name: fg.name, qty, fgKg: qty * fg.weight, sfgKg: qty * fg.weight, batterKg: Number((qty * fg.weight * 1.1).toFixed(2)),
            deadline, status, isReplacement: Math.random() > 0.9, shift, currentStep: status === 'PLANNED' ? 'Queue' : (status === 'IN PROGRESS' ? 'Mixing' : 'Entry')
        });
    }
    return orders;
};

const MOCK_ORDERS = generateMockOrders();

const SHIFTS = [
    { id: 'Morning', icon: 'sun', activeColor: 'bg-[#3b82f6] text-white shadow-md border-[#3b82f6]' },
    { id: 'Afternoon', icon: 'sunset', activeColor: 'bg-[#E3624A] text-white shadow-md border-[#E3624A]' },
    { id: 'Night', icon: 'moon', activeColor: 'bg-[#111f42] text-white shadow-md border-[#111f42]' },
    { id: 'All Day', icon: 'layers', activeColor: 'bg-slate-500 text-white shadow-md border-slate-500' }
];

const THEME = {
    primary: '#111f42',   // Primary Navy
    secondary: '#334155', // Slate 700
    warning: '#f59e0b',   // Amber 500
    success: '#10b981',   // Emerald 500
    info: '#3b82f6',      // Blue 500
    accent: '#E3624A',    // Accent Red
    muted: '#94a3b8'      // Slate 400
};

// --- HELPER COMPONENTS ---
const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return <Icons.HelpCircle size={size} className={className} style={style} />;
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.CircleHelp || Icons.Activity;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2} />;
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
    return createPortal(
        <>
            <div 
                className={`fixed inset-0 z-[190] bg-[#111f42]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[200] w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50 text-primary shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm"><LucideIcon name="book-open" size={18} className="text-primary"/> PRODUCTION GUIDE</h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-accent rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 text-slate-500 leading-relaxed text-[12px]">
                    <section>
                        <p className="mb-4"><strong>หน้าที่หลัก:</strong> ใช้สำหรับบริหารจัดการและจัดคิวการผลิตในฝั่งฝ่ายผลิต (Plan By Production) โดยรับข้อมูลออเดอร์มาจากฝ่ายวางแผน (Planning) เพื่อนำมาจัดสรรลงกระบวนการและแผนกต่างๆ อย่างละเอียด</p>
                        <ul className="list-disc list-outside ml-4 space-y-3">
                            <li><strong>ENTRY:</strong> ออเดอร์ที่เพิ่งรับเข้ามาใหม่ รอการประเมินและจัดคิวลงสายการผลิต</li>
                            <li><strong>QUEUE:</strong> ออเดอร์ที่ถูกจัดเรียงลำดับการผลิตเรียบร้อยแล้ว รอดำเนินการเข้าเครื่องจักร</li>
                            <li><strong>MIXING / PACKING:</strong> แท็บเฉพาะสำหรับติดตามสถานะออเดอร์ที่กำลังอยู่ในขั้นตอนการผลิตจริงในแต่ละแผนก</li>
                        </ul>
                    </section>
                    
                    <section>
                        <h4 className="text-sm font-black text-primary mb-4 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">
                            <LucideIcon name="heart-pulse" size={16} className="text-accent"/> PLAN HEALTH
                        </h4>
                        <p className="mb-3">ระบบแจ้งเตือนสถานะความเสี่ยงของออเดอร์ คำนวณแบบ Real-time โดยเทียบเวลาปัจจุบันกับกำหนดส่งมอบ (Deadline):</p>
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-widest min-w-[85px] text-center shadow-sm font-mono mt-0.5">ON PLAN</span>
                                <span className="flex-1 leading-tight">อยู่ในแผนงานปกติ มีเวลาดำเนินการเพียงพอ (มากกว่า 2 ชั่วโมงก่อนกำหนด)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-black uppercase tracking-widest min-w-[85px] text-center shadow-sm font-mono mt-0.5">URGENT</span>
                                <span className="flex-1 leading-tight">ออเดอร์เร่งด่วน ใกล้ถึงกำหนดส่งมอบ (เหลือเวลา &le; 2 ชั่วโมง)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black uppercase tracking-widest min-w-[85px] text-center shadow-sm font-mono mt-0.5 animate-pulse">DELAYED</span>
                                <span className="flex-1 leading-tight">ออเดอร์ล่าช้าเกินกำหนดส่งมอบ ต้องเร่งติดตามและจัดการทันที หรือเป็นออเดอร์ฉุกเฉิน (Replacement)</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-sm font-black text-primary mb-4 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">
                            <LucideIcon name="alert-triangle" size={16} className="text-accent"/> REPLACEMENT ORDERS
                        </h4>
                        <p><strong>การจัดการออเดอร์ทดแทน (Replacement):</strong></p>
                        <p className="mt-2">เมื่อเกิดความสูญเสีย (Loss/Waste) ระหว่างกระบวนการผลิต ฝ่ายผลิตสามารถสร้าง "ออเดอร์ทดแทน" ผ่านปุ่ม Add New Order โดยระบุ Job Type เป็น "Replacement" ระบบจะไฮไลท์และแจ้งเตือนในสถานะ DELAYED สีแดงทันที เพื่อให้ความสำคัญระดับสูงสุดและผลิตทันกำหนดเวลา</p>
                    </section>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end shadow-inner shrink-0">
                    <button onClick={onClose} className="sys-btn-primary">เข้าใจแล้ว</button>
                </div>
            </div>
        </>,
        document.body
    );
}

const KPICard = ({ title, val, color, icon, desc, unit }: any) => (
  <div className="sys-card-base relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start z-10 h-full">
      <div className="flex flex-col justify-center gap-1">
        <p className="sys-kpi-label mb-3">{title}</p>
        <div className="flex flex-col gap-1 items-start">
          <h3 className="sys-kpi-value">{val} <span className="text-[14px] text-slate-400 font-medium">{unit}</span></h3>
          <div className="flex items-center gap-1.5 opacity-80 mt-1">
             <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">
                  {desc}
             </p>
          </div>
        </div>
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform shrink-0">
        <LucideIcon name={icon} size={20} style={{ color: color }} strokeWidth={2.5} />
      </div>
    </div>
    <div className="absolute -right-4 -bottom-4 text-slate-100 pointer-events-none group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500 z-0">
      <LucideIcon name={icon} size={100} style={{ opacity: 0.1, color: color }} />
    </div>
  </div>
);

const StandardModalWrapper = ({ children, className }: any) => (
    <div className={`relative ${className}`} onClick={e => e.stopPropagation()}>
        {children}
    </div>
);

// --- MAIN APPLICATION ---
export default function ProductionPlanning() {
    const [activeMainTab, setActiveMainTab] = useState('Entry');
    const [activeShift, setActiveShift] = useState('All Day');
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showGuide, setShowGuide] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newItem, setNewItem] = useState({ date: new Date().toISOString().split('T')[0], time: '12:00', jobType: 'Normal', sku: '', quantity: '' });

    useEffect(() => {
        setTimeout(() => setLoading(false), 600);
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleAddOrder = () => {
        if (!newItem.sku || !newItem.quantity) return;
        const fg = FG_DATABASE.find(f => f.sku === newItem.sku);
        const qtyNum = Number(newItem.quantity);
        const fgKg = qtyNum * (fg?.weight || 1);
        const shift = newItem.time === '12:00' ? 'Morning' : (newItem.time === '16:00' ? 'Afternoon' : 'Night');

        const newOrder = {
            id: `260416-N${String(Math.floor(Math.random()*1000)).padStart(3, '0')}`,
            sku: newItem.sku, name: fg?.name || 'Unknown', qty: qtyNum, fgKg, sfgKg: fgKg, batterKg: Number((fgKg * 1.1).toFixed(2)),
            deadline: newItem.time, startTime: 'TBD', status: 'DRAFT', isReplacement: newItem.jobType === 'Replacement',
            shift, currentStep: 'Entry'
        };
        setOrders([newOrder, ...orders]);
        setNewItem({ ...newItem, sku: '', quantity: '' });
        setIsAddModalOpen(false);
        if ((window as any).Swal) (window as any).Swal.fire({ icon: 'success', title: 'Order Added', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    };

    const handleDelete = (id: string) => {
        if ((window as any).Swal) {
            (window as any).Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#E3624A', confirmButtonText: 'Yes, delete it!' })
            .then((result: any) => { if (result.isConfirmed) setOrders(orders.filter(p => p.id !== id)); });
        } else {
             if(window.confirm('Are you sure you want to delete this order?')) {
                 setOrders(orders.filter(p => p.id !== id));
             }
        }
    };

    const totalSummary = useMemo(() => {
        return orders.reduce((acc, curr) => ({ fg: acc.fg + curr.fgKg, sfg: acc.sfg + curr.sfgKg, batter: acc.batter + curr.batterKg }), { fg: 0, sfg: 0, batter: 0 });
    }, [orders]);

    const getAlarmStatus = (deadline: string, status: string) => {
        if (status === 'COMPLETED') return { color: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: 'COMPLETED', blink: false };
        const [dh, dm] = (deadline || '23:59').split(':').map(Number);
        const deadlineDate = new Date(); deadlineDate.setHours(dh, dm, 0, 0);
        if (currentTime > deadlineDate) return { color: 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm', label: 'DELAYED', blink: true };
        const diffMs = deadlineDate.getTime() - currentTime.getTime();
        if (diffMs <= 2 * 60 * 60 * 1000) return { color: 'bg-amber-50 text-amber-600 border-amber-200', label: 'URGENT', blink: false };
        return { color: 'bg-slate-50 text-slate-500 border-slate-200', label: 'ON PLAN', blink: false };
    };

    const filteredOrders = useMemo(() => {
        let filtered = orders;
        if (activeShift !== 'All Day') filtered = filtered.filter(o => o.shift === activeShift);
        if (activeMainTab === 'Entry') filtered = filtered.filter(o => ['DRAFT', 'APPROVED', 'PLANNED'].includes(o.status) && o.currentStep === 'Entry');
        else filtered = filtered.filter(o => o.currentStep === activeMainTab);
        
        if (searchTerm) {
            filtered = filtered.filter(o => 
                o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.sku.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return filtered;
    }, [orders, activeShift, activeMainTab, searchTerm]);

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent">
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-accent" />
                <span className="text-primary font-black uppercase tracking-widest text-sm animate-pulse">Loading Planning Data...</span>
            </div>
        </div>
    );

    return (
        <div className="w-full relative flex flex-col h-full min-h-0">
            <GuideTrigger onClick={() => setShowGuide(true)} />
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} />
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn pb-6">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="sys-header-icon-box text-primary">
                        <Icons.Calendar className="sys-header-icon" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center leading-none">
                        <h1 className="sys-title-main flex gap-2">
                            <span>PRODUCTION</span>
                            <span className="text-accent">PLANNING</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.3em]">Managing active production orders & execution</p>
                    </div>
                </div>
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
                    {['Entry', 'Queue', 'Mixing', 'Packing'].map(tab => (
                        <button key={tab} onClick={() => setActiveMainTab(tab)} className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${activeMainTab === tab ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                            {tab === 'Entry' && <Icons.Edit3 size={14} />} {tab}
                        </button>
                    ))}
                </div>
            </header>

            <main className="sys-page-layout flex flex-col flex-1 min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                    <KPICard title="Total FG Required" val={totalSummary.fg} unit="Kg" color={THEME.primary} icon="package-check" desc="Output" />
                    <KPICard title="Flagship AFM" val={50000} unit="Kg" color={THEME.accent} icon="award" desc="Target 50T" />
                    <KPICard title="SFG Buffer" val={totalSummary.sfg} unit="Kg" color={THEME.warning} icon="layers" desc="WIP" />
                    <KPICard title="Daily Batter" val={Math.ceil(totalSummary.batter)} unit="Kg" color={THEME.success} icon="chef-hat" desc="Mixing" />
                </div>

                <div className="sys-table-card flex flex-col flex-1 flex-1 shadow-soft min-h-0">
                    <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white gap-4 shrink-0">
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-sm overflow-x-auto custom-scrollbar">
                            {SHIFTS.map(shift => (
                                <button key={shift.id} onClick={() => setActiveShift(shift.id)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeShift === shift.id ? shift.activeColor : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}><LucideIcon name={shift.icon} size={14} /> {shift.id}</button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                                <input type="text" placeholder="Search Order, SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="sys-input w-full pl-10 pr-4 py-2" />
                            </div>
                            <div className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 shadow-sm px-3 py-2 rounded-md">{filteredOrders.length} Items</div>
                            <button onClick={() => setIsAddModalOpen(true)} className="sys-btn-primary whitespace-nowrap shrink-0 h-10"><Icons.Plus size={16}/> New Order</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                            <table className="w-full text-left min-w-[1000px] border-collapse">
                                <thead className="sys-table-header sys-table-th sticky top-0 z-10">
                                    <tr>
                                        <th className="py-4 px-6 pl-8 w-[12%] whitespace-nowrap">Plan ID</th>
                                        <th className="py-4 px-6 text-center w-[12%] whitespace-nowrap">Plan Health</th>
                                        <th className="py-4 px-6 w-auto whitespace-nowrap">Product</th>
                                        <th className="py-4 px-6 text-center w-[12%] whitespace-nowrap">Order Qty</th>
                                        <th className="py-4 px-6 text-center w-[12%] whitespace-nowrap">Weight (Kg)</th>
                                        <th className="py-4 px-6 text-center w-[10%] whitespace-nowrap">Deadline</th>
                                        <th className="py-4 px-6 text-center w-[10%] whitespace-nowrap">Status</th>
                                        <th className="py-4 px-6 pr-8 text-center w-[10%] whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredOrders.map(o => {
                                        const alarm = getAlarmStatus(o.deadline, o.status);
                                        return (
                                            <tr key={o.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
                                                <td className="sys-table-td py-3 px-6 pl-8 align-middle">
                                                    <div className="flex flex-col items-start gap-0.5">
                                                        <span className="font-bold text-primary text-[12px] font-mono tracking-tight">{o.id}</span>
                                                        {o.isReplacement && <span className="text-[8px] bg-rose-50 text-accent px-1.5 py-0.5 rounded uppercase font-black tracking-widest border border-rose-200">Replacement</span>}
                                                    </div>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 align-middle text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm transition-all ${alarm.color} ${alarm.blink ? 'opacity-80' : ''}`}>{alarm.label}</span>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 align-middle">
                                                    <div className="font-bold text-primary text-[12px] leading-tight max-w-[200px] truncate" title={o.name}>{o.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono font-medium mt-0.5">{o.sku}</div>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 align-middle text-center font-mono font-bold text-primary text-[12px]">
                                                    {o.qty.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">Pks</span>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 align-middle text-center font-mono text-slate-500 font-bold text-[12px]">
                                                    {o.fgKg.toLocaleString()} <span className="text-[9px] font-normal text-slate-400">Kg</span>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 align-middle text-center font-mono font-black text-accent text-[12px]">
                                                    {o.deadline}
                                                </td>
                                                <td className="sys-table-td py-3 px-6 align-middle text-center">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shadow-sm ${o.status === 'PLANNED' || o.status === 'IN PROGRESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{o.status}</span>
                                                </td>
                                                <td className="sys-table-td py-3 px-6 pr-8 align-middle text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button className="sys-btn-action hover:text-primary"><Icons.Edit3 size={14} /></button>
                                                        <button onClick={() => handleDelete(o.id)} className="sys-btn-action hover:text-accent hover:bg-rose-50 hover:border-red-200"><Icons.Trash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[12px] opacity-70">
                                                No Orders Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                </div>
            </main>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn font-sans">
                    <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative border border-white/40 max-h-[90vh]">
                        <div className="bg-primary px-8 py-5 flex justify-between items-center shrink-0 border-b border-primary">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20"><Icons.Plus size={20} className="text-warning" /></div>
                                <div><h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Add New Production Order</h3><p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1.5">Direct Entry to Queue</p></div>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><Icons.X size={20} /></button>
                        </div>
                        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-8 bg-slate-50">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">1. Delivery Deadline</label>
                                    <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                                        {['12:00', '16:00', '24:00'].map(t => (
                                            <button key={t} onClick={()=>setNewItem({...newItem, time: t})} className={`flex-1 py-2.5 rounded-lg text-[11px] font-black transition-all font-mono uppercase ${newItem.time === t ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-slate-500 hover:text-primary hover:bg-slate-50'}`}>{t}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">2. Job Type</label>
                                    <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                                        <button onClick={()=>setNewItem({...newItem, jobType: 'Normal'})} className={`flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${newItem.jobType === 'Normal' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-primary hover:bg-slate-50'}`}>Normal</button>
                                        <button onClick={()=>setNewItem({...newItem, jobType: 'Replacement'})} className={`flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${newItem.jobType === 'Replacement' ? 'bg-accent text-white shadow-sm' : 'text-slate-500 hover:text-accent hover:bg-rose-50'}`}>Replacement</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">3. Finished Goods (FG)</label>
                                <select value={newItem.sku} onChange={e => setNewItem({...newItem, sku: e.target.value})} className="sys-input w-full cursor-pointer uppercase">
                                    <option value="" disabled>-- SELECT PRODUCT --</option>
                                    {FG_DATABASE.map(f => <option key={f.sku} value={f.sku}>{f.sku} : {f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">4. Quantity (Packs)</label>
                                <div className="relative">
                                    <input type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} className="sys-input w-full p-4 text-2xl font-mono font-black text-primary pr-16" placeholder="0" />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">PCK</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 text-slate-500 hover:text-primary font-bold text-[10px] uppercase tracking-widest transition-colors shadow-none">Cancel</button>
                            <button onClick={handleAddOrder} className="sys-btn-primary"><Icons.PlusCircle size={16} /> Add to Production Queue</button>
                        </div>
                    </StandardModalWrapper>
                </div>
            )}
        </div>
    );
}
