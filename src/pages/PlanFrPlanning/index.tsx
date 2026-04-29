import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import UserGuideButton from '../../components/shared/UserGuideButton';

function UserGuidePanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[600] flex justify-end">
            <div className="absolute inset-0 bg-[#141A26]/20 backdrop-blur-sm animate-in fade-in pointer-events-auto" onClick={onClose} />
            <div className="relative w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 bg-[#141A26] flex items-center justify-between text-white shrink-0 border-b-4 border-[#F2B705]">
                    <div className="flex items-center gap-3">
                        <Icons.HelpCircle size={22} className="text-[#F2B705]" />
                        <h3 className="text-sm font-extrabold uppercase tracking-widest font-mono">PLANNING GUIDE</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-white/50 hover:bg-white/10 hover:text-white rounded-full transition-colors">
                        <Icons.X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#3F4859] relative bg-[#F2F0EB] text-[12px]">
                    <section>
                      <h4 className="font-black text-[#141A26] border-b border-[#4F868C]/10 pb-2 mb-4 flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
                        <span className="bg-[#141A26] text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">1</span> 
                        ข้อมูลการขายรอประเมิน
                      </h4>
                      <p className="text-[13px] leading-relaxed">ใบสั่งขาย (Sales Order) จากออฟฟิศที่รอการจับคู่กับกำลังการผลิต (Capacity) เพื่อนำมาสร้างเป็นตารางการผลิต (Production Plan)</p>
                    </section>
                    <section>
                      <h4 className="font-black text-[#141A26] border-b border-[#4F868C]/10 pb-2 mb-4 flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
                        <span className="bg-[#D91604] text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">2</span> 
                        สถานะ (Status)
                      </h4>
                      <ul className="space-y-3">
                          <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-[#737597] mt-1.5 shrink-0"></span><span className="text-[13px]"><b>DRAFT</b>: ร่างแผน ยังไม่ได้รับการยืนยัน</span></li>
                          <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-[#3A7283] mt-1.5 shrink-0"></span><span className="text-[13px]"><b>CONFIRMED</b>: แผนผลิตยืนยันแล้ว รอเข้าสายการผลิต</span></li>
                          <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-[#B06821] mt-1.5 shrink-0"></span><span className="text-[13px]"><b>IN PROCESS</b>: กำลังดำเนินการผลิตจริง</span></li>
                          <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 shrink-0"></span><span className="text-[13px]"><b>COMPLETED</b>: ปิดแผนการผลิตแล้ว</span></li>
                      </ul>
                    </section>
                </div>
                <div className="p-6 bg-white shrink-0 flex justify-end border-t border-[#4F868C]/10">
                    <button onClick={onClose} className="px-8 py-3 bg-[#141A26] text-white rounded-lg font-black text-[11px] uppercase shadow-sm font-mono text-thai hover:bg-[#D91604] transition-all">เข้าใจแล้ว (Got It)</button>
                </div>
            </div>
        </div>
    );
}

// --- MOCK DATABASE ---
const MOCK_PL_DATA = Array.from({ length: 45 }).map((_, i) => ({
    plNo: `PL-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth()+1).padStart(2, '0')}-${String(i+1).padStart(4, '0')}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toISOString().split('T')[0],
    customer: ['Makro', 'Lotus', 'CPALL', 'BJC', 'Export-JP', 'General Market', 'AFM'][Math.floor(Math.random() * 7)],
    skuCount: Math.floor(Math.random() * 15) + 1,
    totalKg: Math.floor(Math.random() * 15000) + 1000,
    priority: ['Normal', 'High', 'Urgent'][Math.floor(Math.random() * 3)],
    status: ['DRAFT', 'CONFIRMED', 'IN_PROCESS', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 5)],
    progress: Math.floor(Math.random() * 100),
    createdBy: ['Admin', 'Planner_JS', 'Planner_TK', 'System_Auto'][Math.floor(Math.random() * 4)]
}));

// Sort by date desc
MOCK_PL_DATA.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// --- STYLES ---
const getStatusStyle = (status: string) => {
    switch (status) {
        case 'DRAFT': return 'bg-[#737597]/10 text-[#737597] border-[#737597]/30';
        case 'CONFIRMED': return 'bg-[#3A7283]/10 text-[#3A7283] border-[#3A7283]/30';
        case 'IN_PROCESS': return 'bg-[#DCBC1B]/10 text-[#B06821] border-[#DCBC1B]/30';
        case 'COMPLETED': return 'bg-[#537E72]/10 text-[#537E72] border-[#537E72]/30';
        case 'CANCELLED': return 'bg-[#C22D2E]/10 text-[#C22D2E] border-[#C22D2E]/30';
        default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
};

const getPriorityStyle = (priority: string) => {
    switch(priority) {
        case 'Urgent': return 'text-[#C22D2E] font-black flex items-center gap-1';
        case 'High': return 'text-[#B06821] font-bold flex items-center gap-1';
        default: return 'text-[#55738D] font-medium flex items-center gap-1';
    }
};

export default function PlanFrPlanning() {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(t);
    }, []);

    const filteredData = useMemo(() => {
        return MOCK_PL_DATA.filter(item => {
            const matchSearch = item.plNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.customer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [searchTerm, statusFilter]);

    // Pagination basics
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, itemsPerPage]);

    // KPIs
    const totalPL = filteredData.length;
    const totalVolume = filteredData.reduce((sum, i) => sum + i.totalKg, 0);
    const pendingPL = filteredData.filter(i => ['DRAFT', 'CONFIRMED'].includes(i.status)).length;
    const completedPL = filteredData.filter(i => i.status === 'COMPLETED').length;

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
                <div className="flex flex-col items-center gap-4">
                    <Icons.Loader2 size={48} className="animate-spin text-[#C22D2E]" />
                    <span className="text-[#2E395F] font-black uppercase tracking-widest text-sm animate-pulse">Loading Planning Data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full relative flex flex-col h-full min-h-0">
            <UserGuideButton onClick={() => setIsGuideOpen(true)} className="bg-[#141A26] text-white hover:bg-[#D91604]" />
            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            
            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn pb-6">
                <div className="flex items-center gap-4">
                    <div className="sys-header-icon-box relative">
                        <Icons.CalendarClock className="sys-header-icon" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="sys-title-main">
                            PLANNING <span className="text-accent">(PL)</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.25em]">
                            Central Planning & Order Management
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">{String(new Date().getDate()).padStart(2, '0')}/{String(new Date().getMonth() + 1).padStart(2, '0')}/{new Date().getFullYear()}</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="sys-page-layout flex flex-col flex-1 min-h-0 space-y-4">
                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                    <div className="sys-card-base relative overflow-hidden group hover:shadow-soft transition-shadow">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="sys-kpi-label text-slate-500">Total Plans</span>
                            <Icons.FileSpreadsheet size={20} className="text-primary"/>
                        </div>
                        <h3 className="sys-kpi-value relative z-10">{totalPL}</h3>
                    </div>
                    
                    <div className="sys-card-base relative overflow-hidden group hover:shadow-soft transition-shadow">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="sys-kpi-label text-slate-500">Target Vol.</span>
                            <Icons.Weight size={20} className="text-primary"/>
                        </div>
                        <h3 className="sys-kpi-value relative z-10 flex items-baseline gap-1">
                            {(totalVolume / 1000).toFixed(1)} <span className="text-sm text-slate-400">TON</span>
                        </h3>
                    </div>

                    <div className="sys-card-base relative overflow-hidden group hover:shadow-soft transition-shadow">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="sys-kpi-label text-amber-600 bg-amber-50 px-2 rounded w-max">Pending</span>
                            <Icons.Clock size={20} className="text-amber-500"/>
                        </div>
                        <h3 className="sys-kpi-value text-amber-600 relative z-10">{pendingPL}</h3>
                    </div>

                    <div className="sys-card-base relative overflow-hidden group hover:shadow-soft transition-shadow">
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="sys-kpi-label text-emerald-600 bg-emerald-50 px-2 rounded w-max">Completed</span>
                            <Icons.CheckCircle size={20} className="text-emerald-500"/>
                        </div>
                        <h3 className="sys-kpi-value text-emerald-600 relative z-10">{completedPL}</h3>
                    </div>
                </div>

                {/* Main Table Interface */}
                <div className="sys-table-card flex flex-col flex-1 shadow-soft">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-200 flex flex-col xl:flex-row justify-between items-center gap-4 bg-white">
                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            <div className="relative">
                                <Icons.Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <select 
                                    className="sys-input pl-9 cursor-pointer w-full"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">ALL STATUS</option>
                                    <option value="DRAFT">DRAFT</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="IN_PROCESS">IN PROCESS</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            <div className="relative flex-1 xl:w-80 group">
                                <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"/>
                                <input 
                                    type="text" 
                                    placeholder="Search PL No, Customer..." 
                                    className="sys-input w-full pl-12 pr-4 py-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="sys-btn-secondary hidden sm:flex shrink-0">
                                <Icons.Download size={14} /> Export
                            </button>
                            <button className="sys-btn-primary shrink-0">
                                <Icons.Plus size={14} /> CREATE PL
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                        <table className="w-full min-w-[1100px] text-left border-collapse bg-white">
                            <thead className="sys-table-header sticky top-0 z-10">
                                <tr>
                                    <th className="py-4 px-6 sys-table-th text-center w-16">#</th>
                                    <th className="py-4 px-6 sys-table-th">PL NO.</th>
                                    <th className="py-4 px-6 sys-table-th">Date</th>
                                    <th className="py-4 px-6 sys-table-th">Customer/Ref</th>
                                    <th className="py-4 px-6 sys-table-th">Priority</th>
                                    <th className="py-4 px-6 sys-table-th text-center">Items</th>
                                    <th className="py-4 px-6 sys-table-th text-right">Volume (KG)</th>
                                    <th className="py-4 px-6 sys-table-th w-[150px]">Progress</th>
                                    <th className="py-4 px-6 sys-table-th text-center">Status</th>
                                    <th className="py-4 px-6 sys-table-th text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentItems.map((item, idx) => (
                                    <tr key={item.plNo} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-3 px-6 text-center text-slate-400 font-bold text-xs">
                                            {indexOfFirstItem + idx + 1}
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-mono font-bold text-accent text-sm leading-tight">{item.plNo}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-0.5"><Icons.User size={10}/> {item.createdBy}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-primary font-mono font-bold text-xs">
                                            {new Date(item.date).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="sys-badge bg-slate-100 text-slate-600 border-slate-200">
                                                {item.customer}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 sys-table-td">
                                            <span className={`inline-flex items-center gap-1 font-bold ${item.priority === 'Urgent' ? 'text-accent' : item.priority === 'High' ? 'text-amber-600' : 'text-slate-500'}`}>
                                                {item.priority === 'Urgent' && <Icons.AlertCircle size={12}/>}
                                                {item.priority === 'High' && <Icons.ArrowUpCircle size={12}/>}
                                                {item.priority === 'Normal' && <Icons.Activity size={12}/>}
                                                {item.priority}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-primary font-bold text-xs">
                                                {item.skuCount}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-right">
                                            <span className="font-mono font-bold text-primary text-sm">{item.totalKg.toLocaleString()}</span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex flex-col gap-1.5 w-full">
                                                <div className="flex justify-between items-center text-[9px] font-bold uppercase text-slate-400">
                                                    <span>{item.progress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-500 ${item.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`sys-badge ${getStatusStyle(item.status)}`}>
                                                {item.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-right">
                                            <div className="flex justify-end gap-0.5 transition-opacity">
                                                <button className="sys-btn-action">
                                                    <Icons.Eye size={14} />
                                                </button>
                                                {!['COMPLETED', 'CANCELLED'].includes(item.status) && (
                                                    <button className="sys-btn-action hover:text-accent hover:border-accent">
                                                        <Icons.Pencil size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="py-16 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-2">
                                                    <Icons.SearchX size={24} />
                                                </div>
                                                <p className="sys-label-tiny">No planning records found</p>
                                                <button 
                                                    onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                                                    className="sys-btn-secondary"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="sys-pagination-container">
                        <div className="flex items-center gap-3">
                            <span className="sys-pagination-text text-slate-400">SHOW:</span>
                            <select 
                                className="sys-pagination-select"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="sys-pagination-text text-slate-400 shrink-0 ml-2">TOTAL {filteredData.length} RECORDS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="sys-pagination-btn"
                            >
                                <Icons.ChevronLeft size={16} />
                            </button>
                            <span className="sys-pagination-text w-24 text-center">
                                PAGE {currentPage} OF {totalPages || 1}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="sys-pagination-btn"
                            >
                                <Icons.ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
