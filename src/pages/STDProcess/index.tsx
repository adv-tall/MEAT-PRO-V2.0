import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';

const INITIAL_CATEGORIES = ['Sausage', 'Meatball', 'Ham', 'Bologna', 'WIP-Emulsion', 'All'];
const MOCK_STANDARDS = [
    {
        id: 'STD-001', name: 'Standard Smoked Sausage', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 88.5, status: 'Active', updateDate: '26/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Standard Pork', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Standard Pork', size: 'Jumbo', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 2000 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Thermoformer', packSize: '1kg', format: 'Bag', sfgSize: 'Jumbo', capacityKgHr: 1000 }],
        packVariants: []
    },
    {
        id: 'STD-002', name: 'Premium Meatball', category: 'Meatball', rawWeightPerBatch: 100, yieldPercent: 95, status: 'Active', updateDate: '25/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Premium Beef', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Premium Beef', size: 'M', type: 'Belt Former', casing: '', stuffed: false, capacityKgHr: 1500 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 4T', program: 'Steam_01', cycleTimeMin: 60, capacityBatch: 8 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 40, capacityBatch: 8 }],
        peelingStandards: [],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Flow Pack', packSize: '500g', format: 'Bag', sfgSize: 'M', capacityKgHr: 800 }],
        packVariants: []
    },
    {
        id: 'BAT-SMC-01', name: 'Batter ไส้กรอกรมควัน (Smoked)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Smoked Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-MTB-02', name: 'Batter ลูกชิ้นหมู (Pork Meatball)', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Pork Meatball Formula', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-BOL-04', name: 'Batter โบโลน่า (Bologna)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Bologna Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-CHE-09', name: 'Batter ไส้กรอกชีส (Cheese)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Cheese Sausage Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-SND-20', name: 'Batter แฮมแซนวิช (Sandwich Ham)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Sandwich Ham Formula', batchPerCycle: 1, cycleTimeMin: 20, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-001', name: 'Smoked Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Smoked Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-002', name: 'Meatball Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Meatball Formula', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-003', name: 'Bologna Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Bologna Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-004', name: 'Cheese Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Cheese Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-005', name: 'Sandwich Ham Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Sandwich Ham Formula', batchPerCycle: 1, cycleTimeMin: 20, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-006', name: 'Layer Batter Red', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Red Layer Formula', batchPerCycle: 1, cycleTimeMin: 10, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-007', name: 'Layer Batter Green', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Green Layer Formula', batchPerCycle: 1, cycleTimeMin: 10, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-008', name: 'Filling Cheese', category: 'WIP-Emulsion', rawWeightPerBatch: 50, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Filling Cheese Formula', batchPerCycle: 1, cycleTimeMin: 10, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-001', name: 'Smoked Sausage SFG', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 88.5, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [], 
        formingStandards: [{ id: 1, batter: 'Smoked Batter', size: 'M', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 2000 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-002', name: 'Pork Meatball SFG', category: 'Meatball', rawWeightPerBatch: 100, yieldPercent: 95, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Meatball Batter', size: 'M', type: 'Belt Former', casing: '', stuffed: false, capacityKgHr: 1500 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 4T', program: 'Steam_01', cycleTimeMin: 60, capacityBatch: 8 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 40, capacityBatch: 8 }],
        peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-003', name: 'Bologna SFG', category: 'Bologna', rawWeightPerBatch: 150, yieldPercent: 92, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Bologna Batter', size: 'L', type: 'Clipper Direct', casing: 'Polyamide', stuffed: true, capacityKgHr: 1800 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Steam_01', cycleTimeMin: 150, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 90, capacityBatch: 10 }],
        peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-004', name: 'Cheese Sausage SFG', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 89, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Cheese Batter', size: 'M', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 1900 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-005', name: 'Sandwich Ham SFG', category: 'Ham', rawWeightPerBatch: 150, yieldPercent: 98, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Sandwich Ham Batter', size: 'Jumbo', type: 'Clipper Direct', casing: 'Polyamide', stuffed: true, capacityKgHr: 1200 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Steam_01', cycleTimeMin: 180, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'STD-003', name: 'Bologna Chili', category: 'Bologna', rawWeightPerBatch: 150, yieldPercent: 98, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Bologna Chili Formula', batchPerCycle: 1, cycleTimeMin: 20, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Bologna Chili', size: 'Large', type: 'Clipper', casing: 'Plastic', stuffed: true, capacityKgHr: 1500 }],
        cookingStandards: [{ id: 1, oven: 'Steam Oven', program: 'Steam_85C', cycleTimeMin: 180, capacityBatch: 12 }],
        coolingStandards: [{ id: 1, unit: 'Chilled Water Tank', program: 'Water_Chill', cycleTimeMin: 90, capacityBatch: 12 }],
        peelingStandards: [{ id: 1, method: 'Manual Peeling', capacityKgHr: 500 }],
        cuttingStandards: [{ id: 1, machine: 'High Speed Slicer', thicknessMm: 2, capacityKgHr: 800 }],
        packingStandards: [{ id: 1, machine: 'Thermoformer', packSize: '200g', format: 'Vacuum Pack', sfgSize: 'Sliced', capacityKgHr: 600 }],
        packVariants: []
    },
    {
        id: 'STD-004', name: 'Cheese Sausage', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 92, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Cheese Sausage Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Cheese Formula', size: 'Standard', type: 'Co-Extrusion', casing: 'Collagen', stuffed: true, capacityKgHr: 1800 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Cheese', cycleTimeMin: 100, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Std', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Thermoformer', packSize: '500g', format: 'Bag', sfgSize: 'Standard', capacityKgHr: 900 }],
        packVariants: []
    }
];

