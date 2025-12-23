
import React from 'react';
import { DB } from '../data';
import { SelectionState, ClientData, ItemSelection } from '../types';
import { LOGIC_DB } from '../logicData';
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, FolderRoot, Stethoscope, Info } from 'lucide-react';

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
    <div className="space-y-6 max-w-[1500px] mx-auto pb-48 px-4 animate-in fade-in duration-500">
      
      <div className="bg-slate-900 px-6 py-4 rounded-2xl shadow-xl text-white flex justify-between items-center border-b-4 border-red-600">
        <div className="flex items-center gap-4">
            <ShieldAlert size={24} className="text-red-500" />
            <h2 className="text-lg font-black uppercase tracking-widest italic">Risikomatrix (Screening)</h2>
        </div>
        <div className="flex gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Legende:</span>
            <span className="flex items-center gap-1 text-[10px] font-black text-blue-400 bg-blue-900/30 px-3 py-1 rounded-lg border border-blue-500/20">DIAGNOSE</span>
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-lg border border-emerald-500/20">THEMENFELD</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {riskList.map((item, idx) => {
          const id = `matrix_g0_risk_${idx}`;
          const sel = (selections[id] as ItemSelection) || { checked: false };
          const { diagnoses, fields } = getRiskTriggers(item.n);
          
          const hasTriggers = diagnoses.length > 0 || fields.length > 0;
          const isActive = sel.checked;

          return (
            <div 
              key={id} 
              onClick={() => onUpdate(id, { checked: !isActive })}
              className={`group flex flex-col p-4 rounded-[1.5rem] border-2 transition-all cursor-pointer shadow-sm relative h-full ${
                  isActive 
                    ? 'bg-red-50 border-red-600 ring-4 ring-red-100 z-10' 
                    : (hasTriggers ? 'bg-amber-50 border-amber-300 border-dashed hover:border-amber-400' : 'bg-white border-slate-100 hover:border-slate-300')
              }`}
            >
              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isActive ? 'bg-red-600 text-white shadow-sm' : (hasTriggers ? 'bg-amber-400 text-white' : 'bg-slate-50 text-slate-200')
                    }`}>
                        {isActive ? <AlertTriangle size={14} strokeWidth={3} /> : <CheckCircle size={14} />}
                    </div>
                    {hasTriggers && !isActive && <Zap size={12} className="text-amber-500 animate-pulse shrink-0" fill="currentColor" />}
                </div>

                <div className="min-h-[2rem] flex items-center">
                    <span className={`text-[13px] font-black leading-tight tracking-tight uppercase italic ${isActive ? 'text-red-950' : (hasTriggers ? 'text-amber-900' : 'text-slate-400')}`}>
                        {item.n}
                    </span>
                </div>

                {(isActive || hasTriggers) && (
                    <div className="mt-auto pt-2 border-t border-slate-200/40 flex flex-wrap gap-1.5">
                        {diagnoses.map(d => (
                            <span key={d} className="text-[8px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200 uppercase truncate max-w-full" title={d}>
                                {d}
                            </span>
                        ))}
                        {fields.map(f => (
                            <span key={f} className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 uppercase">
                                {f}
                            </span>
                        ))}
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
          <Info size={20} className="text-blue-500 shrink-0" />
          <p className="text-slate-500 text-[12px] font-black uppercase tracking-tight">
            <span className="text-amber-600">Gelb gestrichelt</span> = Vorschlag durch Analyse. <span className="text-red-600 font-black">Rot</span> = Bestätigt & Teil der Doku. Klick zum (Ab-)Wählen.
          </p>
      </div>
    </div>
  );
};

export default RiskMatrixView;
