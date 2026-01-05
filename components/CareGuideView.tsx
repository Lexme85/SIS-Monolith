
import React from 'react';
import { Sparkles, Loader2, Zap, AlertTriangle, Stethoscope, HeartPulse, Brain, Waves, MessageSquare, ShieldCheck, Star } from 'lucide-react';

interface CareGuideViewProps {
  guideText: string;
  onGenerate: () => void;
  isLoading: boolean;
}

const CareGuideView: React.FC<CareGuideViewProps> = ({ guideText, onGenerate, isLoading }) => {
  
  const parseGuide = (text: string) => {
    if (!text) return [];
    
    // Wir suchen nach festen Kategorien im Text
    const categories = [
      { key: 'FOKUS', label: 'Pflegerischer Fokus', color: 'blue', icon: <HeartPulse size={24}/> },
      { key: 'KOMMUNIKATION', label: 'Kommunikations-Schlüssel', color: 'indigo', icon: <MessageSquare size={24}/> },
      { key: 'GEFAHREN', label: 'Rote Flaggen / Gefahren', color: 'red', icon: <AlertTriangle size={24}/> },
      { key: 'HILFSMITTEL', label: 'Wichtige Hilfsmittel', color: 'emerald', icon: <ShieldCheck size={24}/> },
      { key: 'RITUALE', label: 'Wünsche & Rituale', color: 'amber', icon: <Star size={24}/> }
    ];

    const result: any[] = [];
    
    categories.forEach(cat => {
      const regex = new RegExp(`${cat.key}:?\\s*([\\s\\S]*?)(?=\\n[A-Z]+:?|$)`, 'i');
      const match = text.match(regex);
      if (match && match[1].trim()) {
        result.push({
          ...cat,
          content: match[1].trim().replace(/^- /gm, '')
        });
      }
    });

    // Fallback: Wenn kein Parsing klappt, aber Text da ist
    if (result.length === 0 && text.length > 20) {
        return [{ key: 'INFO', label: 'Allgemeine Hinweise', color: 'slate', icon: <Zap size={24}/>, content: text }];
    }

    return result;
  };

  const sections = parseGuide(guideText);

  const colorMap: any = {
    blue: "bg-blue-50 border-blue-200 text-blue-700 icon-bg-blue-100",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 icon-bg-indigo-100",
    red: "bg-red-50 border-red-200 text-red-700 icon-bg-red-100 animate-pulse-slow",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 icon-bg-emerald-100",
    amber: "bg-amber-50 border-amber-200 text-amber-700 icon-bg-amber-100",
    slate: "bg-slate-50 border-slate-200 text-slate-700 icon-bg-slate-100"
  };

  return (
    <div className="max-w-5xl mx-auto pb-40 animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <div className="bg-slate-900 rounded-[3rem] shadow-2xl p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative border-b-[8px] border-blue-600">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase leading-none">
            <Zap className="text-blue-400 shrink-0" fill="currentColor" size={42} /> Spickzettel <span className="text-blue-500">PRO</span>
          </h2>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-4 max-w-md italic opacity-80">
            Automatisierte Übergabe-Instruktion für das Team.
          </p>
        </div>
        
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className="relative z-10 bg-blue-600 text-white font-black py-5 px-12 rounded-[2rem] shadow-2xl hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-4 uppercase tracking-[0.2em] text-xs border-b-4 border-blue-800"
        >
          {isLoading ? <Loader2 size={24} className="animate-spin"/> : <Sparkles size={24} className="text-blue-200" />}
          {isLoading ? 'Analysiere...' : 'Guide Generieren'}
        </button>
      </div>

      {!guideText && !isLoading && (
        <div className="bg-white border-4 border-dashed border-slate-100 rounded-[4rem] p-24 text-center flex flex-col items-center justify-center shadow-inner">
          <div className="bg-slate-50 p-10 rounded-full mb-8">
            <Stethoscope size={64} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Bereit zur Analyse</p>
          <p className="text-slate-300 text-[11px] mt-4 font-bold uppercase tracking-widest max-w-xs leading-relaxed">
            Klicken Sie oben auf den Button, um aus den gewählten SIS-Daten einen kompakten Spickzettel zu erstellen.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-48 bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm"></div>
           ))}
        </div>
      )}

      {guideText && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => {
             const style = colorMap[section.color] || colorMap.slate;
             const [bgColor, borderColor, textColor, iconBg] = style.split(' ');

             return (
                <div key={idx} className={`${bgColor} ${borderColor} border-2 p-8 rounded-[3rem] shadow-lg hover:shadow-2xl transition-all group flex flex-col gap-6 relative overflow-hidden`}>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`p-4 rounded-2xl ${iconBg.replace('icon-bg-', 'bg-')} ${textColor} shadow-sm group-hover:scale-110 transition-transform`}>
                            {section.icon}
                        </div>
                        <h3 className={`font-black text-sm md:text-lg uppercase italic tracking-tighter ${textColor}`}>
                            {section.label}
                        </h3>
                    </div>
                    <div className={`text-[13px] md:text-[15px] leading-relaxed font-bold ${textColor} opacity-90 relative z-10 whitespace-pre-wrap`}>
                        {section.content}
                    </div>
                </div>
             );
          })}
        </div>
      )}

      <div className="mt-16 bg-slate-900 p-10 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center border-l-[12px] border-blue-600 shadow-2xl">
        <div className="bg-blue-600 p-4 rounded-2xl text-white shrink-0 shadow-lg">
            <AlertTriangle size={32} />
        </div>
        <div>
            <p className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-2">Haftungshinweis zur KI-Nutzung</p>
            <p className="text-slate-400 text-[10px] font-bold uppercase leading-relaxed tracking-wide italic">
                Dieser Spickzettel dient als Orientierungshilfe für die Übergabe. Er ersetzt NICHT das Studium der vollständigen Pflegedokumentation, die ärztliche Anordnung oder die fachliche Einschätzung vor Ort.
            </p>
        </div>
      </div>

      <style>{`
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

export default CareGuideView;
