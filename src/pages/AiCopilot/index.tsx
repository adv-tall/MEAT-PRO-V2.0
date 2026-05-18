import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, Database, LayoutDashboard, BrainCircuit, Activity, LineChart, FileText, BookOpen, MessageSquare, Search } from 'lucide-react';
import GlassCard from '../../components/shared/GlassCard';
import GuideModal from '../../components/shared/GuideModal';
import UserGuideButton from '../../components/shared/UserGuideButton';

export default function AiCopilot() {
    const [prompt, setPrompt] = useState('');
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    return (
        <div className="animate-fadeIn pb-4">
            <UserGuideButton onClick={() => setIsGuideOpen(true)} className="bg-[#186B8C]/90 text-white hover:bg-[#D95032]" />
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#3F4859] uppercase tracking-tight flex items-center gap-2" style={{ fontFamily: 'var(--font-prompt)' }}>
                        <Bot size={28} className="text-[#186B8C]" />
                        AI COPILOT
                    </h2>
                    <p className="text-xs text-[#4F868C] mt-1 font-medium italic">ผู้ช่วยอัจฉริยะสำหรับติดตามและวิเคราะห์ปัญหาในสายการผลิต</p>
                </div>
                <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-[#DCBC1B]/20 text-[#B06821] px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-[#DCBC1B]/50">
                        <Sparkles size={12} />
                        BETA
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
                
                {/* Chat Section */}
                <GlassCard className="lg:col-span-3 flex flex-col h-full bg-white/70 border border-[#4F868C]/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186B8C] via-[#4F868C] to-[#D95032]"></div>
                    
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                        {/* Welcome Message */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#186B8C] to-[#4F868C] flex flex-shrink-0 items-center justify-center shadow-lg transform -rotate-2">
                                <Bot size={22} className="text-white" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-[#4F868C]/20 shadow-sm max-w-2xl relative group">
                                <p className="text-sm text-[#3F4859] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    สวัสดีครับ! ผมคือ <strong className="text-[#186B8C]">MEAT PRO AI Copilot</strong> ผู้ช่วยอัจฉริยะของคุณ ผมสามารถช่วยคุณวิเคราะห์ข้อจำกัดของการผลิต คาดการณ์ปัญหาเครื่องจักร และเพิ่มประสิทธิภาพผลผลิตประจำวันได้
                                </p>
                                <p className="text-sm text-[#3F4859] leading-relaxed mt-2" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    วันนี้คุณต้องการตรวจสอบข้อมูลด้านใด? คุณสามารถถามผมได้เช่น:
                                </p>
                                <ul className="mt-3 space-y-2 text-xs text-[#4F868C]" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#F2B705]" /> "แสดงข้อมูลคอขวดในกระบวนการ Mixing ของวันนี้"</li>
                                    <li className="flex items-center gap-2"><AlertCircle size={14} className="text-[#D91604]" /> "ทำไมกระบวนการผลิตไส้กรอกถึงมีของเสียเพิ่มขึ้นเป็น 0.45%?"</li>
                                    <li className="flex items-center gap-2"><LayoutDashboard size={14} className="text-[#186B8C]" /> "สรุปรายงานผลการผลิตสำหรับกะการทำงานปัจจุบันให้หน่อย"</li>
                                </ul>
                            </div>
                        </div>

                        {/* User Message Example (Mock) */}
                        <div className="flex gap-4 justify-end">
                            <div className="bg-[#4F868C]/10 p-4 rounded-2xl rounded-tr-sm border border-[#4F868C]/20 shadow-sm max-w-xl text-[#3F4859]">
                                <p className="text-sm" style={{ fontFamily: 'var(--font-prompt)' }}>ช่วยวิเคราะห์ปัญหาแรงสั่นสะเทือนของเครื่อง Mixer #1 ช่วงที่ผ่านมาหน่อยครับ</p>
                            </div>
                        </div>

                        {/* AI Response Example (Mock) */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#186B8C] to-[#4F868C] flex flex-shrink-0 items-center justify-center shadow-lg transform -rotate-2">
                                <Bot size={22} className="text-white" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-[#4F868C]/20 shadow-sm max-w-2xl">
                                <p className="text-sm text-[#3F4859] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    อ้างอิงจากข้อมูล IoT เซนเซอร์ของ <strong className="text-[#D95032]">เครื่อง Mixer #1</strong> ในช่วง 4 ชั่วโมงที่ผ่านมา:
                                </p>
                                <div className="mt-3 p-3 bg-[#FFF8F8] border border-[#D91604]/20 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity size={16} className="text-[#D91604]" />
                                        <span className="text-xs font-bold text-[#D91604] uppercase" style={{ fontFamily: 'var(--font-prompt)' }}>ตรวจพบความผิดปกติของแรงสั่นสะเทือน</span>
                                    </div>
                                    <p className="text-xs text-[#4F868C]" style={{ fontFamily: 'var(--font-prompt)' }}>พบความถี่ที่ผิดปกติเวลา 14:20 และ 15:45 น. รูปแบบนี้มักบ่งบอกถึงปัญหาก่อนที่แบริ่งจะเสียหาย</p>
                                </div>
                                <p className="text-sm font-bold text-[#3F4859] mt-3" style={{ fontFamily: 'var(--font-prompt)' }}>ข้อเสนอแนะในการดำเนินการ:</p>
                                <ul className="mt-2 space-y-1 text-xs text-[#4F868C] list-disc list-inside" style={{ fontFamily: 'var(--font-prompt)' }}>
                                    <li>กำหนดเวลาเพื่อตรวจเช็คเครื่องจักรประมาณ 30 นาที ในช่วงเปลี่ยนกะพนักงานรอบถัดไป</li>
                                    <li>เตรียมชิ้นส่วนทดแทนให้พร้อม: ตลับลูกปืนแบริ่ง ซีรี่ส์ B-2045</li>
                                    <li>ลดปริมาณวัตถุดิบในการผสมต่อรอบลง 15% ชั่วคราวเพื่อลดแรงกระทำต่อแกนหมุน</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/50 border-t border-[#4F868C]/10">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="ถาม AI คู่คิดของคุณ เพื่อวิเคราะห์ข้อมูลการผลิต, สรุปรายงาน หรือแก้ปัญหาเฉพาะหน้า..." 
                                className="w-full bg-white border-2 border-[#4F868C]/20 rounded-2xl py-4 pl-4 pr-16 text-sm text-[#3F4859] focus:outline-none focus:border-[#186B8C] focus:ring-4 focus:ring-[#186B8C]/10 transition-all font-medium placeholder-[#8F9FBF]"
                                style={{ fontFamily: 'var(--font-prompt)' }}
                            />
                            <button className="absolute right-3 top-2.5 bg-[#186B8C] text-white p-2 rounded-xl shadow-md hover:bg-[#4F868C] hover:scale-105 transition-all">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* Sidebar Context Panel */}
                <div className="space-y-4 flex flex-col h-full">
                    {/* Active Context */}
                    <GlassCard className="bg-white/80 border-[#4F868C]/20 p-5">
                        <h3 className="text-xs font-black text-[#8F9FBF] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BrainCircuit size={14} className="text-[#186B8C]" /> 
                            AI Context Model
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F2F0EB] border border-[#E6E1DB]">
                                <div className="flex items-center gap-2">
                                    <Database size={14} className="text-[#537E72]" />
                                    <span className="text-[11px] font-bold text-[#3F4859]">ERP Sync</span>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-[#537E72] animate-pulse"></span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F2F0EB] border border-[#E6E1DB]">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-[#186B8C]" />
                                    <span className="text-[11px] font-bold text-[#3F4859]">IoT Sensors</span>
                                </div>
                                <span className="w-2 h-2 rounded-full bg-[#186B8C] animate-pulse"></span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F2F0EB] border border-[#E6E1DB]">
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={14} className="text-[#D95032]" />
                                    <span className="text-[11px] font-bold text-[#3F4859]">QA Logs</span>
                                </div>
                                <span className="text-[#D95032] font-bold text-[10px]">Updated 5m ago</span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Quick Queries */}
                    <GlassCard className="bg-white/80 border-[#4F868C]/20 p-5 flex-1">
                        <h3 className="text-xs font-black text-[#8F9FBF] uppercase tracking-widest mb-4">
                            Prompt Library
                        </h3>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 rounded-lg bg-transparent hover:bg-[#F2F0EB] border border-transparent hover:border-[#E6E1DB] transition-all group flex items-start gap-2">
                                <LineChart size={14} className="text-[#4F868C] mt-0.5 flex-shrink-0" />
                                <span className="text-[11px] font-medium text-[#4F868C] group-hover:text-[#186B8C] leading-snug" style={{ fontFamily: 'var(--font-prompt)' }}>วิเคราะห์ประสิทธิภาพรวมของเครื่องจักร (OEE) สำหรับวันนี้</span>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg bg-transparent hover:bg-[#F2F0EB] border border-transparent hover:border-[#E6E1DB] transition-all group flex items-start gap-2">
                                <AlertCircle size={14} className="text-[#D91604] mt-0.5 flex-shrink-0" />
                                <span className="text-[11px] font-medium text-[#4F868C] group-hover:text-[#D91604] leading-snug" style={{ fontFamily: 'var(--font-prompt)' }}>อะไรคือสาเหตุหลักของของเสีย (Defects) ที่สูงที่สุดในสัปดาห์นี้?</span>
                            </button>
                            <button className="w-full text-left p-3 rounded-lg bg-transparent hover:bg-[#F2F0EB] border border-transparent hover:border-[#E6E1DB] transition-all group flex items-start gap-2">
                                <FileText size={14} className="text-[#DCBC1B] mt-0.5 flex-shrink-0" />
                                <span className="text-[11px] font-medium text-[#4F868C] group-hover:text-[#B06821] leading-snug" style={{ fontFamily: 'var(--font-prompt)' }}>สร้างสรุปการส่งมอบกะการทำงาน (Shift Handover)</span>
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <GuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                title="COPILOT GUIDE"
                subtitle="AI ASSISTANT MANUALLY"
                icon={<Bot size={24} />}
            >
                <div>
                    <div className="flex items-center gap-2 mb-4 text-[#1a2035] border-b border-[#E6E1DB] pb-2">
                        <MessageSquare size={18} className="text-[#E3624A]" />
                        <h3 className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-prompt)' }}>1. การสอบถามและวิเคราะห์ข้อมูล</h3>
                    </div>
                    <p className="text-sm text-[#4a5568] mb-4" style={{ fontFamily: 'var(--font-prompt)' }}>
                        AI Copilot จะเชื่อมต่อและนำข้อมูลทั้งหมดจากระบบ ERP, IoT เซนเซอร์ และ บันทึกการจัดการคุณภาพ (QA Logs) เพื่อให้คำตอบที่ถูกต้องแม่นยำ คุณสามารถพูดคุยกับ AI ได้เหมือนพนักงานผู้ช่วย
                    </p>
                    
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm flex items-start gap-3">
                            <Search size={16} className="text-[#186B8C] mt-1" />
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>การตั้งคำถาม (Prompting)</p>
                                <p className="text-xs text-[#4a5568]" style={{ fontFamily: 'var(--font-prompt)' }}>พิมพ์สิ่งที่คุณต้องการวิเคราะห์หรือค้นหา ข้อมูลจะแสดงผลแบบเชิงลึก เช่น "ช่วยเรียงลำดับการซ่อมบำรุงในสัปดาห์หน้าที"</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm flex items-start gap-3">
                            <LineChart size={16} className="text-[#537E72] mt-1" />
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>แนวทางหรือข้อมูลที่ได้</p>
                                <p className="text-xs text-[#4a5568]" style={{ fontFamily: 'var(--font-prompt)' }}>ได้ผลลัพธ์การวิเคราะห์ในเชิงคาดการณ์สาเหตุล่วงหน้า เช่น ข้อมูลสั่นสะเทือนจะประมวลเป็นโอกาสที่แบริ่งเสีย</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4 text-[#1a2035] border-b border-[#E6E1DB] pb-2">
                        <BrainCircuit size={18} className="text-[#E3624A]" />
                        <h3 className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-prompt)' }}>2. การติดตามสถานะ AI</h3>
                    </div>
                    <p className="text-sm text-[#4a5568] mb-3" style={{ fontFamily: 'var(--font-prompt)' }}>
                        คุณสามารถตรวจสอบสถานะการรับข้อมูลของ AI ได้จากแผงควบคุม <strong>AI Context Model</strong> ด้านขวา ว่าข้อมูลต่างๆ (ERP, IoT, QA) เป็นปัจจุบันหรือไม่ 
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4 text-[#1a2035] border-b border-[#E6E1DB] pb-2">
                        <Sparkles size={18} className="text-[#E3624A]" />
                        <h3 className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-prompt)' }}>3. ตัวช่วยคำสั่งด่วน (Prompt Library)</h3>
                    </div>
                    <p className="text-sm text-[#4a5568] mb-4" style={{ fontFamily: 'var(--font-prompt)' }}>
                        คลิกเลือกคำสั่งที่เตรียมไว้ให้ (Prompt Library) ด้านล่างขวา เพื่อสั่งการทันทีโดยไม่ต้องพิมพ์ซ้ำ ทั้งประหยัดเวลาและได้คำสั่งที่ดึงข้อมูลครบถ้วนสำหรับหัวข้อนั้น ๆ 
                    </p>
                    <div className="bg-[#FFF8F8] border border-[#ffd5cc] p-4 rounded-xl mb-8">
                        <BookOpen size={20} className="text-[#E3624A] mb-2" />
                        <div>
                            <span className="font-bold text-[#D95032] text-sm block mb-1">แนะนำ:</span>
                            <span className="text-xs text-[#4a5568] leading-relaxed" style={{ fontFamily: 'var(--font-prompt)' }}>คุณสามารถกำหนด Prompt ประจำตำแหน่งของคุณเอง ให้ฝ่าย IT เพิ่มลงในระบบเพื่อให้การเริ่มงานของคุณในตอนเช้าสะดวกรวดเร็วที่สุด</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4 text-[#1a2035] border-b border-[#E6E1DB] pb-2">
                        <Send size={18} className="text-[#E3624A]" />
                        <h3 className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-prompt)' }}>4. ACTION BUTTONS (ปุ่มคำสั่ง)</h3>
                    </div>
                    
                    <div className="bg-[#F2F0EB] p-4 rounded-xl border border-[#E6E1DB] space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="bg-[#186B8C] text-white p-2 rounded-lg flex-shrink-0 cursor-default">
                                <Send size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>ส่งคำถาม (Send Prompt)</p>
                                <p className="text-[11px] text-[#4a5568]" style={{ fontFamily: 'var(--font-prompt)' }}>กดเพื่อเริ่มประมวลผลคำสั่งหรือคำถามที่คุณพิมพ์ไว้ในช่องแชท</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="border border-[#E6E1DB] bg-white p-2 rounded-lg flex-shrink-0 cursor-default">
                                <LineChart size={18} className="text-[#4F868C]" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1a2035] mb-1" style={{ fontFamily: 'var(--font-prompt)' }}>ตัวอย่างคำสั่ง (Quick Query)</p>
                                <p className="text-[11px] text-[#4a5568]" style={{ fontFamily: 'var(--font-prompt)' }}>คลิกที่ตัวแทยข้อมูลนี้เพื่อนำเข้าชุดคำถามสำเร็จรูปไปประมวลผลทันที</p>
                            </div>
                        </div>
                    </div>
                </div>
            </GuideModal>
        </div>
    );
}

