import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import UserGuideButton from '../../components/shared/UserGuideButton';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { ListManagerModal } from '../STDProcess/components/ListManagerModal';
import { api } from '../../services/api';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Clock, 
  List, 
  LayoutGrid, 
  HelpCircle, 
  X, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Save, 
  CalendarDays, 
  Settings, 
  Palmtree,
  Settings2
} from 'lucide-react';

// --- ERP Palette / Main Theme ---
const palette = {
    primary: '#141A26',     // Navy Dark
    accent: '#D91604',      // Danger/Red for Sunday/Alerts
    gold: '#F2B705',        // Gold/Warning
    teal: '#4F868C',        // Teal
    sunday: '#D91604',      // Red for Sunday
    saturday: '#9B7EBD',    // Lavender for Saturday
    bg: '#F2F0EB'           // Neutral Bg
};

// --- Sub Component: KPI Card ---
const KpiCard = ({ title, val, color, IconComponent, desc }: any) => (
    <div className="bg-white p-6 rounded-[22px] shadow-sm hover:shadow-md transition-all duration-300 border border-black/5 relative overflow-hidden group h-full cursor-pointer">
        <div className="absolute -right-6 -bottom-6 opacity-[0.03] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none z-0">
            <IconComponent size={120} />
        </div>
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-black font-mono tracking-tighter leading-tight truncate text-[#141A26]">{val}</h4>
                </div>
                {desc && (
                    <p className="text-[8px] text-slate-400 font-bold mt-2 flex items-center gap-1.5 truncate uppercase">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: color}}></span>
                        {desc}
                    </p>
                )}
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5 bg-slate-50" style={{ color: color }}>
                <IconComponent size={24} strokeWidth={2.5} />
            </div>
        </div>
    </div>
);

