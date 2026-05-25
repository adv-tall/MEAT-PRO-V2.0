import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

const MOCK_PROBLEMS = [
    { id: 'PRB-001', date: '26/02/2025', planId: '260416-001', product: 'Smoked Sausage', reportedBy: 'QA Team', type: 'QC Failed (Weight Var)', lossKg: 50, requiredReplacementKg: 50, status: 'Pending Replan' },
    { id: 'PRB-002', date: '26/02/2025', planId: '260416-003', product: 'Pork Meatball', reportedBy: 'Mixing', type: 'Spill / Dropped', lossKg: 20, requiredReplacementKg: 20, status: 'Replanned' }
];

export default function UnplannedJobs() {
    const [problems, setProblems] = useState(MOCK_PROBLEMS);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [newProblem, setNewProblem] = useState({ planId: '', product: '', type: '', lossKg: '' });

    const handleReport = () => {
        if(!newProblem.planId || !newProblem.lossKg) return;
        
        const newPrb = {
            id: `PRB-${String(problems.length + 1).padStart(3, '0')}`,
            date: new Date().toLocaleDateString('en-GB'),
            planId: newProblem.planId,
            product: newProblem.product || 'Unknown Product',
            reportedBy: 'Production',
            type: newProblem.type,
            lossKg: Number(newProblem.lossKg),
            requiredReplacementKg: Number(newProblem.lossKg),
            status: 'Pending Replan'
        };

        setProblems([newPrb, ...problems]);
        setIsReportOpen(false);
        setNewProblem({ planId: '', product: '', type: '', lossKg: '' });
        
        if ((window as any).Swal) {
            (window as any).Swal.fire({
                title: 'Problem Reported!',
                text: 'IA Generator will calculate new Plan ID for replacement.',
                icon: 'success',
                confirmButtonColor: '#111f42'
            });
        }
    };

    const handleGenerateReplan = (id: string) => {
        setProblems(problems.map(p => {
            if (p.id === id) {
                return { ...p, status: 'Replanned' };
            }
            return p;
        }));
        if ((window as any).Swal) {
             (window as any).Swal.fire({
                title: 'IA Generator Success',
                text: 'Generated Plan ID: ' + id.replace('PRB', 'RP-PLAN') + ' and alerted Production Planning.',
                icon: 'success'
             });
        }
    };

    return (
        <div className="w-full relative flex flex-col h-full min-h-0 animate-fadeIn">
            <header className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="sys-header-icon-box text-accent">
                        <Icons.AlertTriangle className="sys-header-icon" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="sys-title-main">
                            UNPLANNED <span className="text-accent">JOBS & PROBLEM</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.25em]">
                            Report Losses and Request Replacements
                        </p>
                    </div>
                </div>
            </header>

            <main className="sys-page-layout flex flex-col flex-1 min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 mb-4">
                    <div className="sys-card-base bg-gradient-to-br from-white to-rose-50 border-rose-100 flex items-center justify-between">
                        <div>
                            <p className="sys-kpi-label text-rose-500">Pending Replans</p>
                            <h3 className="sys-kpi-value text-rose-600">{problems.filter(p=>p.status === 'Pending Replan').length}</h3>
                        </div>
                        <Icons.AlertOctagon size={40} className="text-rose-200" />
                    </div>
                    <div className="sys-card-base flex items-center justify-between">
                        <div>
                            <p className="sys-kpi-label">Total Losses Today</p>
                            <h3 className="sys-kpi-value">{problems.reduce((sum, p) => sum + p.lossKg, 0)} <span className="text-sm text-slate-400">Kg</span></h3>
                        </div>
                        <Icons.TrendingDown size={40} className="text-slate-100" />
                    </div>
                </div>

                <div className="sys-table-card flex flex-col flex-1 shadow-soft">
                    <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white gap-4">
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search Problem ID, Plan ID..." className="sys-input w-full pl-12 pr-4 py-2" />
                        </div>
                        <button className="sys-btn-primary bg-accent hover:bg-red-700" onClick={() => setIsReportOpen(true)}>
                            <Icons.AlertCircle size={14} /> REPORT PROBLEM
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                        <table className="w-full text-left min-w-[1000px] border-collapse bg-white">
                            <thead className="sys-table-header sticky top-0 z-10">
                                <tr>
                                    <th className="py-4 px-6 sys-table-th">Report ID</th>
                                    <th className="py-4 px-6 sys-table-th">Date</th>
                                    <th className="py-4 px-6 sys-table-th">Original Plan ID</th>
                                    <th className="py-4 px-6 sys-table-th">Product</th>
                                    <th className="py-4 px-6 sys-table-th">Issue / Type</th>
                                    <th className="py-4 px-6 sys-table-th text-right">Loss (Kg)</th>
                                    <th className="py-4 px-6 sys-table-th text-center">Status</th>
                                    <th className="py-4 px-6 sys-table-th text-center">IA Replan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {problems.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 px-6 font-mono font-bold text-accent text-sm">{p.id}</td>
                                        <td className="py-3 px-6 text-slate-500 font-medium text-sm">{p.date}</td>
                                        <td className="py-3 px-6 font-mono text-primary font-bold">{p.planId}</td>
                                        <td className="py-3 px-6 text-primary font-bold text-sm">{p.product}</td>
                                        <td className="py-3 px-6">
                                            <span className="bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{p.type}</span>
                                        </td>
                                        <td className="py-3 px-6 text-right font-mono font-bold text-rose-600 text-sm">-{p.lossKg}</td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${p.status === 'Replanned' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'}`}>{p.status}</span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {p.status === 'Pending Replan' ? (
                                                <button onClick={() => handleGenerateReplan(p.id)} className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 mx-auto">
                                                    <Icons.Sparkles size={12} /> IA Replan
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-bold"><Icons.CheckCircle size={16} className="inline mr-1 text-emerald-500" /> Done</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <DraggableModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                title="REPORT DAILY PROBLEM"
                width="600px"
                contentClassName="p-6"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Original Plan ID</label>
                        <input type="text" className="sys-input w-full" placeholder="e.g. 260416-001" value={newProblem.planId} onChange={e => setNewProblem({...newProblem, planId: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Product Name / SKU</label>
                        <input type="text" className="sys-input w-full" value={newProblem.product} onChange={e => setNewProblem({...newProblem, product: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Issue Type</label>
                        <select className="sys-input w-full" value={newProblem.type} onChange={e => setNewProblem({...newProblem, type: e.target.value})}>
                            <option value="" disabled>-- Select Issue --</option>
                            <option value="QC Failed">QC Failed</option>
                            <option value="Spill / Dropped">Spill / Dropped</option>
                            <option value="Machine Error">Machine Error</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Loss amount (Kg) to replace</label>
                        <input type="number" className="sys-input w-full text-rose-600 font-bold" value={newProblem.lossKg} onChange={e => setNewProblem({...newProblem, lossKg: e.target.value})} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button className="sys-btn-secondary" onClick={() => setIsReportOpen(false)}>Cancel</button>
                        <button className="sys-btn-primary bg-accent hover:bg-red-700" onClick={handleReport}>
                            Submit Report
                        </button>
                    </div>
                </div>
            </DraggableModal>
        </div>
    );
}
