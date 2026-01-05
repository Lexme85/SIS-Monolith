
import React from 'react';
import { ClientData } from '../types';
import { Activity, Brain, Heart, Bone, Stethoscope, AlertOctagon, Syringe, Crosshair, Smile, Moon, MessageCircle, FileText, CheckCircle2, UserCheck, Hash } from 'lucide-react';

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Allgemeine Stammdaten */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ring-4 ring-blue-50/50">
        <div className="bg-blue-600 px-6 py-4 font-black text-white flex items-center gap-3">
          <UserCheck size={18} /> <span className="text-[11px] uppercase tracking-wider">Klienten-Stamm</span>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Name</label>
            <input 
                type="text" 
                className="w-full p-3 border border-slate-200 rounded-xl text-sm h-11 font-bold focus:border-blue-500 outline-none transition-colors" 
                value={data.name} 
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="Name..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Geburtsdatum</label>
                <input 
                    type="date" 
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-[13px] h-11 font-bold focus:border-blue-500 outline-none" 
                    value={data.dob} 
                    onChange={(e) => onChange('dob', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Zimmer</label>
                <input 
                    type="text" 
                    className="w-full p-3 border-2 border-blue-100 bg-blue-50/30 rounded-xl text-sm h-11 font-black text-blue-900 focus:border-blue-500 outline-none" 
                    value={data.roomNumber} 
                    onChange={(e) => onChange('roomNumber', e.target.value)}
                    placeholder="Nr."
                />
              </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 font-black text-white flex items-center gap-3">
          <MessageCircle size={18} /> <span className="text-[11px] uppercase tracking-wider">Modul 1: Gespräch</span>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Partner</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white h-11 font-bold" value={data.convPartner} onChange={(e) => onChange('convPartner', e.target.value)}>
                <option value="">Wählen...</option>
                <option value="Bewohner">Bewohner allein</option>
                <option value="Angehöriger">Bewohner & Angehöriger</option>
                <option value="Betreuer">Gesetzlicher Betreuer</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Barrieren</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white h-11 font-bold" value={data.convBarriers} onChange={(e) => onChange('convBarriers', e.target.value)}>
                <option value="Nein">Keine</option>
                <option value="Ja">Ja, sprachlich</option>
                <option value="Gehör">Ja, Schwerhörigkeit</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 font-black text-slate-900 flex items-center gap-3 border-b border-slate-100">
          <FileText size={18} className="text-blue-600" /> <span className="text-[11px] uppercase tracking-wider">Individuelle Biografie</span>
        </div>
        <div className="p-4 md:p-6">
            <textarea 
                className="w-full p-4 border-2 border-slate-100 rounded-2xl text-[13px] font-medium focus:border-blue-500 outline-none min-h-[100px] transition-colors bg-slate-50"
                placeholder="Besonderheiten, Wünsche, Abneigungen..."
                value={data.masterNotes}
                onChange={(e) => onChange('masterNotes', e.target.value)}
            ></textarea>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 font-black text-white flex items-center gap-3">
            <Stethoscope size={18} className="text-blue-400" /> <span className="text-[11px] uppercase tracking-wider">Klinisches Profil</span>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(diagnoses).map(([key, list]) => (
                <div key={key} className="space-y-1.5">
                    <div className="flex items-center gap-2 font-black text-slate-400 text-[10px] uppercase border-b border-slate-100 pb-1.5 mb-3 tracking-widest">
                        {key === 'neuro' && <Brain size={12} />}
                        {key === 'cardio' && <Heart size={12} />}
                        {key === 'ortho' && <Bone size={12} />}
                        {key}
                    </div>
                    {list.map(d => {
                        const isChecked = data.diagnoses?.includes(d);
                        return (
                            <div 
                                key={d} 
                                onClick={() => onChange('diagnoses', toggleArrayItem(data.diagnoses || [], d))}
                                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer select-none active:scale-[0.97] ${isChecked ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`}
                            >
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                                    {isChecked && <CheckCircle2 size={10} className="text-white" />}
                                </div>
                                <span className={`text-[12px] font-bold leading-tight ${isChecked ? 'text-blue-900' : 'text-slate-600'}`}>{d}</span>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 overflow-hidden border-l-[10px] border-l-red-500">
        <div className="bg-red-50 px-6 py-4 font-black text-red-700 flex items-center gap-3 border-b border-red-100">
          <AlertOctagon size={18} /> <span className="text-[11px] uppercase tracking-wider">CAVE: Warnhinweise</span>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {commonCaves.map(cave => {
                const isChecked = data.cave.includes(cave);
                return (
                    <div 
                        key={cave} 
                        onClick={() => onChange('cave', toggleArrayItem(data.cave, cave))}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer active:scale-[0.95] ${isChecked ? 'bg-red-600 border-red-700 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500'}`}
                    >
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tight">{cave.replace('CAVE: ', '')}</span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default MasterData;
