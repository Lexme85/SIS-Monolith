
import React, { useState, useEffect } from 'react';
import { DB } from '../data';
import { SelectionState, ClientData, ListItem, ItemSelection, DropdownOption } from '../types';
import { LOGIC_DB } from '../logicData';
import { 
  AlertCircle, ChevronDown, CheckCircle, Activity, Zap, 
  ShieldCheck, ShieldAlert, Clock, 
  Settings2, AlertOctagon, Star, BriefcaseMedical, Info, Link2, Stethoscope,
  Calendar, ChevronRight, Tag
} from 'lucide-react';

interface TopicFieldProps {
  viewId: string;
  selections: SelectionState;
  onUpdate: (id: string, updates: Partial<ItemSelection>) => void;
  clientData: ClientData; 
}

const TopicField: React.FC<TopicFieldProps> = ({ viewId, selections, onUpdate, clientData }) => {
  const data = DB[viewId];
  if (!data) return <div className="p-10 text-slate-400 italic">Daten nicht verfügbar.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4 border-b pb-6 mb-8 border-slate-200">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">{String(data.title)}</h2>
      </div>

      {data.groups.map((group, gIdx) => (
          <GroupCard 
            key={`${viewId}_g${gIdx}`} 
            group={group} 
            gid={`${viewId}_g${gIdx}`} 
            selections={selections} 
            onUpdate={onUpdate} 
            clientData={clientData}
          />
      ))}
    </div>
  );
};

const GroupCard: React.FC<{group: any, gid: string, selections: SelectionState, onUpdate: any, clientData: ClientData}> = ({ group, gid, selections, onUpdate, clientData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const gatewayId = `${gid}_gateway`;
    const gatewayVal = selections[gatewayId]?.gatewayVal || false; 

    const hasActiveItems = Object.keys(selections).some(k => k.startsWith(gid) && !k.endsWith('_gateway') && !k.includes('_res_') && (selections[k] as any).checked);
    const isConspicuous = gatewayVal || hasActiveItems;
    
    useEffect(() => { if(isConspicuous) setIsOpen(true); }, [isConspicuous]);

    return (
        <div className={`bg-white rounded-[2rem] shadow-sm border transition-all mb-8 ${isOpen ? 'border-slate-300 ring-4 ring-slate-50' : 'border-slate-200'}`}>
            <div className={`p-6 flex justify-between items-center cursor-pointer select-none transition-colors ${isConspicuous ? 'bg-red-50/40' : 'bg-slate-50/50'}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-5">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${isConspicuous ? 'bg-red-600 text-white shadow-lg' : 'bg-green-600 text-white'}`}>
                        {isConspicuous ? <AlertOctagon size={24} /> : <ShieldCheck size={24} />}
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight uppercase italic">{String(group.title)}</span>
                </div>
                <div className="flex items-center gap-6">
                    {isConspicuous && <span className="text-[11px] font-black text-red-600 uppercase tracking-widest hidden md:block">Handlungsbedarf</span>}
                    <ChevronDown size={24} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x border-slate-100">
                        <Column title="Risiko" color="red" list={group.r} type="risk" gid={gid} selections={selections} onUpdate={onUpdate} clientData={clientData} />
                        <Column title="Befund" color="blue" list={group.s} type="stat" gid={gid} selections={selections} onUpdate={onUpdate} clientData={clientData} />
                        <Column title="Hilfsmittel" color="gold" list={group.aid} type="aid" gid={gid} selections={selections} onUpdate={onUpdate} clientData={clientData} />
                        <Column title="Ressourcen" color="purple" list={group.res} type="res" gid={gid} selections={selections} onUpdate={onUpdate} clientData={clientData} />
                        <Column title="Maßnahmen" color="green" list={group.m} type="act" gid={gid} selections={selections} onUpdate={onUpdate} clientData={clientData} />
                    </div>
                </div>
            )}
        </div>
    );
};

