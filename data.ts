
import { DbSchema, ListItem } from './types';

export const NURSING_CONCEPTS = [
    "Aktivierend-therapeutische Pflege",
    "Validation (nach Naomi Feil)",
    "Psychobiographisches Pflegemodell (Böhm)",
    "Basale Stimulation",
    "Kinästhetik",
    "Bobath-Konzept",
    "Krohwinkel (AEDL/ABEDL)",
    "Strukturmodell (SIS)",
    "Wohnbereichskonzept",
    "Palliativ-Care Ansatz"
];

export const S_SIDE = ["Rechts", "Links", "Beidseits"];
export const S_FREQ = ["Selten", "Häufig", "Ständig", "Schwankend"];
export const S_ORIENT = ["Zeitlich desorientiert", "Örtlich desorientiert", "Situativ desorientiert", "Personell desorientiert"];
export const S_MOB_DETAIL = ["Bettlägerig", "Dreht sich selbst", "Transfer Sitz-Stand", "Geht sicher", "Geht unsicher / schwankend"];
export const D_COMPETENCE = ["Selbstständig", "Nicht selbstständig", "Kompensiert"];

export const T_GEN = [
    {t:"Täglich", d:1}, {t:"Morgens", d:1}, {t:"Abends", d:1}, {t:"2x tgl.", d:1}, {t:"3x tgl.", d:1}, 
    {t:"Wöchentlich", d:7}, {t:"2x Wöchentlich", d:3}, {t:"Bei Bedarf", d:0}, {t:"Nachts", d:1}
];

export const D_MED_PREP = ["Durch PK richten", "Apotheke (Blister)", "Angehörige", "Selbstständig"];
export const D_BTM_INT = ["Alle 72 Std.", "Alle 4 Tage", "Alle 7 Tage", "Wöchentlich"];
export const D_BAG_INT = ["Alle 14 Tage", "Monatlich", "Nach Bedarf"];
export const D_MED_WHY = ["Schmerzen", "Unruhe / Angst", "Atemnot", "Übelkeit", "Einschlafstörung"];

export const D_TRANS = ["1 PK", "2 PK", "Lifter", "Rutschbrett", "Rollator", "Rollstuhl"];
export const D_WASH = ["Im Bett", "Am Waschbecken", "Duschstuhl", "Badewanne", "Waschtraining"];
export const D_TARGET = ["Mobilität", "Stabilisierung", "Heimkehr", "Wundheilung", "Schmerzfreiheit"];
export const D_DESTINATION = ["Zuhause", "Dauerpflege", "Reha", "Hospiz"];

