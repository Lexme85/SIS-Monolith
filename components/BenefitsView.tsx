
import React from 'react';
import { Euro, Home, Building2, BriefcaseMedical, Armchair, ArrowRightCircle, Printer } from 'lucide-react';

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
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow print:shadow-none print:border-slate-300 print-break-avoid`}>
      <div className={`px-5 py-4 border-b border-gray-100 flex items-center gap-3 ${colorClass}`}>
        <div className="p-2 bg-white/20 rounded-lg text-white no-print">
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-white uppercase tracking-wider text-sm print:text-slate-900 print:font-black">{title}</h3>
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
        {subText && <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{subText}</div>}
      </div>
      <div className={`font-black text-base md:text-lg ${value > 0 ? 'text-[#2c3e50]' : 'text-slate-300'}`}>
        {value > 0 ? formatEuro(value) : '—'}
      </div>
    </div>
  );

  if (pg === "PG 0" || pg === "Kein PG") {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 px-6 text-center">
            <Euro size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold">Kein Pflegegrad ausgewählt</h2>
            <p className="text-sm mt-2">Bitte wählen Sie oben rechts einen Pflegegrad aus, um die Leistungen anzuzeigen.</p>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 px-2 md:px-4">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-6 print:bg-white print:text-slate-900 print:border-slate-200 print:shadow-none">
        <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="bg-[#f1c40f] text-[#2c3e50] px-3 py-1 rounded font-black text-xs uppercase shadow-sm no-print">Details für</span>
                <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">{pg}</h1>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-90">{data.title}</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="text-right hidden md:block no-print">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Rechtsanspruch</div>
                <div className="text-xs font-bold">Katalog Pflegekasse</div>
            </div>
            <button onClick={() => window.print()} className="bg-slate-800 p-3 md:p-4 rounded-xl text-white hover:bg-slate-700 no-print">
                <Printer size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 print:grid-cols-3">
        
        {/* 1. Ambulante Pflege */}
        <Card title="Häusliche Pflege" icon={Home} colorClass="bg-emerald-600 print:bg-white">
            <Row label="Pflegegeld" value={data.money} subText="Bei Eigen-Pflege" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Pflegesachleistung" value={data.kind} subText="Pflegedienst" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Entlastungsbetrag" value={data.entlastung} subText="Alle PG" />
        </Card>

        {/* 2. Stationär & Tagespflege */}
        <Card title="Teil-/Vollstationär" icon={Building2} colorClass="bg-blue-600 print:bg-white">
            <Row label="Tages-/Nachtpflege" value={data.day} subText="Zusätzlich zum Geld" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Vollstationär" value={data.station} subText="Heim-Zuschuss" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Wohngruppenzuschlag" value={data.group} subText="WG-Option" />
        </Card>

        {/* 3. Budget / Jährlich */}
        <Card title="Jahresbudgets" icon={BriefcaseMedical} colorClass="bg-purple-600 print:bg-white">
            <Row label="Verhinderungspflege" value={data.prevent} subText="6 Wochen/Jahr" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Kurzzeitpflege" value={data.short} subText="8 Wochen/Jahr" />
            <div className="border-t border-gray-100 my-1"></div>
            <Row label="Pflegehilfsmittel" value={data.aids} subText="Verbrauchsgüter" />
        </Card>

      </div>

      {/* Info Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
             <ArrowRightCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
             <div>
                 <h4 className="font-black text-blue-900 text-xs uppercase tracking-tight">Umwandlungsanspruch</h4>
                 <p className="text-[10px] font-medium text-blue-800 mt-1 leading-relaxed">
                    Bis zu 40% der Pflegesachleistung können für anerkannte Alltags-Unterstützungen genutzt werden.
                 </p>
             </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-3">
             <Armchair className="text-orange-600 shrink-0 mt-0.5" size={18} />
             <div>
                 <h4 className="font-black text-orange-900 text-xs uppercase tracking-tight">Kombi-Leistung</h4>
                 <p className="text-[10px] font-medium text-orange-800 mt-1 leading-relaxed">
                    Pflegegeld und Pflegesachleistung sind im Verhältnis flexibel kombinierbar.
                 </p>
             </div>
        </div>
      </div>

    </div>
  );
};

export default BenefitsView;
