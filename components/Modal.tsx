
import React from 'react';
import { Sparkles, Loader2, X, ClipboardList, FileText, Zap, ShieldAlert, Printer } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  sisText: string;
  measText: string;
  guideText?: string;
  onEnhance?: () => void;
  isAiLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, sisText, measText, guideText, onEnhance, isAiLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/98 z-50 flex justify-center items-center p-0 sm:p-4 print:bg-white print:p-0">
      <div className="bg-slate-100 w-full h-[98vh] sm:h-[95vh] rounded-t-[3.5rem] sm:rounded-[4.5rem] shadow-2xl flex flex-col overflow-hidden print:shadow-none print:bg-white print:block print:h-auto">
        
        {/* Header - Hidden on Print */}
        <div className="bg-slate-900 px-10 py-8 border-b border-white/5 flex justify-between items-center shrink-0 print:hidden">
            <div className="flex items-center gap-8">
                <div className="bg-blue-600 p-4 rounded-2xl"><ShieldAlert size={24} className="text-white" /></div>
                <h2 className="text-white font-black text-2xl uppercase italic">Dokumentation</h2>
            </div>
            <div className="flex gap-4">
                {onEnhance && (
                    <button onClick={onEnhance} disabled={isAiLoading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs flex items-center gap-2">
                        {isAiLoading ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16} />}
                        Professionalisieren
                    </button>
                )}
                <button onClick={onClose} className="p-3 text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
        </div>

        {/* Print Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12 print:overflow-visible print:p-0 print:block">
            <div className="hidden print:block border-b-4 border-slate-900 pb-6 mb-10">
                <h1 className="text-4xl font-black italic">SIS MONOLITH <span className="text-blue-600">PROFESSIONAL</span></h1>
                <p className="text-xs font-bold uppercase mt-2 tracking-widest">Erstellt am {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:block print:space-y-20">
                <section>
                    <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-4 print:text-2xl">Narrative SIS</h3>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 print:border-none print:p-0">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed font-serif print:text-[12pt]">{sisText}</div>
                    </div>
                </section>

                <section>
                    <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-4 print:text-2xl">Maßnahmenplan</h3>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 print:border-none print:p-0">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed font-serif print:text-[12pt]">{measText}</div>
                    </div>
                </section>
            </div>
        </div>

        {/* Footer - Hidden on Print */}
        <div className="p-8 bg-white border-t flex justify-between items-center print:hidden">
            <button onClick={() => window.print()} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3">
                <Printer size={20} /> PDF Exportieren
            </button>
            <button onClick={onClose} className="text-slate-500 font-bold uppercase text-xs">Schließen</button>
        </div>
      </div>

      <style>{`
        @media print {
            @page { size: A4; margin: 20mm; }
            body { background: white !important; }
            .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Modal;
