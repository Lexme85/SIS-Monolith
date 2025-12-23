
import React from 'react';
import { Sparkles, Loader2, ClipboardCheck, Zap, AlertTriangle, Stethoscope, HeartPulse, Brain, Waves } from 'lucide-react';

interface CareGuideViewProps {
  guideText: string;
  onGenerate: () => void;
  isLoading: boolean;
}

const CareGuideView: React.FC<CareGuideViewProps> = ({ guideText, onGenerate, isLoading }) => {
  
  const parseGuide = (text: string) => {
    if (!text) return null;
    // Simple split by double newlines or lines starting with titles
    const sections = text.split(/\n(?=[A-ZÄÖÜ\s]{3,}:)/);
    return sections;
  };

  const sections = parseGuide(guideText);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Action Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center justify-center md:justify-start gap-3">
            <Zap className="text-yellow-500" fill="currentColor" size={32} /> PFLEGE-SPICKZETTEL
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-2 max-w-md italic">
            "Was ist pflegerisch gerade wichtig?" – KI-generierte Anleitung für die nächste Schicht basierend auf Diagnosen und SIS.
          </p>
        </div>
        
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className="relative z-10 bg-slate-900 text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 uppercase tracking-widest text-xs"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} className="text-blue-400" />}
          {isLoading ? 'Analysiere Daten...' : 'Anleitung Erstellen'}
        </button>
      </div>

      {!guideText && !isLoading && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center flex flex-col items-center">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm mb-6">
            <ClipboardCheck size={48} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Noch keine Anleitung generiert</p>
          <p className="text-slate-300 text-xs mt-2">Klicken Sie auf den Button, um die aktuellen Klientendaten zu analysieren.</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
           {[1,2,3].map(i => (
             <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
           ))}
        </div>
      )}

      {guideText && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections?.map((section, idx) => {
             const [title, ...content] = section.split(':');
             const icons = [
                <HeartPulse className="text-red-500" />,
                <Waves className="text-blue-500" />,
                <Brain className="text-purple-500" />,
                <Stethoscope className="text-emerald-500" />,
                <AlertTriangle className="text-amber-500" />
             ];

             return (
                <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                        {icons[idx % icons.length]}
                    </div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter italic">{title?.trim()}</h3>
                  </div>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {content.join(':').trim()}
                  </div>
                </div>
             );
          })}
        </div>
      )}

      <div className="mt-12 bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex gap-4 text-xs text-amber-800">
        <AlertTriangle className="shrink-0 text-amber-600" size={24} />
        <div>
          <strong className="block mb-1 uppercase tracking-wider">Wichtiger Hinweis</strong>
          Diese Notiz dient als Hilfestellung zur schnellen Orientierung. Sie ersetzt NICHT den vollständigen Maßnahmenplan oder die ärztlichen Verordnungen. Bitte immer die Original-Akte gegenprüfen.
        </div>
      </div>
    </div>
  );
};

export default CareGuideView;
