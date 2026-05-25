import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Activity, ShieldAlert, Clock, UserCheck, Search, Filter, Download, 
  Eye, X, FileText, AlertTriangle, CheckCircle, Server, Database, 
  ChevronLeft, ChevronRight, HelpCircle, ChevronDown, MapPin
} from 'lucide-react';
import { api, cache } from '../../services/api';

const THEME = {
  bgMain: '#F2F0EB',
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #141A26 0%, #0F172A 100%)',
  glassWhite: 'rgba(255, 255, 255, 0.90)',
  primary: '#141A26',
  primaryLight: '#4F868C',
  accent: '#16778C',
  gold: '#F2B705',
  brightGold: '#F2B705',
  success: '#537E72',
  danger: '#D91604',
  skyBlue: '#4F868C',
  dustyBlue: '#737597',
  indigo: '#3F4859',
  softPurple: '#BB8588',
  deepNavy: '#141A26',
  brownGold: '#D8A48F',
  vibrantPurple: '#2d2c4a',
  burntOrange: '#D95032',
  slateBlue: '#4F868C',
  coolGray: '#E6E1DB'
};

const generateMockLogs = () => {
    const logs = [];
    const modules = ['Authentication', 'User Permission', 'Item Master', 'Sales Order', 'Inventory', 'System Config'];
    const actions = ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'DATA_EXPORT', 'RECORD_CREATED', 'RECORD_DELETED', 'PERMISSION_CHANGED', 'UNAUTHORIZED_ACCESS'];
    const users = ['SOMCHAI SALES', 'SUDA MARKETING', 'T-DCC Developer', 'SARAH SUPPORT', 'UNKNOWN_USER'];
    
    for (let i = 1; i <= 45; i++) {
        const statusType = Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Failed' : 'Warning') : 'Success';
        const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
        logs.push({
            id: `LOG-${String(i).padStart(5, '0')}`,
            timestamp: date.toISOString().replace('T', ' ').substring(0, 19),
            user: statusType === 'Failed' && Math.random() > 0.5 ? 'UNKNOWN_USER' : users[Math.floor(Math.random() * users.length)],
            role: statusType === 'Failed' ? '-' : (Math.random() > 0.5 ? 'ADMIN' : 'USER'),
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            module: modules[Math.floor(Math.random() * modules.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            status: statusType,
            details: statusType === 'Failed' ? 'Invalid credentials or expired token.' : 'Operation completed successfully.',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        });
    }
    return logs.sort((a, b: any) => (new Date(b.timestamp) as any) - (new Date(a.timestamp) as any));
};

const KpiCard = ({ icon: IconComp, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white px-6 py-6 rounded-3xl border border-[#E6E1DB] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#F2B705] hover:shadow-md transition-all duration-300 min-h-[120px] flex flex-col justify-between animate-fadeIn cursor-pointer">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 pointer-events-none z-0">
            <IconComp size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full">
            <p className="text-[11px] font-bold text-[#737597] uppercase tracking-widest">{label}</p>
            <div className={`w-10 h-10 rounded-[14px] border flex items-center justify-center shrink-0 shadow-sm transition-all`} style={{backgroundColor: `${colorAccent}10`, borderColor: `${colorAccent}20`, color: colorAccent}}>
                <IconComp size={20} />
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between">
            <div className="text-[28px] font-black leading-none text-[#141A26] font-mono" style={{color: colorValue}}>
                {value}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#737597] flex items-center gap-1">
                {desc}
            </span>
        </div>
    </div>
);

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#141A26]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#F2B705] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-[#141A26] px-8 py-5 flex justify-between items-center text-white shrink-0 border-b border-[#3F4859] shadow-sm relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shadow-inner border border-white/20"><ShieldAlert size={20} /></div>
            <div>
              <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm">AUDIT GUIDE</h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1 drop-shadow-sm">คู่มือการตรวจสอบบันทึกการใช้งาน</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#3F4859] text-[12px] leading-relaxed custom-scrollbar bg-[#F2F0EB]">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#141A26] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2">
              <Activity size={18} className="text-[#F2B705]"/> 1. Purpose of Access Logs
            </h4>
            <div className="space-y-3 text-[12px] font-medium leading-relaxed bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm">
              <p className="mb-2">หน้าต่าง Access Logs ใช้สำหรับการตรวจสอบความเคลื่อนไหวและประวัติการเข้าถึงระบบทั้งหมด เพื่อให้สอดคล้องกับมาตรฐานความปลอดภัย (Security Audit)</p>
              <ul className="list-disc pl-5 space-y-1 text-[#3F4859]">
                <li>เก็บบันทึกการเข้าสู่ระบบ (Login) ทั้งสำเร็จและล้มเหลว</li>
                <li>ติดตามการแก้ไขข้อมูลสำคัญ (Create, Update, Delete)</li>
                <li>บันทึกหมายเลข IP และอุปกรณ์ที่ใช้เข้าถึง</li>
              </ul>
            </div>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#141A26] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2">
              <Filter size={18} className="text-[#4F868C]"/> 2. Status Indicators
            </h4>
            <div className="space-y-3 text-[12px] leading-relaxed font-medium bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm">
              <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#537E72]/10 text-[#537E72] border border-[#537E72]/20 font-black text-[10px]">SUCCESS</span>
                  <p className="text-[#3F4859]">การทำงานเสร็จสมบูรณ์ ไม่มีข้อผิดพลาด</p>
              </div>
              <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#D95032]/10 text-[#D95032] border border-[#D95032]/20 font-black text-[10px]">WARNING</span>
                  <p className="text-[#3F4859]">การเข้าถึงที่ควรจับตามอง เช่น สิทธิ์ไม่เพียงพอ</p>
              </div>
              <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#D91604]/10 text-[#D91604] border border-[#D91604]/20 font-black text-[10px]">FAILED</span>
                  <p className="text-[#3F4859]">การทำงานล้มเหลว หรือการพยายามเจาะระบบ</p>
              </div>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#141A26] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2">
              <Download size={18} className="text-[#537E72]"/> 3. Data Export
            </h4>
            <p className="text-[12px] leading-relaxed font-medium">
              ผู้ดูแลระบบสามารถกดปุ่ม <b className="text-[#141A26]">EXPORT LOGS</b> เพื่อดาวน์โหลดข้อมูลเป็นไฟล์ CSV สำหรับนำไปวิเคราะห์ต่อในระบบภายนอก หรือเก็บเป็นหลักฐานรายงาน (Audit Report)
            </p>
          </section>
        </div>
        
        <div className="px-8 py-4 bg-white border-t border-[#E6E1DB] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#141A26] text-white font-black rounded-xl uppercase text-[11px] hover:bg-[#3F4859] transition-all shadow-md tracking-widest border border-[#141A26]">รับทราบ (Got it)</button>
        </div>
      </div>
    </>,
    document.body
  );
}

function LogDetailsModal({ isOpen, onClose, log }: any) {
    if (!isOpen || !log) return null;

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Success': return 'text-[#537E72] bg-[#537E72]/10 border-[#537E72]/20';
            case 'Failed': return 'text-[#D91604] bg-[#D91604]/10 border-[#D91604]/20';
            case 'Warning': return 'text-[#D95032] bg-[#D95032]/10 border-[#D95032]/20';
            default: return 'text-[#737597] bg-white border-[#E6E1DB]';
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#141A26]/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-[28px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden border border-[#E6E1DB]/50">
                <div className="bg-[#141A26] px-8 py-4 flex justify-between items-center text-[#F2B705] shrink-0 border-b border-[#3F4859]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shadow-inner border border-white/20"><FileText size={24} strokeWidth={2.5} /></div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm text-white">LOG DETAILS</h3>
                            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-2 drop-shadow-sm"><Activity size={12} className="text-[#F2B705]" /> System Event Inspector</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-[#D91604]"><X size={24} /></button>
                </div>

                <div className="p-8 flex flex-col gap-6 bg-[#F2F0EB] overflow-y-auto custom-scrollbar"> 
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-[#141A26] font-mono tracking-tighter">{log.id}</h2>
                            <p className="text-[11px] font-bold text-[#737597] mt-1 uppercase tracking-widest">{log.timestamp}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full border-2 font-black text-[12px] uppercase tracking-widest ${getStatusStyle(log.status)}`}>
                            {log.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DB] shadow-sm space-y-4">
                            <h4 className="text-[11px] font-black text-[#141A26] uppercase tracking-widest border-b border-[#E6E1DB] pb-2 flex items-center gap-2"><UserCheck size={14} className="text-[#4F868C]"/> User Identity</h4>
                            <div className="space-y-3">
                                <div><p className="text-[9px] font-black text-[#737597] uppercase tracking-widest">Username / ID</p><p className="text-[13px] font-black text-[#141A26] font-mono">{log.user}</p></div>
                                <div><p className="text-[9px] font-black text-[#737597] uppercase tracking-widest">Access Role</p><p className="text-[12px] font-bold text-[#F2B705]">{log.role}</p></div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DB] shadow-sm space-y-4">
                            <h4 className="text-[11px] font-black text-[#141A26] uppercase tracking-widest border-b border-[#E6E1DB] pb-2 flex items-center gap-2"><Server size={14} className="text-[#4F868C]"/> Network & Device</h4>
                            <div className="space-y-3">
                                <div><p className="text-[9px] font-black text-[#737597] uppercase tracking-widest">IP Address</p><p className="text-[13px] font-black text-[#4F868C] font-mono">{log.ip}</p></div>
                                <div><p className="text-[9px] font-black text-[#737597] uppercase tracking-widest">User Agent</p><p className="text-[11px] font-medium text-[#3F4859] truncate" title={log.userAgent}>{log.userAgent}</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E6E1DB] shadow-sm space-y-4">
                        <h4 className="text-[11px] font-black text-[#141A26] uppercase tracking-widest border-b border-[#E6E1DB] pb-2 flex items-center gap-2"><Database size={14} className="text-[#4F868C]"/> Action Payload</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><p className="text-[9px] font-black text-[#737597] uppercase tracking-widest">Target Module</p><p className="text-[12px] font-bold text-[#141A26]">{log.module}</p></div>
                            <div><p className="text-[9px] font-black text-[#737597] uppercase tracking-widest">Action Performed</p><p className="text-[12px] font-black text-[#4F868C] uppercase font-mono">{log.action}</p></div>
                        </div>
                        <div className="bg-[#F2F0EB] p-4 rounded-xl border border-[#E6E1DB] font-mono text-[11px] text-[#3F4859]">
                            <span className="text-[#D91604] font-bold">"Message"</span>: "{log.details}"
                        </div>
                    </div>
                </div>

                <div className="px-8 py-4 bg-white border-t border-[#E6E1DB] flex justify-end items-center shrink-0">
                    <button onClick={onClose} className="px-10 py-3 bg-[#141A26] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#3F4859] hover:text-white transition-all border border-[#141A26]">
                        Close Details
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function AccessLogs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            
            const response = await api.post('read', 'AccessLogs');
            if (response.status === 'success' && response.data && response.data.length > 0) {
                const mappedLogs = [...response.data].reverse().map((realLog) => ({
                    id: realLog.id || `LOG-${Math.floor(Math.random()*10000)}`,
                    timestamp: realLog.timestamp ? new Date(realLog.timestamp).toISOString().replace('T', ' ').substring(0, 19) : '',
                    user: realLog.userName || realLog.userId || 'UNKNOWN_USER',
                    role: 'USER',
                    ip: realLog.ipAddress || '192.168.0.1',
                    module: 'System',
                    action: realLog.action || 'UNKNOWN',
                    status: realLog.action?.includes('Failed') ? 'Failed' : 'Success',
                    details: realLog.details || '',
                    userAgent: '-'
                }));
                setLogs(mappedLogs);
            } else {
                setLogs(generateMockLogs());
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            setLogs(generateMockLogs());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const totalLogs = logs.length;
    const failedLogs = logs.filter(l => l.status === 'Failed').length;
    const successLogs = logs.filter(l => l.status === 'Success').length;
    const uniqueUsers = new Set(logs.map(l => l.user)).size;

    const filteredLogs = useMemo(() => {
        let res = logs;
        if (statusFilter !== 'All') {
            res = res.filter(l => l.status === statusFilter);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(l => 
                l.user.toLowerCase().includes(q) || 
                l.module.toLowerCase().includes(q) || 
                l.action.toLowerCase().includes(q) ||
                l.ip.includes(q)
            );
        }
        return res;
    }, [logs, statusFilter, searchQuery]);

    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredLogs.slice(start, start + itemsPerPage);
    }, [filteredLogs, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, itemsPerPage]);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Success': return 'text-[#537E72] bg-[#537E72]/10 border-[#537E72]/20';
            case 'Failed': return 'text-[#D91604] bg-[#D91604]/10 border-[#D91604]/20';
            case 'Warning': return 'text-[#D95032] bg-[#D95032]/10 border-[#D95032]/20';
            default: return 'text-[#737597] bg-white border-[#E6E1DB]';
        }
    };

    return (
        <div className="flex flex-1 w-full font-sans flex-col pb-0 animate-fadeIn">
            
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[220px] -translate-y-1/2 bg-white border border-[#E6E1DB] border-r-0 text-[#141A26] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D91604] hover:text-white hover:border-[#D91604] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#737597] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            <LogDetailsModal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} log={selectedLog} />

            <div className="px-8 pt-6 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-20 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#4F868C] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#4F868C]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <ShieldAlert size={28} strokeWidth={2.5} className="text-[#4F868C]" />
                  </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h3 className="font-black text-[#141A26] uppercase tracking-widest text-[24px] flex items-center gap-2 leading-none">
                                SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F868C] to-[#F2B705] drop-shadow-sm">ACCESS LOGS</span>
                            </h3>
                        </div>
                        <p className="text-[11px] font-bold text-[#537E72] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            SECURITY AUDIT & ACTIVITY TRACKING
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-8 mt-2 pb-6">
                <div className="max-w-[1500px] w-full mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5 shrink-0">
                        <KpiCard label="Total Requests" value={totalLogs.toLocaleString()} icon={Activity} colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="All Logged Events" />
                        <KpiCard label="Successful Actions" value={successLogs.toLocaleString()} icon={CheckCircle} colorAccent={THEME.success} colorValue={THEME.success} desc="Authorized Operations" />
                        <KpiCard label="Failed Attempts" value={failedLogs.toLocaleString()} icon={AlertTriangle} colorAccent={THEME.danger} colorValue={THEME.danger} desc="Requires Attention" />
                        <KpiCard label="Unique Users" value={uniqueUsers} icon={UserCheck} colorAccent={THEME.accent} colorValue={THEME.primary} desc="Active Identities" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-[#E6E1DB]/60 overflow-hidden flex flex-col animate-fadeIn">
                        
                        <div className="px-8 py-4 border-b border-[#E6E1DB] bg-white flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative">
                                    <button onClick={() => setFilterDropdownOpen(!filterDropdownOpen)} className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[#E6E1DB] shadow-sm hover:border-[#F2B705] hover:bg-[#F2F0EB] transition-all min-w-[180px]">
                                        <Filter size={16} className="text-[#F2B705]" />
                                        <span className="text-[11px] font-black uppercase text-[#141A26]">{statusFilter === 'All' ? 'All Statuses' : statusFilter}</span>
                                        <ChevronDown size={14} className={`text-[#737597] ml-auto transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {filterDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setFilterDropdownOpen(false)}></div>
                                            <div className="absolute top-[110%] left-0 w-full bg-white border border-[#E6E1DB] shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                                                {['All', 'Success', 'Failed', 'Warning'].map(status => (
                                                    <button key={status} onClick={() => { setStatusFilter(status); setFilterDropdownOpen(false); }} className={`w-full flex items-center p-3 rounded-xl transition-all ${statusFilter === status ? 'bg-[#F2F0EB] text-[#141A26]' : 'hover:bg-[#F2F0EB] text-[#737597]'}`}>
                                                        <span className="text-[11px] font-black uppercase tracking-wider">{status === 'All' ? 'All Statuses' : status}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="relative flex-1 md:w-80">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737597]" />
                                    <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search user, IP, or module..." className="w-full pl-12 pr-4 py-2.5 text-[12px] font-bold rounded-2xl border border-[#E6E1DB] focus:outline-none focus:border-[#F2B705] bg-white focus:bg-[#F2F0EB] shadow-sm text-[#141A26] transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-3 shrink-0 w-full md:w-auto">
                                <button className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-[#141A26] to-[#3F4859] text-white rounded-2xl text-[11px] font-black tracking-widest uppercase shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2 border border-[#141A26]">
                                    <Download size={16} /> EXPORT LOGS
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar bg-white">
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#141A26] text-white sticky top-0 z-10 border-b-2 border-[#F2B705]">
                                    <tr>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Date / Time</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">User Identity</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">IP Address</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Module & Action</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">Status</th>
                                        <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E6E1DB] bg-white">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-[#737597] font-bold text-[12px]">
                                                Loading logs...
                                            </td>
                                        </tr>
                                    ) : paginatedLogs.length > 0 ? paginatedLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-[#F2F0EB] transition-colors group">
                                            <td className="py-3 px-6 text-[12px]">
                                                <div className="flex items-center gap-2 font-mono text-[#737597]">
                                                    <Clock size={14}/> <span>{log.timestamp}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex flex-col">
                                                    <span className={`font-black text-[12px] font-mono tracking-tight ${log.user === 'UNKNOWN_USER' ? 'text-[#D91604]' : 'text-[#141A26]'}`}>{log.user}</span>
                                                    <span className="text-[10px] font-bold text-[#737597] mt-0.5 uppercase tracking-wider">{log.role}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 font-mono text-[12px] font-bold text-[#4F868C]">
                                                <div className="flex items-center gap-1.5"><MapPin size={12} className="text-[#737597]"/> {log.ip}</div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[12px] text-[#141A26]">{log.module}</span>
                                                    <span className="font-mono text-[10px] font-black text-[#F2B705] mt-0.5 tracking-tight">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <span className={`px-3 py-1 rounded-full border font-black text-[11px] uppercase tracking-widest whitespace-nowrap ${getStatusStyle(log.status)}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex justify-center items-center gap-[1px]">
                                                    <button onClick={() => setSelectedLog(log)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-[#E6E1DB] text-[#4F868C] hover:bg-[#E6E1DB] hover:border-[#4F868C] transition-all active:scale-90" title="View Details">
                                                        <Eye size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-[#737597] font-bold text-[12px]">
                                                No logs found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-3 bg-white border-t-[1.5px] border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-6 text-[11px] font-black text-[#737597] uppercase tracking-widest">
                                <div className="flex items-center gap-3">
                                    <span>Display Rows:</span>
                                    <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#E6E1DB] rounded-lg px-3 py-1.5 outline-none font-black text-[#141A26] cursor-pointer shadow-sm focus:border-[#F2B705]">
                                        {[15, 30, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <p className="bg-white px-4 py-1.5 rounded-lg border border-[#E6E1DB] shadow-sm text-[#141A26]">Total Records: {filteredLogs.length}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-9 h-9 border border-[#E6E1DB] bg-white rounded-lg flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#E6E1DB] text-[#4F868C] shadow-sm active:scale-90'}`}>
                                    <ChevronLeft size={16}/>
                                </button>
                                <div className="bg-white text-[#141A26] px-6 py-2 rounded-lg font-black text-[11px] min-w-[120px] text-center uppercase tracking-widest border border-[#E6E1DB] shadow-sm">
                                    Page {currentPage} / {totalPages || 1}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-9 h-9 border border-[#E6E1DB] bg-white rounded-lg flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#E6E1DB] text-[#4F868C] shadow-sm active:scale-90'}`}>
                                    <ChevronRight size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

