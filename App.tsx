
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MasterData from './components/MasterData';
import TopicField from './components/TopicField';
import RiskMatrixView from './components/RiskMatrixView';
import DiagnosisDetails from './components/DiagnosisDetails';
import BenefitsView from './components/BenefitsView';
import PgCalculator from './components/PgCalculator';
import CareGuideView from './components/CareGuideView';
import Modal from './components/Modal';
import { SelectionState, ClientData, ItemSelection, NbaData } from './types';
import { DB } from './data';
import { FileText, Menu, X } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const EXPIRATION_DATE = new Date('2025-12-31T23:59:59');

const getInitialClientData = (): ClientData => ({
  name: '', dob: '', fieldB: '', pg: 'PG 0',
  repName: '', repType: 'Keine Vertretung', repScope: 'Wirkungskreis: Gesundheit',
  proxyStatus: 'Nicht vorhanden', proxyScope: 'Umfang: Gesundheit & Aufenthalt', proxyStorage: 'Aufbewahrung: Akte',
  livingWill: 'Keine', livingWillStorage: 'Hinterlegt: Akte',
  evalDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  allergies: [], allergyFood: 'Nüsse', cave: [],
  diagnoses: [],
  diagnosisSymptomSelection: {},
  diagnosisMeasureSelection: {},
  diagnosisConceptSelection: {},
  convPartner: '', convAtmosphere: '', convBarriers: 'Nein', convBarrierDetail: ''
});

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('master');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selections, setSelections] = useState<SelectionState>({});
  const [clientData, setClientData] = useState<ClientData>(getInitialClientData());
  const [modalOpen, setModalOpen] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState({ sis: '', meas: '', guide: '' });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiry = () => { if (new Date() > EXPIRATION_DATE) setIsExpired(true); };
    checkExpiry();
    const interval = setInterval(checkExpiry, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getItemById = (id: string) => {
    const parts = id.split('_');
    if (parts.length < 4) return null;
    const tfKey = parts[0];
    const gIdx = parseInt(parts[1].substring(1));
    const type = parts[2];
    const idx = parseInt(parts[3]);
    const group = DB[tfKey]?.groups[gIdx];
    if (!group) return null;
    const listMap: any = { risk: 'r', stat: 's', act: 'm', res: 'res', aid: 'aid' };
    return group[listMap[type]]?.[idx];
  };

  const generateRawDocs = () => {
    let sisPoints: string[] = [];
    let measPoints: string[] = [];
    
    const diagStr = (clientData.diagnoses || []).join(', ') || 'Keine angegeben';
    const caveStr = (clientData.cave || []).join(', ') || 'Keine';

    sisPoints.push(`KLIENT: ${clientData.name || 'Unbekannt'}`);
    sisPoints.push(`DIAGNOSEN: ${diagStr}`);
    sisPoints.push(`CAVE: ${caveStr}`);

    Object.entries(selections).forEach(([id, sel]) => {
      const selectionItem = sel as ItemSelection;
      if (!selectionItem.checked || id.endsWith('_gateway')) return;
      const item = getItemById(id);
      if (!item) return;
      const type = id.split('_')[2];
      const tfName = id.split('_')[0].toUpperCase();
      let detailStr = `- [${tfName}] ${item.n}`;
      if (selectionItem.subTags && selectionItem.subTags.length > 0) detailStr += ` | Details: ${selectionItem.subTags.join(', ')}`;
      if (selectionItem.detailVal) detailStr += ` | Status: ${selectionItem.detailVal}`;
      
      if (type === 'act') measPoints.push(detailStr);
      else sisPoints.push(detailStr);
    });

    setGeneratedDocs(prev => ({ ...prev, sis: sisPoints.join('\n'), meas: measPoints.join('\n') }));
    setModalOpen(true);
  };

  const handleEnhance = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const diagStr = (clientData.diagnoses || []).join(', ');
      const caveStr = (clientData.cave || []).join(', ');

      let contextStr = `KLIENT: ${clientData.name}\nDIAGNOSEN: ${diagStr}\nCAVE: ${caveStr}\n\nEingaben aus der Erhebung:\n`;
      Object.entries(selections).forEach(([id, sel]) => {
          const s = sel as ItemSelection;
          if(s.checked) {
              const item = getItemById(id);
              if(item) contextStr += `- ${item.n} (${(s.subTags || []).join(', ')}) ${s.detailVal || ''}\n`;
          }
      });

      const prompt = `
        Erstelle eine professionelle SIS (Strukturierte Informationssammlung) und einen daraus resultierenden Maßnahmenplan.
        
        STRENGE REGELN FÜR DEN SCHREIBSTIL:
        1. NUTZE KEINE ICH-FORM (nicht "Ich möchte", nicht "Ich kann").
        2. NUTZE KEINE WÖRTLICHE REDE (keine Zitate des Klienten).
        3. NUTZE PROFESSIONELLE PFLEGEFACHSPRACHE (narrativ, beschreibend, objektiv).
        4. Schreibe in der dritten Person (z.B. "Der Klient benötigt...", "Es besteht eine Gefährdung hinsichtlich...") oder unpersönlich.
        5. Fokus auf Ressourcen und konkrete Defizite.

        STRUKTUR DER ANTWORT (NUTZE DIESE TRENNER):
        1. NARRATIVE SIS:
           Formuliere für jedes Themenfeld (TF1-TF6) einen zusammenhängenden fachlichen Text basierend auf den Eingaben.
        
        ###MAẞNAHMEN###
        2. MAẞNAHMENPLAN:
           Leite aus den Erkenntnissen der SIS konkrete, zielgerichtete pflegerische Interventionen ab.
        
        ###SPICKZETTEL###
        3. PFLEGE-SPICKZETTEL (Kurzinfos für die Schicht):
           GEFAHR/CAVE:
           VITAL & MEDIS:
           HILFSMITTEL:
           KOMMUNIKATION:
           RESSOURCEN:

        DATENKONTEXT:
        ${contextStr}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.1 }
      });
      
      const text = response.text || '';
      const parts = text.split('###MAẞNAHMEN###');
      const sisPart = parts[0]?.trim();
      const rest = parts[1] || '';
      const subParts = rest.split('###SPICKZETTEL###');
      
      const finalDocs = { 
        sis: sisPart || 'Fehler beim Generieren der SIS.', 
        meas: subParts[0]?.trim() || 'Fehler beim Generieren der Maßnahmen.',
        guide: subParts[1]?.trim() || 'Fehler beim Generieren des Spickzettels.'
      };
      setGeneratedDocs(finalDocs);
    } catch (error) {
      console.error("AI Error:", error);
      alert("KI-Dienst momentan nicht erreichbar.");
    } finally { setIsAiLoading(false); }
  };

  const handleAiFillNba = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const diagStr = (clientData.diagnoses || []).join(', ');
      let contextStr = `Klient: ${clientData.name}\nDiagnosen: ${diagStr}\nSIS-Einträge:\n`;
      Object.entries(selections).forEach(([id, sel]) => {
          const s = sel as ItemSelection;
          if(s.checked) {
              const item = getItemById(id);
              if(item) contextStr += `- ${item.n}: ${(s.subTags || []).join(', ')} ${s.detailVal || ''}\n`;
          }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analysiere den Klienten für den Pflegegrad (NBA). Gib NUR ein valides JSON Objekt zurück.
        Schema: { "m1": [5], "m2": [11], "m3": [13], "m4": [13], "m5": 0, "m6": [6] }
        Kontext:\n${contextStr}`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    m1: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    m2: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    m3: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    m4: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    m5: { type: Type.INTEGER },
                    m6: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                }
            }
        }
      });

      const rawText = response.text || '{}';
      const cleanJsonStr = rawText.replace(/```json|```/gi, '').trim();
      const resJson = JSON.parse(cleanJsonStr);
      
      if (resJson.m1) {
          handleClientUpdate('nba', resJson);
          alert("KI-Analyse für NBA abgeschlossen.");
      }
    } catch (error) {
      console.error("NBA AI Error:", error);
      alert("Fehler bei der NBA-Analyse.");
    } finally { setIsAiLoading(false); }
  };

  const handleUpdateSelection = (id: string, updates: Partial<ItemSelection>) => {
    setSelections(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleClientUpdate = (field: keyof ClientData, value: any) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };

  if (isExpired) return <div className="p-20 text-center font-black text-slate-400">TESTPHASE BEENDET</div>;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-slate-100 font-sans">
      <header className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center z-20 shrink-0 border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
            <button className="lg:hidden p-3 hover:bg-white/10 rounded-2xl transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <div className="flex flex-col">
              <h1 className="m-0 text-xl font-black tracking-tighter uppercase flex items-center gap-3 italic">
                SIS <span className="text-blue-500">MONOLITH</span> <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded-lg font-black not-italic border border-blue-500/20 tracking-widest">PRO V3.5</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{clientData.name || 'Dokumentation läuft...'}</span>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Einstufung:</span>
                <span className="text-sm font-black text-blue-400">{clientData.pg}</span>
            </div>
            <select 
              className="bg-slate-800 text-white px-4 py-2 rounded-xl font-black border border-slate-700 text-xs shadow-inner focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={String(clientData.pg)} 
              onChange={(e) => handleClientUpdate('pg', e.target.value)}
            >
                {["PG 0", "PG 1", "PG 2", "PG 3", "PG 4", "PG 5"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {mobileMenuOpen && (
            <div className="absolute inset-0 z-30 flex">
                <Sidebar currentView={currentView} onSwitch={(v) => { setCurrentView(v); setMobileMenuOpen(false); }} selections={selections} clientData={clientData} className="flex h-full shadow-2xl" />
                <div className="flex-1 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            </div>
        )}
        <Sidebar currentView={currentView} onSwitch={setCurrentView} selections={selections} clientData={clientData} className="hidden lg:flex h-full" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-12 pb-36">
            <div className="max-w-[1600px] mx-auto">
                {currentView === 'master' && <MasterData data={clientData} onChange={handleClientUpdate} />}
                {currentView === 'matrix' && <RiskMatrixView selections={selections} onUpdate={handleUpdateSelection} clientData={clientData} />}
                {currentView === 'diagDetails' && <DiagnosisDetails data={clientData} selections={selections} onChange={handleClientUpdate} onUpdateSelection={handleUpdateSelection} />}
                {currentView === 'benefits' && <BenefitsView pg={String(clientData.pg)} />}
                {currentView === 'calculator' && <PgCalculator data={clientData} onUpdate={(nba) => handleClientUpdate('nba', nba)} onAiFill={handleAiFillNba} isAiLoading={isAiLoading} />}
                {currentView === 'careGuide' && <CareGuideView guideText={generatedDocs.guide} onGenerate={handleEnhance} isLoading={isAiLoading} />}
                {['tf1','tf2','tf3','tf4','tf5','tf6'].includes(currentView) && <TopicField key={currentView} viewId={currentView} selections={selections} onUpdate={handleUpdateSelection} clientData={clientData} />}
            </div>
        </main>
      </div>

      <footer className="bg-white border-t p-6 flex justify-between items-center z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] safe-area-pb">
        <div className="hidden sm:flex items-center gap-5 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200 shadow-inner">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Nächste Evaluation:</span>
            <input type="date" className="bg-transparent font-black text-slate-800 outline-none text-xs" value={String(clientData.evalDate)} onChange={(e) => handleClientUpdate('evalDate', e.target.value)} />
        </div>
        <button onClick={generateRawDocs} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-700 flex items-center gap-4 shadow-2xl shadow-blue-500/40 transition-all active:scale-95 text-[11px]">
            <FileText size={22} /> 
            <span>Dokumentation erstellen</span>
        </button>
      </footer>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        sisText={generatedDocs.sis} 
        measText={generatedDocs.meas} 
        guideText={generatedDocs.guide}
        onEnhance={handleEnhance} 
        isAiLoading={isAiLoading} 
      />
    </div>
  );
};

export default App;