export default function STDProcess() {
    const [searchTerm, setSearchQuery] = useState('');
    const [masterData, setMasterData] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    
    useEffect(() => {
        setMasterData(MOCK_STANDARDS as any);
    }, []);

    const filteredData = useMemo(() => {
        return masterData.filter((item: any) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, masterData, filterCategory]);

    return (
        <div className="w-full relative flex flex-col h-full min-h-0">
            {/* Header Area */}
            <header className="pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="sys-header-icon-box">
                        <Icons.Timer className="sys-header-icon" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="sys-title-main">
                            STD <span className="text-accent">PROCESS TIME</span>
                        </h1>
                        <p className="sys-title-sub uppercase tracking-[0.25em]">
                            Configure Production Standards & Routing
                        </p>
                    </div>
                </div>
            </header>

            <main className="sys-page-layout flex flex-col flex-1 min-h-0">
                <div className="sys-table-card flex flex-col flex-1 shadow-soft">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select 
                                value={filterCategory} 
                                onChange={(e) => setFilterCategory(e.target.value)} 
                                className="sys-input cursor-pointer min-w-[200px]"
                            >
                                {INITIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search Standard ID, Name..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                className="sys-input w-full pl-12 pr-4 py-2" 
                            />
                        </div>
                        <button className="sys-btn-primary shrink-0 self-end md:self-auto hidden md:flex">
                            <Icons.Plus size={14} /> NEW STANDARD
                        </button>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50">
                        <table className="w-full text-left min-w-[1000px] border-collapse bg-white">
                            <thead className="sys-table-header sticky top-0 z-10">
                                <tr>
                                    <th className="py-4 px-6 sys-table-th">Standard ID</th>
                                    <th className="py-4 px-6 sys-table-th">Name</th>
                                    <th className="py-4 px-6 sys-table-th">Category</th>
                                    <th className="py-4 px-6 sys-table-th text-right">Batch Size (kg)</th>
                                    <th className="py-4 px-6 sys-table-th text-center">Yield</th>
                                    <th className="py-4 px-6 sys-table-th text-center">Status</th>
                                    <th className="py-4 px-6 sys-table-th text-right w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="py-3 px-6">
                                            <span className="font-mono font-bold text-accent text-sm">
                                                {item.id}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 sys-table-td">
                                            <div className="font-bold text-primary">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Updated: {item.updateDate}</div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="sys-badge bg-slate-100 text-slate-500 border-slate-200">{item.category}</span>
                                        </td>
                                        <td className="py-3 px-6 text-right">
                                            <span className="font-mono font-bold text-primary text-sm">{item.rawWeightPerBatch}</span>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex flex-col items-center gap-1.5 w-full max-w-[80px] mx-auto">
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${item.yieldPercent}%` }}></div>
                                                </div>
                                                <span className="font-mono font-bold text-accent text-xs leading-none">{item.yieldPercent}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <span className={`sys-badge ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="sys-btn-action">
                                                    <Icons.Eye size={14} />
                                                </button>
                                                <button className="sys-btn-action hover:text-accent hover:border-accent">
                                                    <Icons.Pencil size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="sys-pagination-container">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total {filteredData.length} Items</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="sys-pagination-btn" disabled><Icons.ChevronLeft size={16} /></button>
                            <button className="sys-pagination-btn px-4 bg-primary text-white pointer-events-none text-xs font-mono">1</button>
                            <button className="sys-pagination-btn" disabled><Icons.ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
