
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MasterData from './components/MasterData';
import TopicField from './components/TopicField';
import RiskMatrixView from './components/RiskMatrixView';
import DiagnosisDetails from './components/DiagnosisDetails';
import PsychologicalAssessment from './components/PsychologicalAssessment';
import BenefitsView from './components/BenefitsView';
import PgCalculator from './components/PgCalculator';
import CareGuideView from './components/CareGuideView';
import ArchiveView from './components/ArchiveView';
import Modal from './components/Modal';
import { SelectionState, ClientData, ItemSelection, NbaData } from './types';
import { DB } from './data';
import { LOGIC_DB } from './logicData';
import { FileText, Menu, X, Save } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const EXPIRATION_DATE = new Date('2026-01-30T23:59:59');

const getInitialClientData = (): ClientData => ({
  name: '', dob: '', roomNumber: '', fieldB: '', pg: 'PG 0',
  repName: '', repType: 'Keine Vertretung', repScope: 'Wirkungskreis: Gesundheit',
  proxyStatus: 'Nicht vorhanden', proxyScope: 'Umfang: Gesundheit & Aufenthalt', proxyStorage: 'Aufbewahrung: Akte',
  livingWill: 'Keine', livingWillStorage: 'Hinterlegt: Akte',
  evalDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
  allergies: [], allergyFood: 'Nüsse', cave: [],
  diagnoses: [],
  diagnosisSymptomSelection: {},
  diagnosisMeasureSelection: {},
  diagnosisConceptSelection: {},
  masterNotes: '',
  tfNotes: { tf1: '', tf2: '', tf3: '', tf4: '', tf5: '', tf6: '' },
  psychAnswers: {},
  convPartner: '', convAtmosphere: '', convBarriers: 'Nein', convBarrierDetail: '',
  nba: {
    m1: Array(5).fill(-1),
    m2: Array(11).fill(-1),
    m3: Array(13).fill(-1),
    m4: Array(13).fill(-1),
    m5: 0,
    m6: Array(6).fill(-1)
  }
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
  const [archive, setArchive] = useState<any[]>([]);

  useEffect(() => {
    const checkExpiry = () => { if (new Date() > EXPIRATION_DATE) setIsExpired(true); };
    checkExpiry();
    const interval = setInterval(checkExpiry, 3600000);
    const savedArchive = localStorage.getItem('sis_monolith_archive');
    if (savedArchive) setArchive(JSON.parse(savedArchive));
    return () => clearInterval(interval);
  }, []);

  const saveToArchive = () => {
    if (!clientData.name) {
        alert("Bitte geben Sie einen Namen ein, bevor Sie speichern.");
        return;
    }
    const newEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        clientData,
        selections,
        generatedDocs
    };
    const updatedArchive = [newEntry, ...archive.filter(item => item.clientData.name !== clientData.name || item.clientData.dob !== clientData.dob)];
    setArchive(updatedArchive);
    localStorage.setItem('sis_monolith_archive', JSON.stringify(updatedArchive));
    alert("Fall erfolgreich im Archiv gespeichert.");
  };

  const loadFromArchive = (entry: any) => {
    setClientData(entry.clientData);
    setSelections(entry.selections);
    setGeneratedDocs(entry.generatedDocs);
    setCurrentView('master');
  };

  const deleteFromArchive = (id: string) => {
    const updatedArchive = archive.filter(item => item.id !== id);
    setArchive(updatedArchive);
    localStorage.setItem('sis_monolith_archive', JSON.stringify(updatedArchive));
  };

  const getItemById = (id: string) => {
    if (id.startsWith('diag_')) {
        const parts = id.split('_');
        const diagName = parts[1];
        const idx = parseInt(parts[2]);
        const logic = LOGIC_DB[diagName];
        if (logic && logic.specificItems) {
            return { n: logic.specificItems[idx].n, type: 'stat' };
        }
        return null;
    }
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
    
    Object.entries(selections).forEach(([id, sel]) => {
      const selectionItem = sel as ItemSelection;
      if (!selectionItem.checked) return;
      const item = getItemById(id);
      if (!item) return;

      let detailStr = `- ${item.n}`;
      if (selectionItem.detailVal) detailStr += `: ${selectionItem.detailVal}`;
      if (selectionItem.subTags?.length) detailStr += ` [${selectionItem.subTags.join(', ')}]`;
      
      if (id.includes('_act_')) measPoints.push(detailStr);
      else sisPoints.push(detailStr);
    });

    setGeneratedDocs({ 
      sis: sisPoints.join('\n'), 
      meas: measPoints.join('\n'), 
      guide: generatedDocs.guide
    });
    setModalOpen(true);
  };

  const handleEnhance = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      alert("Fehler: Kein API-Key gefunden. Bitte prüfen Sie die Umgebungsvariablen.");
      return;
    }

    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      let contextStr = `KONTEXT-DATEN:
      Klient: ${clientData.name}
      Zimmer: ${clientData.roomNumber}
      Pflegegrad: ${clientData.pg}
      Diagnosen: ${(clientData.diagnoses || []).join(', ')}
      Biografie: ${clientData.masterNotes}
      Individuelle Notizen: ${JSON.stringify(clientData.tfNotes)}
      
      GEWÄHLTE PFLEGE-ASPEKTE:
      `;
      
      Object.entries(selections).forEach(([id, sel]) => {
          const s = sel as ItemSelection;
          if(s.checked) {
              const item = getItemById(id);
              if(item) {
                  const tfName = id.split('_')[0].toUpperCase();
                  contextStr += `[${tfName}] ${item.n} | ${s.detailVal || ''} | ${(s.subTags || []).join(', ')}\n`;
              }
          }
      });

      const prompt = `DU BIST DER 'SIS MONOLITH' - DER GOLD-STANDARD DER PFLEGEDOKUMENTATION.
      ERSTELLE EINE DETAILLIERTE DOKUMENTATION. NUTZE KEINEN BLOCKTEXT.
      
      STRUKTUR-VORGABEN:
      1. NUTZE KEINE Markdown-Sonderzeichen wie Sternchen (*).
      2. Trenne die Themenfelder durch Marker ###TF1### bis ###TF6###.
      3. Schreibe in kurzen, prägnanten Sätzen.
      
      ABSCHNITT 1: [[SIS]]
      ###TF1###
      ...
      ###TF2###
      ...
      ###TF3###
      ...
      ###TF4###
      ...
      ###TF5###
      ...
      ###TF6###
      ...
      
      ABSCHNITT 2: [[MASSNAHMEN]]
      ...
      
      ABSCHNITT 3: [[SPICKZETTEL]]
      FOKUS: ...
      KOMMUNIKATION: ...
      GEFAHREN: ...
      HILFSMITTEL: ...
      RITUALE: ...
      
      DATENBASIS:
      ${contextStr}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
      });
      
      const rawText = response.text || '';
      const parseText = rawText.replace(/\*/g, '');

      const sisMatch = parseText.match(/\[\[SIS\]\]([\s\S]*?)(?=\[\[|$)/i);
      const measMatch = parseText.match(/\[\[MASSNAHMEN\]\]([\s\S]*?)(?=\[\[|$)/i);
      const guideMatch = parseText.match(/\[\[SPICKZETTEL\]\]([\s\S]*?)(?=\[\[|$)/i);
      
      setGeneratedDocs({ 
        sis: (sisMatch ? sisMatch[1].trim() : 'Fehler bei SIS-Generierung'), 
        meas: (measMatch ? measMatch[1].trim() : 'Fehler bei Maßnahmen-Generierung'), 
        guide: (guideMatch ? guideMatch[1].trim() : generatedDocs.guide) 
      });
    } catch (e: any) { 
      console.error("AI Error Details:", e);
      if (e.message?.includes("Requested entity was not found") && (window as any).aistudio) {
          alert("Ihr API-Key scheint nicht für dieses Modell berechtigt zu sein oder ist abgelaufen. Bitte wählen Sie einen gültigen Key aus.");
          (window as any).aistudio.openSelectKey();
      } else {
          alert("KI-Fehler: " + (e.message || "Unbekannter Fehler bei der Verarbeitung.")); 
      }
    } finally { 
      setIsAiLoading(false); 
    }
  };

  const handleAiFillCalculator = async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return;
      setIsAiLoading(true);
      try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `Analysiere folgende Patientendaten und fülle die NBA-Module (0-3 Skala, außer Modul 3 und 5) aus.
          Daten: ${JSON.stringify(selections)}
          Diagnosen: ${clientData.diagnoses.join(', ')}`;

          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: [{ parts: [{ text: prompt }] }],
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
                          m6: { type: Type.ARRAY, items: { type: Type.INTEGER } }
                      },
                      required: ["m1", "m2", "m3", "m4", "m5", "m6"]
                  }
              }
          });
          const result = JSON.parse(response.text);
          setClientData(prev => ({ ...prev, nba: result }));
      } catch (e: any) { 
          console.error("Calculator AI Error:", e);
          alert("KI-Rechner Fehler: " + (e.message || "Verarbeitung fehlgeschlagen."));
      } finally { setIsAiLoading(false); }
  };

  const handleUpdateSelection = (id: string, updates: Partial<ItemSelection>) => {
    setSelections(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleClientUpdate = (field: keyof ClientData, value: any) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };

  if (isExpired) return <div className="p-20 text-center font-black text-slate-400">ABGELAUFEN</div>;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-slate-100">
      <header className="bg-slate-900 text-white px-6 py-4 md:px-8 md:py-5 flex justify-between items-center z-20 shrink-0 border-b border-white/5 no-print">
        <div className="flex items-center gap-4 md:gap-6">
            <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase italic">SIS <span className="text-blue-500">MONOLITH</span></h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right hidden sm:block">
                <span className="block text-[10px] font-black uppercase text-blue-400 leading-none">{clientData.name || 'Neuer Klient'}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{clientData.roomNumber ? `Zimmer ${clientData.roomNumber}` : 'Keine Zimmernr.'}</span>
            </div>
            <select className="bg-slate-800 text-white px-2 py-1 md:px-3 rounded text-xs border border-slate-700 font-bold" value={String(clientData.pg)} onChange={(e) => handleClientUpdate('pg', e.target.value)}>
                {["PG 0", "PG 1", "PG 2", "PG 3", "PG 4", "PG 5"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          currentView={currentView} 
          onSwitch={(v) => { setCurrentView(v); setMobileMenuOpen(false); }} 
          selections={selections} 
          clientData={clientData} 
          className={`${mobileMenuOpen ? 'flex absolute inset-0 z-30' : 'hidden'} lg:flex no-print`} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-12 pb-32 md:pb-36 print:p-0 print:overflow-visible print:bg-white">
            {currentView === 'master' && <MasterData data={clientData} onChange={handleClientUpdate} />}
            {currentView === 'diagDetails' && <DiagnosisDetails data={clientData} selections={selections} onChange={handleClientUpdate} onUpdateSelection={handleUpdateSelection} />}
            {currentView === 'psychAssessment' && <PsychologicalAssessment data={clientData} onChange={(f, v) => handleClientUpdate(f, v)} />}
            {currentView === 'matrix' && <RiskMatrixView selections={selections} onUpdate={handleUpdateSelection} clientData={clientData} />}
            {currentView === 'calculator' && <PgCalculator data={clientData} onUpdate={(nba) => handleClientUpdate('nba', nba)} onAiFill={handleAiFillCalculator} isAiLoading={isAiLoading} />}
            {currentView === 'benefits' && <BenefitsView pg={clientData.pg} />}
            {currentView === 'careGuide' && <CareGuideView guideText={generatedDocs.guide} isLoading={isAiLoading} onGenerate={handleEnhance} />}
            {currentView === 'archive' && <ArchiveView archive={archive} onLoad={loadFromArchive} onDelete={deleteFromArchive} />}
            
            {['tf1','tf2','tf3','tf4','tf5','tf6'].includes(currentView) && (
              <TopicField 
                viewId={currentView} 
                selections={selections} 
                onUpdate={handleUpdateSelection} 
                clientData={clientData}
                note={clientData.tfNotes[currentView]}
                onNoteChange={(v) => handleClientUpdate('tfNotes', {...clientData.tfNotes, [currentView]: v})}
              />
            )}
        </main>
      </div>

      <footer className="bg-white border-t p-4 md:p-6 flex justify-center gap-2 md:gap-4 z-20 no-print">
        <button onClick={saveToArchive} className="bg-slate-100 text-slate-600 px-4 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-slate-200 flex items-center gap-2 md:gap-4 active:scale-95 transition-transform border border-slate-200">
            <Save size={18} /> <span className="hidden sm:inline">Entwurf Speichern</span><span className="sm:hidden">Sichern</span>
        </button>
        <button onClick={generateRawDocs} className="bg-blue-600 text-white px-6 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-blue-700 flex items-center gap-2 md:gap-4 shadow-xl active:scale-95 transition-transform">
            <FileText size={18} /> <span className="hidden sm:inline">Dokumentation erstellen</span><span className="sm:hidden">Export</span>
        </button>
      </footer>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} sisText={generatedDocs.sis} measText={generatedDocs.meas} guideText={generatedDocs.guide} onEnhance={handleEnhance} isAiLoading={isAiLoading} />
    </div>
  );
};

export default App;
