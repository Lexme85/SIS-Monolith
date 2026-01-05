
import React from 'react';
import { DB } from '../data';
import { SelectionState, ClientData, ItemSelection } from '../types';
import { LOGIC_DB } from '../logicData';
import { 
    AlertTriangle, CheckCircle, ShieldAlert, Zap, 
    Info, Calendar, MessageSquare, ClipboardCheck, Printer 
} from 'lucide-react';

interface RiskMatrixViewProps {
  selections: SelectionState;
  onUpdate: (id: string, updates: Partial<ItemSelection>) => void;
  clientData: ClientData;
}

const RiskMatrixView: React.FC<RiskMatrixViewProps> = ({ selections, onUpdate, clientData }) => {
  const data = DB['matrix'];
  if (!data) return <div className="p-10 text-red-500 font-black italic text-center text-[13px]">Keine Matrix-Daten verfügbar.</div>;

  const riskList = data.groups[0]?.r || [];

  const getRiskTriggers = (riskName: string) => {
    const diagnosticTriggers: string[] = [];
    const topicFieldTriggers: string[] = [];
    
    if (clientData.diagnoses) {
      clientData.diagnoses.forEach(diagName => {
        const logic = LOGIC_DB[diagName];
        if (logic && logic.matrix && logic.matrix.includes(riskName)) {
          diagnosticTriggers.push(diagName);
        }
      });
    }

    Object.entries(selections).forEach(([id, itemSel]) => {
      const selectionItem = itemSel as ItemSelection;
      if (selectionItem.checked && !id.startsWith('matrix')) {
          const parts = id.split('_');
          const tfKey = parts[0];
          const tags = selectionItem.subTags || [];
          
          const tfMap: Record<string, string> = {
              tf1: 'TF 1', tf2: 'TF 2', tf3: 'TF 3', tf4: 'TF 4', tf5: 'TF 5', tf6: 'TF 6'
          };

          const matches = {
            'Sturz': tfKey === 'tf2' || tags.some(t => /sturz|unsicher|schwankend|rollator/i.test(t)),
            'Dekubitus': tags.some(t => /bettlägerig|wunde|pergamenthaut|hämatom/i.test(t)),
            'Harninkontinenz': tags.some(t => /harninkontinenz|vorlage/i.test(t)),
            'Stuhlinkontinenz': tags.some(t => /stuhlinkontinenz/i.test(t)),
            'Mangelernährung': tags.some(t => /bmi|appetit|mangel/i.test(t)),
            'Exsikkose': tags.some(t => /trinkmenge|flüssigkeit/i.test(t)),
            'Aspiration': tags.some(t => /schluckstörung|aspiration/i.test(t)),
            'Kontraktur': tags.some(t => /lähmung|parese|immobilität/i.test(t)),
            'Eigengefährdung': tags.some(t => /hinlauftendenz|weglauftendenz|unruhe/i.test(t)),
            'Soziale Isolation': tfKey === 'tf5' && tags.some(t => /rückzug|einzelgänger/i.test(t)),
            'Schmerz': tfKey === 'tf3' && tags.some(t => /schmerz/i.test(t))
          };

          if (matches[riskName as keyof typeof matches]) {
            topicFieldTriggers.push(tfMap[tfKey] || tfKey.toUpperCase());
          }
      }
    });

    return {
        diagnoses: Array.from(new Set(diagnosticTriggers)),
        fields: Array.from(new Set(topicFieldTriggers))
    };
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-48 px-2 md:px-4 animate-in fade-in duration-500">
      
      <div className="bg-slate-900 px-4 py-4 md:px-6 rounded-2xl shadow-xl text-white flex justify-between items-center border-b-4 border-red-600 print:bg-white print:text-slate-900 print:border-slate-200">
        <div className="flex items-center gap-3 md:gap-4">
            <ShieldAlert size={24} className="text-red-500 print:text-red-600" />
            <h2 className="text-sm md:text-lg font-black uppercase tracking-widest italic">Risikomatrix & Beratung</h2>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex gap-4 no-print">
                <span className="flex items-center gap-1 text-[10px] font-black text-blue-400 bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-500/20 uppercase">Diagnose-Trigger</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-lg border border-emerald-500/20 uppercase">SIS-Trigger</span>
            </div>
            <button onClick={() => window.print()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors no-print">
                <Printer size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 print:grid-cols-2 print:gap-4">
        {riskList.map((item, idx) => {
          const id = `matrix_g0_risk_${idx}`;
          const sel = (selections[id] as ItemSelection) || { checked: false, subTags: [], lastChangeDate: '' };
          const { diagnoses, fields } = getRiskTriggers(item.n);
          
          const hasTriggers = diagnoses.length > 0 || fields.length > 0;
          const isActive = sel.checked;
          const subTags = sel.subTags || [];

          return (
            <div 
              key={id} 
              className={`group flex flex-col rounded-[2.5rem] border-2 transition-all shadow-sm relative overflow-hidden print-break-avoid ${
                  isActive 
                    ? 'bg-white border-red-600 ring-4 ring-red-50 z-10 print:ring-0 print:border-red-500' 
                    : (hasTriggers ? 'bg-amber-50/50 border-amber-300 border-dashed print:border-slate-200 print:bg-white' : 'bg-white border-slate-100')
              }`}
            >
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div onClick={() => onUpdate(id, { checked: !isActive })} className={`flex items-center gap-4 cursor-pointer no-print`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isActive ? 'bg-red-600 text-white shadow-lg' : (hasTriggers ? 'bg-amber-400 text-white' : 'bg-slate-50 text-slate-200')
                        }`}>
                            {isActive ? <AlertTriangle size={18} strokeWidth={3} /> : <CheckCircle size={18} />}
                        </div>
                        <span className={`text-sm md:text-lg font-black tracking-tight uppercase italic ${isActive ? 'text-slate-900' : (hasTriggers ? 'text-amber-900' : 'text-slate-400')}`}>
                            {item.n}
                        </span>
                    </div>
                    {/* Print-only Label */}
                    <div className="hidden print:flex items-center gap-3">
                         <span className={`text-lg font-black uppercase italic ${isActive ? 'text-red-600' : 'text-slate-300'}`}>{item.n}</span>
                         {isActive && <AlertTriangle size={18} className="text-red-500" />}
                    </div>
                </div>

                {(isActive || hasTriggers) && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {diagnoses.map(d => (
                            <span key={d} className="text-[8px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200 uppercase truncate max-w-[120px]" title={d}>
                                {d}
                            </span>
                        ))}
                        {fields.map(f => (
                            <span key={f} className={`text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 uppercase`}>
                                {f}
                            </span>
                        ))}
                    </div>
                )}

                {isActive && (
                    <div className="space-y-4 md:space-y-6 pt-4 md:pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                            <MessageSquare size={14} className="text-blue-500" /> Beratungsprotokoll
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {item.s?.map(tag => {
                                const isTagSelected = subTags.includes(tag);
                                return (
                                    <button 
                                        key={tag}
                                        onClick={() => {
                                            const newTags = isTagSelected ? subTags.filter(t => t !== tag) : [...subTags, tag];
                                            onUpdate(id, { subTags: newTags });
                                        }}
                                        className={`text-[9px] md:text-[10px] px-2.5 py-1.5 rounded-xl border transition-all no-print ${isTagSelected ? 'bg-blue-600 border-blue-700 text-white font-black shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 font-bold'}`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                            {/* Print-only Tags */}
                            {subTags.map(tag => (
                                <span key={tag} className="hidden print:inline-block bg-slate-100 text-slate-800 text-[9px] font-black px-2 py-1 rounded-md border border-slate-200 uppercase">{tag}</span>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 print:bg-white print:border-slate-200">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                <Calendar size={12} /> Beratungsdatum: {sel.lastChangeDate || '—'}
                            </label>
                            <input 
                                type="date" 
                                value={sel.lastChangeDate || ''}
                                onChange={(e) => onUpdate(id, { lastChangeDate: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-[12px] font-bold outline-none no-print"
                            />
                        </div>
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-6 flex items-center gap-4 md:gap-6 shadow-sm no-print">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-inner">
            <Info size={24} />
          </div>
          <p className="text-slate-500 text-[10px] md:text-[12px] font-black uppercase tracking-tight leading-relaxed">
            <span className="text-amber-600">Gelb gestrichelt</span> = System erkennt Risiken durch Diagnosen. <br/>
            Markieren Sie das Risiko <span className="text-red-600 font-black">Rot</span>, um die Beratung zu dokumentieren.
          </p>
      </div>
    </div>
  );
};

export default RiskMatrixView;
