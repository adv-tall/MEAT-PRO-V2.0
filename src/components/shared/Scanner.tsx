import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';
import { DraggableModal } from './DraggableModal';

interface ScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  title?: string;
}

export function Scanner({ onScan, onClose, title = "Scan QR / Barcode" }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText);
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      },
      (error) => {
        // Silently handle scan errors (common during scanning)
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [onScan]);

  return (
    <DraggableModal
       isOpen={true}
       onClose={onClose}
       title={title}
       icon={<Camera size={16} />}
       className="w-full max-w-md"
    >
      <div className="p-6 bg-white">
        <div id="reader" className="overflow-hidden rounded-2xl border-2 border-slate-100"></div>
        <p className="mt-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Position the code within the frame to scan
        </p>
      </div>
    </DraggableModal>
  );
}
