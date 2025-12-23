
import React, { useState, useEffect } from 'react';
import { ClientData, NbaData } from '../types';
import { Calculator, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, TrendingUp, Info, MousePointer2, ClipboardCheck, ChevronRight } from 'lucide-react';

interface PgCalculatorProps {
  data: ClientData;
  onUpdate: (data: NbaData) => void;
  onAiFill: () => void;
  isAiLoading: boolean;
}

const QUESTIONS = {
    m1: ["Positionswechsel im Bett", "Halten einer stabilen Sitzposition", "Umsetzen", "Fortbewegen innerhalb des Wohnbereichs", "Treppensteigen"],
    m2: ["Erkennen von Personen", "Örtliche Orientierung", "Zeitliche Orientierung", "Erinnern an wesentliche Ereignisse", "Steuern von Alltagshandlungen", "Treffen von Entscheidungen", "Verstehen von Sachverhalten", "Erkennen von Risiken", "Mitteilen von Bedürfnissen", "Verstehen von Aufforderungen", "Beteiligen an einem Gespräch"],
    m3: ["Motorisch geprägte Verhaltensauff.", "Nächtliche Unruhe", "Selbstschädigendes Verhalten", "Beschädigen von Gegenständen", "Physisch aggressives Verhalten", "Verbale Aggression", "Andere vokale Auffälligkeiten", "Abwehr pflegerischer Maßnahmen", "Wahnvorstellungen", "Ängste", "Antriebslosigkeit / Depressiv", "Sozial inadäquate Verhaltensweisen", "Sonstige inadäquate Handlungen"],
    m4: ["Waschen vorderer Oberkörper", "Körperpflege Kopfbereich", "Waschen Intimbereich", "Duschen und Baden", "An-/Auskleiden Oberkörper", "An-/Auskleiden Unterkörper", "Mundgerechtes Zubereiten", "Essen", "Trinken", "Benutzen einer Toilette", "Bewältigen Harninkontinenz", "Bewältigen Stuhlinkontinenz", "Ernährung (Sonde/Parenteral)"],
    m6: ["Gestaltung des Tagesablaufs", "Ruhen und Schlafen", "Sich beschäftigen", "Planungen vornehmen", "Interaktion mit Personen", "Kontaktpflege"]
};

const calcWeightedM1 = (sum: number) => {
    if(sum <= 1) return 0;
    if(sum <= 3) return 2.5;
    if(sum <= 5) return 5;
    if(sum <= 9) return 7.5;
    return 10;
};

const calcWeightedM2M3 = (sumM2: number, sumM3: number) => {
    let wM2 = 0;
    if(sumM2 <= 1) wM2 = 0;
    else if(sumM2 <= 5) wM2 = 3.75;
    else if(sumM2 <= 10) wM2 = 7.5;
    else if(sumM2 <= 16) wM2 = 11.25;
    else wM2 = 15;

    let wM3 = 0;
    if(sumM3 === 0) wM3 = 0;
    else if(sumM3 <= 2) wM3 = 3.75;
    else if(sumM3 <= 4) wM3 = 7.5;
    else if(sumM3 <= 6) wM3 = 11.25;
    else wM3 = 15;

    return Math.max(wM2, wM3);
};

const calcWeightedM4 = (sum: number) => {
    if(sum <= 2) return 0;
    if(sum <= 7) return 10;
    if(sum <= 18) return 20;
    if(sum <= 36) return 30;
    return 40;
};

const calcWeightedM5 = (rawPoints: number) => {
    if(rawPoints < 1) return 0;
    if(rawPoints < 4) return 5;
    if(rawPoints < 9) return 10;
    if(rawPoints < 13) return 15;
    return 20;
};

const calcWeightedM6 = (sum: number) => {
    if(sum == 0) return 0;
    if(sum <= 3) return 3.75;
    if(sum <= 6) return 7.5;
    if(sum <= 11) return 11.25;
    return 15;
};

