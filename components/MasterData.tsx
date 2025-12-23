
import React from 'react';
import { ClientData } from '../types';
import { Activity, Brain, Heart, Bone, Stethoscope, AlertOctagon, Syringe, Crosshair, Smile, Moon, MessageCircle, AlertCircle, Square, CheckCircle2 } from 'lucide-react';

interface MasterDataProps {
  data: ClientData;
  onChange: (field: keyof ClientData, value: any) => void;
}

const MasterData: React.FC<MasterDataProps> = ({ data, onChange }) => {
  const toggleArrayItem = (array: string[], item: string): string[] => {
    if (array.includes(item)) return array.filter(i => i !== item);
    return [...array, item];
  };

  const commonCaves = [
    "CAVE: Herzschrittmacher", "CAVE: Shunt (Dialyse/VP)", "CAVE: BTM-Pflicht",
    "CAVE: Insulinpflicht", "CAVE: Epilepsie", "CAVE: Blutverdünner"
  ];

  const diagnoses = {
      neuro: ["Apoplex (Schlaganfall)", "Demenz (Alzheimer/Vaskulär)", "Morbus Parkinson", "Multiple Sklerose (MS)", "Epilepsie", "Wesensveränderung", "Polyneuropathie"],
      psyche: ["Rezidivierende depressive Störung", "Angst- und Panikstörung", "Schizophrenie", "Bipolare Störung", "Sucht / Abhängigkeit", "Borderline-Störung"],
      sleep: ["Insomnie (Schlafstörung)", "Schlafapnoe-Syndrom", "Restless-Legs-Syndrom (RLS)"],
      cardio: ["Arterielle Hypertonie", "Herzinsuffizienz (Global/NYHA)", "Vorhofflimmern (Arrhythmie)", "KHK (Koronare Herzkrankheit)", "pAVK (Durchblutungsstörung)", "Ulcus cruris venosum"],
      ortho: ["Z.n. Schenkelhalsfraktur", "Hüft-TEP (Implantation)", "Knie-TEP (Implantation)", "Z.n. Amputation (Gliedmaßen)", "Osteoporose", "Rheumatoide Arthritis", "Spinalkanalstenose", "Bandscheibenvorfall (LWS/HWS)"],
      meta: ["Diabetes Mellitus Typ 1", "Diabetes Mellitus Typ 2", "Chronische Niereninsuffizienz (CNI)", "Leberzirrhose", "Gicht (Hyperurikämie)", "Adipositas"],
      onco: ["Onkologie / Palliativ (Allgemein)", "Mammakarzinom", "Bronchialkarzinom", "Kolorektales Karzinom", "Prostatakarzinom", "Pankreaskarzinom"],
      resp: ["COPD", "Pneumonie (Aktuell/Z.n.)", "Asthma Bronchiale", "Tracheostoma"],
      devices: ["PEG-Sonde", "Dauerkatheter (Transurethral)", "Suprapubischer Katheter (SPK)", "Stoma (Colo-/Ileostoma)"],
      other: ["Harninkontinenz", "Inkontinenz (Stuhl)", "Harnwegsinfekt (HWI)", "Dekubitus", "Reduzierter Allgemeinzustand (Red. AZ)", "Glaukom / Blindheit", "MRSA / Infektion"]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 font-black text-white flex items-center gap-3">
          <MessageCircle size={20} /> <span className="text-[12px] uppercase tracking-wider">Modul 1: Gesprächssituation</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 tracking-widest">Gesprächspartner</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white h-12 font-bold" value={data.convPartner} onChange={(e) => onChange('convPartner', e.target.value)}>
                <option value="">Wählen...</option>
                <option value="Bewohner">Bewohner allein</option>
                <option value="Angehöriger">Bewohner & Angehöriger</option>
                <option value="Betreuer">Gesetzlicher Betreuer</option>
                <option value="Pflegekraft">Pflegekraft allein</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 tracking-widest">Atmosphäre</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white h-12 font-bold" value={data.convAtmosphere} onChange={(e) => onChange('convAtmosphere', e.target.value)}>
                <option value="">Wählen...</option>
                <option value="Offen">Offen und kooperativ</option>
                <option value="Verschlossen">Verschlossen / Zurückhaltend</option>
                <option value="Kognitiv">Kognitiv eingeschränkt</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase mb-2 tracking-widest">Barrieren</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white h-12 font-bold" value={data.convBarriers} onChange={(e) => onChange('convBarriers', e.target.value)}>
                <option value="Nein">Keine</option>
                <option value="Ja">Ja, sprachlich</option>
                <option value="Gehör">Ja, Schwerhörigkeit</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 font-black text-white flex items-center gap-3">
            <Stethoscope size={20} className="text-blue-400" /> <span className="text-[12px] uppercase tracking-wider">Diagnosen & Vorerkrankungen</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(diagnoses).map(([key, list]) => (
                <div key={key} className="space-y-2">
                    <div className="flex items-center gap-3 font-black text-slate-400 text-[11px] uppercase border-b-2 border-slate-100 pb-2 mb-4 tracking-widest">
                        {key === 'neuro' && <Brain size={14} />}
                        {key === 'cardio' && <Heart size={14} />}
                        {key === 'ortho' && <Bone size={14} />}
                        {key === 'psyche' && <Smile size={14} />}
                        {key === 'sleep' && <Moon size={14} />}
                        {key === 'meta' && <Activity size={14} />}
                        {key === 'onco' && <Crosshair size={14} />}
                        {key === 'resp' && <Activity size={14} />}
                        {key === 'devices' && <Syringe size={14} />}
                        {key === 'other' && <Activity size={14} />}
                        {key}
                    </div>
                    {list.map(d => {
                        const isChecked = data.diagnoses?.includes(d);
                        return (
                            <div 
                                key={d} 
                                onClick={() => onChange('diagnoses', toggleArrayItem(data.diagnoses || [], d))}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] ${isChecked ? 'bg-blue-50 border-2 border-blue-100 shadow-sm' : 'hover:bg-slate-50 border-2 border-transparent'}`}
                            >
                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                                    {isChecked && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <span className={`text-[13px] font-black leading-tight tracking-tight ${isChecked ? 'text-blue-900 italic' : 'text-slate-600'}`}>{d}</span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 overflow-hidden border-l-[12px] border-l-red-500">
        <div className="bg-red-50 px-6 py-4 font-black text-red-700 flex items-center gap-3 border-b border-red-100">
          <AlertOctagon size={20} /> <span className="text-[12px] uppercase tracking-wider">CAVE: Medizinische Warnhinweise</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {commonCaves.map(cave => {
                const isChecked = data.cave.includes(cave);
                return (
                    <div 
                        key={cave} 
                        onClick={() => onChange('cave', toggleArrayItem(data.cave, cave))}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98] ${isChecked ? 'bg-red-600 border-red-700 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-red-50'}`}
                    >
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 ${isChecked ? 'bg-white border-white' : 'bg-white border-slate-300'}`}>
                            {isChecked && <CheckCircle2 size={14} className="text-red-600" />}
                        </div>
                        <span className="text-[12px] font-black uppercase tracking-widest">{cave.replace('CAVE: ', '')}</span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default MasterData;
