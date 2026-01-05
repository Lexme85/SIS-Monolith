
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
export const D_COMPETENCE = ["Selbstständig", "Anleitung/Aufsicht", "Teilübernahme", "Vollübernahme"];
export const D_TRANS = ["1 PK", "2 PK", "Lifter", "Aufstehhilfe", "Rutschbrett"];

export const T_GEN = [
    {t:"Täglich", d:1}, {t:"Morgens", d:1}, {t:"Abends", d:1}, {t:"2x tgl.", d:1}, {t:"3x tgl.", d:1}, 
    {t:"Wöchentlich", d:7}, {t:"2x Wöchentlich", d:3}, {t:"Bei Bedarf", d:0}, {t:"Nachts", d:1}
];

export const D_CHANGE_INT = [
    {t:"Alle 14 Tage", d:14}, {t:"Alle 4 Wochen", d:28}, {t:"Alle 6 Wochen", d:42}, {t:"Alle 3 Monate", d:90}
];

export const D_STOMA_INT = [
    {t:"Täglich", d:1}, {t:"Alle 2 Tage", d:2}, {t:"Alle 3 Tage", d:3}, {t:"Wöchentlich", d:7}
];

const S_ADVICE = ["Beratung erfolgt", "Infomaterial ausgehändigt", "Angehörige einbezogen", "Beratung abgelehnt"];

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
                title: "Vitalwerte & Monitoring",
                gateway: { question: "Regelmäßige Kontrollen nötig?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Überwacht Vitalwerte selbstständig"}, {n:"Führt BZ-Tagebuch"}],
                s: [
                    {n:"Blutdruck-Status", s:["Stabil", "Hypertonie", "Hypotonie", "Schwankend"]},
                    {n:"Blutzucker-Status", s:["Stabil", "Instabil", "Hypoglykämie-Neigung", "Hyperglykämie-Neigung"]},
                    {n:"Gewichtsentwicklung", s:["Stabil", "Abnahme (unfreiwillig)", "Zunahme (Ödeme)"]}
                ],
                m: [
                    {n:"Blutdruckmessung", t:T_GEN},
                    {n:"Blutzuckermessung", t:T_GEN},
                    {n:"Gewichtskontrolle", t:[{t:"Wöchentlich", d:7}, {t:"Monatlich", d:30}]}
                ]
            },
            {
                title: "Schmerz & Symptomlast",
                gateway: { question: "Schmerzen oder belastende Symptome?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Kann Schmerz äußern"}, {n:"Bedarfsmedikation wirkt gut"}],
                r: [{n:"Chronisches Schmerzsyndrom"}, {n:"Durchbruchschmerz"}],
                s: [
                    {n:"Schmerzcharakter", s:["Stechend", "Brennend", "Dumpf", "Pulsierend", "Einschießend"]},
                    {n:"Schmerzlokalisation", s:["Rücken", "Extremitäten", "Abdomen", "Kopf", "Gelenke"]},
                    {n:"Andere Symptome", s:["Atemnot in Ruhe", "Atemnot bei Belastung", "Schwindel / Übelkeit", "Juckreiz"]}
                ],
                m: [
                    {n:"Schmerzassessment", t:[{t:"Täglich", d:1}, {t:"Bei Bedarf", d:0}]},
                    {n:"Bedarfsmedikation (Gabe)", l:["Schmerzen", "Unruhe", "Atemnot"], t:T_GEN}
                ]
            },
            {
                title: "Wunden & Hautintegrität",
                gateway: { question: "Hautdefekte oder Wunden vorhanden?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Haut intakt / Reizfrei"}, {n:"Gute Wundheilungstendenz"}],
                r: [{n:"Hautrisiko", s:["Pergamenthaut", "Hämatomneigung", "Ödeme", "Dekubitus-Risiko"]}],
                s: [
                    {n:"Wundart", s:["Dekubitus (I-IV)", "Ulcus Cruris", "OP-Wunde", "Hautläsion / Riss"]},
                    {n:"Wundstatus", s:["Granulierend", "Fibrinös", "Nekrotisch", "Infiziert / Belegt"]}
                ],
                m: [
                    {n:"Wundversorgung", t:T_GEN, isDateRelevant: true},
                    {n:"Kompressionstherapie", s:S_SIDE, t:T_GEN},
                    {n:"Hautpflege (medizinisch)", t:T_GEN}
                ]
            },
            {
                title: "Medikation & Injektionen",
                gateway: { question: "Unterstützung bei Medikamenten?", posLabel: "Nein", negLabel: "Ja" },
                res: [{n:"Kennt Wirkung der Medikamente"}, {n:"Compliance vorhanden"}],
                s: [
                    {n:"Einnahme-Barrieren", s:["Schluckstörung", "Abwehr / Verweigerung", "Vergisst Einnahme"]},
                    {n:"Applikationsform", s:["Oral", "Inhalativ", "Transdermal (Pflaster)", "Sondengabe"]}
                ],
                m: [
                    {n:"Richten der Medikation", l:["Durch PK", "Apotheke", "Angehörige"], t:[{t:"Wöchentlich", d:7}]},
                    {n:"Verabreichen der Medikation", t:T_GEN},
                    {n:"Injektion (s.c.)", s:["Insulin", "Heparin", "Bedarf"], t:T_GEN}
                ]
            },
            {
                title: "Technik & Spezialtherapien",
                gateway: { question: "Medizinische Technik im Einsatz?", posLabel: "Nein", negLabel: "Ja" },
                aid: [
                    {n:"Sauerstoff-Versorgung", l:D_COMPETENCE, s:["Nasenbrille", "Maske", "Konzentrator"], isOxygen: true},
                    {n:"Absauggerät", l:D_COMPETENCE},
                    {n:"Port-System / Infusion", l:D_COMPETENCE, isDateRelevant: true, t:D_CHANGE_INT},
                    {n:"Blasenkatheter (DK)", l:D_COMPETENCE, isDateRelevant: true, t:D_CHANGE_INT},
                    {n:"Dialyse-Shunt", l:D_COMPETENCE, s:S_SIDE}
                ],
                m: [
                    {n:"Sauerstoffgabe", s:["Dauerhaft", "Bei Bedarf"], t:T_GEN, isOxygen: true},
                    {n:"PEG-Verbandswechsel", t:D_CHANGE_INT, isDateRelevant: true},
                    {n:"Pflege nach Therapie", s:["Physiotherapie", "Ergotherapie", "Logopädie"], t:T_GEN}
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
                    {n:"Inkontinenz (Risikofeld)", s:["Kontinent", "Harninkontinenz", "Stuhlinkontinenz", "Spürt Drang", "Nutzt Vorlage selbstständig"]},
                    {n:"Ernährungsrisiko", s:["BMI niedrig", "Trinkmenge zu wenig", "Appetitlosigkeit"]}
                ],
                s: [
                    {n:"Körperpflege Bedarf", s:["Überwiegend selbstständig", "Anleitung/Impuls", "Teilübernahme", "Vollständige Übernahme"]},
                    {n:"Ernährung Hilfe", s:["Muss kleingeschnitten werden", "Muss angereicht werden"]}
                ],
                m: [{n:"Ganzkörperwaschung", l:["Im Bett", "Waschbecken", "Dusche"], t:T_GEN}],
                aid: [
                    {n:"Duschstuhl", l:D_COMPETENCE}, 
                    {n:"Toilettensitzerhöhung", l:D_COMPETENCE}, 
                    {n:"Tellerranderhöhung", l:D_COMPETENCE}
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
        title: "TF 6: Häuslichkeit & Hauswirtschaft",
        groups: [
            {
                title: "Kurzzeitpflege & Entlassmanagement",
                gateway: { question: "Aufenthalt zeitlich begrenzt?", posLabel: "Ja", negLabel: "Nein" },
                res: [{n:"Ziele weitgehend erreicht"}, {n:"Angehörige unterstützen Planung"}],
                s: [
                    {n:"Ziele des Aufenthalts", l:["In Arbeit", "Teilweise erreicht", "Erreicht"], s:["Stabilisierung", "Mobilisation", "Schmerzreduktion", "Entlastung Angehörige", "Diagnostische Abklärung"]},
                    {n:"Weitere Planung / Ziel", l:["Zuhause", "Reha", "Hospiz", "Stationär"], s:["Alleinlebend", "Pflegedienst nötig", "Wundversorgung nötig", "Palliativversorgung"]},
                    {n:"Entlassfähigkeit", s:["Stabil", "Transportfähigkeit gegeben", "Hilfsmittel geliefert", "Medikation gesichert"]}
                ],
                m: [
                    {n:"Überleitungsgespräch führen", t:T_GEN},
                    {n:"Hilfsmittel für Zuhause bestellen", isDateRelevant: true},
                    {n:"Pflegedienst-Übergabe organisieren", t:T_GEN},
                    {n:"Entlassbrief & Medikationsplan prüfen", isDateRelevant: true},
                    {n:"Angehörige schulen (Transfer/Pflege)", t:T_GEN}
                ],
                aid: [{n:"Mobiler Notruf (Home)", l:D_COMPETENCE}, {n:"Pflegebett (Home)", l:D_COMPETENCE}]
            }
        ]
    },
    matrix: {
        title: "Risikomatrix",
        groups: [
            { 
                title: "Risiko-Screening & Beratung", 
                r: [
                    {n:"Sturz", s:S_ADVICE, isDateRelevant: true},
                    {n:"Dekubitus", s:S_ADVICE, isDateRelevant: true},
                    {n:"Schmerz", s:S_ADVICE, isDateRelevant: true},
                    {n:"Harninkontinenz", s:S_ADVICE, isDateRelevant: true},
                    {n:"Mangelernährung", s:S_ADVICE, isDateRelevant: true},
                    {n:"Exsikkose", s:S_ADVICE, isDateRelevant: true},
                    {n:"Aspiration", s:S_ADVICE, isDateRelevant: true},
                    {n:"Kontraktur", s:S_ADVICE, isDateRelevant: true},
                    {n:"Thrombose", s:S_ADVICE, isDateRelevant: true},
                    {n:"Pneumonie", s:S_ADVICE, isDateRelevant: true},
                    {n:"Eigengefährdung", s:S_ADVICE, isDateRelevant: true}
                ] 
            }
        ]
    }
};
