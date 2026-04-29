import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const STEPS = ['Mixing', 'Forming', 'Cooking', 'Cooling', 'Peeling', 'Cutting', 'Packing'];

const INITIAL_EQUIPMENT = [
    { id: 'EQ-MIX-001', name: 'Bowl Cutter 200L', step: 'Mixing', qty: 2, note: 'Main line A' },
    { id: 'EQ-MIX-002', name: 'Vacuum Mixer 500L', step: 'Mixing', qty: 1, note: 'For batter' },
    { id: 'EQ-FRM-001', name: 'Frank-A-Matic Hi-Speed', step: 'Forming', qty: 2, note: 'Long sausage' },
    { id: 'EQ-CK-001', name: 'SmokeHouse Gen3', step: 'Cooking', qty: 2, note: 'Smoke house' },
    { id: 'EQ-CL-001', name: 'Rapid Chill Tunnel', step: 'Cooling', qty: 1, note: 'Temp drop' },
    { id: 'EQ-PK-001', name: 'Thermoformer Pack', step: 'Packing', qty: 2, note: 'Vacuum pack' },
];

const MOCK_BREAKDOWNS = [
    { id: 'BD-260401', date: '04/04/2026', machineId: 'EQ-MIX-002', machineName: 'Vacuum Mixer 500L', problem: 'Motor Overheating', actionTaken: '', downtimeMinutes: 45, status: 'Open' },
    { id: 'BD-260402', date: '03/04/2026', machineId: 'EQ-FRM-001', machineName: 'Twist Linker A', problem: 'Casing Jammed', actionTaken: 'Replaced linking nozzle', downtimeMinutes: 20, status: 'Resolved' },
    { id: 'BD-260403', date: '01/04/2026', machineId: 'EQ-CK-001', machineName: 'Smoke House 6T', problem: 'Steam Valve Leak', actionTaken: 'Tightened valve', downtimeMinutes: 120, status: 'Resolved' },
];

const COLORS = ['#111f42', '#E3624A', '#537E72', '#DCBC1B'];

