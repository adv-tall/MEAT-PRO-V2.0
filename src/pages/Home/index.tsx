import React, { useState, useEffect } from 'react';
import UserPermissions from '../UserPermissions';
import ProCalendar from '../ProCalendar';
import SystemConfig from '../SystemConfig';
import ProductionTracking from '../ProductionTracking';
import MachineBreakdown from '../MachineBreakdown';
import ProductionPlanning from '../ProductionPlanning';
import DailyBoard from '../DailyBoard';
import PackingBoard from '../PackingBoard';
import MasterItems from '../MasterItems';
import ProductMatrix from '../ProductMatrix';
import PlanFrPlanning from '../PlanFrPlanning';
import STDProcess from '../STDProcess';
import EquipmentRegistry from '../EquipmentRegistry';
import { SYSTEM_MODULES } from '../../config/modules';
import DateTimeBadge from '../../components/shared/DateTimeBadge';
import KpiCard from '../../components/shared/KpiCard';
import GlassCard from '../../components/shared/GlassCard';
import DevPermit from '../DevPermit';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, Clock, Sparkles, ShieldCheck, 
    GraduationCap, Target, UserPlus, Heart, BarChart3, 
    Database, CalendarDays, Settings, Home as HomeIcon, AlertCircle, 
    UserCheck, Cake, PartyPopper, Send, ClipboardCheck, 
    CheckSquare, FileText, Megaphone, Calendar, Info, 
    ChevronLeft, ChevronRight, ChevronDown, Search, Bell,
    Phone, Mail, LogOut, Beef, Thermometer, ShoppingBag, Gauge
} from 'lucide-react';

const PALETTE = {
    bgMain: '#F2F0EB', 
    glassWhite: 'rgba(255, 255, 255, 0.90)',
    red: '#D91604',
    orange: '#D95032',
    gold: '#F2B705',
    teal: '#4F868C',
    blue: '#16778C',
    sidebar: '#141A26',
    text: '#3F4859', 
};

const MOCK_DATA = {
    stats: [
        { label: 'Daily Output', value: '2.4 Tons', sub: 'Sausage & Meatball', icon: Sparkles, color: '#C22D2E' },
        { label: 'Pending Orders', value: '฿ 4.2M', sub: 'Hypermarkets & Wholesale', icon: Target, color: '#D8A48F' },
        { label: 'Ingredients', value: 'Fresh', sub: 'Meat & Spices Safe', icon: Database, color: '#537E72' },
        { label: 'Hygiene Score', value: '99.8%', sub: 'Halal Certified', icon: ShieldCheck, color: '#55738D' },
    ],
    // Keeping other mock data for now
    newMembers: [
        { name: 'พิมพ์พรรณ สวยงาม', pos: 'UX/UI Designer', dept: 'Innovation', joinDate: '01 Jan', avatar: 'https://i.pravatar.cc/150?img=47' },
        { name: 'ธนวัฒน์ มาดี', pos: 'Fullstack Dev', dept: 'Digital Tech', joinDate: '02 Jan', avatar: 'https://i.pravatar.cc/150?img=12' },
        { name: 'เกริกพล ขยันงาน', pos: 'HR Specialist', dept: 'People', joinDate: '05 Jan', avatar: 'https://i.pravatar.cc/150?img=68' },
    ],
    birthdays: [
        { name: 'อภิรดี มีสุข', dept: 'Accounting', date: '10 Jan', avatar: 'https://i.pravatar.cc/150?img=32' },
        { name: 'ชวาล ยิ่งใหญ่', dept: 'Logistics', date: '12 Jan', avatar: 'https://i.pravatar.cc/150?img=13' },
    ],
    approvals: [
        { id: 'LV-2024-001', type: 'Leave Request', requester: 'สมชาย รักดี', detail: 'Sick Leave (3 Days)', status: 'Pending', icon: FileText },
        { id: 'TR-2024-015', type: 'Training Approval', requester: 'วิภาดา แสงงาม', detail: 'Innovation Camp', status: 'In Review', icon: GraduationCap },
        { id: 'MP-2024-002', type: 'Manpower Request', requester: 'IT Manager', detail: 'Lead Talent (1)', status: 'Processing', icon: UserPlus },
    ],
};

