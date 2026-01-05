
import React from 'react';
import { Library, Search, Trash2, ExternalLink, Calendar, User, Hash } from 'lucide-react';

interface ArchiveViewProps {
  archive: any[];
  onLoad: (entry: any) => void;
  onDelete: (id: string) => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ archive, onLoad, onDelete }) => {
  return (
    <div className="max-w-6xl mx-auto pb-40 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white mb-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b-[8px] border-blue-600 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mt-32 blur-[100px]"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="bg-blue-600 p-5 rounded-[1.5rem] shadow-xl">
             <Library size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Klienten-Archiv</h2>
            <p className="text-[11px] font-black text-slate-400 mt-3 uppercase tracking-[0.3em]">Gespeicherte Fälle & Dokumentationen</p>
          </div>
        </div>
        <div className="relative w-full md:w-64 z-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text" 
                placeholder="Suche..." 
                className="w-full bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
      </div>

      {archive.length === 0 ? (
        <div className="bg-white border-4 border-dashed border-slate-100 rounded-[4rem] p-24 text-center flex flex-col items-center justify-center shadow-inner">
            <div className="bg-slate-50 p-10 rounded-full mb-8">
                <Library size={64} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Das Archiv ist leer</p>
            <p className="text-slate-300 text-[11px] mt-4 font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                Speichern Sie aktuelle Entwürfe im Editor, um sie hier für einen späteren Ausdruck zu sichern.
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {archive.map((entry) => (
            <div key={entry.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all group hover:border-blue-200">
                <div className="flex items-center gap-6 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <User size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h4 className="font-black text-lg text-slate-900 uppercase italic tracking-tight">{entry.clientData.name}</h4>
                            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-3 py-1 rounded-full uppercase border border-blue-200">{entry.clientData.pg}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
                                <Calendar size={12} /> {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
                                <Hash size={12} /> Zimmer {entry.clientData.roomNumber || '—'}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onLoad(entry)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <ExternalLink size={16} /> Fall Laden
                    </button>
                    <button 
                        onClick={() => onDelete(entry.id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        title="Löschen"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveView;