const getPG = (totalPoints: number) => {
    if(totalPoints < 12.5) return 0;
    if(totalPoints < 27) return 1;
    if(totalPoints < 47.5) return 2;
    if(totalPoints < 70) return 3;
    if(totalPoints < 90) return 4;
    return 5;
};

const PgCalculator: React.FC<PgCalculatorProps> = ({ data, onUpdate, onAiFill, isAiLoading }) => {
    const nba = data.nba || {
        m1: Array(5).fill(-1),
        m2: Array(11).fill(-1),
        m3: Array(13).fill(-1),
        m4: Array(13).fill(-1),
        m5: 0,
        m6: Array(6).fill(-1)
    };

    const updateModule = (mod: keyof NbaData, idx: number, val: number) => {
        if(mod === 'm5') {
            onUpdate({ ...nba, m5: val });
            return;
        }
        const arr = [...(nba[mod] as number[])];
        arr[idx] = val;
        onUpdate({ ...nba, [mod]: arr });
    };

    const sumSafe = (arr: number[]) => arr.reduce((a, b) => a + (b === -1 ? 0 : b), 0);

    const sumM1 = sumSafe(nba.m1);
    const wM1 = calcWeightedM1(sumM1);
    const sumM2 = sumSafe(nba.m2);
    const sumM3 = sumSafe(nba.m3); 
    const wM2M3 = calcWeightedM2M3(sumM2, sumM3);
    const sumM4 = sumSafe(nba.m4); 
    const wM4 = calcWeightedM4(sumM4);
    const wM5 = calcWeightedM5(nba.m5);
    const sumM6 = sumSafe(nba.m6);
    const wM6 = calcWeightedM6(sumM6);

    const totalScore = wM1 + wM2M3 + wM4 + wM5 + wM6;
    const calculatedPG = getPG(totalScore);
    const currentPGNum = parseInt(data.pg.replace(/\D/g,'')) || 0;
    const isUpgrade = calculatedPG > currentPGNum;

    const RenderModule = ({ title, code, items, options, color, badgeColor }: any) => (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-10">
            <div className={`px-8 py-5 font-black text-slate-800 bg-slate-50 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-6 rounded-full ${badgeColor}`}></div>
                    <span className="text-sm uppercase tracking-[0.2em] italic">{title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl bg-white border shadow-sm ${color} uppercase tracking-widest`}>
                        Rohpunkte: {sumSafe((nba as any)[code])}
                    </span>
                </div>
            </div>
            <div className="divide-y divide-slate-100">
                {items.map((q: string, idx: number) => {
                    const currentVal = (nba as any)[code][idx];
                    const isSelected = currentVal !== -1;
                    const selectedOption = options.find((o: any) => o.val === currentVal);
                    
                    return (
                        <div 
                            key={idx} 
                            className={`flex flex-col p-6 transition-all duration-300 ${
                                isSelected 
                                ? 'bg-blue-50/40 border-l-[6px] border-l-blue-600 shadow-inner' 
                                : 'bg-white border-l-[6px] border-l-transparent hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-4">
                                    <span className={`text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {idx+1}
                                    </span>
                                    <div className="flex flex-col flex-1">
                                        <span className={`text-[13px] font-black leading-snug tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {q}
                                        </span>
                                        {isSelected && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${badgeColor} animate-pulse`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${color} bg-white px-2 py-0.5 rounded border border-current opacity-80`}>
                                                    Gewählt: {selectedOption?.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {options.map((opt: any) => {
                                        const active = currentVal === opt.val;
                                        return (
                                            <button
                                                key={opt.val}
                                                onClick={() => updateModule(code, idx, opt.val)}
                                                className={`text-[9px] font-black p-3 rounded-xl border uppercase tracking-tighter transition-all flex flex-col items-center justify-center gap-1 text-center shadow-sm ${
                                                    active 
                                                    ? 'bg-blue-600 text-white border-blue-700 shadow-lg scale-[1.02] ring-4 ring-blue-500/10' 
                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50'
                                                }`}
                                            >
                                                <span className="opacity-60 text-[8px]">{opt.val} PKT</span>
                                                <span className="truncate w-full font-black">{opt.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-48 animate-in fade-in duration-500 px-4">
            
            <div className="bg-slate-900 rounded-[3rem] shadow-2xl p-10 text-white mb-12 relative overflow-hidden border-b-[12px] border-blue-600 mt-6">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full mb-4 uppercase tracking-[0.2em] shadow-lg">NBA Analyse System</div>
                        <h2 className="text-4xl font-black mb-4 flex items-center justify-center md:justify-start gap-5 italic tracking-tighter">
                            <Calculator size={42} className="text-blue-400" /> PFLEGEGRAD-ANALYSE
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-2xl leading-relaxed opacity-80">
                            Blaue Markierung zeigt bereits gewertete Felder. Ändern Sie Ihre Auswahl jederzeit durch Klicken auf die Buttons.
                        </p>
                    </div>
                    
                    <button 
                        onClick={onAiFill}
                        disabled={isAiLoading}
                        className="bg-blue-600 text-white hover:bg-blue-700 font-black py-5 px-12 rounded-[2rem] shadow-2xl shadow-blue-500/40 flex items-center gap-5 transition-all active:scale-95 disabled:opacity-70 text-xs uppercase tracking-widest border-b-4 border-blue-800"
                    >
                        {isAiLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={24} className="text-blue-200" />}
                        {isAiLoading ? 'Berechne...' : 'KI-Quick-Fill'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Einstufung Ist</span>
                    <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{data.pg}</span>
                </div>
                
                <div className="md:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Gewichtete Punkte</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-black italic tracking-tighter leading-none">{totalScore.toFixed(1)}</span>
                        <span className="text-blue-500 font-black text-xl italic tracking-tighter uppercase">Pkt</span>
                    </div>
                    <div className="w-full max-w-xs bg-white/10 h-2 mt-8 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{width: `${Math.min(totalScore, 100)}%`}}></div>
                    </div>
                </div>

                <div className={`p-8 rounded-[2.5rem] shadow-sm border flex flex-col items-center justify-center text-center transition-all duration-500 ${isUpgrade ? 'bg-emerald-50 border-emerald-200 ring-8 ring-emerald-500/5' : 'bg-white border-slate-200'}`}>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Prognose Soll</span>
                    <div className="flex items-center gap-4">
                        <span className={`text-5xl font-black italic tracking-tighter ${isUpgrade ? 'text-emerald-600' : 'text-slate-900'}`}>
                            PG {calculatedPG}
                        </span>
                        {isUpgrade && <TrendingUp className="text-emerald-600 animate-bounce" size={28} />}
                    </div>
                    {isUpgrade && <span className="text-[9px] font-black text-emerald-700 bg-emerald-200 px-4 py-1.5 rounded-full mt-4 uppercase tracking-widest border border-emerald-300">Upgrade möglich</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12">
                <div className="space-y-4">
                    <RenderModule 
                        title="Modul 1: Mobilität" 
                        code="m1" 
                        items={QUESTIONS.m1} 
                        color="text-blue-600"
                        badgeColor="bg-blue-600"
                        options={[{val:0, label:"Selbstständig"}, {val:1, label:"Überw. Selbst."}, {val:2, label:"Überw. Unselbst."}, {val:3, label:"Unselbstständig"}]} 
                    />
                    <RenderModule 
                        title="Modul 2: Kognition" 
                        code="m2" 
                        items={QUESTIONS.m2} 
                        color="text-purple-600"
                        badgeColor="bg-purple-600"
                        options={[{val:0, label:"Vorhanden"}, {val:1, label:"Größtenteils"}, {val:2, label:"Gering"}, {val:3, label:"Nicht vorh."}]} 
                    />
                    <RenderModule 
                        title="Modul 3: Verhalten" 
                        code="m3" 
                        items={QUESTIONS.m3} 
                        color="text-orange-600"
                        badgeColor="bg-orange-600"
                        options={[{val:0, label:"Nie"}, {val:1, label:"Selten"}, {val:3, label:"Häufig"}, {val:5, label:"Täglich"}]} 
                    />
                </div>

                <div className="space-y-4">
                    <RenderModule 
                        title="Modul 4: Selbstversorgung" 
                        code="m4" 
                        items={QUESTIONS.m4} 
                        color="text-emerald-600"
                        badgeColor="bg-emerald-600"
                        options={[{val:0, label:"Selbstständig"}, {val:1, label:"Überw. Selbst."}, {val:2, label:"Überw. Unselbst."}, {val:3, label:"Unselbstständig"}]} 
                    />
                    
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-10">
                        <div className="px-8 py-5 font-black text-slate-800 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-6 rounded-full bg-red-500"></div>
                                <span className="text-sm uppercase tracking-[0.2em] italic">Modul 5: Therapiebewältigung</span>
                            </div>
                            <span className="text-[10px] font-black px-4 py-1.5 rounded-xl bg-white border border-red-100 text-red-600 shadow-sm uppercase tracking-widest">Punkte: {nba.m5}</span>
                        </div>
                        <div className={`p-10 transition-all ${nba.m5 > 0 ? 'bg-blue-50/40 border-l-[6px] border-l-blue-600 shadow-inner' : 'bg-white border-l-[6px] border-l-transparent'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <Info size={18} className="text-blue-600" />
                                <div className="flex flex-col">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 italic">Maßnahmenfrequenz (Durchschnitt)</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-tight">Regelmäßigkeit ärztlich verordneter Maßnahmen</p>
                                </div>
                            </div>
                            <div className="relative pt-8 pb-4">
                                <input 
                                    type="range" 
                                    min="0" max="15" 
                                    value={nba.m5} 
                                    onChange={(e) => updateModule('m5', 0, parseInt(e.target.value))}
                                    className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 shadow-inner"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase mt-8 tracking-tighter">
                                    <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">0 (Kein Aufwand)</span>
                                    <div className="bg-blue-600 text-white px-6 py-2 rounded-2xl shadow-xl flex flex-col items-center -mt-2 transform hover:scale-110 transition-transform ring-4 ring-blue-500/20">
                                        <span className="text-[8px] opacity-60">SCORE</span>
                                        <span className="text-lg font-black">{nba.m5}</span>
                                    </div>
                                    <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">15 (Maximaler Aufwand)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <RenderModule 
                        title="Modul 6: Alltagsleben" 
                        code="m6" 
                        items={QUESTIONS.m6} 
                        color="text-cyan-600"
                        badgeColor="bg-cyan-600"
                        options={[{val:0, label:"Selbstständig"}, {val:1, label:"Überw. Selbst."}, {val:2, label:"Überw. Unselbst."}, {val:3, label:"Unselbstständig"}]} 
                    />
                </div>
            </div>

            <div className="mt-12 bg-blue-50/50 border-2 border-dashed border-blue-200 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 shadow-inner">
                <div className="bg-white p-5 rounded-[2rem] shadow-xl text-blue-600"><Info size={32} /></div>
                <div className="flex-1 text-center md:text-left">
                    <p className="text-[12px] font-black text-blue-900 uppercase tracking-[0.2em] mb-2">Haftungsausschluss</p>
                    <p className="text-[11px] font-bold text-blue-800/60 uppercase tracking-tight leading-relaxed">
                        Die Analyseergebnisse stellen eine Prognose dar. Nur der MD oder Medicproof ist zur rechtssicheren Einstufung befugt. Alle Eingaben können jederzeit angepasst werden.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default PgCalculator;
