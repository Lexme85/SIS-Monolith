
import React from 'react';
import { ClientData } from '../types';
import { BrainCircuit, MessageSquareText, Sparkles, HeartHandshake, Smile, Info } from 'lucide-react';

interface PsychologicalAssessmentProps {
  data: ClientData;
  onChange: (field: 'psychAnswers', value: Record<string, string>) => void;
}

const PSYCH_QUESTIONS = [
  { id: 'q1', label: 'Stimmungslage', q: 'Wie würden Sie Ihre aktuelle Grundstimmung beschreiben (z.B. optimistisch, bedrückt, wechselhaft)?', icon: <Smile size={18}/> },
  { id: 'q2', label: 'Einsamkeit', q: 'Fühlen Sie sich in Ihrem Alltag oft allein oder isoliert, auch wenn Menschen um Sie herum sind?', icon: <MessageSquareText size={18}/> },
  { id: 'q3', label: 'Autonomie', q: 'Haben Sie das Gefühl, noch die Kontrolle über wichtige Entscheidungen in Ihrem Leben zu haben?', icon: <HeartHandshake size={18}/> },
  { id: 'q4', label: 'Antrieb & Freude', q: 'Gibt es Dinge oder Tätigkeiten, auf die Sie sich im Laufe des Tages wirklich freuen?', icon: <Sparkles size={18}/> },
  { id: 'q5', label: 'Resilienz', q: 'Wie gehen Sie emotional mit körperlichen Rückschritten oder neuen Einschränkungen um?', icon: <BrainCircuit size={18}/> },
  { id: 'q6', label: 'Sicherheit & Sorgen', q: 'Fühlen Sie sich nachts sicher, oder plagen Sie Sorgen, die Sie nicht zur Ruhe kommen lassen?', icon: <Info size={18}/> },
  { id: 'q7', label: 'Selbstwert', q: 'Haben Sie das Gefühl, für andere Menschen in Ihrem Umfeld noch eine Bedeutung zu haben?', icon: <Smile size={18}/> },
  { id: 'q8', label: 'Ängste', q: 'Welche Ängste beeinflussen Ihren Alltag am meisten (z.B. Sturzangst, Angst vor Abhängigkeit)?', icon: <Info size={18}/> },
  { id: 'q9', label: 'Anpassungsfähigkeit', q: 'Wie leicht fällt es Ihnen, sich auf neue Situationen oder neue Gesichter in der Pflege einzustellen?', icon: <MessageSquareText size={18}/> },
  { id: 'q10', label: 'Gehör finden', q: 'Haben Sie das Gefühl, dass Ihre Wünsche und Bedürfnisse von Angehörigen und Personal wirklich gehört werden?', icon: <HeartHandshake size={18}/> }
];

const PsychologicalAssessment: React.FC<PsychologicalAssessmentProps> = ({ data, onChange }) => {
  const handleChange = (id: string, val: string) => {
    onChange('psychAnswers', { ...data.psychAnswers, [id]: val });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1200px] mx-auto pb-40 px-4">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl text-white border-b-[12px] border-indigo-500 relative overflow-hidden mt-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-2xl">
            <BrainCircuit size={40} />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">Psychosoziales Assessment</h2>
            <p className="text-[11px] font-black text-indigo-300 mt-4 uppercase tracking-[0.3em]">Tiefergehende Analyse für die KI-gestützte Pflegeplanung</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PSYCH_QUESTIONS.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col group">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">{item.label}</h3>
            </div>
            <p className="text-sm font-bold text-slate-500 mb-4 leading-relaxed">{item.q}</p>
            <textarea 
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none min-h-[100px] transition-all"
              placeholder="Antwort oder Beobachtung hier eintragen..."
              value={data.psychAnswers[item.id] || ''}
              onChange={(e) => handleChange(item.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-8 rounded-[3rem] flex gap-6 items-center">
        <div className="bg-white p-4 rounded-2xl text-indigo-600 shadow-sm"><Sparkles size={24}/></div>
        <p className="text-indigo-900 text-[11px] font-bold uppercase leading-relaxed tracking-wide">
          Diese Antworten helfen der KI, psychosoziale Risiken (z.B. Depression, soziale Isolation) zu erkennen und diese in das <span className="text-indigo-600">Themenfeld 5</span> sowie den <span className="text-indigo-600">Maßnahmenplan</span> einfließen zu lassen.
        </p>
      </div>
    </div>
  );
};

export default PsychologicalAssessment;