export default function ProCalendar() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Production Run', 'Maintenance', 'Cleaning', 'Audit', 'Meeting']);
  const [categoryItems, setCategoryItems] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, configRes] = await Promise.all([
        api.post('read', 'ProCalendar'),
        api.post('read', 'SystemConfig')
      ]);

      let fetchedEvents: any[] = [];
      if (eventsRes.status === 'success' && eventsRes.data?.items) {
        fetchedEvents = eventsRes.data.items;
      }
      
      if (configRes.status === 'success' && configRes.data?.items) {
          const loadedCats = configRes.data.items
             .filter((item: any) => item.category === 'Event Category');
          setCategoryItems(loadedCats);
          if (loadedCats.length > 0) setCategories(loadedCats.map((item: any) => item.value));

          const dbHolidays = configRes.data.items.filter((item: any) => item.category === 'AnnualHoliday');
          const fixedHolidays = [
            { value: '01-01', description: 'วันขึ้นปีใหม่' },
            { value: '03-03', description: 'วันมาฆบูชา' },
            { value: '04-13', description: 'วันสงกรานต์' },
            { value: '04-14', description: 'วันสงกรานต์' },
            { value: '04-15', description: 'วันสงกรานต์' },
            { value: '05-01', description: 'วันแรงงานแห่งชาติ' },
            { value: '06-03', description: 'วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าสุทิดาฯ' },
            { value: '07-28', description: 'วันเฉลิมพระชนมพรรษา รัชกาลที่ 10' },
            { value: '08-12', description: 'วันแม่แห่งชาติ' },
            { value: '10-13', description: 'วันหยุดชดเชย วันนวมินทรมหาราช' },
            { value: '10-23', description: 'วันปิยมหาราช' },
            { value: '12-05', description: 'วันพ่อแห่งชาติ' },
            { value: '12-31', description: 'วันสิ้นปี' }
          ];
          
          // Combine fixed and db holidays
          const holidays = [...fixedHolidays, ...dbHolidays];

          if (holidays.length > 0) {
              const currentYear = new Date().getFullYear();
              const years = [currentYear - 1, currentYear, currentYear + 1];
              const dynamicHolidays = years.flatMap(year => 
                  holidays.map((h: any) => ({
                      id: `DYN-HOL-${year}-${h.value}`,
                      date: `${year}-${h.value}`,
                      title: h.description,
                      time: 'All Day',
                      type: 'Holiday',
                      priority: 'High',
                      status: 'Confirmed'
                  }))
              );
              // avoid duplicate keys or mixed arrays
              fetchedEvents = [...fetchedEvents, ...dynamicHolidays];
          }
      }
      
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Error fetching calendar data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
        case 'Production Run': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Maintenance': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Cleaning': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Audit': return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'Meeting': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Holiday': return 'bg-red-50 text-red-600 border-red-100';
        default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const [eventForm, setEventForm] = useState({
    id: '', date: '', title: '', time: '', type: 'Production Run', priority: 'Normal', status: 'Scheduled'
  });

  const daysOfWeek = [
    { label: 'SUN', color: palette.sunday },
    { label: 'MON', color: palette.primary },
    { label: 'TUE', color: palette.primary },
    { label: 'WED', color: palette.primary },
    { label: 'THU', color: palette.primary },
    { label: 'FRI', color: palette.primary },
    { label: 'SAT', color: palette.saturday }
  ];

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ day: null });
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ 
        day: i, 
        dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isWeekend: (new Date(year, month, i).getDay() === 0 || new Date(year, month, i).getDay() === 6)
      });
    }
    return days;
  }, [currentDate]);

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.type.toLowerCase().includes(searchQuery.toLowerCase());
      const evMonth = ev.date.substring(0, 7);
      const currMonth = currentDate.toISOString().substring(0, 7);
      return matchSearch && (activeTab === 'list' ? true : evMonth === currMonth);
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, searchQuery, currentDate, activeTab]);

  // Pagination Logic
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;

  // Handlers
  const handlePrevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)); setCurrentPage(1); };
  const handleNextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)); setCurrentPage(1); };
  const handleSetToday = () => { setCurrentDate(new Date()); setCurrentPage(1); };

  const openEventModal = (mode: string, data: any = null, type = 'Event') => {
    setModalMode(mode);
    if (mode === 'create') {
      const isHolidays = type === 'Holiday';
      setEventForm({
        id: '', // removed logic `isHolidays ? ...` because backend handles unique id
        date: data?.dateStr || new Date().toISOString().split('T')[0],
        title: '',
        time: isHolidays ? 'All Day' : '10:00',
        type: isHolidays ? 'Holiday' : (categories.includes('Production Run') ? 'Production Run' : categories[0] || 'Meeting'),
        priority: isHolidays ? 'High' : 'Normal',
        status: 'Scheduled'
      });
    } else {
      const cleanedTitle = data.title.replace(/^\*/, '');
      setEventForm({ ...data, title: cleanedTitle });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (isSaving) return;
    if (!eventForm.title || !eventForm.date) return;
    setIsSaving(true);
    const processedTitle = eventForm.title.replace(/^\*/, '');
    
    // Add missing fields for the sheet
    const submitData = {
      ...eventForm,
      title: processedTitle,
      id: modalMode === 'create' ? `EV-${Date.now()}` : eventForm.id,
      createdAt: eventForm.id ? undefined : new Date().toISOString()
    };

    try {
      const res = await api.post(modalMode === 'create' ? 'write' : 'update', 'ProCalendar', submitData);
      if (res.status === 'success') {
          // Fetch again to ensure consistency or just update local
          if (modalMode === 'create') {
            setEvents([...events, submitData]);
          } else {
            setEvents(events.map(e => e.id === submitData.id ? submitData : e));
          }
          setIsModalOpen(false);
          const Swal = typeof window !== 'undefined' ? (window as any).Swal : null;
          if (Swal) Swal.fire({ icon: 'success', title: 'Saved successfully!', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      } else {
          alert('Failed to save event: ' + res.message);
      }
    } catch (e) {
      console.error(e);
      alert('Error saving data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      try {
        const res = await api.post('delete', 'ProCalendar', { id });
        if (res.status === 'success') {
            setEvents(events.filter(e => e.id !== id));
        } else {
            alert('Failed to delete: ' + res.message);
        }
      } catch (e) {
        console.error(e);
        alert('Error deleting data');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F2F0EB] w-full relative">
      <style>{`
        .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
        .day-cell { min-height: 120px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; min-width: 0; }
        .day-cell:nth-child(7n) { border-right: none; }
      `}</style>

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between py-2 gap-4 shrink-0 mb-4 bg-transparent border-b border-[#4F868C]/10 pb-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-[#4F868C]/20">
                <CalendarIcon size={24} className="text-[#141A26]" strokeWidth={2} />
            </div>
            <div>
                <h2 className="text-[#141A26] font-black tracking-tighter text-2xl uppercase leading-none">
                    PRO <span className="text-[#D91604]">CALENDAR</span>
                </h2>
                <p className="text-[#4F868C] text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">Production Schedule & Tracking</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#F2F0EB] p-1 rounded-xl border border-[#4F868C]/20 shadow-inner">
            <button onClick={() => setActiveTab('calendar')} className={`px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 rounded-lg ${activeTab === 'calendar' ? 'bg-[#F2B705] text-white shadow-md' : 'text-[#4F868C] hover:bg-white/50'}`}>
                <LayoutGrid size={14} /> Calendar
            </button>
            <button onClick={() => setActiveTab('list')} className={`px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 rounded-lg ${activeTab === 'list' ? 'bg-[#F2B705] text-white shadow-md' : 'text-[#4F868C] hover:bg-white/50'}`}>
                <List size={14} /> Event List
            </button>
          </div>
        </div>
      </header>

      {/* Guide Toggle Button (Right Edge) */}
      {!isGuideOpen && (
          <UserGuideButton 
              onClick={() => setIsGuideOpen(true)} 
              className="bg-[#D6E0E1] text-[#4A7F85] hover:bg-[#4A7F85] hover:text-white"
          />
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 shrink-0">
            <KpiCard title="Prod Orders" val={filteredEvents.filter(e=>e.type !== 'Holiday').length} color={palette.teal} IconComponent={LayoutGrid} desc="Active Runs" />
            <KpiCard title="Plant Holidays" val={events.filter(e=>e.type === 'Holiday' && new Date(e.date) >= new Date()).length} color={palette.accent} IconComponent={Palmtree} desc="Line Stoppages" />
            <KpiCard title="Maintenance" val={events.filter(e=>e.type==='Maintenance').length} color={palette.gold} IconComponent={Settings} desc="PM & Fixes" />
            <KpiCard title="Scheduled Tasks" val={filteredEvents.length} color="#16A34A" IconComponent={CalendarDays} desc="This Month" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#4F868C]/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[600px]">
          
          <div className="px-6 py-4 border-b border-[#4F868C]/10 flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#F2F0EB]/30 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#4F868C]/20 shadow-sm">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F2F0EB] rounded-lg transition-colors text-[#4F868C]"><ChevronLeft size={20}/></button>
                <div className="px-4 text-[16px] font-black text-[#141A26] uppercase tracking-widest min-w-[180px] text-center">
                  {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth} className="p-2 hover:bg-[#F2F0EB] rounded-lg transition-colors text-[#4F868C]"><ChevronRight size={20}/></button>
              </div>
              <button onClick={handleSetToday} className="px-6 h-11 bg-white border border-[#4F868C]/20 text-[#141A26] font-black uppercase tracking-widest rounded-xl hover:bg-[#F2F0EB] transition-all text-[11px] shadow-sm">Today</button>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F868C]/50" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search activities..." className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold rounded-xl border border-[#4F868C]/20 focus:outline-none focus:border-[#F2B705] bg-white transition-all shadow-sm text-[#141A26]" />
              </div>
              <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEventModal('create', null, 'Event')} className="px-5 h-11 bg-[#141A26] text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-md hover:bg-[#4F868C] transition-all flex items-center gap-2">
                    <Plus size={16} className="text-[#F2B705]" strokeWidth={3} /> Add Event
                  </button>
                  <button onClick={() => openEventModal('create', null, 'Holiday')} className="px-5 h-11 bg-[#D91604] text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-md hover:bg-[#B31203] transition-all flex items-center gap-2">
                    <Palmtree size={16} strokeWidth={2.5} /> Add Holiday
                  </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {activeTab === 'calendar' ? (
              <div className="flex flex-col min-w-[800px]">
                <div className="calendar-grid border-b border-[#4F868C]/20">
                  {daysOfWeek.map((day, idx) => (
                    <div key={idx} style={{ backgroundColor: day.color }} className="py-3 text-center text-[11px] font-black tracking-[0.2em] text-white">
                      {day.label}
                    </div>
                  ))}
                </div>
                <div className="calendar-grid bg-[#F2F0EB]/30">
                  {calendarDays.map((d, idx) => {
                    const dayEvents = events.filter(e => e.date === d.dateStr);
                    const isSunday = idx % 7 === 0;
                    const isSaturday = idx % 7 === 6;

                    return (
                      <div key={idx} className={`day-cell p-2 transition-colors relative group ${!d.day ? 'bg-transparent opacity-30' : 'bg-white hover:bg-[#F2F0EB]/80'} ${isSunday && d.day ? 'bg-red-50/30' : ''} ${isSaturday && d.day ? 'bg-teal-50/30' : ''}`}>
                        {d.day && (
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <span className={`w-7 h-7 flex items-center justify-center rounded-full font-black text-[13px] ${d.isToday ? 'bg-[#D91604] text-white shadow-md' : 'text-[#4F868C]'} ${isSunday && !d.isToday ? 'text-[#D91604]' : ''}`}>{d.day}</span>
                            </div>
                            <div className="space-y-1 overflow-y-auto max-h-[85px] custom-scrollbar pb-6">
                              {dayEvents.map((ev, i) => (
                                <div key={i} title={ev.title.replace(/^\*/, '')} onClick={() => openEventModal('edit', ev)} className={`px-2 py-1 rounded-sm text-[9px] font-bold border shadow-sm cursor-pointer hover:scale-[1.02] transition-all flex items-center gap-1 ${getTypeColor(ev.type)} overflow-hidden`}>
                                  {ev.type === 'Holiday' && <Palmtree size={10} className="shrink-0" />}
                                  <span className="truncate">{ev.title.replace(/^\*/, '')}</span>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => openEventModal('create', d, 'Event')} className="absolute bottom-2 right-2 w-6 h-6 bg-[#141A26] rounded-lg shadow-md flex items-center justify-center text-[#F2B705] opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-[#F8F9FA] border-b-2 border-slate-200">
                    <tr>
                      <th className="font-mono text-[11px] uppercase tracking-widest text-[#55738D] px-6 py-4 font-bold">Date & Time</th>
                      <th className="font-mono text-[11px] uppercase tracking-widest text-[#55738D] px-6 py-4 font-bold">Title & Activity</th>
                      <th className="font-mono text-[11px] uppercase tracking-widest text-[#55738D] px-6 py-4 font-bold">Category</th>
                      <th className="font-mono text-[11px] uppercase tracking-widest text-[#55738D] px-6 py-4 font-bold text-center">Priority</th>
                      <th className="font-mono text-[11px] uppercase tracking-widest text-[#55738D] px-6 py-4 font-bold text-center">Status</th>
                      <th className="font-mono text-[11px] uppercase tracking-widest text-[#55738D] px-6 py-4 font-bold text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4F868C]/10 bg-white">
                    {paginatedEvents.map((ev) => (
                      <tr key={ev.id} className="hover:bg-[#F2F0EB]/80 transition-colors group">
                        <td className="px-6 py-3 border-b border-[#4F868C]/5 text-[12px] text-[#141A26] font-medium align-middle">
                          <div className="flex flex-col gap-1">
                            <span className="font-black text-[#141A26] uppercase flex items-center gap-1.5 leading-none">
                              <CalendarDays size={14} className="text-[#4F868C]" />
                              {new Date(ev.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[11px] text-[#4F868C] font-mono flex items-center gap-1.5 leading-none pl-5">
                              <Clock size={11} className="text-[#F2B705]"/> {ev.time}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b border-[#4F868C]/5 text-[12px] text-[#141A26] font-medium align-middle">
                          <div className={`flex items-center gap-2 font-black uppercase tracking-tight ${ev.type === 'Holiday' ? 'text-[#D91604]' : 'text-[#141A26]'}`}>
                            {ev.type === 'Holiday' && <Palmtree size={14} className="text-[#D91604]" />}
                            {ev.title.replace(/^\*/, '')}
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b border-[#4F868C]/5 text-[12px] text-[#141A26] font-medium align-middle">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-[0.1em] shadow-sm inline-block ${getTypeColor(ev.type)}`}>
                            {ev.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 border-b border-[#4F868C]/5 text-[12px] text-[#141A26] font-medium align-middle text-center">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter shadow-sm border ${ev.priority === 'High' || ev.priority === 'Critical' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {ev.priority}
                          </span>
                        </td>
                        <td className="px-6 py-3 border-b border-[#4F868C]/5 text-[12px] text-[#141A26] font-medium align-middle text-center">
                          <div className={`flex items-center justify-center gap-2 text-[11px] font-black uppercase border rounded-xl py-1 px-3 w-fit mx-auto shadow-sm ${ev.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                             {ev.status === 'Completed' ? <CheckCircle2 size={13}/> : <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"/>}
                             {ev.status}
                          </div>
                        </td>
                        <td className="px-6 py-3 border-b border-[#4F868C]/5 text-[12px] text-[#141A26] font-medium align-middle text-center">
                          <div className="flex justify-center gap-0.5">
                            <button onClick={() => openEventModal('edit', ev)} className="p-2 bg-white border border-[#4F868C]/20 rounded-lg text-[#F2B705] hover:bg-[#F2B705] hover:text-white transition-all shadow-sm"><Pencil size={14}/></button>
                            <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 bg-white border border-[#4F868C]/20 rounded-lg text-[#D91604] hover:bg-[#D91604] hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedEvents.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-20 text-center text-[#4F868C] font-bold uppercase tracking-widest text-[12px] opacity-70">No matching activities in current scope</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {activeTab === 'list' && (
            <div className="px-8 py-4 border-t border-[#4F868C]/10 bg-[#F2F0EB]/50 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-mono">
                <div className="text-[11px] font-black text-[#4F868C] uppercase tracking-widest">Displaying {paginatedEvents.length} of {filteredEvents.length} schedules</div>
                <div className="flex items-center gap-1">
                    <button onClick={()=>setCurrentPage(p=>Math.max(1, p-1))} disabled={currentPage===1} className="p-2 rounded-xl border border-[#4F868C]/20 bg-white text-[#141A26] disabled:opacity-30 hover:bg-[#F2F0EB] shadow-sm transition-all"><ChevronLeft size={16}/></button>
                    <div className="flex items-center px-4 h-9 bg-white border border-[#4F868C]/20 rounded-xl shadow-sm text-[10px] font-black text-[#141A26]">PAGE {currentPage} / {totalPages}</div>
                    <button onClick={()=>setCurrentPage(p=>Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 rounded-xl border border-[#4F868C]/20 bg-white text-[#141A26] disabled:opacity-30 hover:bg-[#F2F0EB] shadow-sm transition-all"><ChevronRight size={16}/></button>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add / Edit Event */}
      <DraggableModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? (eventForm.type === 'Holiday' ? 'New Holiday' : 'Create Event') : 'Modify Entry'}
        icon={eventForm.type === 'Holiday' ? <Palmtree size={16} className="text-[#D91604]" /> : <CalendarDays size={16} className="text-[#F2B705]" />}
        className="w-full max-w-xl"
        headerClassName="bg-[#141A26] text-white border-t-[8px] border-[#F2B705]"
        contentClassName="p-6"
      >
        <div className="space-y-6 font-sans">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">{eventForm.type === 'Holiday' ? 'Holiday Name' : 'Event Description'}</label>
                <input value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} className="w-full border-b-2 border-[#4F868C]/20 bg-transparent py-2 text-sm font-bold text-[#141A26] focus:border-[#F2B705] outline-none transition-colors" placeholder={eventForm.type === 'Holiday' ? "ระบุชื่อวันสำคัญ..." : "Interview, Onboarding, Training..."} />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Date</label>
                    <input type="date" value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} className="w-full border-b-2 border-[#4F868C]/20 bg-transparent py-1.5 text-sm font-bold text-[#141A26] focus:border-[#F2B705] outline-none transition-colors" />
                </div>
                {eventForm.type !== 'Holiday' && (
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Time</label>
                      <div className="relative">
                        <Clock size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#F2B705]" />
                        <input type="time" value={eventForm.time} onChange={e=>setEventForm({...eventForm, time: e.target.value})} className="w-full pl-6 border-b-2 border-[#4F868C]/20 bg-transparent py-1.5 text-sm font-bold text-[#141A26] focus:border-[#F2B705] outline-none transition-colors" />
                      </div>
                  </div>
                )}
            </div>

            {eventForm.type !== 'Holiday' && (
              <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1.5 relative">
                      <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2 flex justify-between items-center">
                        Category
                        <button onClick={() => setIsConfigOpen(true)} className="text-[#4F868C] hover:text-[#D91604]"><Settings2 size={12} /></button>
                      </label>
                      <select value={eventForm.type} onChange={e=>setEventForm({...eventForm, type: e.target.value})} className="w-full border-b-2 border-[#4F868C]/20 bg-transparent py-1.5 text-xs font-bold text-[#141A26] outline-none cursor-pointer focus:border-[#F2B705] transition-colors">
                        {categories.map((cat, i) => (
                           <option key={i}>{cat}</option>
                        ))}
                      </select>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Priority</label>
                      <select value={eventForm.priority} onChange={e=>setEventForm({...eventForm, priority: e.target.value})} className="w-full border-b-2 border-[#4F868C]/20 bg-transparent py-1.5 text-xs font-bold text-[#141A26] outline-none cursor-pointer focus:border-[#F2B705] transition-colors">
                        <option>Low</option><option>Normal</option><option>High</option><option>Critical</option>
                      </select>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Status</label>
                      <select value={eventForm.status} onChange={e=>setEventForm({...eventForm, status: e.target.value})} className="w-full border-b-2 border-[#4F868C]/20 bg-transparent py-1.5 text-xs font-black text-[#D91604] outline-none cursor-pointer uppercase focus:border-[#F2B705] transition-colors">
                        <option>Scheduled</option><option>Confirmed</option><option>Completed</option>
                      </select>
                  </div>
              </div>
            )}
        </div>

        <div className="mt-8 pt-4 border-t border-[#4F868C]/10 flex justify-end gap-3 font-mono">
            <button onClick={()=>setIsModalOpen(false)} className="px-6 py-2.5 text-[#4F868C] font-black uppercase text-[10px] hover:text-[#141A26] transition-colors" disabled={isSaving}>Cancel</button>
            <button onClick={handleSaveEvent} disabled={isSaving} className={`px-10 py-3 rounded-2xl font-black uppercase text-[10px] shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 ${eventForm.type === 'Holiday' ? 'bg-[#D91604]' : 'bg-[#141A26]'} text-white opacity-${isSaving ? '50' : '100'}`}>
                {isSaving ? <span className="animate-spin mr-1 border-t-2 border-l-2 border-white w-4 h-4 rounded-full"></span> : <Save size={16} className={`${eventForm.type === 'Holiday' ? 'text-white' : 'text-[#F2B705]'}`} />}
                {isSaving ? 'Saving...' : 'Save Entry'}
            </button>
        </div>
      </DraggableModal>

      {/* List Manager Modal for Config */}
      {isConfigOpen && (
          <ListManagerModal
              title="Manage Categories"
              items={categories}
              onAdd={async (newItem: string) => {
                  try {
                      // Attempt to save to SystemConfig
                      const newId = `CAT-${Date.now()}`;
                      const fullItem = { id: newId, category: 'Event Category', value: newItem, description: 'Added from ProCalendar' };
                      await api.post('write', 'SystemConfig', fullItem);
                      setCategoryItems([...categoryItems, fullItem]);
                      setCategories([...categories, newItem]);
                  } catch (e) {
                      console.error("Failed to add category", e);
                  }
              }}
              onEdit={async (oldItem: string, newItem: string) => {
                  try {
                      const itemObj = categoryItems.find(c => c.value === oldItem);
                      if (itemObj && itemObj.id) {
                          await api.post('update', 'SystemConfig', { ...itemObj, value: newItem });
                          setCategoryItems(categoryItems.map(c => c.id === itemObj.id ? { ...c, value: newItem } : c));
                      }
                      setCategories(categories.map(c => c === oldItem ? newItem : c));
                  } catch (e) {
                      console.error("Failed to edit category", e);
                  }
              }}
              onRemove={async (itemToRemove: string) => {
                  try {
                      const itemObj = categoryItems.find(c => c.value === itemToRemove);
                      if (itemObj && itemObj.id) {
                          await api.post('delete', 'SystemConfig', { id: itemObj.id });
                          setCategoryItems(categoryItems.filter(c => c.id !== itemObj.id));
                      }
                      setCategories(categories.filter(c => c !== itemToRemove));
                  } catch (e) {
                      console.error("Failed to remove category", e);
                  }
              }}
              onClose={() => setIsConfigOpen(false)}
          />
      )}

      {/* User Guide Drawer */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[600] flex justify-end">
            <div className="absolute inset-0 bg-[#141A26]/20 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto" onClick={() => setIsGuideOpen(false)} />
            <div className="relative w-[400px] bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 bg-[#141A26] flex items-center justify-between text-white shrink-0 border-b border-[#4F868C]/10 border-t-4 border-t-[#F2B705]">
                    <div className="flex items-center gap-3">
                        <HelpCircle size={22} className="text-[#F2B705]" />
                        <h3 className="text-sm font-extrabold uppercase tracking-widest font-mono">CALENDAR GUIDE</h3>
                    </div>
                    <button onClick={() => setIsGuideOpen(false)} className="p-1.5 text-white/50 hover:bg-white/10 hover:text-white rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#3F4859] relative bg-[#F2F0EB] text-[12px]">
                    <section>
                      <h4 className="font-black text-[#141A26] border-b border-[#4F868C]/10 pb-2 mb-4 flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
                        <span className="bg-[#141A26] text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">1</span> 
                        เพิ่มกิจกรรม (Events)
                      </h4>
                      <p className="text-[13px] leading-relaxed">คลิกที่ "ADD EVENT" เพื่อกำหนดตารางผลิต, การซ่อมบำรุง, การทำความสะอาด หรือนัดหมายต่างๆ สีของแต่ละรายการจะเปลี่ยนไปตามประเภท (Category) โดยอัตโนมัติ</p>
                    </section>
                    <section>
                      <h4 className="font-black text-[#141A26] border-b border-[#4F868C]/10 pb-2 mb-4 flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
                        <span className="bg-[#D91604] text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">2</span> 
                        วันหยุดโรงงาน (Holidays)
                      </h4>
                      <p className="text-[13px] leading-relaxed">วันหยุดประจำปีของบริษัทจะถูกแสดงด้วยไอคอน <b className="text-[#D91604]">ต้นปาล์ม (Palm Tree)</b> โดยระบบจะทำการคำนวณและเพิ่มวันหยุดมาตรฐานเหล่านี้ให้ในทุกๆ ปีโดยอัตโนมัติ นอกจากนี้คุณยังสามารถเพิ่มวันหยุดพิเศษเองได้ผ่านปุ่ม "ADD HOLIDAY"</p>
                    </section>
                    <section>
                      <h4 className="font-black text-[#141A26] border-b border-[#4F868C]/10 pb-2 mb-4 flex items-center gap-2 font-mono uppercase tracking-widest text-sm">
                        <span className="bg-[#4F868C] text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">3</span> 
                        จัดการหมวดหมู่
                      </h4>
                      <p className="text-[13px] leading-relaxed">ในหน้าเพิ่มกิจกรรม คุณสามารถคลิกที่ไอคอนรูปฟันเฟือง (Settings) เพื่อเพิ่ม แทรก แก้ไข หรือลบหมวดหมู่ของกิจกรรมที่ใช้ในโรงงานได้เองเลย</p>
                    </section>
                </div>
                <div className="p-6 bg-white shrink-0 flex justify-end border-t border-[#4F868C]/10">
                    <button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#141A26] text-white font-black rounded-lg uppercase font-mono text-[11px] hover:bg-[#4F868C] transition-all shadow-sm">เข้าใจแล้ว (Got It)</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
