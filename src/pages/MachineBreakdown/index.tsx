import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// --- THEME COLORS FOR CHARTS ---
const THEME = {
    primary: '#111f42',   // Primary Navy
    secondary: '#334155', // Slate 700
    warning: '#f59e0b',   // Amber 500
    success: '#10b981',   // Emerald 500
    info: '#3b82f6',      // Blue 500
    accent: '#E3624A',    // Accent Red
    muted: '#94a3b8'      // Slate 400
};

// --- Mocking External Dependencies ---
const Swal = typeof window !== 'undefined' ? ((window as any).Swal || null) : null;

// --- MOCK DATA ---
const MOCK_EQUIPMENT = [
    { id: 'EQ-MIX-01', name: 'Vacuum Mixer 500L', type: 'Mixing', step: '1' },
    { id: 'EQ-MIX-02', name: 'Bowl Cutter 200L', type: 'Mixing', step: '1' },
    { id: 'EQ-FRM-01', name: 'Twist Linker A', type: 'Forming', step: '2' },
    { id: 'EQ-FRM-02', name: 'Clipper Direct B', type: 'Forming', step: '2' },
    { id: 'EQ-OVK-01', name: 'Smoke House 6T', type: 'Cooking', step: '3' },
    { id: 'EQ-OVK-02', name: 'Steam Oven 4T', type: 'Cooking', step: '3' },
    { id: 'EQ-PAC-01', name: 'Thermoformer X1', type: 'Packing', step: '7' },
];

