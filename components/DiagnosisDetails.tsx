
import React from 'react';
import { ClientData, SelectionState } from '../types';
import { LOGIC_DB } from '../logicData';
import { 
    Stethoscope, Activity, ClipboardList, 
    CheckCircle2, GraduationCap, ListChecks, Zap, HelpCircle, AlertTriangle
} from 'lucide-react';

interface DiagnosisDetailsProps {
    data: ClientData;
    selections: SelectionState;
    onChange: (field: keyof ClientData, value: any) => void;
    onUpdateSelection: (id: string, updates: Partial<any>) => void;
}

const DiagnosisDetails: React.FC<DiagnosisDetailsProps> = ({ data, selections, onChange, onUpdateSelection }) => {
    
    const handleToggleItem = (diagName: string, text: string, type: 'symptom' | 'measure' | 'concept', idx: number) => {
        const logicId = `diag_${diagName}_${idx}`;
        
        if (type === 'symptom') {
            const isCurrentlyChecked = selections[logicId]?.checked || false;
            onUpdateSelection(logicId, { 
                checked: !isCurrentlyChecked,
                originVals: [diagName]
            });
        }

        const listFieldMap = { 
            symptom: 'diagnosisSymptomSelection', 
            measure: 'diagnosisMeasureSelection', 
            concept: 'diagnosisConceptSelection' 
        };
        const fieldName = listFieldMap[type] as keyof ClientData;
        const currentSelections = (data[fieldName] as Record<string, string[]>) || {};
        const diagList = currentSelections[diagName] || [];
        
        const isSelected = diagList.includes(text);
        const newList = isSelected ? diagList.filter(s => s !== text) : [...diagList, text];

        onChange(fieldName, { ...currentSelections, [diagName]: newList });
    };

    const selectedDiagnoses = data.diagnoses || [];

    if (selectedDiagnoses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-300 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 m-4 shadow-inner">
                <div className="bg-slate-50 p-10 rounded-full mb-6">
                    <Stethoscope size={64} className="opacity-20 text-blue-600" />
                </div>
                <h3 className="font-black text-xl uppercase tracking-[0.2em] text-slate-900 leading-none">Keine Krankheitsbilder</h3>
                <p className="text-[12px] mt-4 font-bold text-slate-400 uppercase tracking-widest text-center max-w-sm leading-relaxed">
                    Wählen Sie in den <span className="text-blue-600 underline cursor-pointer">Stammdaten</span> klinische Diagnosen aus.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-40 animate-in fade-in duration-700 max-w-[1600px] mx-auto px-4">
            <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden border-b-[12px] border-blue-600 mt-4">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                <div className="flex items-center gap-6 md:gap-10 relative z-10">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-blue-500/20">
                        <Activity size={32} />
                    </div>
                    <div>
                        <h3 className="font-black text-3xl md:text-5xl uppercase tracking-tighter italic leading-none">Diagnose Details</h3>
                        <p className="text-[10px] md:text-[11px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em] flex items-center gap-2">
                           <Zap size={14} className="text-blue-500" /> Klinisches Experten-Board
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {selectedDiagnoses.map(diag => {
                    const logic = LOGIC_DB[diag];
                    const symptomsSelected = data.diagnosisSymptomSelection[diag] || [];
                    const measuresSelected = data.diagnosisMeasureSelection[diag] || [];
                    const conceptsSelected = data.diagnosisConceptSelection[diag] || [];

                    return (
                        <div key={diag} className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-xl overflow-hidden group">
                            <div className="bg-slate-50 px-6 md:px-10 py-6 md:py-8 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50 animate-pulse"></div>
                                    <h4 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">{diag}</h4>
                                </div>
                                {logic?.matrix && (
                                    <div className="flex flex-wrap gap-2">
                                        {logic.matrix.map(r => (
                                            <span key={r} className="bg-red-50 text-red-600 text-[9px] font-black uppercase px-3 py-1 rounded-full border border-red-100 flex items-center gap-1.5 shadow-sm">
                                                <AlertTriangle size={10} /> {r}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x border-slate-100">
                                {/* SIS Symptome */}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-4 mb-6 md:mb-8 text-slate-900">
                                        <div className="p-2.5 md:p-3 bg-blue-100 rounded-xl md:rounded-2xl text-blue-600"><ListChecks size={20}/></div>
                                        <div className="text-left">
                                            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] block">Symptom-Board (SIS)</span>
                                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase italic">Überträgt Daten in Themenfelder</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {logic?.specificItems?.map((item, idx) => {
                                            const logicId = `diag_${diag}_${idx}`;
                                            const isChecked = selections[logicId]?.checked || false;
                                            return (
                                                <div key={idx} onClick={() => handleToggleItem(diag, item.n, 'symptom', idx)} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all active:scale-95 ${isChecked ? 'bg-blue-600 border-blue-700 text-white shadow-xl shadow-blue-500/20' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${isChecked ? 'bg-white border-white' : 'bg-white border-slate-300'}`}>
                                                        {isChecked && <CheckCircle2 size={14} className="text-blue-600" />}
                                                    </div>
                                                    <div className="flex flex-col text-left overflow-hidden">
                                                        <span className="text-xs font-black leading-tight tracking-tight truncate">{item.n}</span>
                                                        <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${isChecked ? 'text-blue-200' : 'text-blue-500'}`}>SIS TF {item.tf.replace('tf','')}</span>
                                                    </div>
                                                </div>
                                            );
                                        }) || <div className="p-6 text-center text-slate-400 text-xs italic">Wählen Sie Diagnosen in den Stammdaten.</div>}
                                    </div>
                                </div>
                                
                                {/* Interventionen */}
                                <div className="p-6 md:p-8 bg-slate-50/30">
                                    <div className="flex items-center gap-4 mb-6 md:mb-8 text-slate-900">
                                        <div className="p-2.5 md:p-3 bg-emerald-100 rounded-xl md:rounded-2xl text-emerald-600"><ClipboardList size={20}/></div>
                                        <div className="text-left">
                                            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] block">Pflegeplan-Module</span>
                                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase italic">Klinische Standard-Maßnahmen</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {logic?.measures?.map((text, idx) => {
                                            const isChecked = measuresSelected.includes(text);
                                            return (
                                                <div key={idx} onClick={() => handleToggleItem(diag, text, 'measure', idx)} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all active:scale-95 ${isChecked ? 'bg-emerald-600 border-emerald-700 text-white shadow-xl shadow-emerald-500/20' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${isChecked ? 'bg-white border-white' : 'bg-white border-slate-300'}`}>
                                                        {isChecked && <CheckCircle2 size={14} className="text-emerald-600" />}
                                                    </div>
                                                    <span className="text-xs font-black leading-tight tracking-tight text-left">{text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {/* Konzepte */}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-4 mb-6 md:mb-8 text-slate-900">
                                        <div className="p-2.5 md:p-3 bg-purple-100 rounded-xl md:rounded-2xl text-purple-600"><GraduationCap size={20}/></div>
                                        <div className="text-left">
                                            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] block">Expertenstandards</span>
                                            <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase italic">Leitliniengerechte Konzepte</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {logic?.concepts?.map((text, idx) => {
                                            const isChecked = conceptsSelected.includes(text);
                                            return (
                                                <div key={idx} onClick={() => handleToggleItem(diag, text, 'concept', idx)} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all active:scale-95 ${isChecked ? 'bg-slate-900 border-black text-white shadow-xl shadow-black/20' : 'bg-white border-slate-100 hover:border-purple-200'}`}>
                                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${isChecked ? 'bg-white border-white' : 'bg-white border-slate-300'}`}>
                                                        {isChecked && <CheckCircle2 size={14} className="text-slate-900" />}
                                                    </div>
                                                    <span className="text-xs font-black leading-tight tracking-tight text-left">{text}</span>
                                                </div>
                                            );
                                        })}
                                        {(!logic?.concepts || logic.concepts.length === 0) && (
                                            <div className="flex flex-col items-center justify-center py-10 text-slate-300 italic text-[10px] uppercase font-bold text-center gap-3">
                                                <HelpCircle size={24} className="opacity-20" />
                                                Standard-Pflege
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DiagnosisDetails;
