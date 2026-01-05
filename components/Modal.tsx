
import React from 'react';
import { 
    Sparkles, Loader2, X, ClipboardList, FileText, Zap, 
    ShieldAlert, Printer, Brain, Activity, HeartPulse, 
    ShowerHead, Users, Home, Download
} from 'lucide-react';

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

  const parseSisFields = (text: string) => {
    const fields = [
      { id: 'tf1', label: 'Kognition & Kommunikation', icon: <Brain size={20} />, color: 'blue' },
      { id: 'tf2', label: 'Mobilität & Beweglichkeit', icon: <Activity size={20} />, color: 'indigo' },
      { id: 'tf3', label: 'Krankheitsbezog. Anforderungen', icon: <HeartPulse size={20} />, color: 'red' },
      { id: 'tf4', label: 'Selbstversorgung', icon: <ShowerHead size={20} />, color: 'emerald' },
      { id: 'tf5', label: 'Soziale Beziehungen', icon: <Users size={20} />, color: 'purple' },
      { id: 'tf6', label: 'Haushaltsführung / Entlass.', icon: <Home size={20} />, color: 'amber' }
    ];

    const result = fields.map(field => {
      const marker = `###TF${field.id.slice(2)}###`;
      const nextMarker = `###TF${parseInt(field.id.slice(2)) + 1}###`;
      
      const regex = new RegExp(`${marker}([\\s\\S]*?)(?=${nextMarker}|$)`, 'i');
      const match = text.match(regex);
      
      return {
        ...field,
        content: match ? match[1].trim() : ''
      };
    });

    const hasAnyContent = result.some(r => r.content.length > 0);
    if (!hasAnyContent && text.length > 0) {
        result[0].content = text;
    }

    return result.filter(r => r.content.length > 0);
  };

  const sisFields = parseSisFields(sisText);

  const colorStyles: any = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    red: "bg-red-50 border-red-100 text-red-700",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    purple: "bg-purple-50 border-purple-100 text-purple-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700"
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-[60] flex justify-center items-center p-0 sm:p-6 print:bg-white print:p-0 print:static print:block">
      <div className="bg-slate-100 w-full max-w-6xl h-full sm:h-[95vh] rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden print:shadow-none print:bg-white print:block print:h-auto print:static">
        
        {/* Header */}
        <div className="bg-slate-900 px-8 py-6 border-b border-white/5 flex justify-between items-center shrink-0 print:hidden">
            <div className="flex items-center gap-6">
                <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-500/20"><ShieldAlert size={20} className="text-white" /></div>
                <div>
                    <h2 className="text-white font-black text-xl uppercase italic leading-none">Dokumentations-Vorschau</h2>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.2em] mt-1">Status: Bereit zur Übernahme</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {onEnhance && (
                    <button 
                        onClick={onEnhance} 
                        disabled={isAiLoading} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                    >
                        {isAiLoading ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />}
                        KI-Optimierung
                    </button>
                )}
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 print:overflow-visible print:p-0 print:block print:static bg-white/50">
            
            {/* Print Header Logo */}
            <div className="hidden print:block border-b-4 border-slate-900 pb-4 mb-8">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">SIS MONOLITH <span className="text-blue-600">PRO</span></h1>
                <p className="text-[8px] font-black uppercase mt-2 tracking-[0.3em] text-slate-500 italic">Offizieller Dokumentationsbericht | Stand: {new Date().toLocaleDateString()}</p>
            </div>

            {/* SIS Section */}
            <section className="print:break-inside-avoid animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <h3 className="text-slate-900 font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-2 whitespace-nowrap">
                        <FileText size={16} className="text-blue-600" /> Narrative SIS (Kategorisiert)
                    </h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
                    {sisFields.map((field) => (
                        <div key={field.id} className={`p-8 rounded-[2.5rem] border transition-all ${colorStyles[field.color] || 'bg-white'} print:bg-white print:border-slate-200 print:p-6 print:rounded-3xl print:mb-4`}>
                            <div className="flex items-center gap-4 mb-4 border-b border-current/10 pb-3">
                                <div className="p-2 rounded-xl bg-white/50 shadow-sm print:hidden">{field.icon}</div>
                                <h4 className="font-black text-[12px] uppercase tracking-wider italic">{field.label}</h4>
                            </div>
                            <div className="whitespace-pre-wrap text-[14px] leading-relaxed font-serif print:text-[11pt] print:leading-normal print:text-black italic">
                                {field.content}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Measures and Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-12">
                <section className="print:break-inside-avoid animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                            <ClipboardList size={14} className="text-emerald-600" /> Maßnahmenplan
                        </h3>
                        <div className="h-px flex-1 bg-slate-100"></div>
                    </div>
                    <div className="bg-emerald-50/30 p-8 rounded-[2.5rem] border border-emerald-100/50 shadow-sm h-full print:bg-white print:border-slate-200 print:rounded-3xl">
                        <div className="whitespace-pre-wrap text-[13px] md:text-[14px] leading-relaxed font-serif text-slate-800 print:text-[11pt] print:leading-normal print:text-black">
                            {measText}
                        </div>
                    </div>
                </section>

                {guideText && (
                  <section className="print:break-inside-avoid animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                              <Zap size={14} className="text-yellow-600" /> Pflege-Spickzettel
                          </h3>
                          <div className="h-px flex-1 bg-slate-100"></div>
                      </div>
                      <div className="bg-amber-50/40 p-8 rounded-[2.5rem] border border-amber-100/50 shadow-sm h-full print:bg-white print:border-slate-200 print:rounded-3xl">
                          <div className="whitespace-pre-wrap text-[13px] md:text-[14px] leading-relaxed font-serif text-slate-800 italic print:text-[11pt] print:leading-normal print:text-black">
                              {guideText}
                          </div>
                      </div>
                  </section>
                )}
            </div>

            <div className="hidden print:grid grid-cols-2 gap-20 pt-16 mt-16">
                <div className="border-t border-slate-300 pt-4">
                    <p className="text-[8px] font-black uppercase text-slate-400">Datum / Unterschrift Pflegefachkraft</p>
                </div>
                <div className="border-t border-slate-300 pt-4 text-right">
                    <p className="text-[8px] font-black uppercase text-slate-400">Datum / Unterschrift Klient / Betreuer</p>
                </div>
            </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 md:p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 print:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <button 
                onClick={() => window.print()} 
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-900/10"
            >
                <Download size={18} /> PDF Speichern / Drucken
            </button>
            <div className="flex items-center gap-3 text-slate-400 text-[9px] font-bold uppercase italic max-w-xs text-center sm:text-left">
                <Printer size={16} /> Wählen Sie im Druckdialog "Als PDF speichern" für ein digitales Archiv.
            </div>
            <button 
                onClick={onClose} 
                className="text-slate-400 font-black uppercase text-[10px] hover:text-slate-900 transition-colors tracking-widest px-4"
            >
                Schließen
            </button>
        </div>
      </div>

      <style>{`
        @media print {
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            body { 
              background: white !important; 
              -webkit-print-color-adjust: exact;
            }
            .print\\:hidden { display: none !important; }
            .print\\:static { position: static !important; }
            .print\\:block { display: block !important; }
            .print\\:break-inside-avoid { break-inside: avoid; }
        }
        .font-serif {
            font-family: 'Georgia', 'Times New Roman', serif;
        }
      `}</style>
    </div>
  );
};

export default Modal;