export const DB: DbSchema = {
    tf1: {
        title: "TF 1: Kognition und Kommunikation",
        groups: [
            {
                title: "Orientierung & Verstehen",
                gateway: { question: "Kognitive Einschränkungen?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Vollständig orientiert"}, {n:"Erkennt Personen"}, {n:"Versteht komplexe Aufforderungen"}],
                r: [
                    {n:"Desorientierung", s:S_ORIENT},
                    {n:"Findet Zimmer nicht"},
                    {n:"Weglauftendenz / Hinlauftendenz"}
                ],
                s: [
                    {n:"Kommunikationsdefizit", s:["Versteht nur kurze Sätze", "Ja-Nein-Ebene", "Bedürfnisse äußern möglich", "Wortfindungsstörungen"]},
                    {n:"Herausforderndes Verhalten", s:["Nächtliche Unruhe", "Abwehr bei Pflegemaßnahmen", "Rufen/Schreien"]}
                ],
                m: [{n:"Orientierungstraining", t:T_GEN}],
                aid: [
                    {n:"Hörgerät", l:D_COMPETENCE, s:S_SIDE}, 
                    {n:"Brille", l:D_COMPETENCE}, 
                    {n:"Kommunikations-App", l:D_COMPETENCE}
                ]
            }
        ]
    },
    tf2: {
        title: "TF 2: Mobilität",
        groups: [
            {
                title: "Bewegung & Hilfsmittel",
                gateway: { question: "Beweglichkeit eingeschränkt?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Sicherer Transfer"}, {n:"Geht sicher ohne Hilfsmittel"}],
                r: [
                    {n:"Sturzgefahr", s:["Sturz i.d. letzten 6 Mon.", "Balancestörungen", "Angst zu stürzen"]},
                    {n:"Eingeschränkte Mobilität", s:S_MOB_DETAIL}
                ],
                s: [
                    {n:"Risiko-Indikator", s:["Rollator wird abgelehnt", "Rollator wird vergessen", "Hemiparese", "Tremor"]},
                    {n:"Gehfähigkeit", s:["Geht sicher", "Geht unsicher", "Geht schwankend"]}
                ],
                m: [{n:"Transfer-Hilfe", l:D_TRANS, t:T_GEN}],
                aid: [
                    {n:"Rollator (wird genutzt)", l:D_COMPETENCE}, 
                    {n:"Rollstuhl (manuell)", l:D_COMPETENCE, s:["Aktiv fahrbar", "Wird geschoben"]}, 
                    {n:"E-Rollstuhl", l:D_COMPETENCE},
                    {n:"Gehstock", l:D_COMPETENCE}
                ]
            }
        ]
    },
    tf3: {
        title: "TF 3: Krankheitsbezogene Anforderungen",
        groups: [
            {
                title: "Medikation & Symptome",
                tag: "treatment",
                gateway: { question: "Hilfe bei Therapie?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Nimmt Medikamente selbstständig"}],
                s: [
                    {n:"Belastende Symptome", s:["Chronische Schmerzen", "Akute Schmerzen", "Luftnot Ruhe", "Luftnot Belastung", "Schwindel", "Übelkeit"]},
                    {n:"Hautzustand", s:["Intakt", "Pergamenthaut", "Hämatomneigung", "Bestehende Wunde"]}
                ],
                m: [
                    {n:"Medikamentengabe", s:["Braucht Erinnerung (Anreichen)", "Muss verabreicht werden", "Schluckstörungen bei Tabletten"]},
                    {n:"Wundversorgung", t:T_GEN, isDateRelevant: true}
                ],
                aid: [
                    {n:"Inhalationsgerät", l:D_COMPETENCE}, 
                    {n:"BZ-Messgerät", l:D_COMPETENCE}, 
                    {n:"CPAP-Maske", l:D_COMPETENCE},
                    {n:"Insulin-Pen", l:D_COMPETENCE}
                ]
            }
        ]
    },
    tf4: {
        title: "TF 4: Selbstversorgung",
        groups: [
            {
                title: "Hygiene & Ernährung",
                gateway: { question: "Hilfe bei SV?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Oberkörper selbstständig"}, {n:"Isst selbstständig"}, {n:"Trinkmenge ausreichend"}],
                r: [
                    {n:"Inkontinenz (Risikofeld)", s:["Kontinent", "Harninkontinenz", "Stuhlinkontinenz", "Spürt Drang", "Nutzt Vorlage selbstständig", "Nutzt Vorlage NICHT selbstständig"]},
                    {n:"Ernährungsrisiko", s:["BMI niedrig", "Trinkmenge zu wenig", "Appetitlosigkeit"]}
                ],
                s: [
                    {n:"Körperpflege Bedarf", s:["Überwiegend selbstständig", "Anleitung/Impuls", "Teilübernahme", "Vollständige Übernahme"]},
                    {n:"Ernährung Hilfe", s:["Muss kleingeschnitten werden", "Muss angereicht werden"]}
                ],
                m: [{n:"Ganzkörperwaschung", l:D_WASH, t:T_GEN}],
                aid: [
                    {n:"Duschstuhl", l:D_COMPETENCE}, 
                    {n:"Toilettensitzerhöhung", l:D_COMPETENCE}, 
                    {n:"Tellerranderhöhung", l:D_COMPETENCE},
                    {n:"Spezialbesteck / Trinkhilfe", l:D_COMPETENCE}
                ]
            }
        ]
    },
    tf5: {
        title: "TF 5: Soziales & Schlaf",
        groups: [
            {
                title: "Tagesstruktur & Interaktion",
                gateway: { question: "Probleme?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Sucht Kontakt"}, {n:"Feste Rituale (Mittagsschlaf/TV)"}, {n:"Nimmt aktiv an Gruppen teil"}],
                s: [
                    {n:"Sozialverhalten", s:["Rückzugstendenz / Einzelgänger", "Sucht Kontakt", "Konfliktfreudig", "Regelmäßiger Besuch"]},
                    {n:"Tagesstruktur", s:["Nimmt aktiv teil", "Braucht Motivation/Abholung", "Nimmt passiv teil"]}
                ],
                m: [{n:"Motivation / Begleitung", t:T_GEN}],
                aid: [{n:"Lichtwecker / Orientierungslicht", l:D_COMPETENCE}]
            }
        ]
    },
    tf6: {
        title: "TF 6: Kurzzeitpflege & Entlassmanagement",
        groups: [
            {
                title: "Ziele der Kurzzeitpflege",
                gateway: { question: "Individuelle Ziele definiert?", posLabel: "Ja", negLabel: "Nein" },
                res: [
                    {n:"Hohe Eigenmotivation zur Reha"}, 
                    {n:"Rückkehrwille ausgeprägt"},
                    {n:"Stabile soziale Unterstützung"}
                ],
                r: [
                    {n:"Risiko: Heimverbleib droht", s:["Soziale Isolation", "Wohnung nicht barrierefrei", "Überlastung Angehörige"]},
                    {n:"Risiko: Re-Hospitalisierung", s:["Instabiler AZ", "Unzureichende Compliance"]}
                ],
                s: [
                    {n:"Hauptziel der Aufnahme", s:D_TARGET},
                    {n:"Geplante Destination", s:D_DESTINATION}
                ],
                m: [
                    {n:"Zielvereinbarungsgespräch", t:T_GEN},
                    {n:"Aktivierende Reha-Pflege", t:T_GEN}
                ]
            },
            {
                title: "Entlassmanagement & Überleitung",
                gateway: { question: "Entlassmanagement aktiv?", posLabel: "Ja", negLabel: "Nein" },
                res: [
                    {n:"Hilfsmittel zu Hause vorhanden"},
                    {n:"Pflegedienst bereits involviert"}
                ],
                s: [
                    {n:"Überleitungs-Status", s:["Medikationsplan aktuell", "Entlassbericht liegt vor", "Arzttermine vereinbart", "Transportschein vorh."]},
                    {n:"Häusliche Barrieren", s:["Treppen ohne Lift", "Bad nicht barrierefrei", "Kein Telefon/Notruf"]}
                ],
                m: [
                    {n:"Hilfsmittel-Anforderung", t:T_GEN},
                    {n:"Schulung der Angehörigen", t:T_GEN},
                    {n:"Rezeptanforderung (Med/HM)", t:T_GEN}
                ],
                aid: [
                    {n:"Hausnotruf-System", l:D_COMPETENCE},
                    {n:"Pflegebett (Häuslich)", l:D_COMPETENCE}
                ]
            }
        ]
    },
    matrix: {
        title: "Risikomatrix",
        groups: [
            { 
                title: "Risiken", 
                r: [
                    {n:"Dekubitus"}, {n:"Sturz"}, {n:"Schmerz"}, {n:"Harninkontinenz"}, {n:"Stuhlinkontinenz"},
                    {n:"Mangelernährung"}, {n:"Exsikkose"}, {n:"Aspiration"}, {n:"Kontraktur"}, {n:"Thrombose"},
                    {n:"Pneumonie"}, {n:"Intertrigo"}, {n:"Eigengefährdung"}, {n:"Herausforderndes Verhalten"},
                    {n:"Hinlauftendenz"}, {n:"Schlafstörung"}, {n:"Soziale Isolation"}, {n:"Wundheilungsstörung"}, {n:"Infektionsrisiko"}
                ] 
            }
        ]
    }
};
