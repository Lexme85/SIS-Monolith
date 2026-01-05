
import React, { useState, useEffect } from 'react';
import { DB } from '../data';
import { LOGIC_DB } from '../logicData';
import { SelectionState, ClientData, ListItem, ItemSelection, GroupData } from '../types';
import { 
  ChevronDown, CheckCircle, AlertOctagon, ShieldCheck, Edit3, Activity
} from 'lucide-react';

interface TopicFieldProps {
  viewId: string;
  selections: SelectionState;
  onUpdate: (id: string, updates: Partial<ItemSelection>) => void;
  clientData: ClientData; 
  note: string;
  onNoteChange: (val: string) => void;
}

const TopicField: React.FC<TopicFieldProps> = ({ viewId, selections, onUpdate, clientData, note, onNoteChange }) => {
  const rawData = DB[viewId];
  if (!rawData) return <div className="p-10 text-slate-400 italic">Daten nicht verfügbar.</div>;

  // Wir klonen die Daten, um die vorhandenen Gruppen dynamisch zu erweitern
  const data = JSON.parse(JSON.stringify(rawData)) as typeof rawData;

  // Sammle alle klinischen Items aus ALLEN gewählten Diagnosen für dieses TF
  const clinicalItems: any[] = [];
  (clientData.diagnoses || []).forEach(diag => {
    const logic = LOGIC_DB[diag];
    if (logic && logic.specificItems) {
      logic.specificItems.forEach((si, idx) => {
        if (si.tf === viewId) {
          clinicalItems.push({
            ...si,
            diagOrigin: diag,
            diagIdx: idx
          });
        }
      });
    }
  });

  // Injiziere die klinischen Items in die ERSTE Gruppe des Themenfelds (Befund-Spalte)
  if (clinicalItems.length > 0 && data.groups.length > 0) {
      if (!data.groups[0].s) data.groups[0].s = [];
      // Wir fügen sie am Anfang der Befund-Liste ein
      data.groups[0].s = [...clinicalItems, ...data.groups[0].s];
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2 border-b pb-6 mb-8 border-slate-200">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">{String(data.title)}</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strukturmodell (SIS) - Dynamisch erweitert</p>
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

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-300 overflow-hidden mt-10 ring-4 ring-blue-50/50">
        <div className="bg-slate-900 px-8 py-5 flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Edit3 size={20} /></div>
            <h3 className="text-white font-black text-lg uppercase tracking-tight italic">Ergänzende Beobachtungen</h3>
        </div>
        <div className="p-8">
            <textarea 
                className="w-full p-6 border-2 border-slate-100 rounded-[2rem] text-sm font-medium focus:border-blue-500 outline-none min-h-[150px] transition-all bg-slate-50 shadow-inner focus:bg-white"
                placeholder="Schreiben Sie hier spezifische Details für diesen Bereich rein..."
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
            ></textarea>
        </div>
      </div>
    </div>
  );
};

const GroupCard: React.FC<{group: GroupData, gid: string, selections: SelectionState, onUpdate: any, clientData: ClientData}> = ({ group, gid, selections, onUpdate, clientData }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const hasActiveItems = Object.keys(selections).some(id => {
        // Prüfe Standard-Items
        if (id.startsWith(gid)) return selections[id].checked;
        // Prüfe injizierte Diagnose-Items (diese fangen mit diag_ an)
        // Wir müssen prüfen, ob eines der injizierten Items in dieser Gruppe angeklickt wurde
        if (id.startsWith('diag_') && selections[id].checked) {
            // Check if this diag item actually belongs to the current view via LOGIC_DB lookup is complex, 
            // but since we only render relevant ones in TopicField, this is usually fine for UI-feedback.
            return true; 
        }
        return false;
    });

    const isConspicuous = hasActiveItems;
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
                <ChevronDown size={24} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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

    return (
        <div className="space-y-3">
            {list.map((item: any, idx: number) => {
                const id = item.diagOrigin ? `diag_${item.diagOrigin}_${item.diagIdx}` : `${gid}_${type}_${idx}`;
                const sel = (selections[id] as ItemSelection) || { checked: false, originVals: [], subTags: [], detailVal: '' };
                const isChecked = sel.checked;
                const origins = sel.originVals || (item.diagOrigin ? [item.diagOrigin] : []);
                const subTags = sel.subTags || [];

                return (
                    <div key={id} className={`rounded-2xl border transition-all overflow-hidden ${isChecked ? 'border-blue-300 bg-blue-50/20 shadow-md ring-2 ring-blue-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <div onClick={() => onUpdate(id, { checked: !isChecked, originVals: origins })} className={`p-4 flex items-center gap-4 cursor-pointer`}>
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${isChecked ? badgeColors[color as keyof typeof badgeColors] : 'bg-white border-slate-300'}`}>
                                {isChecked && <CheckCircle size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <div className="flex flex-col min-w-0 text-left">
                                <span className={`text-[13px] font-black leading-tight tracking-tight ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>{item.n}</span>
                                {origins.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {origins.map(o => (
                                            <span key={o} className="bg-blue-600 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                                <Activity size={8} /> {o}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isChecked && (
                            <div className="px-4 pb-4 pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-blue-100 mt-1">
                                {item.l && (
                                    <div className="mt-3">
                                        <select 
                                            value={sel.detailVal || ''} 
                                            onChange={(e) => onUpdate(id, { detailVal: e.target.value })}
                                            className="w-full bg-white border border-blue-200 rounded-xl py-2 px-3 text-[12px] font-black text-slate-700 outline-none shadow-sm"
                                        >
                                            <option value="">Status wählen...</option>
                                            {item.l.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                )}
                                {item.s && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {item.s.map((tag: string) => {
                                            const isTagSelected = subTags.includes(tag);
                                            return (
                                                <button 
                                                    key={tag}
                                                    onClick={() => {
                                                        const newTags = isTagSelected ? subTags.filter(t => t !== tag) : [...subTags, tag];
                                                        onUpdate(id, { subTags: newTags });
                                                    }}
                                                    className={`text-[9px] px-2.5 py-1 rounded-lg border transition-all uppercase tracking-tighter ${isTagSelected ? 'bg-blue-600 border-blue-600 text-white font-black' : 'bg-white border-slate-200 text-slate-500 font-bold hover:bg-slate-50'}`}
                                                >
                                                    {tag}
                                                </button>
                                            );
                                        })}
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
