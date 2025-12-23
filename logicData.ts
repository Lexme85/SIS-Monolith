
export interface SpecificItem {
    text: string;
    tf: 'tf1' | 'tf2' | 'tf3' | 'tf4' | 'tf5' | 'tf6';
}

export interface RecommendedAid {
    name: string;
    note: string;
}

export interface LogicEntry {
    specificItems: SpecificItem[];
    matrix: string[];
    measures: string[];
    concepts?: string[]; 
    recommendedAids?: RecommendedAid[];
}

export const LOGIC_DB: Record<string, LogicEntry> = {
    // --- NEUROLOGIE ---
    "Apoplex (Schlaganfall)": {
        specificItems: [
            { text: "Hemiparese / Lähmung", tf: 'tf2' },
            { text: "Aphasie / Sprachstörung", tf: 'tf1' },
            { text: "Dysphagie (Schluckstörung)", tf: 'tf3' },
            { text: "Vernachlässigung (Neglect)", tf: 'tf1' }
        ],
        matrix: ["Sturz", "Kontraktur", "Dekubitus", "Aspiration", "Thrombose"],
        measures: ["Bobath-Lagerung", "Schlucktraining", "Unterstützung beim Einkleiden"],
        concepts: ["Bobath-Konzept", "Kinästhetik"]
    },
    "Demenz (Alzheimer/Vaskulär)": {
        specificItems: [
            { text: "Desorientierung", tf: 'tf1' },
            { text: "Erkennt Personen nicht", tf: 'tf1' },
            { text: "Weglauftendenz / Hinlauftendenz", tf: 'tf1' },
            { text: "Nächtliche Unruhe", tf: 'tf1' }
        ],
        matrix: ["Eigengefährdung", "Hinlauftendenz", "Sturz", "Herausforderndes Verhalten"],
        measures: ["Validation nach Feil", "Biografiearbeit", "Tagesstruktur"],
        concepts: ["Validation", "Böhm-Modell"]
    },
    "Morbus Parkinson": {
        specificItems: [
            { text: "Rigor / Freezing", tf: 'tf2' },
            { text: "Tremor (Zittern)", tf: 'tf2' },
            { text: "Hypomimie (Maskengesicht)", tf: 'tf1' },
            { text: "Kleinschrittiges Gangbild", tf: 'tf2' }
        ],
        matrix: ["Sturz", "Aspiration", "Kontraktur", "Schlafstörung"],
        measures: ["Medikamente exakt nach Plan", "Gehtraining", "Logopädie", "Einsatz von Anti-Freezing-Techniken"]
    },
    "Multiple Sklerose (MS)": {
        specificItems: [
            { text: "Fatigue (Erschöpfung)", tf: 'tf5' },
            { text: "Spastik", tf: 'tf2' },
            { text: "Sensibilitätsstörungen", tf: 'tf1' },
            { text: "Sehstörungen", tf: 'tf1' }
        ],
        matrix: ["Dekubitus", "Sturz", "Harninkontinenz", "Schmerz"],
        measures: ["Kühlende Waschungen", "Physiotherapie", "IK-Management", "Ressourcenorientierte Tagesplanung"]
    },
    "Epilepsie": {
        specificItems: [
            { text: "Gefahr von Krampfanfällen", tf: 'tf3' },
            { text: "Aura-Wahrnehmung", tf: 'tf1' }
        ],
        matrix: ["Sturz", "Eigengefährdung"],
        measures: ["Anfallsprotokoll führen", "Sicherheit im Bad/Bett gewährleisten", "Bedarfsmedikation bereitstellen"]
    },
    "Polyneuropathie": {
        specificItems: [
            { text: "Kribbeln/Brennen in Füßen", tf: 'tf3' },
            { text: "Taubheitsgefühl", tf: 'tf1' },
            { text: "Gleichgewichtsstörung", tf: 'tf2' }
        ],
        matrix: ["Sturz", "Dekubitus", "Infektionsrisiko"],
        measures: ["Regelmäßige Fußinspektion", "Vermeidung von Hitze/Kälte-Extremen", "Sturzprävention"]
    },

    // --- KARDIOLOGIE & GEFÄẞE ---
    "Herzinsuffizienz (Global/NYHA)": {
        specificItems: [
            { text: "Dyspnoe (Atemnot)", tf: 'tf3' },
            { text: "Ödeme (Beine/Lunge)", tf: 'tf3' },
            { text: "Belastungsintoleranz", tf: 'tf2' }
        ],
        matrix: ["Thrombose", "Exsikkose", "Pneumonie", "Dekubitus"],
        measures: ["Tägl. Gewichtskontrolle", "Atemerleichternde Lagerung", "Flüssigkeitsbilanz", "Kompressionstherapie"]
    },
    "Arterielle Hypertonie": {
        specificItems: [
            { text: "Schwindel bei Belastung", tf: 'tf3' },
            { text: "Kopfschmerz", tf: 'tf3' }
        ],
        matrix: ["Sturz"],
        measures: ["Blutdruckkontrolle", "Salzarme Kost", "Medikamenten-Compliance fördern"]
    },
    "Vorhofflimmern (Arrhythmie)": {
        specificItems: [
            { text: "Herzstolpern", tf: 'tf3' },
            { text: "Erhöhte Blutungsneigung", tf: 'tf3' }
        ],
        matrix: ["Thrombose", "Sturz"],
        measures: ["Puls-Kontrolle", "Überwachung Gerinnungshemmer (Marcumar/DOAK)", "CAVE: Sturzfolge-Blutung"]
    },
    "pAVK (Durchblutungsstörung)": {
        specificItems: [
            { text: "Claudicatio (Schaufensterkrankheit)", tf: 'tf2' },
            { text: "Kühle Extremitäten", tf: 'tf3' }
        ],
        matrix: ["Schmerz", "Infektionsrisiko", "Dekubitus"],
        measures: ["Gehtraining", "Wattepolsterung der Zehen", "Keine engen Strümpfe"]
    },

    // --- RESPIRATORISCH ---
    "COPD": {
        specificItems: [
            { text: "Produktiver Husten", tf: 'tf3' },
            { text: "Luftnot bei Belastung", tf: 'tf2' },
            { text: "Angst bei Atemnot", tf: 'tf1' }
        ],
        matrix: ["Pneumonie", "Aspiration", "Mangelernährung"],
        measures: ["Inhalation", "Lippenbremse", "VATI-Lagerung", "Atemerleichternde Sitzpositionen"]
    },

    // --- STOFFWECHSEL ---
    "Diabetes Mellitus Typ 2": {
        specificItems: [
            { text: "Wundheilungsstörung", tf: 'tf3' },
            { text: "Gefahr Hyper-/Hypoglykämie", tf: 'tf3' },
            { text: "Sensibilitätsstörung Füße", tf: 'tf2' }
        ],
        matrix: ["Wundheilungsstörung", "Infektionsrisiko", "Dekubitus"],
        measures: ["BZ-Kontrolle", "Fußinspektion", "Ernährungsplan", "Hautpflege mit harnstoffhaltigen Cremes"]
    },
    "Chronische Niereninsuffizienz (CNI)": {
        specificItems: [
            { text: "Juckreiz (Pruritus)", tf: 'tf3' },
            { text: "Oligurie (wenig Urin)", tf: 'tf4' }
        ],
        matrix: ["Exsikkose", "Hautdefekt"],
        measures: ["Trinkmengenbeschränkung (falls verordnet)", "Eiweißarme Kost", "Spezielle Hautpflege"]
    },

    // --- ORTHOPÄDIE ---
    "Rheumatoide Arthritis": {
        specificItems: [
            { text: "Morgensteifigkeit", tf: 'tf2' },
            { text: "Gelenkschmerzen", tf: 'tf3' },
            { text: "Deformierte Handgelenke", tf: 'tf4' }
        ],
        matrix: ["Schmerz", "Sturz", "Kontraktur"],
        measures: ["Wärmeanwendungen", "Gelenkschutz-Training", "Bewegungsübungen", "Einsatz von Griffverdickungen"]
    },
    "Osteoporose": {
        specificItems: [
            { text: "Frakturgefahr", tf: 'tf2' },
            { text: "Rundrücken (Kyphose)", tf: 'tf2' }
        ],
        matrix: ["Sturz", "Schmerz"],
        measures: ["Kalziumreiche Kost", "Bewegungsförderung", "Hüftprotektoren nutzen"]
    },
    "Z.n. Schenkelhalsfraktur": {
        specificItems: [
            { text: "Schonhaltung", tf: 'tf2' },
            { text: "Angst vor erneutem Sturz", tf: 'tf1' }
        ],
        matrix: ["Sturz", "Kontraktur", "Thrombose"],
        measures: ["Mobilisation mit Gehhilfe", "Schmerzmanagement", "Kräftigungsübungen"]
    },

    // --- PSYCHE ---
    "Rezidivierende depressive Störung": {
        specificItems: [
            { text: "Antriebslosigkeit", tf: 'tf5' },
            { text: "Interessenverlust", tf: 'tf5' },
            { text: "Schlafstörung", tf: 'tf5' }
        ],
        matrix: ["Soziale Isolation", "Mangelernährung", "Schlafstörung"],
        measures: ["Gesprächsangebote", "Motivation zur Gruppenteilnahme", "Tagesstrukturplan"]
    },

    // --- SPEZIALTHEMEN (INKONTINENZ etc.) ---
    "Harninkontinenz": {
        specificItems: [
            { text: "Unwillkürlicher Harnabgang", tf: 'tf4' },
            { text: "Dranginkontinenz", tf: 'tf4' },
            { text: "Nächtliches Einnässen", tf: 'tf4' }
        ],
        matrix: ["Harninkontinenz", "Dekubitus", "Sturz", "Infektionsrisiko"],
        measures: ["Toilettentraining (Intervall-Gänge)", "Wechsel von Inkontinenzmaterial", "Hautschutz (Barrierecreme)", "Flüssigkeitsaufnahme am Tag fördern"]
    },
    "Inkontinenz (Stuhl)": {
        specificItems: [
            { text: "Stuhlabgang unkontrolliert", tf: 'tf4' },
            { text: "Stuhlschmieren", tf: 'tf4' }
        ],
        matrix: ["Stuhlinkontinenz", "Dekubitus", "Infektionsrisiko"],
        measures: ["Darmmanagement", "Ballaststoffreiche Kost", "Hautpflege nach jedem Abgang"]
    },
    "Dekubitus": {
        specificItems: [
            { text: "Hautrötung (nicht wegdrückbar)", tf: 'tf3' },
            { text: "Bestehender Gewebeschaden", tf: 'tf3' }
        ],
        matrix: ["Dekubitus", "Infektionsrisiko", "Schmerz"],
        measures: ["Lagerung nach Plan (z.B. 30°)", "Druckentlastende Matratze", "Eiweißreiche Ernährung"]
    }
};
