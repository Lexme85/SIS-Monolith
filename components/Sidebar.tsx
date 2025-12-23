
import React from 'react';
import { SelectionState, ClientData } from '../types';
import { LOGIC_DB } from '../logicData';
import { Euro, Calculator, Database, ClipboardList, ShieldAlert, UserCheck, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSwitch: (view: string) => void;
  selections: SelectionState;
  clientData: ClientData;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSwitch, selections, clientData, className = "" }) => {
  
  const getTotalDeficitCount = (prefix: string) => {
    let count = Object.keys(selections).filter(key => key.startsWith(prefix) && selections[key].checked).length;
    if (clientData && clientData.diagnoses) {
        clientData.diagnoses.forEach(diag => {
            const selectedSymptoms = clientData.diagnosisSymptomSelection[diag] || [];
            const logicEntry = LOGIC_DB[diag];
            if (logicEntry && logicEntry.specificItems) {
                const matchingItems = logicEntry.specificItems.filter(item => 
                    item.tf === prefix && selectedSymptoms.includes(item.text)
                );
                count += matchingItems.length;
            }
        });
    }
    return count;
  };

  const NavItem = ({ view, label, prefix, icon: Icon }: { view: string, label: string, prefix?: string, icon?: any }) => {
    const active = currentView === view;
    const count = prefix ? getTotalDeficitCount(prefix) : 0;
    const hasDeficits = count > 0;
    
    return (
      <div 
        onClick={() => onSwitch(view)}
        className={`px-6 py-4 cursor-pointer transition-all flex justify-between items-center group ${
          active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        } ${active ? 'rounded-xl mx-3' : ''}`}
      >
        <div className="flex items-center gap-3">
            {Icon && <Icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />}
            <span className={`text-[15px] font-semibold tracking-tight`}>{label}</span>
        </div>
        
        {prefix && hasDeficits && (
          <span className={`text-[12px] py-0.5 px-2.5 rounded-md font-bold ${active ? 'bg-white text-blue-600' : 'bg-red-500 text-white shadow-sm'}`}>
             {count}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`w-[280px] bg-slate-900 flex flex-col shrink-0 overflow-y-auto h-full border-r border-slate-800 ${className}`}>
      <div className="py-8">
        <div className="px-6 text-[11px] uppercase text-slate-500 font-bold tracking-[0.2em] mb-4">Basisdaten</div>
        <NavItem view="master" label="Stammdaten" icon={UserCheck} />
        <NavItem view="diagDetails" label="Diagnose-Details" icon={Database} />
      </div>

      <div className="flex-1">
        <div className="px-6 text-[11px] uppercase text-slate-500 font-bold tracking-[0.2em] mb-4">Themenfelder (SIS)</div>
        <NavItem view="tf1" label="TF 1: Kognition" prefix="tf1" icon={ClipboardList} />
        <NavItem view="tf2" label="TF 2: Mobilität" prefix="tf2" icon={ClipboardList} />
        <NavItem view="tf3" label="TF 3: Krankheit" prefix="tf3" icon={ClipboardList} />
        <NavItem view="tf4" label="TF 4: Selbstvers." prefix="tf4" icon={ClipboardList} />
        <NavItem view="tf5" label="TF 5: Soziales" prefix="tf5" icon={ClipboardList} />
        <NavItem view="tf6" label="TF 6: Entlassung" prefix="tf6" icon={ClipboardList} />
        
        <div className="mt-4">
           <NavItem view="careGuide" label="Pflege-Spickzettel" icon={Zap} />
        </div>

        <div className="mt-8 mb-4 px-6 text-[11px] uppercase text-slate-500 font-bold tracking-[0.2em]">Expertenstandards</div>
        <NavItem view="matrix" label="Risikomatrix" prefix="matrix" icon={ShieldAlert} />
        <NavItem view="calculator" label="PG-Rechner" icon={Calculator} />
        <NavItem view="benefits" label="Leistungsanspruch" icon={Euro} />
      </div>

      <div className="p-6 border-t border-slate-800">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Monolith Professional v3.5</div>
      </div>
    </div>
  );
};

export default Sidebar;
