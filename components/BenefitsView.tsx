import React from 'react';
import { Euro, Home, Building2, BriefcaseMedical, Armchair, ArrowRightCircle } from 'lucide-react';

interface BenefitsViewProps {
  pg: string;
}

// Data structure based on the provided PDF screenshots (2017+ Logic)
const BENEFITS_DB: Record<string, any> = {
  "PG 0": {
    money: 0, kind: 0, day: 0, station: 0,
    entlastung: 0, aids: 0, housing: 0,
    short: 0, prevent: 0, group: 0
  },
  "PG 1": {
    title: "Geringe Beeinträchtigung der Selbstständigkeit",
    money: 0, // Pflegegeld
    kind: 0, // Sachleistung
    day: 0, // Tagespflege (bzw. über Entlastungsbetrag)
    station: 125, // Zuschuss Vollstationär
    entlastung: 125, // Entlastungsbetrag
    aids: 40, // Hilfsmittel
    housing: 4000, // Wohnumfeld
    short: 0, // Kurzzeitpflege (bzw. über Entlastungsbetrag)
    prevent: 0, // Verhinderungspflege
    group: 214 // Wohngruppenzuschlag
  },
  "PG 2": {
    title: "Erhebliche Beeinträchtigung der Selbstständigkeit",
    money: 316,
    kind: 689,
    day: 689,
    station: 770,
    entlastung: 125,
    aids: 40,
    housing: 4000,
    short: 1612,
    prevent: 1612,
    group: 214
  },
  "PG 3": {
    title: "Schwere Beeinträchtigung der Selbstständigkeit",
    money: 545,
    kind: 1298,
    day: 1298,
    station: 1262,
    entlastung: 125,
    aids: 40,
    housing: 4000,
    short: 1612,
    prevent: 1612,
    group: 214
  },
  "PG 4": {
    title: "Schwerste Beeinträchtigung der Selbstständigkeit",
    money: 728,
    kind: 1612,
    day: 1612,
    station: 1775,
    entlastung: 125,
    aids: 40,
    housing: 4000,
    short: 1612,
    prevent: 1612,
    group: 214
  },
  "PG 5": {
    title: "Schwerste Beeinträchtigung mit besonderen Anforderungen",
    money: 901,
    kind: 1995,
    day: 1995,
    station: 2005,
    entlastung: 125,
    aids: 40,
    housing: 4000,
    short: 1612,
    prevent: 1612,
    group: 214
  }
};

const BenefitsView: React.FC<BenefitsViewProps> = ({ pg }) => {
  const data = BENEFITS_DB[pg] || BENEFITS_DB["PG 0"];
  
  const formatEuro = (val: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  const Card = ({ title, icon: Icon, children, colorClass }: any) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow`}>
      <div className={`px-5 py-4 border-b border-gray-100 flex items-center gap-3 ${colorClass}`}>
        <div className="p-2 bg-white/20 rounded-lg text-white">
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-white uppercase tracking-wider text-sm">{title}</h3>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );

  const Row = ({ label, value, subText }: { label: string, value: number, subText?: string }) => (
    <div className="flex justify-between items-center group">
      <div>
        <div className="text-slate-600 font-medium text-sm group-hover:text-slate-800 transition-colors">{label}</div>
        {subText && <div className="text-xs text-slate-400">{subText}</div>}
      </div>
      <div className={`font-black text-lg ${value > 0 ? 'text-[#2c3e50]' : 'text-slate-300'}`}>
        {value > 0 ? formatEuro(value) : '—'}
      </div>
    </div>
  );

  if (pg === "PG 0" || pg === "Kein PG") {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
            <Euro size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold">Kein Pflegegrad ausgewählt</h2>
            <p>Bitte wählen Sie oben rechts einen Pflegegrad aus, um die Leistungen anzuzeigen.</p>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <div className="flex items-center gap-3 mb-1">
                <span className="bg-[#f1c40f] text-[#2c3e50] px-3 py-1 rounded font-black text-sm uppercase">Aktuell gewählt</span>
                <h1 className="text-3xl font-black">{pg}</h1>
            </div>
            <p className="text-slate-300 text-sm font-medium opacity-90">{data.title}</p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Basisdaten</div>
            <div className="text-sm">Leistungskatalog Pflegeversicherung</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Ambulante Pflege */}
        <Card title="Häusliche Pflege (Monatlich)" icon={Home} colorClass="bg-[#27ae60]">
            <Row label="Pflegegeld" value={data.money} subText="Bei Pflege durch Angehörige" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Pflegesachleistung" value={data.kind} subText="Durch ambulanten Pflegedienst" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Entlastungsbetrag" value={data.entlastung} subText="Zweckgebunden (Alle PG)" />
            <div className="mt-2 bg-green-50 p-3 rounded text-xs text-green-800 border border-green-100">
                <strong>Kombi-Leistung:</strong> Pflegegeld und Sachleistung können prozentual kombiniert werden.
            </div>
        </Card>

        {/* 2. Stationär & Tagespflege */}
        <Card title="Stationär / Teilstationär" icon={Building2} colorClass="bg-[#2980b9]">
            <Row label="Tages-/Nachtpflege" value={data.day} subText="Zusätzlich zum Pflegegeld!" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Vollstationär" value={data.station} subText="Pauschaler Leistungsbetrag" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Wohngruppenzuschlag" value={data.group} subText="Ambulant betreute WG" />
        </Card>

        {/* 3. Budget / Jährlich */}
        <Card title="Jahresbudgets & Pauschalen" icon={BriefcaseMedical} colorClass="bg-[#8e44ad]">
            <Row label="Verhinderungspflege" value={data.prevent} subText="Pro Jahr (max. 6 Wochen)" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Kurzzeitpflege" value={data.short} subText="Pro Jahr (max. 8 Wochen)" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Wohnumfeld" value={data.housing} subText="Je Maßnahme (Einmalig)" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Pflegehilfsmittel" value={data.aids} subText="Zum Verbrauch (Monatlich)" />
        </Card>

      </div>

      {/* Info Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
             <ArrowRightCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
             <div>
                 <h4 className="font-bold text-blue-900 text-sm">Umwidmung möglich</h4>
                 <p className="text-xs text-blue-800 mt-1">
                    Bis zu <strong>40% der Pflegesachleistung</strong> können für anerkannte Angebote zur Unterstützung im Alltag umgewandelt werden (Umwandlungsanspruch).
                 </p>
             </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start gap-3">
             <Armchair className="text-orange-600 shrink-0 mt-0.5" size={20} />
             <div>
                 <h4 className="font-bold text-orange-900 text-sm">Verhinderungspflege Flex</h4>
                 <p className="text-xs text-orange-800 mt-1">
                    Nicht genutzte Mittel der Kurzzeitpflege können (bis zu 50%) auf die Verhinderungspflege angerechnet werden (max. 2.418 € gesamt nach altem Recht, neue Reformen beachten).
                 </p>
             </div>
        </div>
      </div>

    </div>
  );
};

export default BenefitsView;