const Column = ({ title, color, list, ...props }: any) => {
    const colors = { 
        red: "text-red-700 bg-red-50", 
        blue: "text-blue-700 bg-blue-50", 
        gold: "text-amber-700 bg-amber-50", 
        purple: "text-purple-700 bg-purple-50", 
        green: "text-green-700 bg-green-50" 
    };
    return (
        <div className="p-4">
            <div className={`text-[11px] font-black uppercase tracking-widest mb-4 px-3 py-1.5 rounded text-center ${colors[color as keyof typeof colors]}`}>{title}</div>
            <ItemList list={list} color={color} {...props} />
        </div>
    );
};

const ItemList = ({ list, type, gid, selections, onUpdate, color, clientData }: any) => {
    if(!list || list.length === 0) return <div className="text-[11px] text-slate-300 text-center py-6 italic font-bold uppercase">Keine Einträge</div>;
    const badgeColors = { red: "bg-red-600", blue: "bg-blue-600", gold: "bg-amber-600", purple: "bg-purple-600", green: "bg-green-600" };

    const handleSubTagToggle = (id: string, tag: string, currentTags: string[]) => {
        const newTags = currentTags.includes(tag) 
            ? currentTags.filter(t => t !== tag) 
            : [...currentTags, tag];
        onUpdate(id, { subTags: newTags });
    };

    return (
        <div className="space-y-3">
            {list.map((item: ListItem, idx: number) => {
                const id = `${gid}_${type}_${idx}`;
                const sel = (selections[id] as ItemSelection) || { checked: false, originVals: [], subTags: [], detailVal: '', timeVal: '' };
                const isChecked = sel.checked;
                const origins = sel.originVals || [];
                const subTags = sel.subTags || [];

                return (
                    <div key={id} className={`rounded-2xl border transition-all overflow-hidden ${isChecked ? 'border-slate-300 bg-white shadow-md ring-2 ring-slate-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <div onClick={() => onUpdate(id, { checked: !isChecked })} className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${isChecked && origins.length > 0 ? 'bg-blue-50/20' : ''}`}>
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${isChecked ? badgeColors[color as keyof typeof badgeColors] : 'bg-white border-slate-300'}`}>
                                {isChecked && <CheckCircle size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <div className="flex flex-col min-w-0 text-left">
                                <span className={`text-[14px] font-black leading-tight tracking-tight ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>{item.n}</span>
                                {isChecked && origins.length > 0 && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <Stethoscope size={12} className="text-blue-600" />
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter truncate">Begründet durch: {origins.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isChecked && (
                            <div className="px-4 pb-4 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-50 mt-1">
                                
                                {item.l && (
                                    <div className="space-y-1.5 mt-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <ChevronRight size={12} /> Detailauswahl
                                        </label>
                                        <select 
                                            value={sel.detailVal || ''} 
                                            onChange={(e) => onUpdate(id, { detailVal: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[12px] font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Wählen...</option>
                                            {item.l.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                )}

                                {item.t && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} /> Frequenz / Zeit
                                        </label>
                                        <select 
                                            value={sel.timeVal || ''} 
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const opt = item.t?.find(o => (typeof o === 'string' ? o : o.t) === val);
                                                const days = (opt && typeof opt !== 'string') ? opt.d : 0;
                                                onUpdate(id, { timeVal: val, timeDays: days });
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[12px] font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Wählen...</option>
                                            {item.t.map(opt => {
                                                const label = typeof opt === 'string' ? opt : opt.t;
                                                return <option key={label} value={label}>{label}</option>;
                                            })}
                                        </select>
                                    </div>
                                )}

                                {item.s && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Tag size={12} /> Spezifizierung
                                        </label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.s.map(tag => {
                                                const isTagSelected = subTags.includes(tag);
                                                return (
                                                    <button 
                                                        key={tag}
                                                        onClick={() => handleSubTagToggle(id, tag, subTags)}
                                                        className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                                                            isTagSelected 
                                                            ? 'bg-blue-600 border-blue-600 text-white font-black uppercase' 
                                                            : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 font-bold'
                                                        }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {item.isDateRelevant && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} /> Letzter Wechsel
                                        </label>
                                        <input 
                                            type="date"
                                            value={sel.lastChangeDate || ''}
                                            onChange={(e) => onUpdate(id, { lastChangeDate: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[12px] font-black text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TopicField;