const generateMockBreakdowns = () => {
    return [
        { id: 'BD-260401', date: '04/04/2026', machineId: 'EQ-MIX-01', machineName: 'Vacuum Mixer 500L', problem: 'Motor Overheating (Temp > 85c)', actionTaken: '', downtimeMinutes: 45, status: 'Open', reportedBy: 'Operator A' },
        { id: 'BD-260402', date: '03/04/2026', machineId: 'EQ-FRM-01', machineName: 'Twist Linker A', problem: 'Casing Jammed / Tearing', actionTaken: 'Replaced linking nozzle and recalibrated speed', downtimeMinutes: 20, status: 'Resolved', reportedBy: 'Tech Lead' },
        { id: 'BD-260403', date: '01/04/2026', machineId: 'EQ-OVK-01', machineName: 'Smoke House 6T', problem: 'Steam Valve Leak', actionTaken: 'Tightened valve and replaced gasket seal', downtimeMinutes: 120, status: 'Resolved', reportedBy: 'Maintenance' },
        { id: 'BD-260329', date: '29/03/2026', machineId: 'EQ-PAC-01', machineName: 'Thermoformer X1', problem: 'Vacuum Pump Failure', actionTaken: 'Swapped backup pump unit', downtimeMinutes: 90, status: 'Resolved', reportedBy: 'Maintenance' },
        { id: 'BD-260328', date: '28/03/2026', machineId: 'EQ-MIX-02', machineName: 'Bowl Cutter 200L', problem: 'Blade sensor error', actionTaken: '', downtimeMinutes: 15, status: 'Open', reportedBy: 'Operator B' },
    ];
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
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm"><LucideIcon name="book-open" size={18} className="text-primary"/> BREAKDOWN GUIDE</h3>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-accent rounded-full transition-colors"><LucideIcon name="x" size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 text-slate-500 leading-relaxed text-[12px]">
                    <section>
                        <p className="mb-4"><strong className="text-primary font-mono">หน้าที่หลัก:</strong> ใช้สำหรับบันทึกและติดตามประวัติการซ่อมบำรุงเมื่อเครื่องจักรขัดข้อง (<span className="font-mono">Machine Breakdown</span>) พร้อมระบบคำนวณประสิทธิภาพการทำงานโดยรวมของเครื่องจักร (<span className="font-mono">OEE</span>)</p>
                        <ul className="list-disc list-outside ml-4 space-y-3">
                            <li><strong className="text-primary font-mono">BREAKDOWN LIST:</strong> ตารางแสดงประวัติเครื่องจักรขัดข้อง สามารถบันทึกปัญหา (<span className="font-mono">Problem</span>), แนวทางแก้ไข (<span className="font-mono">Action</span>) และเวลาที่สูญเสีย (<span className="font-mono">Downtime</span>)</li>
                            <li><strong className="text-primary font-mono">OEE METRICS:</strong> แดชบอร์ดสรุปประสิทธิภาพเครื่องจักรแบบเจาะลึก แยกเป็น <span className="font-mono">Availability</span> และ <span className="font-mono">Quality</span> พร้อมกราฟแนวโน้มย้อนหลัง</li>
                            <li><strong className="text-primary font-mono">DASHBOARD:</strong> กราฟวิเคราะห์เพื่อค้นหาเครื่องจักรที่มีปัญหาบ่อยสุด (<span className="font-mono">Top Downtime</span>) และประเภทปัญหาที่เกิดซ้ำ (<span className="font-mono">Top Issues</span>) เพื่อวางแผน <span className="font-mono">PM</span></li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="text-sm font-black text-primary mb-4 uppercase flex items-center gap-2 border-b border-slate-200 pb-2 font-mono">
                            <LucideIcon name="activity" size={16} className="text-accent"/> OEE DEFINITIONS
                        </h4>
                        <div className="space-y-4 mt-4">
                            <div className="flex items-start gap-4">
                                <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-black uppercase tracking-widest min-w-[85px] text-center shadow-sm font-mono mt-0.5">AVAILABILITY</span>
                                <span className="flex-1 leading-relaxed">อัตราความพร้อมใช้งานเครื่องจักร คำนวณจาก <span className="font-mono">(Planned Time - Downtime) / Planned Time</span></span>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black uppercase tracking-widest min-w-[85px] text-center shadow-sm font-mono mt-0.5">QUALITY</span>
                                <span className="flex-1 leading-relaxed">อัตราคุณภาพการผลิต คำนวณจาก <span className="font-mono">Good Count / Total Count</span> (ชิ้นงานดีเทียบกับชิ้นงานทั้งหมด)</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="px-3 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black uppercase tracking-widest min-w-[85px] text-center shadow-sm font-mono mt-0.5">TARGET &gt; 85%</span>
                                <span className="flex-1 leading-relaxed">เป้าหมายมาตรฐานสากล <span className="font-mono">(World Class OEE)</span> ระบบจะแสดงเส้นประในกราฟ <span className="font-mono">Trend</span> เพื่อเปรียบเทียบ</span>
                            </div>
                        </div>
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

const StandardModalWrapper = ({ children, className }: any) => (
    <div className={`relative ${className}`} onClick={e => e.stopPropagation()}>
        {children}
    </div>
);

// --- MAIN APPLICATION ---
export default function MachineBreakdown() {
    const [activeTab, setActiveTab] = useState('breakdown_list');
    const [breakdowns, setBreakdowns] = useState<any[]>([]);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formMachineId, setFormMachineId] = useState('');
    const [formProblem, setFormProblem] = useState('');
    const [formAction, setFormAction] = useState('');
    const [formDowntime, setFormDowntime] = useState(0);
    const [formStatus, setFormStatus] = useState('Open');

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            setTimeout(() => {
                setEquipment(MOCK_EQUIPMENT);
                setBreakdowns(generateMockBreakdowns());
                setLoading(false);
            }, 600);
        };
        loadData();
    }, []);

    const filteredData = useMemo(() => {
        return breakdowns.filter(item => {
            const matchSearch = item.machineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchSearch;
        });
    }, [searchTerm, breakdowns]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const handleOpenModal = (item: any = null) => {
        if (item && item.id) {
            setEditingItem(item);
            setFormMachineId(item.machineId);
            setFormProblem(item.problem);
            setFormAction(item.actionTaken);
            setFormDowntime(item.downtimeMinutes);
            setFormStatus(item.status);
        } else {
            setEditingItem(null);
            setFormMachineId('');
            setFormProblem('');
            setFormAction('');
            setFormDowntime(0);
            setFormStatus('Open');
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formMachineId || !formProblem) {
            if (Swal) Swal.fire('Warning', 'Please select a Machine and describe the Problem', 'warning');
            else alert('Please select a Machine and describe the Problem');
            return;
        }

        const selectedMachine = equipment.find(e => e.id === formMachineId);
        const machineName = selectedMachine ? selectedMachine.name : formMachineId;

        const newItem = {
            id: editingItem ? editingItem.id : `BD-${Date.now().toString().slice(-6)}`,
            date: editingItem ? editingItem.date : new Date().toLocaleDateString('en-GB'),
            machineId: formMachineId,
            machineName,
            problem: formProblem,
            actionTaken: formAction,
            downtimeMinutes: formDowntime,
            status: formStatus,
            reportedBy: editingItem ? editingItem.reportedBy : 'Current User'
        };

        let updatedBreakdowns;
        if (editingItem) {
            updatedBreakdowns = breakdowns.map(b => b.id === newItem.id ? newItem : b);
        } else {
            updatedBreakdowns = [newItem, ...breakdowns];
        }

        setBreakdowns(updatedBreakdowns);
        setIsModalOpen(false);
        if(Swal) Swal.fire({ icon: 'success', title: 'Saved Successfully', showConfirmButton: false, timer: 1000 });
    };

    const handleDelete = (id: string) => {
        if(Swal) {
            Swal.fire({ title: 'Are you sure?', text: `Delete record ${id}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E', confirmButtonText: 'Yes, delete it!' }).then((result: any) => { 
                if (result.isConfirmed) { 
                    setBreakdowns(breakdowns.filter(item => item.id !== id)); 
                    Swal.fire({icon: 'success', title: 'Deleted!', text: 'Record deleted.', timer: 1500, showConfirmButton: false}); 
                } 
            });
        } else {
            if(window.confirm('Are you sure you want to delete this record?')) {
                setBreakdowns(breakdowns.filter(item => item.id !== id));
            }
        }
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent">
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-accent" />
                <span className="text-primary font-black uppercase tracking-widest text-sm animate-pulse">Loading Equipment Data...</span>
            </div>
        </div>
    );

    const totalDowntime = breakdowns.reduce((sum, b) => sum + b.downtimeMinutes, 0);
    const openIssues = breakdowns.filter(b => b.status === 'Open').length;
    const resolvedIssues = breakdowns.filter(b => b.status === 'Resolved').length;

    // Calculate Mock OEE
    const totalAvailableTime = equipment.length * 8 * 60; // Assuming 8 hours per machine
    const availability = totalAvailableTime > 0 ? ((totalAvailableTime - totalDowntime) / totalAvailableTime) * 100 : 100;

    return (
        <div className="w-full relative flex flex-col h-full min-h-0">
            <GuideTrigger onClick={() => setShowGuide(true)} />
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} />

            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn pb-6 z-10 relative">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="sys-header-icon-box text-primary">
                        <Icons.Wrench className="sys-header-icon" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center leading-none">
                        <h1 className="sys-title-main flex gap-2">
                            <span>MACHINE</span>
                            <span className="text-accent">BREAKDOWN</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.3em]">Maintenance & Breakdown Tracking</p>
                    </div>
                </div>
                
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
                    <button onClick={() => setActiveTab('breakdown_list')} className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${activeTab === 'breakdown_list' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                        <Icons.List size={14} /> Breakdown List
                    </button>
                    <button onClick={() => setActiveTab('oee')} className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${activeTab === 'oee' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                        <Icons.Activity size={14} /> OEE Metrics
                    </button>
                    <button onClick={() => setActiveTab('dashboard')} className={`sys-tab-btn flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                        <Icons.PieChart size={14} /> Dashboard
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full pb-10 flex flex-col gap-6 relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                
                {/* KPI Row (Only show in breakdown list to save space) */}
                {activeTab === 'breakdown_list' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <KPICard title="Total Downtime" val={totalDowntime} unit="Min" color={THEME.accent} icon="clock" desc="Across all machines" />
                        <KPICard title="Open Issues" val={openIssues} color={THEME.warning} icon="alert-triangle" desc="Require attention" />
                        <KPICard title="Resolved" val={resolvedIssues} color={THEME.success} icon="check-circle" desc="Fixed issues" />
                        <KPICard title="Avg Availability" val={availability.toFixed(1)} unit="%" color={THEME.info} icon="activity" desc="Estimated OEE Availability" />
                    </div>
                )}

                {/* MAIN CONTENT AREA */}
                {activeTab === 'breakdown_list' && (
                    <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-transparent overflow-hidden">
                        {/* TOOLBAR */}
                        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center shrink-0 gap-4 bg-white/50 backdrop-blur-sm rounded-t-2xl border-x border-t border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-[12px] font-black text-primary uppercase tracking-widest">
                                    <Icons.List size={16} className="text-accent"/>
                                    <span>Breakdown Records</span>
                                </div>
                                <span className="text-slate-300">|</span>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded-md">{filteredData.length} Records</div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    <input type="text" placeholder="Search Machine, Issue..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="sys-input w-full pl-10 pr-4 py-2" />
                                </div>
                                <button onClick={() => handleOpenModal()} className="sys-btn-primary whitespace-nowrap shrink-0">
                                    <Icons.AlertTriangle size={14} /> Report Issue
                                </button>
                            </div>
                        </div>

                        {/* TABLE (Lean & Clean Padding) */}
                        <div className="flex-1 overflow-hidden flex flex-col bg-white border-x border-b border-slate-200 rounded-b-2xl shadow-sm">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left min-w-[900px] border-collapse">
                                    <thead className="sys-table-header sys-table-th sticky top-0 z-10">
                                        <tr>
                                            <th className="py-4 px-6 pl-8 w-[12%] whitespace-nowrap">Date</th>
                                            <th className="py-4 px-6 w-[25%] whitespace-nowrap">Machine</th>
                                            <th className="py-4 px-6 w-[20%] whitespace-nowrap">Problem</th>
                                            <th className="py-4 px-6 w-[20%] whitespace-nowrap">Action Taken</th>
                                            <th className="py-4 px-6 w-[10%] text-right whitespace-nowrap">Downtime</th>
                                            <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Status</th>
                                            <th className="py-4 px-6 pr-8 text-right w-20 whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {paginatedData.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 group">
                                                
                                                {/* Col 1: Date & ID */}
                                                <td className="py-3 px-6 pl-8 align-middle">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="font-bold text-primary text-[12px] font-mono">{item.date}</span>
                                                        <span className="text-slate-500 text-[10px] font-mono font-bold">{item.id}</span>
                                                    </div>
                                                </td>

                                                {/* Col 2: Machine */}
                                                <td className="sys-table-td py-3 px-6 align-middle font-bold text-primary">
                                                    {item.machineName}
                                                </td>

                                                {/* Col 3: Problem */}
                                                <td className="sys-table-td py-3 px-6 align-middle">
                                                    <div className="text-[12px] text-accent font-bold line-clamp-2 whitespace-normal break-words" title={item.problem}>
                                                        {item.problem}
                                                    </div>
                                                </td>

                                                {/* Col 4: Action */}
                                                <td className="sys-table-td py-3 px-6 align-middle">
                                                    <div className="text-[11px] text-slate-500 font-medium line-clamp-2 whitespace-normal break-words" title={item.actionTaken || 'Pending action'}>
                                                        {item.actionTaken || <span className="italic text-slate-300">-</span>}
                                                    </div>
                                                </td>

                                                {/* Col 5: Downtime */}
                                                <td className="sys-table-td py-3 px-6 align-middle text-right">
                                                    <div className="flex items-baseline justify-end gap-1 whitespace-nowrap">
                                                        <span className="font-mono font-black text-accent text-[12px]">
                                                            {item.downtimeMinutes}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                            Min
                                                        </span>
                                                    </div>
                                                </td>
                                                
                                                {/* Col 6: Status */}
                                                <td className="sys-table-td py-3 px-6 align-middle text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border whitespace-nowrap ${item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>

                                                {/* Col 7: Action */}
                                                <td className="py-3 px-6 pr-8 align-middle">
                                                    <div className="flex justify-end gap-2 text-slate-500">
                                                        <button onClick={() => handleOpenModal(item)} className="sys-btn-action hover:text-primary">
                                                            <Icons.Pencil size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} className="sys-btn-action hover:text-accent hover:bg-rose-50 hover:border-red-200">
                                                            <Icons.Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                        {paginatedData.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[12px] opacity-70">
                                                    No Records Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination (Synced) */}
                            <div className="sys-pagination-container shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="sys-pagination-text text-slate-500">SHOW:</span>
                                        <select 
                                            value={itemsPerPage} 
                                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                            className="sys-pagination-select"
                                        >
                                            {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div className="sys-pagination-text text-slate-500">TOTAL {filteredData.length} ITEMS</div>
                                </div>
                                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="sys-pagination-btn"><Icons.ChevronLeft size={16}/></button>
                                    <div className="sys-pagination-text bg-slate-50 border border-slate-200 px-5 py-2 rounded-lg min-w-[120px] text-center">PAGE {currentPage} OF {totalPages || 1}</div>
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="sys-pagination-btn"><Icons.ChevronRight size={16}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'oee' && (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                        <div className="sys-card-base p-8 shrink-0">
                            <h3 className="font-black text-primary flex items-center gap-2 uppercase tracking-widest mb-8 text-sm"><LucideIcon name="activity" size={18} className="text-accent" /> Overall Equipment Effectiveness (OEE)</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Overall OEE */}
                                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Overall OEE</h4>
                                    <div className="relative w-44 h-44 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.primary} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 78) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-primary font-mono">78<span className="text-xl text-slate-400">%</span></span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-6 text-center font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-md border border-slate-200">Target: 85%</p>
                                </div>

                                {/* Availability */}
                                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Availability</h4>
                                    <div className="relative w-44 h-44 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.info} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * availability) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-primary font-mono">{availability.toFixed(1)}<span className="text-xl text-slate-400">%</span></span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-6 text-center font-bold uppercase tracking-widest">Operating / Planned</p>
                                </div>

                                {/* Quality */}
                                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Quality</h4>
                                    <div className="relative w-44 h-44 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.success} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 98.5) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black text-primary font-mono">98.5<span className="text-xl text-slate-400">%</span></span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-6 text-center font-bold uppercase tracking-widest">Good / Total Count</p>
                                </div>
                            </div>
                        </div>
                        <div className="sys-card-base p-8 flex-1">
                            <h3 className="font-black text-primary flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="trending-up" size={18} className="text-accent" /> OEE Trend (Last 7 Days)</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[
                                        { name: 'Mon', oee: 75, target: 85 }, { name: 'Tue', oee: 78, target: 85 },
                                        { name: 'Wed', oee: 82, target: 85 }, { name: 'Thu', oee: 76, target: 85 },
                                        { name: 'Fri', oee: 79, target: 85 }, { name: 'Sat', oee: 84, target: 85 },
                                        { name: 'Sun', oee: 78, target: 85 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'JetBrains Mono' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'JetBrains Mono' }} domain={[60, 100]} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px', fontWeight: 'bold', color: '#111f42' }} />
                                        <Line type="monotone" dataKey="oee" name="Actual OEE %" stroke={THEME.primary} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6, fill: THEME.primary, stroke: 'white' }} />
                                        <Line type="monotone" dataKey="target" name="Target (85%)" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Downtime by Machine */}
                            <div className="sys-card-base p-8">
                                <h3 className="font-black text-primary flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="bar-chart-2" size={18} className="text-accent" /> Downtime by Machine</h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={
                                            Object.values(breakdowns.reduce((acc, curr) => {
                                                if (!acc[curr.machineName]) acc[curr.machineName] = { name: curr.machineName, downtime: 0 };
                                                acc[curr.machineName].downtime += curr.downtimeMinutes;
                                                return acc;
                                            }, {} as any)).sort((a: any, b: any) => b.downtime - a.downtime).slice(0, 5)
                                        } layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'JetBrains Mono' }} />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#111f42', fontWeight: 'bold' }} width={120} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                            <Bar dataKey="downtime" name="Downtime (Min)" fill={THEME.primary} radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Problem Types */}
                            <div className="sys-card-base p-8">
                                <h3 className="font-black text-primary flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="pie-chart" size={18} className="text-accent" /> Top Issues</h3>
                                <div className="h-72 w-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={
                                                    Object.values(breakdowns.reduce((acc, curr) => {
                                                        const prob = curr.problem.substring(0, 20) + (curr.problem.length > 20 ? '...' : '');
                                                        if (!acc[prob]) acc[prob] = { name: prob, value: 0 };
                                                        acc[prob].value += 1;
                                                        return acc;
                                                    }, {} as any)).sort((a: any, b: any) => b.value - a.value).slice(0, 4)
                                                }
                                                cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value"
                                            >
                                                {
                                                    [THEME.primary, THEME.warning, THEME.info, THEME.secondary].map((color, index) => (
                                                        <Cell key={`cell-${index}`} fill={color} stroke="none" />
                                                    ))
                                                }
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#111f42' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal for Add/Edit (Synced with STDProcess Modal Layout) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn font-sans">
                    <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative border border-white/40 max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-primary px-8 py-5 flex justify-between items-center shrink-0 border-b border-primary">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                                    <LucideIcon name={editingItem ? "edit-3" : "plus-circle"} size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">{editingItem ? 'Edit Breakdown Record' : 'Report Machine Issue'}</h3>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1.5">{editingItem ? editingItem.id : 'Create new maintenance log'}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><LucideIcon name="x" size={20} /></button>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 gap-6">
                                
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Machine</label>
                                    <select 
                                        value={formMachineId} 
                                        onChange={(e) => setFormMachineId(e.target.value)}
                                        className="sys-input w-full"
                                    >
                                        <option value="">-- Select Machine --</option>
                                        {equipment.map(eq => (
                                            <option key={eq.id} value={eq.id}>{eq.name} ({eq.type})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Problem Description</label>
                                    <textarea 
                                        value={formProblem} 
                                        onChange={(e) => setFormProblem(e.target.value)}
                                        className="sys-input w-full min-h-[80px]"
                                        placeholder="Describe the issue..."
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Action Taken</label>
                                    <textarea 
                                        value={formAction} 
                                        onChange={(e) => setFormAction(e.target.value)}
                                        className="sys-input w-full min-h-[80px]"
                                        placeholder="What was done to fix it? (Optional if still open)"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Downtime (Minutes)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={formDowntime} 
                                            onChange={(e) => setFormDowntime(Number(e.target.value))}
                                            className="sys-input w-full text-right pr-12 font-mono font-black text-accent"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">MIN</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Status</label>
                                    <select 
                                        value={formStatus} 
                                        onChange={(e) => setFormStatus(e.target.value)}
                                        className="sys-input w-full"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-500 hover:text-primary font-bold text-[10px] uppercase tracking-widest transition-colors shadow-none">Cancel</button>
                            <button onClick={handleSave} className="sys-btn-primary bg-primary"><LucideIcon name="save" size={14}/> Save Record</button>
                        </div>
                    </StandardModalWrapper>
                </div>
            )}
        </div>
    );
}
