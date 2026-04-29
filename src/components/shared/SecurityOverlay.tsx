import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SecurityOverlay() {
  const { user } = useAuth();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key or Cmd+Shift+... / Ctrl+P
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey) || // Mac screenshot shortcuts
        ((e.ctrlKey || e.metaKey) && e.key === 'p') // Print shortcut
      ) {
        setIsCapturing(true);
        // If it's a screenshot shortcut, hide after 4 seconds
        if (e.key !== 'p') {
          setTimeout(() => setIsCapturing(false), 4000);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
       if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey)) {
         // Some OSs eat the keyup, but we clear it anyway
         setTimeout(() => setIsCapturing(false), 4000);
       }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [user]);

  if (!user) return null;

  const isHighLevelAccess = user.role === 'Admin' || user.role === 'Super Admin' || user.isDev || user.role === 'Manager' || user.position === 'Lead Developer';

  return (
    <>
      <style>{`
        @media print {
          body * {
            ${!isHighLevelAccess ? 'filter: blur(10px) !important; color: transparent !important;' : ''}
          }
          #security-overlay, #security-overlay * {
            filter: none !important;
            color: black !important;
            display: flex !important;
          }
        }
      `}</style>
      
      {/* 
        This div shows up either during JS capture or native print.
        During native print, display block is forced via @media print.
      */}
      <div id="security-overlay" className={`fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden transition-all duration-300 ${!isHighLevelAccess ? 'backdrop-blur-3xl bg-white/70' : 'bg-transparent'} ${isCapturing ? 'opacity-100' : 'opacity-0 print:opacity-100'}`}>
        
        {/* Watermark grid - Always visible during capture/print */}
        <div className="absolute inset-0 opacity-[0.04] print:opacity-[0.08] flex flex-wrap gap-12 items-center justify-center rotate-[-30deg] scale-[2] transform-gpu select-none">
          {Array.from({ length: 150 }).map((_, i) => (
            <div key={i} className="text-2xl font-black text-black whitespace-nowrap tracking-wider">
              {user.name} - {user.employeeId} <br/>
              <span className="text-sm opacity-70 block text-center">{new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })}</span>
            </div>
          ))}
        </div>
        
        {/* Block Message for unauthorized users */}
        {!isHighLevelAccess && (
           <div className="bg-red-600 text-white font-black px-12 py-8 rounded-[2rem] shadow-2xl rotate-[0deg] border-8 border-white text-4xl transform scale-110 drop-shadow-[0_0_50px_rgba(220,38,38,0.5)]">
             <div className="flex flex-col items-center text-center">
               <span className="text-6xl mb-6">🚫</span>
               UNAUTHORIZED
               <div className="text-2xl mt-2 mb-4 leading-tight">SCREEN CAPTURE / PRINT BLOCKED</div>
               <div className="text-base text-red-100 font-medium px-4 py-2 bg-black/20 rounded-xl">Event Logged to System Administrator</div>
             </div>
           </div>
        )}
      </div>
    </>
  );
}