export default function EquipmentRegistry() {
    const [activeTab, setActiveTab] = useState('equipment'); /* equipment, breakdowns, dashboard */
    const [equipment, setEquipment] = useState([]);
    const [breakdowns, setBreakdowns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStep, setFilterStep] = useState('All');

    useEffect(() => {
        setEquipment(INITIAL_EQUIPMENT as any);
        setBreakdowns(MOCK_BREAKDOWNS as any);
    }, []);

    const filteredEquipment = useMemo(() => {
        return equipment.filter((item: any) => {
            const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStep = filterStep === 'All' || item.step === filterStep;
            return matchSearch && matchStep;
        });
    }, [searchTerm, equipment, filterStep]);

    const filteredBreakdowns = useMemo(() => {
        return breakdowns.filter((item: any) => item.machineName.toLowerCase().includes(searchTerm.toLowerCase()) || item.problem.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, breakdowns]);

    const totalDowntime = breakdowns.reduce((sum: number, b: any) => sum + b.downtimeMinutes, 0);
    const resolvedIssues = breakdowns.filter((b: any) => b.status === 'Resolved').length;

    return (
        <div className="w-full relative flex flex-col h-full min-h-0">
            {/* Header */}
            <header className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="sys-header-icon-box">
                        <Icons.Wrench className="sys-header-icon" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="sys-title-main">
                            EQUIPMENT <span className="text-accent">REGISTRY</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.25em]">
                            Machine & Facility Hub
                        </p>
                    </div>
                </div>

                <div className="bg-white p-1.5 rounded-xl flex items-center shadow-sm border border-slate-200">
                    <button onClick={() => setActiveTab('equipment')} className={`sys-tab-btn ${activeTab === 'equipment' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                        <Icons.Settings size={14} className="inline mr-1" /> Machine List
                    </button>
                    <button onClick={() => setActiveTab('breakdowns')} className={`sys-tab-btn ${activeTab === 'breakdowns' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                        <Icons.List size={14} className="inline mr-1" /> Breakdown Log
                    </button>
                    <button onClick={() => setActiveTab('dashboard')} className={`sys-tab-btn ${activeTab === 'dashboard' ? 'sys-tab-active' : 'sys-tab-inactive'}`}>
                        <Icons.PieChart size={14} className="inline mr-1" /> OEE & Dashboard
                    </button>
                </div>
            </header>

            <main className="sys-page-layout flex flex-col flex-1 min-h-0 space-y-4">
                {/* Main Content Area */}
                {activeTab === 'equipment' || activeTab === 'breakdowns' ? (
                    <div className="sys-table-card flex flex-col flex-1 shadow-soft">
                        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {activeTab === 'equipment' && (
                                    <select 
                                        value={filterStep} 
                                        onChange={(e) => setFilterStep(e.target.value)} 
                                        className="sys-input cursor-pointer min-w-[200px]"
                                    >
                                        <option value="All">All Steps</option>
                                        {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                )}
                            </div>
                            <div className="relative w-full md:w-80 group">
                                <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder={activeTab === 'equipment' ? "Search Machine..." : "Search Issue..."} 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="sys-input w-full pl-12 pr-4 py-2" 
                                />
                            </div>
                            <button className="sys-btn-primary shrink-0 self-end md:self-auto hidden md:flex">
                                <Icons.Plus size={14} /> NEW {activeTab === 'equipment' ? 'MACHINE' : 'RECORD'}
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                            <table className="w-full text-left min-w-[900px] border-collapse bg-white">
                                <thead className="sys-table-header sticky top-0 z-10">
                                    {activeTab === 'equipment' ? (
                                        <tr>
                                            <th className="py-4 px-6 sys-table-th">ID</th>
                                            <th className="py-4 px-6 sys-table-th">Machine Name</th>
                                            <th className="py-4 px-6 sys-table-th">Process Step</th>
                                            <th className="py-4 px-6 sys-table-th text-center">Quantity</th>
                                            <th className="py-4 px-6 sys-table-th">Note</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th className="py-4 px-6 sys-table-th">Date / ID</th>
                                            <th className="py-4 px-6 sys-table-th">Machine</th>
                                            <th className="py-4 px-6 sys-table-th">Problem</th>
                                            <th className="py-4 px-6 sys-table-th text-right">Downtime</th>
                                            <th className="py-4 px-6 sys-table-th text-center">Status</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeTab === 'equipment' ? (
                                        filteredEquipment.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-6 font-mono font-bold text-accent text-sm">{item.id}</td>
                                                <td className="py-3 px-6 font-bold text-primary">{item.name}</td>
                                                <td className="py-3 px-6"><span className="sys-badge bg-slate-100 text-slate-500 border-slate-200">{item.step}</span></td>
                                                <td className="py-3 px-6 font-mono text-center font-bold text-primary">{item.qty}</td>
                                                <td className="py-3 px-6 text-slate-500 text-xs">{item.note}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        filteredBreakdowns.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-6 text-xs text-primary font-mono text-sm leading-tight font-bold">{item.date} <br/><span className="text-slate-400 text-[10px]">{item.id}</span></td>
                                                <td className="py-3 px-6 font-bold text-primary">{item.machineName}</td>
                                                <td className="py-3 px-6 text-accent font-bold">{item.problem}</td>
                                                <td className="py-3 px-6 font-mono text-right font-bold text-primary">{item.downtimeMinutes}</td>
                                                <td className="py-3 px-6 text-center">
                                                    <span className={`sys-badge ${item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="sys-pagination-container">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {activeTab === 'equipment' ? filteredEquipment.length : filteredBreakdowns.length} Records
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <div className="sys-card-base">
                            <h3 className="sys-title-sub uppercase tracking-widest mb-4 font-bold flex items-center gap-2"><Icons.PieChart size={16} className="text-accent" /> Downtime Distribution</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={breakdowns.map((b: any) => ({ name: b.machineName, value: b.downtimeMinutes }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={5}>
                                            {breakdowns.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="sys-card-base">
                            <h3 className="sys-title-sub uppercase tracking-widest mb-4 font-bold flex items-center gap-2"><Icons.BarChart2 size={16} className="text-primary" /> Recent Breakdowns (Mins)</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={breakdowns}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="id" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} />
                                        <Bar dataKey="downtimeMinutes" fill="#E3624A" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
