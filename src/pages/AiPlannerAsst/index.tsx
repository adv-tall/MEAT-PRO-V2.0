import React, { useState, useEffect } from 'react';
import { CalendarClock, Sparkles, BookOpen, Calculator, BarChart3, Clock, AlertTriangle, FileCheck, Layers, ChevronRight, CheckCircle2, TrendingUp, Package, Cog } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GuideModal from '../../components/shared/GuideModal';
import UserGuideButton from '../../components/shared/UserGuideButton';

export default function AiPlannerAsst() {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleStartAnalysis = () => {
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        setProgress(0);
        
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            setProgress(currentProgress);
            
            if (currentProgress >= 100) {
                clearInterval(interval);
                setIsAnalyzing(false);
                setAnalysisComplete(true);
            }
        }, 100);
    };

    return (
        <div className="animate-fadeIn pb-4">
            <UserGuideButton onClick={() => setIsGuideOpen(true)} className="bg-[#537E72]/90 text-white hover:bg-[#E3624A]" />
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#3F4859] uppercase tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-prompt)' }}>
                        <CalendarClock size={28} className="text-[#186B8C]" />
                        AI PLANNER ASST.
                    </h2>
                    <p className="text-xs text-[#4F868C] mt-1 font-medium italic">ผู้ช่วยวางแผนผลผลิตอัจฉริยะ (AI-Driven Capacity Planning)</p>
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-[#186B8C]/20 text-[#186B8C] px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-[#186B8C]/50">
                        <Sparkles size={12} />
                        AI ENGINE V1.2
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Action Panel */}
                <GlassCard className="lg:col-span-2 space-y-6 bg-white/80 border-[#4F868C]/20 p-6">
                    <div className="flex items-center justify-between border-b border-[#E6E1DB] pb-4">
                        <h3 className="text-lg font-bold text-[#1a2035]" style={{ fontFamily: 'var(--font-prompt)' }}>ระบบคำนวณแผนการผลิตอัตโนมัติ</h3>
                        <span className="bg-[#537E72]/10 text-[#537E72] px-3 py-1 rounded border border-[#537E72]/20 text-xs font-bold uppercase tracking-wide">
                            {isAnalyzing ? 'Analyzing...' : analysisComplete ? 'Analysis Complete' : 'Ready for calculation'}
                        </span>
                    </div>

                    {!isAnalyzing && !analysisComplete && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white border border-[#E6E1DB] rounded-xl p-4 shadow-sm hover:border-[#186B8C]/50 transition-colors cursor-pointer group">
                                    <Calculator size={24} className="text-[#186B8C] mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-[#3F4859] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>วางแผนแบบระยะสั้น (Short-term)</h4>
                                    <p className="text-xs text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>คำนวณกำลังการผลิตรายสัปดาห์ ปรับแผนตามจำนวนวัตถุดิบและคำสั่งซื้อปัจจุบัน</p>
                                </div>
                                <div className="bg-white border border-[#E6E1DB] rounded-xl p-4 shadow-sm hover:border-[#E3624A]/50 transition-colors cursor-pointer group">
                                    <BarChart3 size={24} className="text-[#E3624A] mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-[#3F4859] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>คาดการณ์ล่วงหน้า (Forecast)</h4>
                                    <p className="text-xs text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>พยากรณ์ความต้องการระยะ 1-3 เดือนจากประวัติการปรับยอดและเทรนด์ของฤดูกาล</p>
                                </div>
                            </div>

                            <div className="bg-[#F8F9FA] rounded-xl p-5 border border-[#E6E1DB]">
                                <h4 className="text-sm font-bold text-[#1a2035] mb-3" style={{ fontFamily: 'var(--font-prompt)' }}>เป้าหมายการคำนวณปัจจุบัน</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#E6E1DB] shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Layers className="text-[#4F868C]" size={18} />
                                            <span className="text-sm font-medium text-[#3F4859]" style={{ fontFamily: 'var(--font-prompt)' }}>รักษาระดับสต็อคความปลอดภัย (Safety Stock)</span>
                                        </div>
                                        <span className="bg-[#186B8C] text-white px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#E6E1DB] shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <Clock className="text-[#4F868C]" size={18} />
                                            <span className="text-sm font-medium text-[#3F4859]" style={{ fontFamily: 'var(--font-prompt)' }}>ลดเวลาการเปลี่ยนสายการผลิต (Minimize Changeover Time)</span>
                                        </div>
                                        <span className="bg-[#186B8C] text-white px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button onClick={handleStartAnalysis} className="bg-[#186B8C] text-white px-6 py-2.5 rounded-xl font-bold tracking-wide shadow hover:bg-[#4F868C] transition-colors flex items-center gap-2" style={{ fontFamily: 'var(--font-prompt)' }}>
                                        <Sparkles size={16} />
                                        เริ่มประมวลผลแผนการผลิต
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {isAnalyzing && (
                        <div className="py-12 flex flex-col items-center justify-center space-y-6">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-[#186B8C]/20 rounded-full border-t-[#186B8C] animate-spin"></div>
                                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#E3624A] animate-pulse" size={24} />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-lg font-bold text-[#3F4859]" style={{ fontFamily: 'var(--font-prompt)' }}>AI กำลังวิเคราะห์ข้อมูล...</h4>
                                <p className="text-sm text-[#4a5568]" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    {progress < 30 ? 'Reading current production orders...' : 
                                     progress < 60 ? 'Evaluating machine capacity & constraints...' : 
                                     progress < 90 ? 'Checking inventory levels...' : 
                                     'Generating optimized schedules...'}
                                </p>
                            </div>
                            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
                                <div className="bg-[#186B8C] h-2.5 rounded-full transition-all duration-200 ease-out" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    {analysisComplete && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 size={24} className="text-[#16A34A]" />
                                    <div>
                                        <h4 className="font-bold text-[#16A34A]" style={{ fontFamily: 'var(--font-prompt)' }}>การวิเคราะห์เสร็จสมบูรณ์</h4>
                                        <p className="text-xs text-[#15803D]" style={{ fontFamily: 'var(--font-prompt)' }}>พบแผนที่เหมาะสมที่สุด 2 รายการสำหรับรอบการผลิตนี้</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white p-3 rounded-lg border border-[#BBF7D0]">
                                        <p className="text-xs text-[#4a5568] mb-1 whitespace-nowrap" style={{ fontFamily: 'var(--font-prompt)' }}>Orders Fulfilled</p>
                                        <p className="text-xl font-black text-[#1a2035]">98.5%</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-[#BBF7D0]">
                                        <p className="text-xs text-[#4a5568] mb-1 whitespace-nowrap" style={{ fontFamily: 'var(--font-prompt)' }}>Machine Utilization</p>
                                        <p className="text-xl font-black text-[#16A34A]">87.2%</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-[#BBF7D0]">
                                        <p className="text-xs text-[#4a5568] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>Est. Lead Time</p>
                                        <p className="text-xl font-black text-[#1a2035]">2.4 <span className="text-sm">Days</span></p>
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-3">
                                 <h4 className="font-bold text-[#3F4859] px-1" style={{ fontFamily: 'var(--font-prompt)' }}>แผนที่แนะนำ (Suggested Schedules)</h4>
                                 <div className="bg-white p-4 rounded-xl border border-[#186B8C] shadow-md relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 bg-[#186B8C] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">TOP MATCH</div>
                                     <div className="flex justify-between items-start mb-3">
                                         <div>
                                             <h5 className="font-bold text-[#1a2035]">Schedule Alpha - Optimize for Delivery Time</h5>
                                             <p className="text-xs text-[#4F868C]" style={{ fontFamily: 'var(--font-prompt)' }}>จัดสรรกำลังการผลิตเพื่อส่งมอบ 3 คำสั่งซื้อหลักได้ทันเวลา</p>
                                         </div>
                                     </div>
                                     <div className="flex gap-2">
                                         <button className="bg-[#186B8C] hover:bg-[#4F868C] text-white text-xs px-4 py-2 rounded-lg font-bold transition-colors">นำไปใช้งาน (Apply)</button>
                                         <button className="bg-[#F8F9FA] hover:bg-[#E6E1DB] text-[#3F4859] border border-[#E6E1DB] text-xs px-4 py-2 rounded-lg font-bold transition-colors">ดูรายละเอียด</button>
                                     </div>
                                 </div>
                             </div>

                             <div className="mt-4 flex justify-start">
                                 <button onClick={() => setAnalysisComplete(false)} className="text-[#8F9FBF] hover:text-[#3F4859] text-xs font-bold underline transition-colors" style={{ fontFamily: 'var(--font-prompt)' }}>ตั้งค่าเป้าหมายใหม่ (Re-calculate)</button>
                             </div>
                        </div>
                    )}
                </GlassCard>

                {/* Status & Alerts */}
                <div className="space-y-6 h-full flex flex-col">
                    <GlassCard className="bg-white/80 border-[#4F868C]/20 p-5 flex-1">
                        <div className="flex items-center gap-2 border-b border-[#E6E1DB] pb-3 mb-4">
                            <AlertTriangle size={18} className="text-[#D95032]" />
                            <h3 className="text-sm font-bold text-[#1a2035]" style={{ fontFamily: 'var(--font-prompt)' }}>ข้อจำกัดที่พบ (Bottlenecks)</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="bg-[#FFF8F8] border-l-2 border-[#D91604] p-3 rounded-r-lg shadow-sm">
                                <div className="flex gap-2 items-center mb-1">
                                    <Cog size={14} className="text-[#D91604]" />
                                    <p className="text-xs font-bold text-[#D91604]" style={{ fontFamily: 'var(--font-prompt)' }}>กำลังเครื่องจักรต่ำกว่าเกณฑ์</p>
                                </div>
                                <p className="text-[11px] text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>เครื่อง Forming Line 2 ปิดซ่อมบำรุง ส่งผลกระทบต่อ Capacity 12% ในสัปดาห์นี้</p>
                            </div>
                            <div className="bg-[#FCF9F2] border-l-2 border-[#DCBC1B] p-3 rounded-r-lg shadow-sm">
                                <div className="flex gap-2 items-center mb-1">
                                    <Package size={14} className="text-[#B06821]" />
                                    <p className="text-xs font-bold text-[#B06821]" style={{ fontFamily: 'var(--font-prompt)' }}>วัตถุดิบใกล้หมดอายุ (Inventory)</p>
                                </div>
                                <p className="text-[11px] text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>เนื้อไก่งวงล็อต TR-409 จำเป็นต้องนำมาใช้ภายใน 48 ชั่วโมง</p>
                            </div>
                            {analysisComplete && (
                                <div className="bg-blue-50 border-l-2 border-blue-500 p-3 rounded-r-lg shadow-sm animate-in fade-in">
                                    <div className="flex gap-2 items-center mb-1">
                                        <TrendingUp size={14} className="text-blue-600" />
                                        <p className="text-xs font-bold text-blue-600" style={{ fontFamily: 'var(--font-prompt)' }}>Overwhelmed Orders (Demand)</p>
                                    </div>
                                    <p className="text-[11px] text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>คำสั่งซื้อ PO-9912 อาจมีความล่าช้า 0.5 วัน หากไม่ปรับเพิ่ม Overtime</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    <GlassCard className="bg-[#1a2035] border-transparent p-5 text-white">
                        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-3">
                            <FileCheck size={18} className="text-[#E3624A]" />
                            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Draft Plan</h3>
                        </div>
                        <p className="text-xs text-white/70 mb-4" style={{ fontFamily: 'var(--font-prompt)' }}>มีโครงร่างการผลิตที่ AI เคยสร้างไว้ยังไม่ได้อนุมัติ จำนวน 1 แผน</p>
                        
                        <button className="w-full text-left bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors flex items-center justify-between border border-white/5">
                            <div>
                                <p className="text-xs font-bold text-white mb-0.5">Plan #4092</p>
                                <p className="text-[10px] text-[#E3624A] uppercase tracking-wider font-bold">20 May - 26 May</p>
                            </div>
                            <ChevronRight size={16} className="text-white/50" />
                        </button>
                    </GlassCard>
                </div>
            </div>

            <GuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                title="PLANNER ASST GUIDE"
                subtitle="AUTOMATED CAPACITY PLANNING"
                icon={<CalendarClock size={24} />}
            >
                <div>
                    <div className="flex items-center gap-2 mb-4 text-[#1a2035] border-b border-[#E6E1DB] pb-2">
                        <Sparkles size={18} className="text-[#E3624A]" />
                        <h3 className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-prompt)' }}>1. การทำงานของระบบ AI Planner</h3>
                    </div>
                    <p className="text-sm text-[#4a5568] mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>
                        ระบบนี้จะทำหน้าที่เปรียบเสมือนผู้ช่วยส่วนตัวของฝ่ายวางแผน (Planning) โดยจะนำ <strong>ความต้องการสินค้า (Demand)</strong> มาจับคู่กับ <strong>กำลังการผลิต (Capacity)</strong> เพื่อสร้างแผนที่มีความเป็นไปได้มากที่สุด อิงจากทรัพยากรที่มีในปัจจุบัน แบบไม่มีความผิดพลาดจากการคำนวณของมนุษย์
                    </p>
                    
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm flex items-start gap-4">
                            <div className="bg-[#186B8C]/10 p-2 rounded-lg flex-shrink-0">
                                <Calculator size={18} className="text-[#186B8C]" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>ปุ่ม "วางแผนแบบระยะสั้น"</p>
                                <p className="text-xs text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    (Short-Term Planning) จะถูกคลิกเมื่อต้องการจัดตารางการผลิตรายสัปดาห์หรือรายวันอย่างรวดเร็ว AI จะเน้นแก้ปัญหาสต็อคขาด ณ ปัจจุบัน หรือคำสั่งซื้อด่วน โดยจำกัดการสูญเสียเวลาสูญเปล่า
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm flex items-start gap-4">
                            <div className="bg-[#E3624A]/10 p-2 rounded-lg flex-shrink-0">
                                <BarChart3 size={18} className="text-[#E3624A]" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>ปุ่ม "คาดการณ์ล่วงหน้า"</p>
                                <p className="text-xs text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    (Forecasting) ใช้เพื่อประเมินความต้องการล่วงหน้า เหมาะสำหรับการแจ้งฝ่ายจัดซื้อเพื่อสั่งซื้อวัตถุดิบ (Material Requirement Planning) ล่วงหน้า จะไม่ลงตารางปฏิบัติการจริงๆ จนกว่าเราจะยืนยัน
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4 text-[#1a2035] border-b border-[#E6E1DB] pb-2">
                        <AlertTriangle size={18} className="text-[#E3624A]" />
                        <h3 className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-prompt)' }}>2. การรับมือกับข้อจำกัด (Constraints Handling)</h3>
                    </div>
                    <p className="text-sm text-[#4a5568] mb-3 leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>
                        AI จะทำงานร่วมกับโมดูลอื่นๆ อัตโนมัติ หากเครื่องจักรเสีย หรือวัตถุดิบขาด ระบบจะหยุดการลากตารางงานลงเครื่องจักรนั้นๆ ก่อน และแจ้งเตือนในหน้ากระดาน <strong>ข้อจำกัดที่พบ</strong> ให้เราทราบเหตุผลก่อนเสมอ 
                    </p>
                    <div className="bg-[#FFF8F8] border border-[#ffd5cc] p-4 rounded-xl mb-8">
                        <span className="font-bold text-[#D95032] text-sm block mb-1">สิ่งที่คุณต้องทำ:</span>
                        <ul className="text-xs text-[#4a5568] leading-relaxed list-disc list-inside space-y-1" style={{ fontFamily: 'var(--font-prompt)' }}>
                            <li>อ่านข้อควรระวังในช่องสีขวาที่ AI แจ้งขึ้นมาเสมอ</li>
                            <li>หากจำเป็นต้องดันแผน สามารถข้ามข้อความเตือนได้ (Override) แต่อาจเกิดปัญหาในสายพานการผลิต</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4 text-[#1a2035] border-b border-[#E6E1DB] pb-2">
                        <Calculator size={18} className="text-[#E3624A]" />
                        <h3 className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-prompt)' }}>3. ACTION BUTTONS (ปุ่มคำสั่ง)</h3>
                    </div>
                    
                    <div className="bg-[#F2F0EB] p-4 rounded-xl border border-[#E6E1DB] space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="bg-[#186B8C] text-white p-2 rounded-lg flex-shrink-0 cursor-default">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>เริ่มประมวลผลแผนการผลิต</p>
                                <p className="text-[11px] text-[#4a5568]" style={{ fontFamily: 'var(--font-prompt)' }}>กดเพื่อยืนยันให้ AI สร้างตารางการผลิตทันทีตามเป้าหมาย (Active) ที่ตั้งไว้</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="border border-white/20 bg-white/10 text-white p-2 rounded-lg flex-shrink-0 cursor-default" style={{ backgroundColor: '#1a2035' }}>
                                <ChevronRight size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>Draft Plan (รอตรวจสอบ)</p>
                                <p className="text-[11px] text-[#4a5568]" style={{ fontFamily: 'var(--font-prompt)' }}>คลิกเพื่อดูรายละเอียดแผนที่ระบบล่างร่างไว้ก่อนการอนุมัติ (Approve) ใช้งานจริง</p>
                            </div>
                        </div>
                    </div>
                </div>
            </GuideModal>
        </div>
    );
}