const StatusBadge = ({ status }) => {
    const styles: Record<string, { bg: string, text: string }> = {
        'Pending': { bg: '#FEF3C7', text: '#D97706' },
        'In Review': { bg: '#E0F2FE', text: '#0284C7' },
        'Approved': { bg: '#DCFCE7', text: '#16A34A' },
        'Rejected': { bg: '#FEE2E2', text: '#DC2626' },
        'Processing': { bg: '#F3E8FF', text: '#9333EA' },
    };
    const currentStyle = styles[status] || { bg: '#F1F5F9', text: '#475569' };
    return (
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/50"
            style={{ backgroundColor: currentStyle.bg, color: currentStyle.text }}>
            {status}
        </span>
    );
};

const NavItem = ({ icon: IconComponent, label, active, onClick, isOpen, subItems, isExpanded, onToggleExpand }: any) => {
    const hasSubItems = subItems && subItems.length > 0;
    const isDirectActive = active && !hasSubItems;
    const isParentActive = active && hasSubItems;

    return (
        <div className="mb-1">
            <button
                onClick={hasSubItems ? onToggleExpand : onClick}
                className={`sys-nav-item mx-auto
                    ${isDirectActive ? 'sys-nav-item-active sys-animate-shimmer shadow-lg' : ''}
                    ${isParentActive ? 'bg-[#4F868C]/10' : ''}
                    ${!isOpen ? 'justify-center w-12 px-0 rounded-xl' : 'w-[95%] px-4 justify-start rounded-xl'} 
                `}
            >
                <IconComponent 
                    className={`sys-nav-icon relative z-10 transition-transform duration-300 
                        ${isDirectActive ? 'scale-110 text-[#F2B705] drop-shadow-[0_0_8px_rgba(242,183,5,0.4)]' : ''} 
                        ${isParentActive ? 'text-[#F2B705]' : 'text-[#8F9FBF]'}
                    `}
                    strokeWidth={isDirectActive || isParentActive ? 2.5 : 2}
                />
                
                <div className={`relative z-10 overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-between flex-1 ${isOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0 ml-0'}`}>
                    <span className={`sys-nav-label truncate ${isDirectActive ? 'text-white' : isParentActive ? 'text-[#4F868C]' : 'text-[#8F9FBF]'}`}>
                        {label}
                    </span>
                    {hasSubItems && (
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isDirectActive ? 'text-white' : isParentActive ? 'text-[#4F868C]' : 'text-[#8F9FBF]'}`} />
                    )}
                </div>
            </button>

            {/* Sub-Items Container */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded && isOpen ? 'max-h-[500px] opacity-100 mt-1 pl-4' : 'max-h-0 opacity-0'}`}>
                <div className="sys-sub-container">
                    {hasSubItems && subItems.map((sub, idx) => (
                        <button 
                            key={idx} 
                            onClick={(e) => { e.stopPropagation(); sub.onClick(); }}
                            className={`sys-sub-item rounded-lg ${sub.active ? 'sys-sub-item-active' : 'text-[#8F9FBF]'}`}
                        >
                            <span className={`sys-sub-bullet ${sub.active ? 'bg-white' : 'opacity-30'}`}></span>
                            <span className="truncate">{sub.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardView = () => (
    <div className="space-y-6 animate-fadeIn pb-4">
        <div className="flex justify-between items-center mb-2">
            <div>
                <h1 className="text-[24px] font-bold text-[#3F4859] uppercase tracking-tight">SAWASDEE, PRODUCTION TEAM!</h1>
                <p className="text-[#4F868C] text-[11px] font-bold mt-0.5 uppercase tracking-widest">Real-time monitoring & Control • <span className="text-[#D95032] animate-pulse font-bold">Line A-B Running</span></p>
            </div>
            <div className="flex gap-2">
                <button className="bg-white/80 text-[#4F868C] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-white transition-all flex items-center gap-2 border border-white">
                    <HomeIcon size={16} /> Dashboard
                </button>
                <button className="bg-[#D91604] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2 hover:shadow-glow-red">
                    <AlertCircle size={16} /> Alert Trigger
                </button>
            </div>
        </div>

        {/* NEW BANNER */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-soft h-48 md:h-56 flex flex-col justify-center px-8 md:px-12 border border-[#E6E1DB]">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://shoplogans.com/cdn/shop/articles/WcQ5HUVvepEi2G06bZ7l9gpuffzihJn11654610525_1200x1200.jpg?v=1654871494')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#141619]/95 via-[#141619]/70 to-transparent"></div>
            <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl md:text-[40px] font-black uppercase tracking-tight leading-[1.1] mb-4">
                    <span className="text-white drop-shadow-sm">GLOBAL LEADERS IN</span><br/>
                    <span className="text-[#C22D2E] drop-shadow-sm">MEAT TECHNOLOGY.</span>
                </h2>
                <p className="text-white/90 text-xs md:text-sm font-mono max-w-xl leading-relaxed">
                    A state-of-the-art facility powered by world-class innovation.<br/>
                    Uncompromising commitment to Food Hygiene, Safety, and Product Quality.
                </p>
            </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_DATA.stats.map((stat, idx) => (
                <KpiCard 
                    key={idx} 
                    title={stat.label} 
                    value={stat.value} 
                    color={stat.color} 
                    icon={stat.icon} 
                    description={stat.sub} 
                />
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-0">
            <KpiCard title="PRODUCTION CAP TODAY" value="2.4 / 2.8 Tons" color="#55738D" icon={BarChart3} description="85.7% Utilization" />
            <KpiCard title="% YIELD TODAY" value="98.5%" color="#D8A48F" icon={Target} description="Target: >98%" />
            <KpiCard title="OEE" value="92.4%" color="#BB8588" icon={Clock} description="World Class > 85%" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-0">
            {/* NC / DEFECT STATUS */}
            <GlassCard className="flex flex-col group hover:border-[#BB8588]/40 bg-gradient-to-br from-white via-[#FFF8F8] to-[#BB8588]/15 border-[#BB8588]/20 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 text-[#BB8588] opacity-[0.1] transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={160} />
                </div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold text-[#3F4859] flex items-center gap-2 uppercase">
                            <div className="p-2 bg-[#BB8588]/10 rounded-lg text-[#BB8588]">
                                <AlertCircle size={20} />
                            </div>
                            NC / DEFECT
                        </h2>
                        <p className="text-[10px] text-[#737597] font-medium mt-1 ml-11">Target &lt; 0.5%</p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-3xl font-black text-[#BB8588]">0.45%</h4>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-[10px] relative z-10 mt-2">
                    <div className="bg-white/60 p-3 rounded-xl border border-[#BB8588]/10 backdrop-blur-sm">
                        <p className="font-bold text-[#BB8588] mb-2 uppercase tracking-wide flex items-center gap-1 border-b border-[#BB8588]/10 pb-1">Top Products</p>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center text-gray-600"><span>1. Sausage</span><span className="font-bold text-white bg-[#BB8588] px-1.5 py-0.5 rounded text-[9px]">12%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>2. Beef Ball</span><span className="font-bold text-white bg-[#BB8588]/80 px-1.5 py-0.5 rounded text-[9px]">8%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>3. Bologna</span><span className="font-bold text-white bg-[#BB8588]/60 px-1.5 py-0.5 rounded text-[9px]">5%</span></li>
                        </ul>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-[#BB8588]/10 backdrop-blur-sm">
                        <p className="font-bold text-[#BB8588] mb-2 uppercase tracking-wide flex items-center gap-1 border-b border-[#BB8588]/10 pb-1">Top Causes</p>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center text-gray-600"><span>1. Casing</span><span className="font-bold text-[#BB8588]">40%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>2. Wt. Var</span><span className="font-bold text-[#BB8588]">25%</span></li>
                            <li className="flex justify-between items-center text-gray-600"><span>3. Color</span><span className="font-bold text-[#BB8588]">15%</span></li>
                        </ul>
                    </div>
                </div>
            </GlassCard>

            {/* PROCESS RISK & CCP */}
            <GlassCard className="flex flex-col group hover:border-[#DCBC1B]/50 bg-gradient-to-br from-white via-[#FFFCF0] to-[#DCBC1B]/15 border-[#DCBC1B]/20 relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 text-[#DCBC1B] opacity-[0.1] transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={160} />
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold text-[#3F4859] flex items-center gap-2 uppercase">
                            <div className="p-2 bg-[#DCBC1B]/10 rounded-lg text-[#B06821]">
                                <Settings size={20} />
                            </div>
                            RISK & CCP
                        </h2>
                        <p className="text-[10px] text-[#737597] font-medium mt-1 ml-11">Monitoring 12 Control Points</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#537E72] text-white px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 self-start mt-1">
                        Normal
                    </span>
                </div>

                <div className="relative z-10 mt-2 bg-white/60 rounded-xl border border-[#DCBC1B]/20 p-3 backdrop-blur-sm">
                    <p className="font-bold text-[#B06821] text-[10px] mb-2 uppercase tracking-wide border-b border-[#DCBC1B]/20 pb-1">Top Productivity Risks</p>
                    <ul className="space-y-2 text-[10px]">
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#C22D2E]/20 hover:shadow-sm group/list">
                            <span className="flex items-center gap-2 text-[#3F4859] font-medium"><span className="text-[#C22D2E]">Cutter #2 Temp High</span></span>
                            <span className="text-[#C22D2E] font-extrabold bg-[#C22D2E]/10 px-1.5 py-0.5 rounded">CRITICAL</span>
                        </li>
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#D8A48F]/30 hover:shadow-sm">
                            <span className="flex items-center gap-2 text-[#3F4859] font-medium"><span className="text-[#D8A48F]">Mixer #1 Vibration</span></span>
                            <span className="text-[#B06821] font-bold">Warning</span>
                        </li>
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#DCBC1B]/30 hover:shadow-sm">
                            <span className="flex items-center gap-2 text-[#3F4859] font-medium"><span className="text-[#DCBC1B]">Filler A Speed Drop</span></span>
                            <span className="text-[#B06821] font-bold opacity-70">Watch</span>
                        </li>
                        <li className="flex items-center justify-between p-1.5 rounded hover:bg-white transition-colors border border-transparent hover:border-[#55738D]/30 hover:shadow-sm">
                            <span className="flex items-center gap-2 text-[#3F4859] font-medium"><span className="text-[#55738D]">Packing Line Manpower</span></span>
                            <span className="text-[#55738D] font-bold opacity-70">Info</span>
                        </li>
                    </ul>
                </div>
            </GlassCard>

            {/* PRODUCTION ALERT */}
            <GlassCard className="bg-gradient-to-b from-white/95 to-[#D91604]/5 border-[#D91604]/10 relative overflow-hidden group">
                <div className="absolute -bottom-6 -right-6 text-[#D91604] opacity-5 transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Bell size={120} />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h2 className="text-xl font-bold text-[#3F4859] flex items-center gap-2 uppercase">
                            <div className="p-2 bg-[#D91604]/10 rounded-lg text-[#D91604]">
                                <Megaphone size={20} />
                            </div>
                            ALERTS
                        </h2>
                        <p className="text-[10px] text-[#737597] font-medium mt-1 ml-11">Active Notifications</p>
                    </div>
                </div>
                <div className="space-y-3 relative z-10 mt-2">
                    <div className="p-3 bg-[#D91604]/5 rounded-xl border border-[#D91604]/10 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
                        <div className="bg-[#D91604]/10 p-1.5 rounded-lg text-[#D91604]"><Settings size={14}/></div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-[#D91604] flex justify-between">Machine Maintenance <span className="text-[9px] bg-[#D91604] text-white px-1.5 py-0.5 rounded">NEW</span></p>
                            <p className="text-[10px] text-[#D91604]/80 mt-1 font-medium leading-tight">Mixer #3 scheduled for downtime at 15:00 for preventive parts replacement.</p>
                        </div>
                    </div>
                    <div className="p-3 bg-[#186B8C]/5 rounded-xl border border-[#186B8C]/10 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
                        <div className="bg-[#186B8C]/10 p-1.5 rounded-lg text-[#186B8C]"><Info size={14}/></div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-[#186B8C]">Shift Change Log</p>
                            <p className="text-[10px] text-[#186B8C]/80 mt-1 font-medium leading-tight">Night shift handover completed seamlessly. No pending issues.</p>
                        </div>
                    </div>
                    <div className="p-3 bg-[#D8A48F]/10 rounded-xl border border-[#D8A48F]/20 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
                        <div className="bg-[#D8A48F]/20 p-1.5 rounded-lg text-[#B06821]"><AlertCircle size={14}/></div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-[#B06821]">Material Shortage</p>
                            <p className="text-[10px] text-[#B06821]/80 mt-1 font-medium leading-tight">Packaging material P-200 runs low. Requisition raised.</p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    </div>
);

const GenericView = ({ title, icon: IconComponent, desc }: any) => (
    <div className="animate-fadeIn">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-2xl font-bold text-[#3F4859] uppercase tracking-tight">{title}</h2>
                <p className="text-xs text-[#4F868C] mt-1 font-medium italic">{desc || 'Production Management Module'}</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="flex flex-col items-center justify-center min-h-[400px] text-center border-[#4F868C]/10">
                <div className="p-10 bg-[#F2F0EB] rounded-[2rem] mb-6 shadow-inner border border-gray-200">
                    <IconComponent size={64} className="text-[#D95032]" />
                </div>
                <h3 className="text-xl font-bold text-[#3F4859] uppercase tracking-widest">{title} Interface Ready</h3>
                <p className="text-sm text-[#9295A6] max-w-sm mt-4 font-medium">
                    Welcome to the {title} management module. Full CRUD operations, innovation tables, and talent tracking will be initialized here.
                </p>
                <button className="mt-8 px-10 py-3 bg-[#186B8C] text-white rounded-2xl text-xs font-bold uppercase hover:bg-[#4F868C] transition-all shadow-lg hover:-translate-y-1">
                    Access Talent Database
                </button>
            </GlassCard>
        </div>
    </div>
);

export default function Home() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    const [visitedTabs, setVisitedTabs] = useState(['dashboard']);
    const [activeModulesConfig, setActiveModulesConfig] = useState<Record<string, boolean>>({});
    
    // We'll use the authenticated user instead of hardcoded currentUser
    const currentUser = {
        name: user?.name || 'T-DCC Developer',
        email: user?.employeeId || 'tallintelligence.dcc@gmail.com', // just a fallback
        position: user?.role || 'Lead Developer',
        avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
    };

    useEffect(() => {
        const loadConfig = () => {
            const stored = localStorage.getItem('DEV_PERMIT_MODULES');
            if (stored) {
                setActiveModulesConfig(JSON.parse(stored));
            } else {
                const defaults: Record<string, boolean> = {};
                SYSTEM_MODULES.forEach(m => {
                    defaults[m.id] = true;
                    m.subItems?.forEach(s => defaults[s.id] = true);
                });
                setActiveModulesConfig(defaults);
            }
        };
        
        loadConfig();
        window.addEventListener('sysConfigUpdate', loadConfig);
        return () => window.removeEventListener('sysConfigUpdate', loadConfig);
    }, []);

    const isDev = user?.isDev === true;

    const visibleModules = SYSTEM_MODULES.filter(mod => {
        // If Dev, they see everything logically allowed
        return activeModulesConfig[mod.id] !== false;
    }).map(mod => {
        if (!mod.subItems) return mod;
        return {
            ...mod,
            subItems: mod.subItems.filter(sub => {
                if (sub.id === 'dev_permit') return isDev;
                return activeModulesConfig[sub.id] !== false;
            })
        };
    }).filter(mod => !mod.subItems || mod.subItems.length > 0);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!visitedTabs.includes(activeTab)) setVisitedTabs(prev => [...prev, activeTab]);
    }, [activeTab]);

    const toggleMenu = (menuKey: string) => {
        setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
        if (!isSidebarOpen) setSidebarOpen(true);
    };

    const getTabContent = (tabId: string) => {
        const module = visibleModules.find(m => m.id === tabId || m.subItems?.some(s => s.id === tabId));
        let title = tabId.replace(/_/g, ' ').toUpperCase();
        let icon = Users;

        if (tabId === 'dashboard') return <DashboardView />;
        if (tabId === 'pro_calendar' || tabId === 'PRO_CALENDAR') return <ProCalendar />;
        if (tabId === 'plan_fr_planning' || tabId === 'PLAN_FR_PLANNING') return <PlanFrPlanning />;
        if (tabId === 'plan_by_prod' || tabId === 'PLAN_BY_PROD') return <ProductionPlanning />;
        if (tabId === 'mixing_plan' || tabId === 'MIXING_PLAN') return <DailyBoard />;
        if (tabId === 'packing_plan' || tabId === 'PACKING_PLAN') return <PackingBoard />;
        if (tabId === 'master_item' || tabId === 'MASTER_ITEM') return <MasterItems />;
        if (tabId === 'product_matrix' || tabId === 'PRODUCT_MATRIX') return <ProductMatrix />;
        if (tabId === 'prod_tracking' || tabId === 'PROD_TRACKING') return <ProductionTracking />;
        if (tabId === 'machine_breakdown' || tabId === 'MACHINE_BREAKDOWN') return <MachineBreakdown />;
        if (tabId === 'std_process_time') return <STDProcess />;
        if (tabId === 'equipment_registry') return <EquipmentRegistry />;
        if (tabId === 'user_permission' || tabId === 'USER_PERMISSION') return <UserPermissions />;
        if (tabId === 'system_config' || tabId === 'SYSTEM_CONFIG') return <SystemConfig />;
        if (tabId === 'dev_permit') return isDev ? <DevPermit /> : <div className="p-8 text-center text-slate-500">Access Denied</div>;
        
        if (module) {
            const subItem = module.subItems?.find(s => s.id === tabId);
            title = subItem ? subItem.label : module.label;
            icon = module.icon;
        }

        return <GenericView title={title} icon={icon} />;
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F2F0EB] text-[#3F4859]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 134, 140, 0.1); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F868C; }
                .animate-shimmer { animation: shimmer 1.5s infinite; }
                .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
                .shadow-glow-teal { box-shadow: 0 0 15px rgba(79, 134, 140, 0.3); }
                .shadow-glow-red { box-shadow: 0 0 15px rgba(217, 22, 4, 0.3); }
                .shadow-soft { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04); }
                .shadow-grand { box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); }
            `}</style>
            
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-500 shadow-grand bg-[#141A26]
                lg:relative lg:flex
                ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
                ${isSidebarOpen ? 'lg:w-72' : 'lg:w-24'}
            `}>
                <button 
                    onClick={() => setSidebarOpen(!isSidebarOpen)} 
                    className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-[#4F868C] text-white rounded-full items-center justify-center shadow-lg z-50 border-2 border-[#141A26] hover:bg-[#D91604] transition-colors"
                >
                    {isSidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                </button>

                <div className="h-32 flex flex-col items-center justify-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A91B18] to-[#96291C] flex items-center justify-center shadow-lg transform rotate-3 relative overflow-hidden group border border-white/10">
                            <Beef 
                                size={26} 
                                className="text-[#EFEBCE]" 
                                strokeWidth={2.5} 
                            />
                        </div>

                        <div className={`transition-all duration-500 overflow-hidden flex flex-col ${(isSidebarOpen || isMobileMenuOpen) ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                            <h1 className="text-white text-xl tracking-widest whitespace-nowrap">
                                <span className="font-light">MEAT</span><span className="font-extrabold text-[#A91B18]">PRO</span>
                            </h1>
                            <p className="text-[#90B7BF] text-[9px] font-bold uppercase tracking-[0.74em] mt-0.5 whitespace-nowrap">Halal MES</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-4 relative z-10">
                    {visibleModules.map(module => (
                        <React.Fragment key={module.id}>
                            {module.id === 'planning' && (isSidebarOpen || isMobileMenuOpen) && (
                                <div className="mt-6 mb-2 px-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F2B705]">
                                        OPERATIONAL MODULES
                                    </h3>
                                </div>
                            )}
                            <NavItem 
                                icon={module.icon} 
                                label={module.label} 
                                active={activeTab === module.id || module.subItems?.some(s => s.id === activeTab)} 
                                onClick={() => {
                                    if (module.subItems) {
                                        toggleMenu(module.id);
                                    } else {
                                        setActiveTab(module.id);
                                        if (window.innerWidth < 1024) setMobileMenuOpen(false);
                                    }
                                }} 
                                isOpen={isSidebarOpen || isMobileMenuOpen}
                                isExpanded={expandedMenus[module.id]}
                                onToggleExpand={() => toggleMenu(module.id)}
                                subItems={module.subItems?.map(sub => ({
                                    label: sub.label,
                                    active: activeTab === sub.id,
                                    onClick: () => {
                                        setActiveTab(sub.id);
                                        if (window.innerWidth < 1024) setMobileMenuOpen(false);
                                    }
                                }))}
                            />
                        </React.Fragment>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
                    <div className={`flex items-center gap-3 ${(!isSidebarOpen && !isMobileMenuOpen) && 'justify-center'}`}>
                        <div 
                            className="w-11 h-11 rounded-2xl border-2 border-[#4F868C]/30 bg-cover bg-center shrink-0 shadow-sm p-0.5" 
                        >
                            <img src={currentUser.avatar} className="w-full h-full object-cover rounded-xl" alt="user" />
                        </div>
                        {(isSidebarOpen || isMobileMenuOpen) && (
                            <div className="overflow-hidden">
                                <p className="text-white text-sm font-bold truncate w-32">{currentUser.name}</p>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-[#4F868C] rounded-full animate-pulse"></span>
                                    <p className="text-[#8F9FBF] text-[10px] uppercase font-bold tracking-wider">Logged in</p>
                                </div>
                            </div>
                        )}
                        {(isSidebarOpen || isMobileMenuOpen) && <LogOut size={18} className="ml-auto text-[#9295A6] hover:text-[#D91604] cursor-pointer transition-colors" onClick={logout} title="Log Out" />}
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative overflow-hidden bg-[#F2F0EB] flex flex-col w-full">
                <header className="h-20 lg:h-24 px-4 sm:px-6 md:px-8 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-4 group select-none">
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-[#3F4859]"
                        >
                            <LayoutDashboard size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-3 lg:gap-4 ml-2">
                            <div className="relative flex items-center justify-center w-14 h-14">
                                <div className="absolute inset-0 bg-[#FF3B30] blur-[12px] opacity-30 rounded-full"></div>
                                <Beef size={40} className="text-[#FF3B30] relative z-10" strokeWidth={2} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-lg lg:text-xl font-black text-[#2E395F] tracking-tight leading-none drop-shadow-sm">AUTHENTIC <span className="text-[#BB8588] italic">&</span> VARIETY <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#537E72] to-[#184F61]">HALAL FOOD</span></h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-0.5 w-8 bg-[#DCBC1B] rounded-full shadow-[0_0_5px_#DCBC1B]"></div>
                                    <p className="text-[10px] font-bold text-[#55738D] tracking-[0.15em] uppercase group-hover:text-[#C22D2E] transition-colors duration-300">High Quality & Safety Product for Consumption</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 lg:gap-5">
                        <div className="hidden md:flex items-center gap-4 bg-white/50 rounded-lg pl-4 pr-1 py-1 border border-[#D7CE93]/30 shadow-sm backdrop-blur-sm group hover:bg-white/70 transition-colors">
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-[10px] font-bold text-[#7B555C] tracking-widest uppercase">{currentTime.toLocaleDateString('en-GB', { weekday: 'long' })}</span>
                                <span className="text-xs font-bold text-[#2E395F]">{currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="h-6 w-[1px] bg-[#90B7BF]/40"></div>
                            <div className="flex items-center gap-2 bg-[#A91B18] text-white px-3 py-1.5 rounded font-mono text-sm tracking-widest shadow-inner">
                                <Clock size={14} className="text-white animate-pulse"/> {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <button className="relative p-3 rounded-full bg-white/50 hover:bg-white/70 transition-colors border border-white/60">
                            <Bell size={18} className="text-[#2E395F]" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#A91B18] rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 px-4 sm:px-6 md:px-8 pt-2 pb-4 custom-scrollbar overflow-y-auto flex flex-col">
                    <div className="flex-1">
                        {visitedTabs.map(tabId => (
                            <div key={tabId} style={{ display: activeTab === tabId ? 'block' : 'none' }}>
                                {getTabContent(tabId)}
                            </div>
                        ))}
                    </div>
                    <footer className="mt-8 py-3.5 text-center border-t border-[#4F868C]/10 w-full shrink-0">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2">
                                <Sparkles size={11} className="text-[#F2B705]" />
                                <span className="text-[11px] font-bold text-[#186B8C] uppercase tracking-[0.15em]">
                                    MEAT PRO • PRODUCTION MANAGEMENT SYSTEM • ISO 9001, GHPs, HACCP, HALAL CERTIFIED
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-[#4F868C]">
                                <span className="font-light">System by <span className="font-black uppercase text-[#141A26]">T All Intelligence</span></span>
                                <span className="opacity-20">|</span>
                                <div className="flex items-center gap-1.5">
                                    <Phone size={10} className="text-[#D91604]" />
                                    <span className="font-medium">082-5695654</span>
                                </div>
                                <span className="opacity-20">|</span>
                                <div className="flex items-center gap-1.5">
                                    <Mail size={10} className="text-[#186B8C]" />
                                    <span className="font-medium">tallintelligence.ho@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
